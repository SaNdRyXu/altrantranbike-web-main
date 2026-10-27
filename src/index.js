const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const safeEq = (a, b) => { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };
const isAdmin = (req, env) => { const t = (req.headers.get('authorization') || '').replace(/^Bearer /, ''); return !!env.ADMIN_TOKEN && t && safeEq(t, env.ADMIN_TOKEN); };

export default {
  async fetch(req, env) {
    const url = new URL(req.url), path = url.pathname, m = req.method;
    try {
      // ---------- Público ----------
      if (path === '/api/rutas' && m === 'GET') {
        const { results } = await env.DB.prepare(
          "SELECT id,titulo,fecha,lugar,nivel,url FROM rutas WHERE publicada=1 AND fecha >= strftime('%Y-%m-%dT%H:%M','now','-3 hours') ORDER BY fecha LIMIT 30").all();
        return json(results);
      }
      if (path === '/api/fotos' && m === 'GET') {
        const { results } = await env.DB.prepare('SELECT id,pie,alt FROM fotos WHERE publicada=1 ORDER BY id DESC LIMIT 24').all();
        return json(results);
      }
      const fm = path.match(/^\/api\/foto\/(\d+)$/);
      if (fm && m === 'GET') {
        const f = await env.DB.prepare('SELECT mime,datos FROM fotos WHERE id=? AND publicada=1').bind(fm[1]).first();
        if (!f) return json({ error: 'No encontrado' }, 404);
        const bin = Uint8Array.from(atob(f.datos), c => c.charCodeAt(0));
        return new Response(bin, { headers: { 'content-type': f.mime, 'cache-control': 'public, max-age=3600' } });
      }
      if (path === '/api/invitacion' && m === 'POST') {
        const b = await req.json().catch(() => ({}));
        if (b.web) return json({ ok: true });                       // honeypot anti-spam
        const nombre = clean(b.nombre, 80), contacto = clean(b.contacto, 120), mensaje = clean(b.mensaje, 500);
        if (!nombre || !contacto || b.consentimiento !== true) return json({ error: 'Faltan datos obligatorios.' }, 400);
        const { n } = await env.DB.prepare("SELECT COUNT(*) n FROM invitaciones WHERE creada >= datetime('now','-1 hour')").first();
        if (n >= 30) return json({ error: 'Demasiadas solicitudes. Inténtalo más tarde.' }, 429);
        await env.DB.prepare('INSERT INTO invitaciones(nombre,contacto,mensaje) VALUES(?,?,?)').bind(nombre, contacto, mensaje).run();
        return json({ ok: true }, 201);
      }

      // ---------- Administración ----------
      if (path.startsWith('/api/admin/')) {
        if (!isAdmin(req, env)) return json({ error: 'No autorizado' }, 401);
        const parts = path.split('/').slice(3), [rec, id] = parts;
        if (rec === 'invitaciones') {
          if (m === 'GET') return json((await env.DB.prepare('SELECT * FROM invitaciones ORDER BY (estado="pendiente") DESC, creada DESC LIMIT 200').all()).results);
          if (m === 'PATCH' && id) {
            const b = await req.json().catch(() => ({}));
            if (!['pendiente', 'atendida', 'descartada'].includes(b.estado)) return json({ error: 'Estado no válido' }, 400);
            await env.DB.prepare('UPDATE invitaciones SET estado=? WHERE id=?').bind(b.estado, id).run();
            return json({ ok: true });
          }
          if (m === 'DELETE' && id) { await env.DB.prepare('DELETE FROM invitaciones WHERE id=?').bind(id).run(); return json({ ok: true }); }
        }
        if (rec === 'fotos') {
          if (m === 'GET') return json((await env.DB.prepare('SELECT id,pie,alt,consentimiento_nota,creada FROM fotos ORDER BY id DESC LIMIT 100').all()).results);
          if (m === 'POST') {
            const b = await req.json().catch(() => ({}));
            const datos = String(b.datos || '');
            if (b.consentimiento !== true) return json({ error: 'Debes confirmar el consentimiento de las personas que aparecen.' }, 400);
            if (!['image/jpeg', 'image/webp'].includes(b.mime) || !datos || datos.length > 900000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(datos)) return json({ error: 'Imagen no válida o demasiado pesada.' }, 400);
            const { n } = await env.DB.prepare('SELECT COUNT(*) n FROM fotos').first();
            if (n >= 80) return json({ error: 'Has llegado al límite de 80 fotos. Borra alguna.' }, 400);
            await env.DB.prepare('INSERT INTO fotos(pie,alt,mime,datos,consentimiento,consentimiento_nota) VALUES(?,?,?,?,1,?)').bind(clean(b.pie, 140), clean(b.alt, 200), b.mime, datos, clean(b.nota, 200)).run();
            return json({ ok: true }, 201);
          }
          if (m === 'DELETE' && id) { await env.DB.prepare('DELETE FROM fotos WHERE id=?').bind(id).run(); return json({ ok: true }); }
        }
        if (rec === 'rutas') {
          if (m === 'GET') return json((await env.DB.prepare('SELECT * FROM rutas ORDER BY fecha DESC LIMIT 100').all()).results);
          if (m === 'POST') {
            const b = await req.json().catch(() => ({}));
            const titulo = clean(b.titulo, 120), lugar = clean(b.lugar, 120), nivel = clean(b.nivel, 40) || 'Todos los niveles', link = clean(b.url, 300);
            if (!titulo || !lugar || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(b.fecha || '')) return json({ error: 'Revisa título, lugar y fecha.' }, 400);
            if (link && !/^https:\/\//.test(link)) return json({ error: 'El enlace debe empezar por https://' }, 400);
            await env.DB.prepare('INSERT INTO rutas(titulo,fecha,lugar,nivel,url) VALUES(?,?,?,?,?)').bind(titulo, b.fecha, lugar, nivel, link || null).run();
            return json({ ok: true }, 201);
          }
          if (m === 'DELETE' && id) { await env.DB.prepare('DELETE FROM rutas WHERE id=?').bind(id).run(); return json({ ok: true }); }
        }
        return json({ error: 'No encontrado' }, 404);
      }
      return json({ error: 'No encontrado' }, 404);
    } catch (e) { console.error(e); return json({ error: 'Error del servidor' }, 500); }
  },

  // Limpieza diaria automática (minimización de datos, RGPD)
  async scheduled(_evt, env) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM invitaciones WHERE estado!='pendiente' AND creada < datetime('now','-90 days')"),
      env.DB.prepare("DELETE FROM invitaciones WHERE creada < datetime('now','-180 days')"),
      env.DB.prepare("DELETE FROM rutas WHERE fecha < strftime('%Y-%m-%dT%H:%M','now','-365 days')")
    ]);
  }
};
