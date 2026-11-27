// Se ejecuta manualmente desde Actions, después del PR, CI verde y prueba de producción.
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REF !== 'refs/heads/main'
  || process.env.GITHUB_REPOSITORY !== 'AllanFl0r3s/Frontend-Chatbot') throw Error('Publicar únicamente desde Actions en main del repositorio principal.');
if (process.env.PRODUCTION_VERIFIED !== 'true') throw Error('Primero verifica el flujo en producción y confirma la casilla al ejecutar el workflow.');
const repo = process.env.GITHUB_REPOSITORY;
async function api(endpoint, body) {
  const response = await fetch(`https://api.github.com/repos/${repo}/${endpoint}`, { method: body ? 'POST' : 'GET',
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'semana-7-release' },
    ...(body ? { body: JSON.stringify(body) } : {}) });
  if (!response.ok) throw Error(`GitHub ${endpoint}: HTTP ${response.status}`);
  return response.json();
}
(async () => {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  const sha = git('rev-parse', 'HEAD');
  const branch = await api('branches/main');
  if (branch.commit.sha !== sha || !branch.protected) throw Error('main debe estar protegida y coincidir con el commit revisado.');
  const total = Number(git('rev-list', '--count', 'HEAD'));
  const recent = git('log', '--since=10 days ago', '--format=%H').split('\n').filter(Boolean).length;
  if (total < 35 || recent < 3) throw Error(`Faltan commits reales: total ${total}, últimos diez días ${recent}.`);
  if (!fs.readFileSync('README.md', 'utf8').includes('LEARN-CAP-72EA885A')) throw Error('Falta el token de propiedad.');
  for (const file of ['docs/pruebas.md', 'docs/bitacora/semana-7.md']) if (!fs.existsSync(file)) throw Error('Falta ' + file);
  const runs = await api('actions/workflows/ci.yml/runs?branch=main&event=push&status=success&per_page=30');
  const run = runs.workflow_runs.find(run => run.head_sha === sha && run.conclusion === 'success');
  if (!run) throw Error('Espera a que ci.yml termine en verde para este commit de main.');
  const jobs = await api(`actions/runs/${run.id}/jobs`);
  for (const name of ['Frontend: pruebas y build', 'E2E: cartera con SQL'])
    if (!jobs.jobs.some(job => job.name === name && job.conclusion === 'success')) throw Error('Falta una comprobación aprobada: ' + name);
  const prs = await api(`commits/${sha}/pulls`);
  const pr = prs.find(pr => pr.base.ref === 'main' && pr.merged_at);
  if (!pr) throw Error('El cambio debe haber llegado a main mediante un pull request mezclado.');
  for (const url of ['https://frontend-chatbot-alpha-six.vercel.app/login', 'https://chatbotbackendlocal-1.onrender.com/health']) {
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (response.status !== 200 || new URL(response.url).protocol !== 'https:') throw Error('Falta respuesta HTTPS 200 de ' + url);
  }
  const body = fs.readFileSync('docs/releases/semana-7.md', 'utf8') +
    `\n\nEvidencia de publicación\n\n- Commit: ${sha}\n- Pull request: ${pr.html_url}\n- Pipeline aprobado: ${run.html_url}\n- Commits reales: ${total}; últimos diez días: ${recent}.\n- Prueba manual de producción confirmada por @${process.env.GITHUB_ACTOR} al ejecutar este workflow.\n`;
  const release = await api('releases', { tag_name: 'semana-7', target_commitish: sha, name: 'Semana 7 · Pipeline en verde', body, draft: false, prerelease: false });
  console.log('Release creado: ' + release.html_url);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
