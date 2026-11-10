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
  vm.runInNewContext(source.replace(/  render\(\);\r?\n\}\)\(\);/,'  globalThis.testUnits={fmt,input,read,rowType,fieldType,esc};\n  render();\n})();'),context);
  const click=b=>events.click({target:{closest:()=>({dataset:{},...b})}});
  return {node,click,events,units:context.testUnits};
}
let a=app();assert.equal((a.node('#content').innerHTML.match(/data-key="city"/g)||[]).length,2);assert.equal(a.node('#content').innerHTML.includes('展开全部对比维度'),false);assert.match(a.node('#content').innerHTML,/虚构示例/);assert.match(a.node('#content').innerHTML,/对比项目/);assert.match(a.node('#content').innerHTML,/薪酬分析/);assert.equal((a.node('#content').innerHTML.match(/id="recordSelect"/g)||[]).length,1);
a.click({dataset:{tab:'compare'}});assert.match(a.node('#content').innerHTML,/对比项目/);
a.click({dataset:{calc:'fictional-a'}});assert.match(a.node('#content').innerHTML,/本年预计到账/);
a.click({id:'startDraft'});assert.match(a.node('#content').innerHTML,/正在试算/);
a.click({id:'discardDraft'});assert.match(a.node('#content').innerHTML,/当前真实报价/);
a.click({dataset:{open:'fictional-a'}});assert.doesNotMatch(a.node('#content').innerHTML,/报价历史与机会管理|使用说明与调研依据|HR 报价原话与口径|个人取舍/);
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

// Bundled editing preserves all prior values until a deliberate save, then stores one value.
storage.clear();const bundled=C.clone(seed);bundled.records[0].cells.leader=C.cell('Leader A','original evidence');bundled.records[0].cells.department=C.cell('Team B');
a=app(bundled);assert.match(a.node('#content').innerHTML,/Leader A/);assert.equal((a.node('#content').innerHTML.match(/data-key="leader"/g)||[]).length,0);
a.click({dataset:{inline:'fictional-a',key:'department'}});assert.match(a.node('#editBody').innerHTML,/Leader A/);assert.match(a.node('#editBody').innerHTML,/Team B/);
a.node('#editForm').onsubmit({preventDefault(){},target:{elements:{namedItem:()=>({value:'Team B; Leader A'})}}});
const mergedBundle=JSON.parse([...storage.values()][0]).data.records[0];assert.equal(C.val(mergedBundle,'department'),'Team B; Leader A');assert.equal(C.val(mergedBundle,'leader'),null);assert.equal(mergedBundle.cells.leader.source,'original evidence');
assert.match(a.node('#content').innerHTML,/monthly-chart/);assert.match(a.node('#content').innerHTML,/各机会年度现金对比/);assert.doesNotMatch(a.node('#content').innerHTML,/月均到账（年度÷12）/);
a.click({dataset:{edit:'contributions'}});assert.doesNotMatch(a.node('#editBody').innerHTML,/name="0_base"/);
storage.clear();const noSalary=C.newRecord('unknown');a=app({schema:1,boardId:'unknown-chart',records:[noSalary]});assert.match(a.node('#content').innerHTML,/填写入职日期与收入后显示逐月图/);assert.doesNotMatch(a.node('#content').innerHTML,/NaN|Infinity/);
console.log('Offer simplification: bundled edits, evidence preservation, conditional inputs and chart empty states passed.');

storage.clear();const partial=C.clone(seed);partial.boardId='partial-chart';partial.records[0].cells.components.value[0].amount=null;a=app(partial);assert.doesNotMatch(a.node('#content').innerHTML,/class="stack"/);assert.match(a.node('#content').innerHTML,/固定现金<strong>待确认/);
a.click({dataset:{edit:'calcSettings'}});assert.match(a.node('#editBody').innerHTML,/<input disabled name="trialFactor"/);

storage.clear();a=app();a.click({dataset:{inline:'fictional-a',key:'start'}});assert.match(a.node('#editBody').innerHTML,/type="date"/);assert.match(a.node('#editBody').innerHTML,/原记录为 2026-01/);
a.node('#editForm').onsubmit({preventDefault(){},target:{elements:{namedItem:()=>({value:'2026-07-15'})}}});assert.match(a.node('#content').innerHTML,/2026-07-15/);assert.doesNotMatch(a.node('#content').innerHTML,/NaN/);

const units=app().units;
assert.equal(units.fmt(22000),'22k');assert.equal(units.fmt(35500),'35.5k');assert.equal(units.fmt(35500.01),'35.50001k');assert.equal(units.fmt(0),'0k');assert.equal(units.fmt(-2000),'-2k');assert.equal(units.fmt(null),'待确认');
assert.match(units.input('amount',35500,'money'),/value="35.5"/);
const amountForm={elements:{namedItem:()=>({value:'35.5'})}};assert.equal(units.read(amountForm,'amount','money'),35500);assert.equal(units.read(amountForm,'rate','number'),35.5);
assert.equal(units.rowType('fee',{mode:'rate'}),'number');assert.equal(units.rowType('fee',{mode:'amount'}),'money');assert.equal(units.fieldType('deduction','number'),'money');assert.equal(units.fieldType('trialMonths','number'),'number');
assert.equal(units.esc('预算 6,000 元；行权 2 元/份'),'预算 6k；行权 0.002k/份');
for(const n of [0,0.01,35500.01,123456.78]){const form={elements:{namedItem:()=>({value:String(n/1000)})}};assert.equal(units.read(form,'amount','money'),n);}
console.log('Offer units: k formatting, money round trips, text amounts and unchanged rates/months passed.');
