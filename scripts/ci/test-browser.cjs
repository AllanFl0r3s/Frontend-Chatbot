const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const executable = require('playwright').chromium.executablePath();
const browserDirectory = path.dirname(path.dirname(executable));
const revision = path.basename(browserDirectory).replace(/^chromium-/, '');
if (!/^\d+$/.test(revision)) throw Error('No se reconoció el Chromium de Playwright.');
const headless = path.join(path.dirname(browserDirectory), `chromium_headless_shell-${revision}`);
function find(directory, depth = 0) {
  for (const file of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, file.name);
    if (file.isFile() && /^(chrome-headless-shell|headless_shell)(\.exe)?$/.test(file.name)) return filename;
    if (file.isDirectory() && depth < 2) { const found = find(filename, depth + 1); if (found) return found; }
  }
}
const chrome = fs.existsSync(headless) && find(headless);
if (!chrome) throw Error('Ejecuta npx playwright install chromium antes de las pruebas de navegador.');
const result = spawnSync(process.execPath, [require.resolve('@angular/cli/bin/ng.js'), 'test', '--watch=false', '--browsers=ChromeHeadless'],
  { stdio: 'inherit', env: { ...process.env, CHROME_BIN: chrome } });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
