'use strict';
const assert=require('node:assert/strict');
const C=require('../templates/offer-board/core.js');
const {render}=require('../scripts/render_offer_board.js');
function fixture(){const r=C.newRecord('fictional');for(const [k,v]of Object.entries({company:'虚构示例',start:'2026-01',resident:true,inventoryComplete:true,contributionsComplete:true,trialMonths:0,trialFactor:1,firstMonthFactor:1,firstEmployment:false,deduction:0,otherDeduction:0,policyThrough:'2027-12',bonusEligible:true}))r.cells[k]=C.cell(v,'Test','假设');r.cells.components=C.cell([{...C.component(),name:'工资',amount:10000}]);r.cells.taxYears=C.cell([2026,2027,2028].map(year=>({year,income:0,deduction:0,withheld:0,annualSpecial:0,bonusUsed:false})));return r;}
let r=fixture(),x=C.calculate(r,2026);assert.equal(x.blocked,false);assert.equal(x.gross,120000);assert.equal(x.finalTax,3480);assert.equal(x.net,116520);assert.equal(x.rows[0].tax,150);assert.equal(x.rows[7].tax,430);
for(const [a,t]of [[0,0],[36000,1080],[144000,11880],[300000,43080],[420000,73080],[660000,145080],[960000,250080],[1000000,268080]])assert.equal(C.tax(a),t);
assert.equal(C.bonusTax(36000),1080);assert.equal(C.bonusTax(36001),3390.1);
r.cells.components.value.push({...C.component(),name:'年奖',kind:'variable',amount:36000,frequency:'annual',payMonth:12,tax:'bonus'});x=C.calculate(r,2026,'target','separate');assert.equal(x.finalTax,4560);assert.equal(x.gross,156000);assert.equal(C.calculate(r,2028,'target','separate').blocked,true);assert.equal(C.calculate(r,2026,'fixed').gross,120000);
r=fixture();r.cells.start.value='2026-07';x=C.calculate(r,2026);assert.equal(x.gross,60000);assert.equal(x.finalTax,0);assert.equal(x.withheld,900);assert.equal(x.adjustment,900);r.cells.firstEmployment.value=true;assert.equal(C.calculate(r,2026).withheld,0);
r.cells.contributions.value=[{...C.contribution(),name:'公积金',category:'housing',employee:1000,employer:1000,from:'2026-08',to:'2026-12',source:'虚构'}];x=C.calculate(r,2026);assert.equal(x.employee,5000);assert.equal(x.rows[0].employee,0);assert.equal(x.rows[6].employee,0);assert.equal(C.calculate(r,2027).blocked,true);
r=fixture();r.cells.contributions.value=[{...C.contribution(),name:'社保',mode:'rate',base:1000,min:2000,max:3000,employee:10,employer:20,from:'2026-01',to:'2027-12',source:'虚构'}];assert.equal(C.calculate(r,2026).employee,2400);r.cells.contributions.value[0].base=4000;assert.equal(C.calculate(r,2026).employee,3600);
r=fixture();r.cells.deduction.value=1000;r.cells.taxYears.value[0].annualSpecial=6000;assert.equal(C.calculate(r,2026).finalTax,2880);
r=fixture();r.cells.components.value[0].amount=null;assert.equal(C.calculate(r,2026).net,null);r=fixture();r.cells.firstMonthFactor.value=null;assert.equal(C.calculate(r,2026).net,null);assert.equal(Number.isNaN(C.calculate(r,2026).gross),true);
r=fixture();r.cells.policyThrough.value='2025-12';assert.equal(C.calculate(r,2026).hypothetical,true);
const base={schema:1,boardId:'fictional-only',records:[fixture()]},local=C.clone(base),incoming=C.clone(base);local.records[0].cells.city=C.cell('甲');incoming.records[0].cells.level=C.cell('乙');let merged=C.merge(base,local,incoming);assert.equal(merged.conflicts.length,0);assert.equal(C.val(merged.data.records[0],'city'),'甲');incoming.records[0].cells.city=C.cell('丙');merged=C.merge(base,local,incoming);assert.equal(merged.conflicts.length,1);assert.equal(merged.conflicts[0].local.value,'甲');
const unsafe=C.clone(base);unsafe.records[0].cells.company.value='</script><script>alert(1)</script>';const html=render(unsafe);assert.equal(html.includes('</script><script>alert(1)'),false);assert.equal(html.includes('/*APP*/'),false);assert.throws(()=>C.validate({...base,records:[fixture(),fixture()]}));
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'offer-render-test-'));
try {
  const input=path.join(dir,'data.json'),out=path.join(dir,'board.html'),exportFile=path.join(dir,'export.json'),script=path.resolve(__dirname,'../scripts/render_offer_board.js');
  fs.writeFileSync(input,JSON.stringify(base));
  assert.equal(spawnSync(process.execPath,[script,'--input',input,'--out',out]).status,0);
  const exported=C.clone(base);exported.base=C.clone(base);exported.records[0].cells.city=C.cell('本机');fs.writeFileSync(exportFile,JSON.stringify(exported));
  assert.equal(spawnSync(process.execPath,[script,'--input',out,'--merge',exportFile,'--out',out]).status,0);
  assert.equal(require('../scripts/render_offer_board.js').read(out).records[0].cells.city.value,'本机');
  exported.records[0].cells.city=C.cell('冲突');fs.writeFileSync(exportFile,JSON.stringify(exported));const before=fs.readFileSync(out,'utf8');
  assert.equal(spawnSync(process.execPath,[script,'--input',out,'--merge',exportFile,'--out',out]).status,1);assert.equal(fs.readFileSync(out,'utf8'),before);
} finally { for(const name of fs.readdirSync(dir))fs.unlinkSync(path.join(dir,name));fs.rmdirSync(dir); }
console.log('Offer board: tax, timing, contributions, missing values, merge and rendering checks passed.');
module.exports={fixture};
