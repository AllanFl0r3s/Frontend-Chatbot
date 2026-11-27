const path = require('node:path');
const { createRequire } = require('node:module');
const { backend, env } = require('./environment.cjs');
Object.assign(process.env, env);
const load = createRequire(path.join(backend, 'package.json'));
// Solo el reloj del negocio es fijo. JWT y sesiones usan el reloj real.
load('./dist/suggestions/suggestions.core').todayInHonduras = () => '2026-11-27';
load('./dist/main');
