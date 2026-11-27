// Adaptador exclusivo de CI: ejecuta los cuerpos de las migraciones en dos bases *_WEEK7_CI.
// Los archivos originales y sus protecciones de producción no se alteran.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const config = require('./environment.cjs');
const load = createRequire(path.join(config.backend, 'package.json'));
const mssql = load('mssql');
const bcrypt = load('bcrypt');

function bodies(source) {
  const result = [], pattern = /\bEXEC\s*\(\s*N'/gi;
  let match;
  while ((match = pattern.exec(source))) {
    let index = pattern.lastIndex, text = '', closed = false;
    for (; index < source.length; index++) {
      if (source[index] !== "'") { text += source[index]; continue; }
      if (source[index + 1] === "'") { text += "'"; index++; continue; }
      closed = true; break;
    }
    if (!closed || !/^\s*\)/.test(source.slice(index + 1))) throw Error('Forma inesperada de migración SQL.');
    result.push(text); pattern.lastIndex = index + 2;
  }
  return result;
}
function migration(file, mode = 'exec', index = 0) {
  const source = fs.readFileSync(path.join(config.backend, file), 'utf8');
  const body = mode === 'transaction' ? source.slice(source.indexOf('BEGIN TRY')) : bodies(source)[index];
  if (!body || (mode === 'transaction' && !source.includes('BEGIN TRY'))) throw Error('No se encontró el cuerpo de ' + file);
  return 'SET NOCOUNT ON; SET XACT_ABORT ON; SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON;\n' +
    body.replaceAll('DEMOSTRACION AZURE - DATOS FICTICIOS', 'PRUEBAS CI - DATOS FICTICIOS');
}
async function connect(database) { return new mssql.ConnectionPool({ ...config.sql, database }).connect(); }
async function ownedDatabase(name) {
  if (!Object.values(config.databases).includes(name)) throw Error('Base no autorizada para CI.');
  const master = await connect('master');
  try {
    const found = await master.request().input('name', name).query('SELECT DB_ID(@name) AS id');
    if (!found.recordset[0].id) await master.request().query(`CREATE DATABASE [${name}]`);
  } finally { await master.close(); }
  const db = await connect(name);
  const marker = await db.request().query("SELECT CONVERT(nvarchar(80),value) AS value FROM sys.extended_properties WHERE class=0 AND name=N'Week7CIOwner'");
  if (!marker.recordset.length) {
    const tables = await db.request().query('SELECT COUNT(*) AS count FROM sys.tables WHERE is_ms_shipped=0');
    if (tables.recordset[0].count) { await db.close(); throw Error('Se rechaza una base existente sin marca de CI.'); }
    await db.request().query("EXEC sys.sp_addextendedproperty @name=N'Week7CIOwner',@value=N'Frontend-Chatbot semana-7';");
  } else if (marker.recordset[0].value !== 'Frontend-Chatbot semana-7') { await db.close(); throw Error('La base pertenece a otro entorno.'); }
  return db;
}
(async () => {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { const db = await connect('master'); await db.close(); ready = true; break; }
    catch { await new Promise(resolve => setTimeout(resolve, 2000)); }
  }
  if (!ready) throw Error('SQL de pruebas no respondió.');
  const auth = await ownedDatabase(config.databases.auth);
  try {
    await auth.request().batch(migration('database/azure/01_CHATBOT.sql'));
    await auth.request().batch(migration('database/academic/010_CHATBOT_rutas_usuarios.sql', 'transaction'));
    const roles = await auth.request().query('SELECT COUNT(*) AS count FROM dbo.TBL_ROLES');
    if (!roles.recordset[0].count) await auth.request().query("INSERT dbo.TBL_ROLES(Nombre,Estado_Rol) VALUES(N'ADMINISTRADOR',1),(N'USUARIO',1)");
    const hash = await bcrypt.hash('SoloPruebaCI-2026!', 10);
    for (const [username, role] of [['ci.admin', 1], ['ci.vendedor', 2]]) {
      await auth.request().input('username', username).input('hash', hash).input('role', role).query(`
        IF NOT EXISTS(SELECT 1 FROM dbo.TBL_USUARIOS WHERE Usuario=@username)
        INSERT dbo.TBL_USUARIOS(Id_Rol,Nombre,Usuario,Email,PasswordHash,Estado,RutaCodigo,RutaGestionada)
        VALUES(@role,@username,@username,@username+'@example.invalid',@hash,1,'S01',1);`);
    }
  } finally { await auth.close(); }
  const business = await ownedDatabase(config.databases.business);
  try {
    await business.request().batch(migration('database/azure/02_DW_ISTMA_esquema.sql', 'exec', 1));
    for (const file of ['database/azure/03_DW_ISTMA_semilla.sql','database/azure/06_DW_ISTMA_stock_chat.sql',
      'database/azure/09_DW_ISTMA_catalogo_istmania.sql','database/academic/004_menu_completo.sql'])
      await business.request().batch(migration(file));
    await business.request().batch(migration('database/academic/006_historial_promociones.sql', 'transaction'));
    for (const file of ['database/academic/008_vendedores_S01_S10.sql','database/academic/009_solo_zona_norte.sql',
      'database/academic/011_cortes_cartera_navidad.sql','database/academic/013_cincuenta_pulperias.sql'])
      await business.request().batch(migration(file));
    const count = await business.request().query('SELECT COUNT(*) AS count FROM academico.VendedorClientes');
    if (count.recordset[0].count !== 50) throw Error('La fixture debe tener 50 pulperías.');
  } finally { await business.close(); }
  console.log('Fixture CI lista: dos bases aisladas, dos cuentas ficticias y 50 pulperías.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
