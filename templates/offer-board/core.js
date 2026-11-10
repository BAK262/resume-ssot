/* Offer data and mainland resident wage estimates. No network or storage access. */
(function (root) {
  'use strict';
  const clone = x => JSON.parse(JSON.stringify(x));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const known = x => typeof x === 'number' && Number.isFinite(x);
  const money = x => Math.round((x + Number.EPSILON) * 100) / 100;
  const cell = (value = null, source = '', status = '待确认') => ({value, source, status, date: '', note: ''});
  const val = (record, key) => record.cells[key]?.value;
  const brackets = [[36000,.03,0],[144000,.1,2520],[300000,.2,16920],[420000,.25,31920],[660000,.3,52920],[960000,.35,85920],[Infinity,.45,181920]];
  function tax(x) { if(!known(x))return NaN;const b = brackets.find(b => x <= b[0]); return money(Math.max(0, x * b[1] - b[2])); }
  function bonusTax(x) { if(!known(x))return NaN;const b = brackets.find(b => x <= b[0]); return money(Math.max(0, x * b[1] - b[2] / 12)); }
  const groups = [
    ['岗位与团队','HR', [['company','公司'],['position','岗位'],['department','实际部门'],['entity','劳动合同签约主体'],['city','工作城市'],['leader','直属领导'],['level','岗位序列与职级'],['stage','方案阶段'],['deadline','回复期限'],['start','入职月份','month'],['duties','前半年任务与考核']]],
    ['研究与成长','业务负责人', [['ownership','研究主责与时间占比'],['resources','数据、实验、算力与预算'],['collaboration','算法／产研协作与成果归属'],['impact','研究如何进入业务决策'],['growth','晋升、调薪及可迁移能力']]],
    ['待遇与兑现','HR', [['quotedPackage','HR 所述年包（元）','number'],['packageBasis','总包包含哪些项目／对应哪一年'],['bonusTerms','奖金计算基数、保底与绩效系数'],['bonusTiming','奖金首年折算、发放与离职条件'],['signonTerms','签字费／安家费发放、服务期与返还'],['equity','股权类型、数量、估值、归属、行权与离职处理'],['allowances','现金补贴、报销、人才补贴及条件'],['benefits','商业保险、年假、年金与其他福利'],['contributionTerms','参保地、基数组成、比例和起缴时间']]],
    ['工作与签约','HR', [['hours','工时、加班与调休'],['travel','出差与通勤'],['living','住房与生活成本'],['stability','团队稳定性／员工观察'],['contract','合同期限、试用期与转正标准'],['entryConditions','毕业、背调、体检等入职条件'],['agreements','三方、违约、服务期、竞业与知识产权']]],
    ['谈判与决策','本人', [['priorities','最看重的条件'],['strengths','优势与岗位贡献证据'],['concerns','顾虑与待核实事项'],['target','理想目标、底线及可交换条件'],['alternatives','真实备选及各自进展'],['stop','接受／暂停／退出条件'],['rounds','沟通日期、HR 原话与本轮结果'],['next','下一步与联系人'],['decision','个人判断与理由']]],
    ['测算条件','本人', [['resident','大陆居民工资测算适用','boolean'],['inventoryComplete','现金项目已完整录入（含明确没有的项目）','boolean'],['contributionsComplete','缴费项目已完整录入','boolean'],['trialMonths','试用月数（无则 0）','number'],['trialFactor','试用月薪系数（全薪填 1）','number'],['firstMonthFactor','入职首月工资系数（整月填 1）','number'],['firstEmployment','当年符合首次就业预扣条件','boolean'],['deduction','月专项附加扣除（无则 0）','number'],['otherDeduction','月其他允许税前扣除（无则 0）','number'],['policyThrough','所用工资个税规则已核实至','month'],['bonusEligible','满足全年一次性奖金条件且当年未使用','boolean'],['policyNote','政策来源、核验日期与测算假设']]]
  ];
  function newRecord(id) {
    const r = {id, trackerId: '', cells: {}, versions: [], updatedAt: new Date().toISOString()};
    groups.forEach(g => g[2].forEach(([key]) => r.cells[key] = cell()));
    for (const key of ['components','contributions','taxYears','custom']) r.cells[key] = cell([]);
    r.cells.archived = cell(false, '', '本人确认');
    return r;
  }
  function component() { return {id: 'pay-'+Date.now(), name: '', kind: 'fixed', amount: null, frequency: 'monthly', from: '', to: '', payMonth: null, tax: 'wage', trial: true, prorate: false, terms: '', source: ''}; }
  function contribution() { return {id: 'fee-'+Date.now(), name: '', category: 'social', mode: 'amount', employee: null, employer: null, base: null, min: null, max: null, fixed: 0, rounding: 'cent', from: '', to: '', deduct: true, source: ''}; }
  function validate(data) {
    if (!data || data.schema !== 1 || typeof data.boardId !== 'string' || !Array.isArray(data.records)) throw Error('不是有效的 Offer 对比记录');
    const ids = new Set();
    for (const r of data.records) {
      if (!r.id || ids.has(r.id) || !r.cells || !Array.isArray(r.versions)) throw Error('记录 ID 重复或结构不完整');
      ids.add(r.id);
      for (const [k,c] of Object.entries(r.cells)) if (!c || !Object.hasOwn(c,'value')) throw Error('字段格式错误：'+k);
      for(const [, , fields] of groups)for(const [key,,type]of fields){const value=val(r,key);if(value==null||value==='')continue;if(type==='number'&&(!known(value)||value<0))throw Error('数字字段无效：'+key);if(type==='boolean'&&typeof value!=='boolean')throw Error('确认字段无效：'+key);if(type==='month'&&monthIndex(value)===null)throw Error('月份无效：'+key);}
      for (const key of ['components','contributions','taxYears','custom']) if (!Array.isArray(val(r,key))) throw Error('明细格式错误：'+key);
      for (const p of val(r,'components')) {
        for(const k of ['from','to'])if(p[k]&&monthIndex(p[k])===null)throw Error('收入期间格式无效');
        if(p.from&&p.to&&p.from>p.to)throw Error('收入开始月晚于结束月');
        if (p.amount !== null && (!known(p.amount) || p.amount < 0)) throw Error('收入金额必须为非负数字或留空');
        if (!['monthly','annual','once'].includes(p.frequency) || !['fixed','variable','once','equity','reimbursement'].includes(p.kind) || !['wage','bonus','exempt','unknown'].includes(p.tax)) throw Error('收入项目类型无效');
        if (p.frequency === 'annual' && p.payMonth !== null && (!Number.isInteger(p.payMonth) || p.payMonth<1 || p.payMonth>12)) throw Error('发放月应为 1–12');
      }
      for (const p of val(r,'contributions')) {
        for(const k of ['from','to'])if(p[k]&&monthIndex(p[k])===null)throw Error('缴费期间格式无效');
        if(p.from&&p.to&&p.from>p.to)throw Error('缴费开始月晚于结束月');
        if (!['amount','rate'].includes(p.mode) || !['social','housing','annuity'].includes(p.category)) throw Error('缴费类型无效');
        for (const k of ['employee','employer','base','min','max','fixed']) if (p[k] != null && (!known(p[k]) || p[k]<0)) throw Error('缴费参数必须非负');
        if (p.mode==='rate' && (p.employee>100 || p.employer>100)) throw Error('缴费比例不能超过 100%');
        if (known(p.min)&&known(p.max)&&p.min>p.max) throw Error('基数下限不能高于上限');
      }
      const years=new Set();
      for (const y of val(r,'taxYears')) {
        if (!Number.isInteger(y.year)||y.year<2019||years.has(y.year)) throw Error('年度背景的年份无效或重复');
        years.add(y.year);
        for(const k of ['income','deduction','withheld','annualSpecial']) if(y[k]!=null&&(!known(y[k])||y[k]<0)) throw Error('年度背景金额必须非负或留空');
      }
    }
    return data;
  }
  // Three-way merge preserves independent changes and leaves conflicts for a human.
  function merge(base, local, incoming) {
    const out=clone(incoming), conflicts=[];
    for (const l of local.records) {
      let i=out.records.find(r=>r.id===l.id), b=base.records.find(r=>r.id===l.id);
      if (!i) { out.records.push(clone(l)); continue; }
      for (const key of new Set([...Object.keys(l.cells),...Object.keys(i.cells)])) {
        const bv=b?.cells[key], lv=l.cells[key], iv=i.cells[key];
        if (equal(lv,bv)||equal(lv,iv)) continue;
        if (equal(iv,bv)) { if(lv!==undefined)i.cells[key]=clone(lv); }
        else conflicts.push({id:l.id,key,local:lv??cell(),incoming:iv??cell()});
      }
      if(l.trackerId && !i.trackerId)i.trackerId=l.trackerId;
      i.versions=Array.from(new Map([...i.versions,...l.versions].map(v=>[v.id,v])).values());
    }
    return {data:out, conflicts};
  }
  function monthIndex(s) { if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(s||''))return null; const [y,m]=s.split('-').map(Number); return y*12+m-1; }
  function monthString(i) { return Math.floor(i/12)+'-'+String(i%12+1).padStart(2,'0'); }
  function inPeriod(p,ym) { return (!p.from||ym>=p.from)&&(!p.to||ym<=p.to); }
  function calculate(r, year, scenario='target', bonusMode='combined') {
    const warnings=new Set(), missing=new Set(), rows=[];
    const start=monthIndex(val(r,'start'));
    if(start===null)missing.add('入职月份');
    if(val(r,'resident')!==true)missing.add('大陆居民工资测算适用条件');
    if(val(r,'inventoryComplete')!==true)missing.add('完整现金项目');
    if(val(r,'contributionsComplete')!==true)missing.add('完整缴费项目');
    const inputs={};
    for(const key of ['trialMonths','trialFactor','firstMonthFactor','deduction','otherDeduction']) {
      inputs[key]=val(r,key);
      if(!known(inputs[key])||inputs[key]<0)missing.add(key);
    }
    if(inputs.trialFactor>1 || inputs.firstMonthFactor>1)missing.add('工资系数应在 0–1 内');
    if(!Number.isInteger(inputs.trialMonths))missing.add('试用月数应为整数');
    if(val(r,'firstEmployment')==null)missing.add('首次就业预扣条件');
    const background=val(r,'taxYears').find(x=>x.year===year);
    if(!background || ![background.income,background.deduction,background.withheld,background.annualSpecial].every(known))missing.add(year+' 年其他综合所得背景及全年专项附加扣除（无则明确填 0）');
    const payments=val(r,'components'), fees=val(r,'contributions');
    let cumulative=0, deductions=0, withheld=0, separateCount=0, annualBonusTax=0;
    let hasEmployerUnknown=false, hasPolicyGap=false;
    for(let m=1;m<=12;m++) {
      const idx=year*12+m-1, ym=monthString(idx), active=start!==null&&idx>=start;
      let gross=0,wage=0,bonus=0,employee=0,employerSocial=0,housingPersonal=0,housingEmployer=0,deductible=0;
      const items=[];
      for(const p of payments) {
        if(['equity','reimbursement'].includes(p.kind))continue;
        if(scenario==='fixed'&&p.kind!=='fixed')continue;
        if(!known(p.amount)) { missing.add(p.name+'金额'); continue; }
        if(p.frequency==='annual' && !p.payMonth)missing.add(p.name+'发放月份');
        if(p.frequency==='once' && monthIndex(p.from)===null)missing.add(p.name+'发放年月');
        const due=active && inPeriod(p,ym) && (p.frequency==='monthly'||p.frequency==='annual'&&p.payMonth===m||p.frequency==='once'&&p.from===ym);
        if(!due)continue;
        let amount=p.amount;
        if(p.frequency==='monthly') {
          if(p.trial && (!known(inputs.trialMonths)||idx<start+inputs.trialMonths))amount*=known(inputs.trialFactor)?inputs.trialFactor:NaN;
          if(idx===start)amount*=known(inputs.firstMonthFactor)?inputs.firstMonthFactor:NaN;
        }
        if(p.prorate && p.frequency==='annual') {
          missing.add(p.name+'首年折算需按确认金额拆成一次性项目');
        }
        amount=money(amount); gross+=amount; items.push(p.name+': '+amount);
        if(p.tax==='unknown')missing.add(p.name+'计税处理');
        else if(p.tax==='bonus')bonus+=amount;
        else if(p.tax==='wage')wage+=amount;
        if(p.tax==='exempt'&&!p.source)missing.add(p.name+'免税依据');
      }
      if(active)for(const name of new Set(fees.map(p=>p.name))) {
        const periods=fees.filter(p=>p.name===name), first=periods.map(p=>p.from).filter(Boolean).sort()[0];
        if(first && ym>=first && !periods.some(p=>inPeriod(p,ym)))missing.add(name+'缴费规则未覆盖 '+ym);
        if(periods.filter(p=>inPeriod(p,ym)).length>1)missing.add(name+'缴费期间重叠 '+ym);
      }
      if(active)for(const p of fees) {
        if(!p.from || !p.to) { missing.add(p.name+'缴费期间'); continue; }
        if(!inPeriod(p,ym))continue;
        let personal,company;
        if(p.mode==='amount') { personal=p.employee; company=p.employer; }
        else {
          if(![p.base,p.min,p.max,p.employee,p.fixed].every(known)){missing.add(p.name+'基数／比例／上下限');continue;}
          const b=Math.min(Math.max(p.base,p.min),p.max), round=p.rounding==='yuan'?Math.round:money;
          personal=round(b*p.employee/100+p.fixed);
          company=known(p.employer)?round(b*p.employer/100):null;
        }
        if(!known(personal)){missing.add(p.name+'个人缴费');continue;}
        employee+=personal;
        if(p.deduct)deductible+=personal;
        if(p.category==='housing') { housingPersonal+=personal; if(known(company))housingEmployer+=company; else hasEmployerUnknown=true; }
        else if(known(company))employerSocial+=company;
        if(!p.source)warnings.add(p.name+'缴费依据待补');
      }
      const covered=monthIndex(val(r,'policyThrough'));
      if(active && (covered===null||idx>covered)){hasPolicyGap=true;warnings.add('工资个税规则未核实覆盖 '+ym+'；结果为规则延用试算');}
      let separate=0;
      if(bonusMode==='separate'&&bonus>0) {
        separateCount++;
        if(year>2027||year<2023||val(r,'bonusEligible')!==true||background?.bonusUsed!==false||separateCount>1)missing.add('全年一次性奖金单独计税资格／年度政策');
        separate=bonusTax(bonus); annualBonusTax+=separate;
      } else wage+=bonus;
      if(active) {
        cumulative+=wage;
        deductions+=deductible+inputs.deduction+inputs.otherDeduction;
      }
      const employed=active?Math.min(m,idx-start+1):0;
      const allowance=val(r,'firstEmployment')===true?m:employed;
      const taxable=Math.max(0,cumulative-deductions-allowance*5000);
      const currentTax=active?money(Math.max(0,tax(taxable)-withheld)):0;
      withheld+=currentTax;
      rows.push({month:ym,gross:money(gross),employee:money(employee),deductible:money(deductible),tax:money(currentTax+separate),net:money(gross-employee-currentTax-separate),housingPersonal:money(housingPersonal),housingEmployer:hasEmployerUnknown?null:money(housingEmployer),employerSocial:money(employerSocial),items});
    }
    const sum=k=>money(rows.reduce((s,x)=>s+(x[k]??0),0));
    const annualDeduction=(background?.annualSpecial??NaN)+inputs.otherDeduction*rows.filter(x=>start!==null&&monthIndex(x.month)>=start).length;
    const taxable=Math.max(0,cumulative+(background?.income||0)-60000-sum('deductible')-annualDeduction-(background?.deduction||0));
    const finalTax=money(tax(taxable)+annualBonusTax);
    const adjustment=money(sum('tax')+(background?.withheld||0)-finalTax);
    if((background?.income||0)>0)warnings.add('年度汇算包含其他综合所得；税后金额不是本 Offer 的独立税负归因');
    warnings.add('月预扣使用月扣除额；汇算使用年度背景中的全年专项附加扣除。其他扣除只填未包含的项目。');
    if(val(r,'policyNote'))warnings.add(val(r,'policyNote'));
    const blocked=missing.size>0;
    return {year,scenario,bonusMode,rows,missing:[...missing],warnings:[...warnings],blocked,hypothetical:hasPolicyGap,gross:sum('gross'),employee:sum('employee'),withheld:blocked?null:sum('tax'),net:blocked?null:sum('net'),finalTax:blocked?null:finalTax,adjustment:blocked?null:adjustment,finalNet:blocked?null:money(sum('net')+adjustment),housingPersonal:sum('housingPersonal'),housingEmployer:hasEmployerUnknown?null:sum('housingEmployer')};
  }
  function windowSummary(results, from, to) {
    const rows=results.flatMap(x=>x.rows).filter(x=>x.month>=from&&x.month<=to);
    const blocked=results.some(x=>x.blocked);
    return {gross:money(rows.reduce((s,x)=>s+x.gross,0)),net:blocked?null:money(rows.reduce((s,x)=>s+x.net,0)),months:rows.length};
  }
  const api={clone,equal,known,money,cell,val,groups,newRecord,component,contribution,validate,merge,tax,bonusTax,monthIndex,monthString,calculate,windowSummary};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OfferCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
