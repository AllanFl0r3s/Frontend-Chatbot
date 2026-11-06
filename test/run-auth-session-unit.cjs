// Alternativa de pruebas unitarias sin arrancar un navegador; no sustituye la comprobación visual.
const {createRequire}=require('node:module');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const front=path.resolve(__dirname,'..');
const load=createRequire(path.join(front,'package.json'));
(async()=>{
 const jasminePackage=load('jasmine-core');
 const core=jasminePackage.core(jasminePackage),env=core.getEnv();
 Object.assign(globalThis,jasminePackage.interface(core,env));
 const storage=new Map();
 globalThis.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key),clear:()=>storage.clear()};
 globalThis.window={localStorage:globalThis.localStorage};
 globalThis.ProgressEvent=class ProgressEvent{constructor(type){this.type=type;}};
 await import(pathToFileURL(load.resolve('@angular/compiler')).href);
 const {TestBed}=await import(pathToFileURL(load.resolve('@angular/core/testing')).href);
 const {BrowserTestingModule,platformBrowserTesting}=await import(pathToFileURL(load.resolve('@angular/platform-browser/testing')).href);
 const {PLATFORM_ID,provideZonelessChangeDetection}=await import(pathToFileURL(load.resolve('@angular/core')).href);
 globalThis.document={querySelectorAll:()=>[],body:{querySelectorAll:()=>[]}};
 globalThis.window.document=globalThis.document;
 TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
 beforeEach(()=>TestBed.configureTestingModule({providers:[provideZonelessChangeDetection(),{provide:PLATFORM_ID,useValue:'browser'}]}));
 const output=path.join(front,'out-tsc/auth-session-node.spec.mjs');
 await load('esbuild').build({entryPoints:[path.join(front,'src/app/core/auth-session.spec.ts')],outfile:output,
  bundle:true,format:'esm',platform:'node',target:'es2022',external:['@angular/*','rxjs'],logLevel:'silent'});
 let passed=0,failed=0;
 env.addReporter({specDone:result=>{
  if(result.status==='passed')passed++;else{failed++;console.log('FAIL: '+result.description);for(const failure of result.failedExpectations??[])console.log(failure.message);}
 },jasmineDone:result=>{console.log(JSON.stringify({runtime:'Node + Angular TestBed; DOM, almacenamiento y navegación simulados',passed,failed,status:result.overallStatus}));if(failed||result.overallStatus!=='passed')process.exitCode=1;}});
 await import(pathToFileURL(output).href);
 await env.execute();
})().catch(error=>{console.log(error.stack);process.exitCode=1;});
