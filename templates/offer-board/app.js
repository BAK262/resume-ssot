(function(){
  'use strict';
  const C=OfferCore, $=s=>document.querySelector(s);
  const moneyText=x=>String(x??'').replace(/([\d,]+(?:\.\d+)?)\s*(万元|千元|元)/g,(_,n,u)=>formatK(Number(n.replace(/,/g,''))*({万元:10000,千元:1000,元:1}[u])));
  const formatK=n=>(n/1000).toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:1})+'k';
  const esc=x=>moneyText(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const seed=C.validate(JSON.parse($('#offer-data').textContent)), key='resume-ssot-offer-board-v1:'+seed.boardId;
  let state=C.clone(seed), base=C.clone(seed), conflicts=[], tab='compare', activeId='', draft=null, unknownOnly=false,  editAction=null, storageError='';
  const fmt=n=>C.known(n)?formatK(n):'待确认';
  const show=v=>v==null||v===''?'待确认':typeof v==='boolean'?(v?'是':'否'):String(v);
  let lastSaved=null;
  try {const cached=JSON.parse(localStorage.getItem(key)||'null');if(cached){C.validate(cached.data);C.validate(cached.base);const merged=C.merge(cached.base,cached.data,seed);state=merged.data;conflicts=[...(cached.conflicts||[]),...merged.conflicts];lastSaved=C.clone(cached.data);}}catch(e){storageError='本机缓存读取失败；请先导出当前资料并检查浏览器存储：'+e.message;}
  function persist(){try{const cached=JSON.parse(localStorage.getItem(key)||'null');if(cached&&lastSaved&&!C.equal(cached.data,lastSaved)){C.validate(cached.data);const merged=C.merge(lastSaved,state,cached.data);state=merged.data;conflicts.push(...merged.conflicts,...(cached.conflicts||[]));}conflicts=Array.from(new Map(conflicts.map(c=>[JSON.stringify(c),c])).values());localStorage.setItem(key,JSON.stringify({base,data:state,conflicts}));lastSaved=C.clone(state);storageError='';}catch(e){storageError='本机保存失败，请立即导出记录：'+e.message;}render();}
  function records(){return state.records.filter(r=>$('#archived').checked||!C.val(r,'archived'));}
  function current(){return state.records.find(r=>r.id===activeId);}
  function editable(){return draft||current();}
  function pending(r){return C.groups.slice(0,5).flatMap(g=>g[2]).filter(([k])=>r.cells[k]?.value==null||r.cells[k]?.value===''||['待确认','存在冲突'].includes(r.cells[k]?.status)).length;}
  function title(r){return C.val(r,'company')||'未命名机会';}
  function update(key,value,status,source,date,note){const r=editable();r.cells[key]={...(r.cells[key]||C.cell()),value};r.updatedAt=new Date().toISOString();if(!draft)persist();else render();}
  function fieldButton(key,label='编辑'){return `<button class="quiet small" data-edit="${esc(key)}">${label}</button>`;}
  function recordSelect(){return `<label>当前机会 <select id="recordSelect">${records().map(r=>`<option value="${esc(r.id)}" ${r.id===activeId?'selected':''}>${esc(title(r))} · ${esc(C.val(r,'position')||'岗位待确认')}</option>`).join('')}</select></label>`;}
  function render(){
    const list=records();if(!list.some(r=>r.id===activeId))activeId=list[0]?.id||'';
    $('#saveState').textContent=storageError||(C.equal(state,seed)?'当前显示文件中的资料。手动修改会保存在本浏览器；导出操作记录交给 AI 后，可同步到文件与其他设备。':'本浏览器有资料更新，尚未同步到文件。请导出操作记录交给 AI；跨设备使用前先完成同步。');
    $('#stats').innerHTML=[['参与比较',list.length],['正式通知',list.filter(r=>C.val(r,'stage')==='正式通知').length],['待核实项目',list.reduce((s,r)=>s+pending(r),0)],['已存方案',list.reduce((s,r)=>s+r.versions.length,0)]].map(([t,n])=>`<div class="stat"><strong>${n}</strong><span>${t}</span></div>`).join('');
    $('#conflicts').innerHTML=conflicts.map((c,i)=>`<div class="conflict"><b>同一项目有不同修改：${esc(title(state.records.find(r=>r.id===c.id)))} / ${esc(c.key)}</b><p>请选择保留的值，或先导出交给 AI 核实。</p><div class="fields"><div>本机修改<pre>${esc(JSON.stringify(c.local.value,null,2))}</pre><button data-resolve="${i}" data-side="local">保留本机值</button></div><div>文件／导入值<pre>${esc(JSON.stringify(c.incoming.value,null,2))}</pre><button data-resolve="${i}" data-side="incoming">保留文件值</button></div></div></div>`).join('');
    if(!list.length){$('#content').innerHTML='<div class="empty">点击“新增机会”建立第一列。</div>';return;}
    renderTable(list);
  }
  const isMissing=v=>v==null||v===''||Array.isArray(v)&&!v.length;
  function displayValue(r,k){
    const v=C.val(r,k);
    if(k==='start'&&/^\d{4}-\d{2}$/.test(v||''))return v+'（具体日期待补充）';
    if(C.bundles[k])return C.bundledValue(r,k)||'待确认';
    if(k==='calcSettings'){const n=C.calculate(r,calcYear,scenario,bonusMode).missing.length;return n?'补充测算资料 · '+n+' 项待确认':'测算资料已齐，可查看结果';}
    if(k==='components')return v.map(p=>`${p.name||'未命名'}：${fmt(p.amount)} / ${{monthly:'月',annual:'年',once:'次'}[p.frequency]}${p.terms?'；'+p.terms:''}`).join('\n')+(C.bundledValue(r,'bonusTerms')?'\n'+C.bundledValue(r,'bonusTerms'):'')||'待补充';
    if(k==='contributions')return v.map(p=>`${p.name||'缴费项目'}：个人 ${p.mode==='rate'?show(p.employee)+'%':fmt(p.employee)}，单位 ${p.mode==='rate'?show(p.employer)+'%':fmt(p.employer)}；${p.from||'?'} 至 ${p.to||'?'}`).join('\n')+(C.val(r,'contributionTerms')?'\n'+C.val(r,'contributionTerms'):'')||'待补充';
    if(k==='taxYears')return v.map(p=>`${p.year}：其他收入 ${fmt(p.income)}，全年专项附加扣除 ${fmt(p.annualSpecial)}`).join('\n')||'待补充';
    if(k==='custom')return v.map(p=>`${p.name}：${p.value||'待补充'}`).join('\n')||'添加自定义项目';
    return k==='quotedPackage'?fmt(v):show(v);
  }
  function renderTable(list){
    const scroller=$('#comparison-table')?.parentElement;const scrollTop=scroller?.scrollTop||0,scrollLeft=scroller?.scrollLeft||0;
    let html=`<div class="controls"><label><input id="unknownOnly" type="checkbox" ${unknownOnly?'checked':''}> 只看待补充</label><a href="#salary-analysis">薪酬分析 ↓</a><span class="help">金额单位：k（千元）。点击内容编辑，自动计算。未知留空，明确没有填 0。</span></div><div class="table-wrap"><table class="compare compact" id="comparison-table"><thead><tr><th>对比项目</th>${list.map(r=>`<th><button class="cell-edit" data-inline="${esc(r.id)}" data-key="company">${esc(title(r))}</button></th>`).join('')}</tr></thead><tbody>`;
    const row=(k,label)=>`<tr><th>${esc(label)}</th>${list.map(r=>`<td><button class="cell-edit" data-inline="${esc(r.id)}" data-key="${k}">${esc(displayValue(r,k))}</button></td>`).join('')}</tr>`;
    for(const [name,fields]of C.comparisonGroups){
      let entries=fields.filter(([k])=>k!=='company');

      entries=entries.filter(([k])=>!unknownOnly||list.some(r=>k==='calcSettings'?C.calculate(r,calcYear,scenario,bonusMode).blocked:isMissing(C.bundles[k]?C.bundledValue(r,k):C.val(r,k))));
      if(!entries.length)continue;
      html+=`<tr class="section-row"><th colspan="${list.length+1}">${name}</th></tr>`;
      for(const [k,label]of entries)html+=row(k,label);
      if(name==='薪酬与福利'){
        const results=list.map(r=>C.calculate(r,calcYear,scenario,bonusMode));
        html+=`<tr class="section-row"><th colspan="${list.length+1}">自动汇总 · ${calcYear} 年 · ${scenario==='fixed'?'固定现金':'目标现金'} · ${bonusMode==='combined'?'奖金并入':'合格全年奖单独计税'}</th></tr>`;
        for(const [label,k]of [['年现金（税前）','gross'],['全年预计到账','net']])html+=`<tr><th>${label}</th>${results.map(x=>`<td>${fmt(x[k])}${x.blocked?'<div class="meta">条件待补齐；税前为已录小计</div>':x.hypothetical?'<div class="meta">规则延用试算</div>':''}</td>`).join('')}</tr>`;
      }
    }
    html+=row('custom','自定义比较项')+'</tbody></table></div>';
    renderCalc();const calc=$('#content').innerHTML;
    html+=`<section id="salary-analysis"><h2>薪酬分析</h2><p class="help">共用上表的数据；选择年份和口径，查看逐月到账或建立假设试算。</p>${calc}</section>`;
    $('#content').innerHTML=html;
    const next=$('#comparison-table')?.parentElement;if(next){next.scrollTop=scrollTop;next.scrollLeft=scrollLeft;}
  }
  let calcYear=new Date().getFullYear()+1,scenario='target',bonusMode='combined';
  function renderCalc(){const r=editable();const result=C.calculate(r,calcYear,scenario,bonusMode);const begin=C.startMonth(C.val(r,'start'));const idx=C.monthIndex(begin);const results=idx===null?[]:[C.calculate(r,Math.floor(idx/12),scenario,bonusMode),C.calculate(r,Math.floor(idx/12)+1,scenario,bonusMode)];const window=idx===null?null:C.windowSummary(results,begin,C.monthString(idx+11));
    const fixed=C.calculate(r,calcYear,'fixed',bonusMode),other=C.calculate(r,calcYear,scenario,bonusMode==='combined'?'separate':'combined');
    let html=`<div class="controls">${recordSelect()}<label>年份 <input id="calcYear" type="number" min="2023" max="2100" value="${calcYear}" style="width:100px"></label><select id="scenario"><option value="target" ${scenario==='target'?'selected':''}>目标现金：包含浮动与一次性</option><option value="fixed" ${scenario==='fixed'?'selected':''}>固定现金：只计固定项目</option></select><select id="bonusMode"><option value="combined" ${bonusMode==='combined'?'selected':''}>奖金并入综合所得</option><option value="separate" ${bonusMode==='separate'?'selected':''}>合格全年奖单独计税</option></select></div>`;
    html+=`<div class="notice">${draft?'正在试算：修改不会写入真实报价。':'当前真实报价；可复制为假设方案，比较谈薪调整效果。'} <button id="startDraft" class="quiet small">${draft?'重新复制当前报价':'建立假设试算'}</button> ${draft?'<button id="discardDraft" class="quiet small">退出试算</button><button id="commitDraft" class="quiet small">对方已确认，更新报价</button>':''}</div><div class="actions">${fieldButton('components','调整收入组成')}${fieldButton('contributions','调整缴费')}${fieldButton('taxYears','年度背景')}${fieldButton('calcSettings','测算条件')}</div>`;
    if(result.blocked)html+=`<details class="warning"><summary>税后测算还需 ${result.missing.length} 项资料 · 查看待补清单</summary><ul>${result.missing.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></details>`;
    html+=`<div class="calc-cards">${[['本年预计到账',result.net],['年度汇算后现金',result.finalNet],['公积金账户新增',C.known(result.housingEmployer)&&C.known(result.housingPersonal)?result.housingPersonal+result.housingEmployer:null]].map(([t,n])=>`<div class="stat"><span>${t}</span><strong>${fmt(n)}</strong></div>`).join('')}</div>`;
    if(result.hypothetical)html+='<p class="help">规则延用试算：所选期间尚有政策待核实，详见计算依据。</p>';
    html+=salaryCharts(r,result,fixed);
    html+=`<details><summary>首年、扣款与年度汇算明细</summary><div class="detail-metrics">${[['入职前12个月税前',window?.gross],['入职前12个月到账',window?.net],['个人社保及公积金',result.employee],['全年预扣税',result.withheld],['预计退税（负数为补税）',result.adjustment]].map(([t,n])=>`<p>${t}<strong>${fmt(n)}</strong></p>`).join('')}</div><p class="help">前12个月从入职月起算；所选年度按实际发放月份统计。月到账可能随预扣税变化。</p></details>`;
    if(draft){const real=C.calculate(current(),calcYear,scenario,bonusMode);html+=`<p class="notice">相较真实报价：税前差额 ${fmt(C.known(result.gross)&&C.known(real.gross)?result.gross-real.gross:null)}；到账差额 ${fmt(result.net!==null&&real.net!==null?result.net-real.net:null)}</p>`;}
    html+=`<details><summary>另一种奖金计税方式</summary><p>${bonusMode==='combined'?'单独计税':'并入综合所得'}：全年个税 ${fmt(other.finalTax)}，汇算后现金 ${fmt(other.finalNet)}</p><p>${other.missing.map(esc).join('；')}</p><p class="help">只在资格、发放年度和个人全年背景完整时比较。当前已核实单独计税政策至 2027 年底。</p></details>`;
    html+=`<details><summary>计算依据与假设</summary><p>月到账＝本月现金收入－个人缴费－本月预扣税；固定／目标方案分别计算。公积金账户新增另列。</p><p>综合所得按年度税率累计预扣；汇算使用全年扣除与年度背景。跨年窗口相加各年实际预扣后的月到账，不把两年收入合并计税。</p><ul>${result.warnings.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>政策来源：<a href="https://www.chinatax.gov.cn/n810341/n810760/c3959585/content.html" target="_blank" rel="noopener">工资预扣</a> · <a href="https://fgk.chinatax.gov.cn/zcfgk/c102416/c5211524/content.html" target="_blank" rel="noopener">全年一次性奖金</a></p></details>`;
    html+='<details><summary>逐月数值明细</summary><div class="table-wrap"><table><thead><tr><th>发放月</th><th>税前现金</th><th>个人缴费</th><th>预扣税</th><th>预计到账</th><th>公积金个人</th><th>公积金单位</th></tr></thead><tbody>'+result.rows.map(x=>`<tr><td>${x.month}</td>${[x.gross,x.employee,result.blocked?null:x.tax,result.blocked?null:x.net,x.housingPersonal,x.housingEmployer].map(n=>`<td class="numbers">${fmt(n)}</td>`).join('')}</tr>`).join('')+'</tbody></table></div></details>';
    $('#content').innerHTML=html;
  }
  function salaryCharts(r,result,fixed){
    const target=C.calculate(r,calcYear,'target',bonusMode);
    const onceRecord=C.clone(r);onceRecord.cells.components.value=onceRecord.cells.components.value.filter(p=>p.kind==='once');
    const once=C.calculate(onceRecord,calcYear,'target',bonusMode).gross;
    const variable=C.known(target.gross)&&C.known(fixed.gross)&&C.known(once)?C.money(target.gross-fixed.gross-once):null;
    const parts=[['固定现金',fixed.gross,'fixed'],['浮动现金',variable,'variable'],['一次性现金',once,'once']].map(([label,n,kind])=>[label,C.val(r,'components').some(p=>p.kind===kind&&!C.known(p.amount))?null:n,kind]);
    let html='<div class="chart-grid"><section class="chart-panel"><h3>这一年的钱从哪里来</h3><p class="help">目标现金 · '+calcYear+' 年'+(target.blocked?' · 已录小计':'')+'</p>';
    if(C.known(target.gross)&&target.gross>0&&parts.every(p=>C.known(p[1])&&p[1]>=0))html+='<div class="stack" role="img" aria-label="'+esc(parts.map(p=>p[0]+fmt(p[1])).join('，'))+'">'+parts.map(([label,n,cls])=>`<span class="${cls}" style="width:${n/target.gross*100}%" title="${label} ${fmt(n)}"></span>`).join('')+'</div>';
    else html+='<p class="chart-empty">'+(target.gross===0?'本年已录现金为 0':'填写收入项目后显示构成')+'</p>';
    html+='<div class="legend">'+parts.map(([label,n,cls])=>`<p><i class="${cls}"></i>${label}<strong>${fmt(n)}</strong></p>`).join('')+'</div><p class="help">股权与报销单列；浮动部分按录入金额兑现。</p></section>';
    const net=!result.blocked, values=result.rows.map(x=>net?x.net:x.gross), finite=values.filter(C.known);
    html+='<section class="chart-panel"><h3>'+ (net?'每个月能到账多少':'逐月税前现金')+'</h3><p class="help">'+(net?'按实际预扣后的现金流':'税后条件待补齐，先展示已录税前小计')+' · '+calcYear+' 年</p>';
    if(finite.length){
      const lo=Math.min(0,...finite),hi=Math.max(1,...finite),y=v=>150-(v-lo)/(hi-lo)*120,zero=y(0);
      html+=`<svg class="monthly-chart" viewBox="0 0 600 190" role="img" aria-label="${esc(result.rows.map((x,i)=>x.month+' '+fmt(values[i])).join('；'))}"><text x="0" y="15">${esc(fmt(hi))}</text><line x1="0" x2="600" y1="${zero}" y2="${zero}" stroke="#9ba9a8"/>`;
      result.rows.forEach((x,i)=>{const n=values[i],px=10+i*49;if(C.known(n))html+=`<rect x="${px}" y="${Math.min(y(n),zero)}" width="28" height="${Math.max(1,Math.abs(y(n)-zero))}" rx="3" fill="${n<0?'#b35a48':'#287b70'}"><title>${x.month}：${fmt(n)}</title></rect>`;html+=`<text x="${px+14}" y="174" text-anchor="middle">${i+1}月</text>`;});
      html+='</svg>';
    }else html+='<p class="chart-empty">填写入职日期与收入后显示逐月图</p>';
    html+='</section></div>';
    const compare=records().map(o=>({name:title(o),result:C.calculate(o,calcYear,scenario,bonusMode)}));
    if(compare.length>1){const max=Math.max(1,...compare.map(x=>C.known(x.result.gross)?x.result.gross:0));html+='<section class="chart-panel"><h3>各机会年度现金对比</h3><p class="help">各机会当前报价 · 同一发放年份与现金口径；条件未齐时为已录小计。</p>'+compare.map(x=>`<div class="offer-bar"><span>${esc(x.name)}</span><div><i style="width:${C.known(x.result.gross)?Math.max(0,x.result.gross)/max*100:0}%"></i></div><strong>${fmt(x.result.gross)}</strong></div>`).join('')+'</section>';}
    return html;
  }
  const schemas={
    components:[['name','项目名'],['kind','收入性质','fixed|固定,variable|浮动,once|一次性,equity|股权（单列）,reimbursement|报销（单列）'],['amount','每次金额','money'],['frequency','发放频次','monthly|每月,annual|每年,once|一次'],['from','开始月（留空沿用入职月）；一次性需填','month'],['to','结束月（周期项目）','month'],['payMonth','年度项目发放月 1–12','number'],['tax','计税处理','wage|工资综合所得,bonus|符合条件的全年一次性奖,exempt|有依据免税,unknown|待核实'],['trial','月项目参与试用期折扣','boolean'],['terms','发放、首年折算、返还条件'],['source','免税适用依据']],
    contributions:[['name','险种／项目名'],['category','类别','social|社会保险,housing|公积金,annuity|企业年金／其他'],['mode','输入方式','amount|直接填月缴额,rate|基数与比例'],['employee','个人','fee'],['employer','单位','fee'],['base','申报基数（比例模式）','money'],['min','基数下限（比例模式）','money'],['max','基数上限（比例模式）','money'],['fixed','个人额外固定费用','money'],['rounding','取整','cent|分,yuan|元'],['from','缴费开始月','month'],['to','缴费结束／政策有效月','month'],['deduct','个人部分已确认可税前扣除','boolean'],['source','缴费地、政策来源与核验日']],
    taxYears:[['year','年度','number'],['income','其他综合所得收入额（非应纳税所得额；无则0）','money'],['deduction','其他所得允许扣除（不含60k及本表已计扣除）','money'],['withheld','其他所得已预扣税（无则0）','money'],['annualSpecial','全年专项附加扣除（含未就业月份，按实际资格）','money'],['bonusUsed','其他单位已用本年奖金单独计税','boolean'],['source','依据与年度假设']],
    custom:[['name','比较项'],['value','内容'],['source','出处／确认程度']]
  };
  const rowType=(type,row)=>type==='fee'?(row.mode==='rate'?'number':'money'):type;
  const fieldType=(key,type)=>['deduction','otherDeduction','quotedPackage'].includes(key)?'money':type;
  function input(name,value,type){if(type==='money')return `<span class="money-input"><input name="${name}" type="number" step="0.00001" min="0" value="${C.known(value)?value/1000:''}" aria-label="金额（k，千元）"><span>k</span></span>`;if(type==='boolean')return `<select name="${name}"><option value="">待确认</option><option value="true" ${value===true?'selected':''}>是</option><option value="false" ${value===false?'selected':''}>否</option></select>`;
    if(type?.includes('|'))return `<select name="${name}">${type.split(',').map(x=>{const [v,t]=x.split('|');return `<option value="${v}" ${v===value?'selected':''}>${t}</option>`;}).join('')}</select>`;
    if(type==='number'||type==='month'||type==='date')return `<input name="${name}" type="${type}" ${type==='number'?'step="any" min="0"':''} value="${esc(value)}">`;
    return `<textarea name="${name}">${esc(value)}</textarea>`;}
  function read(form,name,type){const value=form.elements.namedItem(name).value;return type==='money'?(value===''?null:C.money(Number(value)*1000)):type==='number'?(value===''?null:Number(value)):type==='boolean'?(value===''?null:value==='true'):value;}
  let editRows=[];
  function openEdit(k){const r=editable();if(!r)return;editAction=k;$('#editError').textContent='';
    if(k==='calcSettings'){editRows=C.groups[5][2];$('#editTitle').textContent='测算条件';$('#editBody').innerHTML='<div class="edit-grid">'+editRows.map(([key,t,type])=>`<label>${key==='trialFactor'?'试用月薪系数（无试用期自动按 1）':t}${key==='trialFactor'&&C.val(r,'trialMonths')===0?input(key,1,type).replace('<input ','<input disabled '):input(key,C.val(r,key),fieldType(key,type))}</label>`).join('')+'</div>';}
    else if(schemas[k]){editRows=C.clone(C.val(r,k)||[]);$('#editBody').innerHTML='';renderRows();}
    else{const def=C.groups.flatMap(g=>g[2]).find(x=>x[0]===k),c=r.cells[k]||C.cell();$('#editTitle').textContent=C.comparisonGroups.flatMap(g=>g[1]).find(x=>x[0]===k)?.[1]||def?.[1]||k;$('#editBody').innerHTML=`<label>内容${input('value',C.bundles[k]?C.bundledValue(r,k):k==='start'&&/^\d{4}-\d{2}$/.test(c.value||'')?'':c.value,fieldType(k,def?.[2]))}</label>${k==='start'?'<p class="help">'+(/^\d{4}-\d{2}$/.test(c.value||'')?'原记录为 '+esc(c.value)+'，请选择具体日期。':'')+'首月工资按测算条件中的已确认系数计算。</p>':''}`;}
    $('#editor').showModal();}
  function renderRows(){const k=editAction,legacyTerms=$('#editForm').elements.namedItem?.('legacyTerms')?.value??C.bundledValue(editable(),'bonusTerms'),feeTerms=$('#editForm').elements.namedItem?.('feeTerms')?.value??C.val(editable(),'contributionTerms');$('#editTitle').textContent=({components:'收入项目',contributions:'缴费项目',taxYears:'年度税务背景',custom:'自定义比较项'})[k];$('#editBody').innerHTML=`<p class="help">每笔收入只添加一次，奖金与额外薪月请先核对是否为同一笔。周期收入的开始月留空沿用入职月份，结束月留空表示持续发放。缴费可直接填月额，或选择基数与比例自动计算。</p>${editRows.map((row,i)=>`<div class="item-editor"><div class="edit-grid">${schemas[k].filter(([name])=>{if(name==='source')return k==='components'&&row.tax==='exempt';if(k==='contributions'&&row.mode==='amount'&&['base','min','max','fixed','rounding'].includes(name))return false;if(k==='components'&&name==='payMonth'&&row.frequency!=='annual')return false;if(k==='components'&&name==='to'&&row.frequency==='once')return false;if(k==='components'&&name==='trial'&&(row.frequency!=='monthly'||C.val(editable(),'trialMonths')===0))return false;return true;}).map(([name,t,type])=>`<label>${t}${type==='fee'?(row.mode==='rate'?'比例（%）':'月缴额'):''}${input(i+'_'+name,row[name],rowType(type,row))}</label>`).join('')}</div><button type="button" class="quiet small" data-remove-row="${i}">移除此项</button></div>`).join('')}<button type="button" id="addRow" class="quiet">＋ 添加一项</button>${k==='components'&&C.bundledValue(editable(),'bonusTerms')?'<label>已有收入补充说明'+input('legacyTerms',legacyTerms)+'</label>':''}${k==='contributions'?'<label>参保地与特殊约定'+input('feeTerms',feeTerms)+'</label>':''}`;}
  function collectRows(){return editRows.map((row,i)=>{const x={...row};for(const [name,,type]of schemas[editAction])if($('#editForm').elements.namedItem(i+'_'+name))x[name]=read($('#editForm'),i+'_'+name,rowType(type,row));return x;});}
  $('#editForm').onsubmit=e=>{e.preventDefault();try{const r=editable(),k=editAction,copy=C.clone(r);
    if(schemas[k]){const value=collectRows();copy.cells[k]=C.cell(value);C.validate({schema:1,boardId:seed.boardId,records:[copy]});if(e.target.elements.namedItem('legacyTerms')){for(const old of C.bundles.bonusTerms)r.cells[old]={...(r.cells[old]||C.cell()),value:old==='bonusTerms'?read(e.target,'legacyTerms'):null};}if(e.target.elements.namedItem('feeTerms'))r.cells.contributionTerms={...(r.cells.contributionTerms||C.cell()),value:read(e.target,'feeTerms')};update(k,value,draft?'假设':'本人确认','手动编辑',new Date().toISOString().slice(0,10),'');}
    else if(k==='calcSettings'){for(const [key,,type] of editRows)copy.cells[key]={...(copy.cells[key]||C.cell()),value:read(e.target,key,fieldType(key,type))};C.validate({schema:1,boardId:seed.boardId,records:[copy]});r.cells=copy.cells;if(!draft)persist();else render();}
    else{const type=C.groups.flatMap(g=>g[2]).find(x=>x[0]===k)?.[2];copy.cells[k]={...(copy.cells[k]||C.cell()),value:read(e.target,'value',fieldType(k,type))};C.validate({schema:1,boardId:seed.boardId,records:[copy]});if(C.bundles[k]){for(const old of C.bundles[k])r.cells[old]={...(r.cells[old]||C.cell()),value:old===k?copy.cells[k].value:null};if(!draft)persist();else render();}else update(k,copy.cells[k].value);}
    $('#editor').close();}catch(err){$('#editError').textContent=err.message;}};
  function snapshot(label){const r=current();r.versions.push({id:'v-'+Date.now(),label,date:new Date().toISOString(),cells:C.clone(r.cells)});}
  function download(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.tab){draft=null;tab=b.dataset.tab;render();}
    if(b.dataset.open||b.dataset.calc){activeId=b.dataset.open||b.dataset.calc;draft=null;render();}
    if(b.dataset.inline){draft=null;activeId=b.dataset.inline;openEdit(b.dataset.key);}
    if(b.dataset.edit)openEdit(b.dataset.edit);
    if(b.id==='add'){const r=C.newRecord('manual-'+Date.now());state.records.push(r);activeId=r.id;draft=null;tab='compare';persist();openEdit('company');}
    if(b.id==='export')download({schema:1,boardId:seed.boardId,exportedAt:new Date().toISOString(),records:state.records,conflicts,base},'offer-comparison-state.json');
    if(b.id==='print')window.print();if(b.id==='cancelEdit')$('#editor').close();
    if(b.id==='addRow'){editRows=collectRows();editRows.push(editAction==='components'?C.component():editAction==='contributions'?C.contribution():editAction==='taxYears'?{year:calcYear,income:null,deduction:null,withheld:null,annualSpecial:null,bonusUsed:false,source:''}:{name:'',value:'',source:''});renderRows();}
    if(b.dataset.removeRow!==undefined){editRows=collectRows();editRows.splice(Number(b.dataset.removeRow),1);renderRows();}
    if(b.id==='startDraft'){draft=C.clone(current());render();}if(b.id==='discardDraft'){draft=null;render();}
    if(b.id==='commitDraft'&&draft&&confirm('确认对方已提供这一调整方案？将保留旧版，并把试算更新为当前报价。')){snapshot('调整前报价');current().cells=C.clone(draft.cells);current().updatedAt=new Date().toISOString();draft=null;persist();}
    if(b.dataset.resolve!==undefined){const c=conflicts[Number(b.dataset.resolve)];state.records.find(r=>r.id===c.id).cells[c.key]=C.clone(c[b.dataset.side]);conflicts.splice(Number(b.dataset.resolve),1);persist();}

  });
  document.addEventListener('change',e=>{const t=e.target;if(editAction==='calcSettings'&&t.name==='trialMonths'){$('#editForm').elements.namedItem('trialFactor').disabled=t.value==='0';return;}if((editAction==='components'&&(/_(tax|frequency)$/.test(t.name||'')))||(editAction==='contributions'&&t.name?.endsWith('_mode'))){editRows=collectRows();renderRows();return;}if(t.id==='recordSelect'){activeId=t.value;draft=null;}if(t.id==='unknownOnly')unknownOnly=t.checked;if(t.id==='calcYear')calcYear=Math.min(2100,Math.max(2023,Number(t.value)||2027));if(t.id==='scenario')scenario=t.value;if(t.id==='bonusMode')bonusMode=t.value;if(['recordSelect','unknownOnly','audience','calcYear','scenario','bonusMode','archived'].includes(t.id))render();});
  $('#import').onchange=async e=>{try{const data=C.validate(JSON.parse(await e.target.files[0].text()));if(data.boardId!==seed.boardId)throw Error('这份导出属于另一张看板；请由 AI 核实合并');const result=C.merge(data.base?C.validate(data.base):base,state,data);state=result.data;conflicts.push(...result.conflicts,...(data.conflicts||[]));persist();}catch(err){alert('导入失败：'+err.message);}e.target.value='';};
  window.addEventListener('storage',e=>{if(e.key===key)$('#saveState').textContent='另一个标签页修改了资料。先导出当前记录，再刷新核对，避免覆盖。';});
  render();
})();
