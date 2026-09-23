import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const base = new URL('../',import.meta.url);
const read = name => fs.readFileSync(new URL(name,base),'utf8');
for(const name of ['site-config.js','site.js','improvements.js','features.js'])new vm.Script(read(name),{filename:name});
const context=vm.createContext({
 document:{querySelectorAll:()=>[],getElementById:()=>({addEventListener(){}}),addEventListener(){}},
});
vm.runInContext(read('site-config.js')+'\n'+read('site.js'),context);
const products=JSON.parse(vm.runInContext('JSON.stringify({ru:PRODUCTS,...PRODUCTS_I18N})',context));
for(const [lang,items] of Object.entries(products)){
 assert.equal(Object.keys(items).length,8);
 for(const [id,p] of Object.entries(items)){
  if(!['pl101-1','pl101-11-auto'].includes(id)){
   assert.equal(p.warranty,'',lang+' '+id);
   assert.equal(p.specs.filter(([k])=>/Гарантия|Warranty|Кепілдік/.test(k)).length,0);
  }
  if(id==='barrier-e')assert(p.specs.some(([,v])=>v==='80 мм'||v==='80 mm'));
  if(id==='barrier-f')assert(p.specs.some(([,v])=>v==='250 мм'||v==='250 mm'));
 }
}
const source=read('features.js');
const calculation=source.slice(source.indexOf('function calculateParking('),source.indexOf('\nconst calc ='));
vm.runInContext(calculation,context);
const calc=(id,n,install)=>JSON.parse(vm.runInContext('JSON.stringify(calculateParking('+JSON.stringify(id)+','+n+','+install+'))',context));
assert.equal(calc('pl101-1',3,false).total,97500);
assert.equal(calc('pl101-1',3,true).installation,null);
assert.equal(calc('pl105-11',5,false).total,44500);
assert.equal(calc('barrier-f',2,false).total,29800);
for(const n of [0,-1,1.5,1001,NaN])assert.equal(calc('pl101-1',n,false),null);
assert.equal(calc('missing',2,false),null);
vm.runInContext('URBAN_CONFIG.prices["pl101-1"]=40000;URBAN_CONFIG.installationPerUnit=2500;',context);
assert.equal(calc('pl101-1',3,true).total,127500,'Single source price and installation rate');
console.log('PASS: JS syntax; 24 localized product records; calculator including invalid input, unknown installation and changed rates.');
