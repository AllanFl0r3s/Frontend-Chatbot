const path = require('node:path');
const front = path.resolve(__dirname, '../..');
const backend = path.resolve(process.env.BACKEND_DIR || path.join(front, '.ci/backend'));
const sqlHost = process.env.CI_SQL_HOST || '127.0.0.1';
const sqlPort = Number(process.env.CI_SQL_PORT || 14339);
if (sqlHost !== '127.0.0.1' || ![14330, 14339].includes(sqlPort)) throw Error('Las pruebas solo admiten SQL aislado en loopback, puerto 14339 o 14330 local.');
if (!process.env.CI_SQL_PASSWORD) throw Error('Falta CI_SQL_PASSWORD del SQL de pruebas.');
const sql = { server: sqlHost, port: sqlPort, user: process.env.CI_SQL_USER || 'sa', password: process.env.CI_SQL_PASSWORD,
  options: { encrypt: false, trustServerCertificate: true }, requestTimeout: 60000, connectionTimeout: 5000 };
const databases = { auth: 'CHATBOT_WEEK7_CI', business: 'DW_ISTMA_WEEK7_CI' };
const env = { ...process.env, NODE_ENV: 'test', PORT: '3023', DB_HOST: sqlHost, DB_PORT: String(sqlPort),
  DB_USER: sql.user, DB_PASSWORD: sql.password, DB_NAME: databases.auth, DB_SCHEMA: 'dbo', DB_ENCRYPT: 'false', DB_TRUST_SERVER_CERTIFICATE: 'true',
  PROD_DB_HOST: sqlHost, PROD_DB_PORT: String(sqlPort), PROD_DB_USER: sql.user, PROD_DB_PASSWORD: sql.password,
  PROD_DB_NAME: databases.business, PROD_DB_SCHEMA: 'dbo', PROD_DB_ENCRYPT: 'false', PROD_DB_TRUST_SERVER_CERTIFICATE: 'true',
  JWT_SECRET: 'ci-only-jwt-secret-never-use-in-production-2026', JWT_EXPIRATION: '3600',
  PASSWORD_RESET_SECRET: 'ci-only-reset-secret-never-use-in-production-2026',
  OPENAI_ENABLED: 'false', OPENAI_API_KEY: 'not-used-in-ci', VISITS_DATA_SOURCE: 'academic', VISITS_ROUTE_ACCESS: '{}',
  CORS_ORIGINS: 'http://127.0.0.1:4300', FRONTEND_URL: 'http://127.0.0.1:4300', SWAGGER_ENABLED: 'false',
  BREVO_API_KEY: '', RECOVERY_FROM_EMAIL: '' };
module.exports = { front, backend, sql, databases, env };
