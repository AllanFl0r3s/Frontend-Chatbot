const { test } = require('node:test');
const assert = require('node:assert/strict');
const { apiOrigin } = require('../scripts/cloud-environment.cjs');
test('usa el origen del backend HTTPS', () => {
  assert.equal(apiOrigin('https://demo.onrender.com/'), 'https://demo.onrender.com');
});
test('rechaza configuraciones que dejarían el despliegue apuntando a destinos inválidos', () => {
  for (const value of [undefined, '', 'http://demo.onrender.com', 'https://localhost',
    'https://demo.onrender.com/auth', 'https://name:secret@demo.onrender.com',
    'https://demo.onrender.com/?key=secret', 'https://demo.onrender.com/#token']) {
    assert.throws(() => apiOrigin(value));
  }
});
