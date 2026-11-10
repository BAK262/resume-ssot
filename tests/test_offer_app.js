'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),C=require('../templates/offer-board/core.js');
const seed=JSON.parse(fs.readFileSync(require.resolve('../fixtures/example-offers.json'),'utf8'));
const source=fs.readFileSync(require.resolve('../templates/offer-board/app.js'),'utf8');
const storage=new Map();
function app(data=seed){
  const nodes=new Map(),events={};
  function node(s){if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',checked:false,value:'',elements:{},showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(s);}
  node('#offer-data').textContent=JSON.stringify(data);
  const document={querySelector:node,querySelectorAll:()=>[],addEventListener:(event,fn)=>events[event]=fn};
  const context={OfferCore:C,document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{addEventListener(){},print(){}},navigator:{},prompt:()=> '测试版本',confirm:()=>true,alert:()=>{},console,Date,Set,Map};
  vm.runInNewContext(source,context);
  const click=b=>events.click({target:{closest:()=>({dataset:{},...b})}});
  return {node,click,events};
}
let a=app();assert.equal((a.node('#content').innerHTML.match(/data-key="city"/g)||[]).length,2);assert.equal(a.node('#content').innerHTML.includes('展开全部对比维度'),false);assert.match(a.node('#content').innerHTML,/虚构示例/);assert.match(a.node('#content').innerHTML,/对比项目/);assert.match(a.node('#content').innerHTML,/薪酬分析/);assert.equal((a.node('#content').innerHTML.match(/id="recordSelect"/g)||[]).length,1);
a.click({dataset:{tab:'compare'}});assert.match(a.node('#content').innerHTML,/对比项目/);
a.click({dataset:{calc:'fictional-a'}});assert.match(a.node('#content').innerHTML,/本年预计到账/);
a.click({id:'startDraft'});assert.match(a.node('#content').innerHTML,/正在试算/);
a.click({id:'discardDraft'});assert.match(a.node('#content').innerHTML,/当前真实报价/);
a.click({dataset:{open:'fictional-a'}});a.click({id:'snapshot'});assert.match(a.node('#content').innerHTML,/测试版本/);
a.click({dataset:{edit:'company'}});assert.equal(a.node('#editor').open,true);assert.equal(a.node('#editBody').innerHTML.includes('name="source"'),false);assert.equal(a.node('#editBody').innerHTML.includes('name="status"'),false);
const form={elements:{namedItem:()=>({value:'手动公司'})}};
a.node('#editForm').onsubmit({preventDefault(){},target:form});assert.match(a.node('#content').innerHTML,/手动公司/);
a=app();assert.match(a.node('#content').innerHTML,/手动公司/);
const updated=C.clone(seed);updated.records[0].cells.company=C.cell('AI公司');a=app(updated);assert.match(a.node('#conflicts').innerHTML,/手动公司/);assert.match(a.node('#conflicts').innerHTML,/AI公司/);
a.click({dataset:{resolve:'0',side:'local'}});assert.equal(a.node('#conflicts').innerHTML,'');a=app(updated);assert.match(a.node('#content').innerHTML,/手动公司/);assert.equal(a.node('#conflicts').innerHTML,'');
// Two instances editing different cells must preserve both writes.
const first=app(updated),second=app(updated);first.click({dataset:{open:'fictional-a'}});first.click({dataset:{edit:'city'}});first.node('#editForm').onsubmit({preventDefault(){},target:{elements:{...form.elements,namedItem:()=>({value:'甲城'})}}});
second.click({dataset:{open:'fictional-a'}});second.click({dataset:{edit:'level'}});second.node('#editForm').onsubmit({preventDefault(){},target:{elements:{...form.elements,namedItem:()=>({value:'乙级'})}}});
const saved=JSON.parse([...storage.values()][0]);assert.equal(C.val(saved.data.records[0],'city'),'甲城');assert.equal(C.val(saved.data.records[0],'level'),'乙级');
const empty=C.newRecord('empty');app({schema:1,boardId:'empty',records:[empty]}).click({dataset:{calc:'empty'}});
console.log('Offer app: views, editing, draft isolation, snapshots, reload, conflicts and concurrent save checks passed.');
