import { test, expect, APIRequestContext } from '@playwright/test';
import { createRequire } from 'node:module';
import path from 'node:path';
const api = 'http://127.0.0.1:3023';
const credentials = { password: 'SoloPruebaCI-2026!' };
async function login(request: APIRequestContext, identifier: string) {
  const response = await request.post(api + '/auth/login', { data: { identifier, ...credentials } });
  expect(response.status()).toBe(201);
  return (await response.json()).accessToken as string;
}
test('permisos, dinero y cambio de ruta atraviesan HTTP, JWT, negocio y SQL', async ({ request }) => {
  const admin = await login(request, 'ci.admin'), user = await login(request, 'ci.vendedor');
  const adminHeaders = { Authorization: `Bearer ${admin}` }, userHeaders = { Authorization: `Bearer ${user}` };
  const accounts = await (await request.get(api + '/users', { headers: adminHeaders })).json();
  const id = accounts.find((account: any) => account.usuario === 'ci.vendedor').id;
  const assign = async (rutaCodigo: string | null) => expect((await request.patch(api + '/users/' + id, { headers: adminHeaders, data: { rutaCodigo } })).status()).toBe(200);
  const chat = async (message: string) => {
    const response = await request.post(api + '/chat/message', { headers: userHeaders, data: { message } });
    expect(response.status()).toBe(201); return (await response.json()).reply as string;
  };
  try {
    await assign('S01');
    expect((await request.get(api + '/users')).status()).toBe(401);
    expect((await request.patch(api + '/users/' + id, { headers: userHeaders, data: { rutaCodigo: 'S02' } })).status()).toBe(403);
    expect((await request.patch(api + '/users/' + id, { headers: adminHeaders, data: { rutaCodigo: 'S11' } })).status()).toBe(400);
    await chat('menu'); await chat('7');
    const totals = await chat('1');
    expect(totals).toContain('Saldo pendiente: L 3,200.00');
    expect(totals).toContain('Saldo vencido: L 1,800.00');
    expect(totals).toContain('Vence de hoy a 7 días: L 500.00');
    await chat('menu'); await chat('7'); await chat('3');
    expect(await chat('CLI-005')).toContain('No hay documentos con saldo');
    await chat('menu'); await chat('7'); await chat('3');
    expect(await chat('CLI-006')).toContain('No hay documentos con saldo');
    await chat('menu'); await chat('7');
    await assign('S02');
    expect(await chat('1')).toContain('No tienes permiso');
    await chat('menu'); await chat('8');
    expect(await chat('1')).toContain('CLI-006');
    await assign(null);
    expect(await chat('1')).toContain('No tienes permiso');
    expect((await request.post(api + '/auth/register', { data: { nombre: 'Fixture', usuario: 'ci.no-role', email: 'fixture@example.invalid', ...credentials, roleId: 1 } })).status()).toBe(400);
  } finally {
    await assign('S01');
    expect((await request.post(api + '/auth/logout', { headers: userHeaders })).status()).toBe(204);
    expect((await request.post(api + '/chat/message', { headers: userHeaders, data: { message: '7' } })).status()).toBe(401);
    await request.post(api + '/auth/logout', { headers: adminHeaders });
  }
});

test('los centavos se calculan en SQL y no se aceptan pagos mayores al documento', async ({ request }) => {
  const load = createRequire(path.join(process.env.BACKEND_DIR!, 'package.json'));
  const sql = load('mssql');
  const config = require('../../scripts/ci/environment.cjs');
  const db = await new sql.ConnectionPool({ ...config.sql, database: config.databases.business }).connect();
  const token = await login(request, 'ci.vendedor');
  const headers = { Authorization: `Bearer ${token}` };
  const query = () => db.request();
  const chat = async (message: string) => {
    const r = await request.post(api + '/chat/message', { headers, data: { message } });
    expect(r.status()).toBe(201); return (await r.json()).reply;
  };
  try {
    const marker = await query().query("SELECT CONVERT(nvarchar(80),value) AS value FROM sys.extended_properties WHERE class=0 AND name='Week7CIOwner'");
    expect(marker.recordset[0]?.value).toBe('Frontend-Chatbot semana-7');
    await query().query("UPDATE academico.CarteraDocumentos SET Monto=1000.05,Pagado=200.01 WHERE Numero='FAC-DEMO-CORT-S01-01'");
    await chat('menu'); await chat('7');
    expect(await chat('1')).toContain('Saldo pendiente: L 3,200.04');
    await chat('3'); expect(await chat('CLI-001')).toContain('Saldo: L 800.04');
    await expect(query().query("UPDATE academico.CarteraDocumentos SET Pagado=Monto+1 WHERE Numero='FAC-DEMO-CORT-S01-01'")).rejects.toThrow();
  } finally {
    await query().query("UPDATE academico.CarteraDocumentos SET Monto=1000,Pagado=200 WHERE Numero='FAC-DEMO-CORT-S01-01'");
    await request.post(api + '/auth/logout', { headers });
    await db.close();
  }
});
