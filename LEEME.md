# Altrantran Bike · Fase 2 (Cloudflare Workers + D1)

## Estructura
- `public/` → la web (index, panel `admin.html`, avisos legales)
- `src/index.js` → servidor (API + limpieza diaria automática)
- `schema.sql` → tablas de la base de datos
- `wrangler.jsonc` → configuración de Cloudflare

## Puesta en marcha (una sola vez)
Necesitas Node.js instalado y una cuenta gratuita en cloudflare.com. En una terminal, dentro de esta carpeta:

1. `npx wrangler login`  (abre el navegador para autorizar)
2. `npx wrangler d1 create altrantranbike-db`
   → copia el `database_id` que muestra y pégalo en `wrangler.jsonc`
3. `npx wrangler d1 execute altrantranbike-db --remote --file=schema.sql`  (crea las tablas)
4. `npx wrangler secret put ADMIN_TOKEN`  (escribe una clave larga; será la contraseña del panel)
5. `npx wrangler deploy`  → te dará la dirección pública (`altrantranbike.altrantran.workers.dev`)

El panel está en `/admin.html`. No lo enlazamos desde la web.

## Probar en local (opcional)
`npx wrangler d1 execute altrantranbike-db --local --file=schema.sql`
`npx wrangler dev`   (para el panel en local, crea un archivo `.dev.vars` con `ADMIN_TOKEN=tu_clave`)

## Pendiente
- Completar los [corchetes] de `aviso-legal.html` y `privacidad.html`.
- Sustituir la clave de ejemplo por una real y guardarla en un gestor de contraseñas.


admintoken Altrantran2026
