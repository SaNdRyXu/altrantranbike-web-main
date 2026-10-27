-- Esquema SQL estándar (compatible con SQLite/D1; migrable a MySQL/Postgres cambiando solo tipos auto-incrementales)
CREATE TABLE IF NOT EXISTS rutas (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo    TEXT NOT NULL,
  fecha     TEXT NOT NULL,                 -- 'YYYY-MM-DDTHH:MM' (hora de Madrid)
  lugar     TEXT NOT NULL,
  nivel     TEXT NOT NULL DEFAULT 'Todos los niveles',
  url       TEXT,                          -- enlace de la ruta en Atlas Bike
  publicada INTEGER NOT NULL DEFAULT 1,
  creada    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_rutas_fecha ON rutas(fecha);

CREATE TABLE IF NOT EXISTS invitaciones (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre   TEXT NOT NULL,
  contacto TEXT NOT NULL,                  -- email, Instagram o teléfono
  mensaje  TEXT,
  estado   TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','atendida','descartada')),
  creada   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_inv_estado ON invitaciones(estado, creada);

-- Galería manual (fotos reducidas y guardadas en la propia base de datos)
CREATE TABLE IF NOT EXISTS fotos (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  pie                 TEXT,
  alt                 TEXT,
  mime                TEXT NOT NULL,
  datos               TEXT NOT NULL,            -- imagen en base64
  consentimiento      INTEGER NOT NULL CHECK (consentimiento = 1),   -- no se admite una foto sin consentimiento
  consentimiento_nota TEXT,                     -- quién autorizó (solo control interno)
  publicada           INTEGER NOT NULL DEFAULT 1,
  creada              TEXT NOT NULL DEFAULT (datetime('now'))
);
