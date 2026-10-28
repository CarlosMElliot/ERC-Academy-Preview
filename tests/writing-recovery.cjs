const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/../proyectos/simulador-escritura/script.js','utf8');
function boot(saved,blocked=false){
 const els=new Map(),storage=new Map(saved?[['erc-writing-draft-v1',saved]]:[]);let now=1000000;
 function el(id=''){return {id,value:'',textContent:'',innerHTML:'',hidden:true,style:{},children:[],listeners:{},classList:{add(){},remove(){}},appendChild(x){this.children.push(x)},addEventListener(k,f){this.listeners[k]=f},scrollIntoView(){}}}
 const document={getElementById(id){if(!els.has(id))els.set(id,el(id));return els.get(id)},createElement:()=>el(),querySelectorAll:()=>[],body:el()};
 for(const match of fs.readFileSync(__dirname+'/../proyectos/simulador-escritura/index.html','utf8').matchAll(/id="([^"]+)"/g))document.getElementById(match[1]);
 class Clock extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
 const context={document,Date:Clock,window:{addEventListener(){},print(){}},IntersectionObserver:class{observe(){}},localStorage:{getItem(k){if(blocked)throw Error();return storage.get(k)||null},setItem(k,v){if(blocked)throw Error();storage.set(k,v)},removeItem(k){storage.delete(k)}},setInterval:()=>1,clearInterval(){},Blob,URL,console};
 vm.createContext(context);vm.runInContext(code,context);
 return {els,storage,run:s=>vm.runInContext(s,context),advance:ms=>now+=ms};
}
let app=boot();
app.run("state.name='<img src=x onerror=alert(1)>'; state.passage=PASSAGES[0]; startTest(); summaryBox.value='Saved summary'; opinionBox.value='Saved opinion'; saveDraft();");
assert(app.storage.has('erc-writing-draft-v1'));
const saved=app.storage.get('erc-writing-draft-v1');
app=boot(saved);assert.equal(app.els.get('draftPrompt').hidden,false);
app.advance(60000);app.els.get('resumeDraft').listeners.click();
assert.equal(app.run('state.timeLeft'),1020);assert.equal(app.els.get('summaryBox').value,'Saved summary');
app.advance(2000000);app.run('tick()');assert.equal(app.run('state.submitted'),true);
assert(!app.storage.has('erc-writing-draft-v1'));
assert(app.els.get('resultsMeta').textContent.startsWith('<img'));assert.equal(app.els.get('resultsMeta').innerHTML,'');
assert(app.els.get('emailBtn').href.includes('erc.academianic%40gmail.com'));
app=boot('{bad json');assert.equal(app.els.get('draftPrompt').hidden,true);
app=boot(saved);app.els.get('discardDraft').listeners.click();assert(!app.storage.has('erc-writing-draft-v1'));
app=boot(null,true);app.run("state.name='Ana';state.passage=PASSAGES[0];startTest();");assert(app.els.get('draftStatus').textContent.includes('could not save'));
app=boot(JSON.stringify({...JSON.parse(saved),deadline:900000}));app.els.get('resumeDraft').listeners.click();assert.equal(app.run('state.submitted'),true);
console.log('PASS: draft save/restore/discard, elapsed deadline, expired draft, safe name rendering, email destination, invalid and blocked storage');
