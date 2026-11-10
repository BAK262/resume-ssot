(function(){
  'use strict';
  const C=OfferCore, $=s=>document.querySelector(s), esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const seed=C.validate(JSON.parse($('#offer-data').textContent)), key='resume-ssot-offer-board-v1:'+seed.boardId;
  let state=C.clone(seed), base=C.clone(seed), conflicts=[], tab='compare', activeId='', draft=null, unknownOnly=false,  editAction=null, storageError='';
  const fmt=n=>C.known(n)?'¥ '+n.toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2}):'待确认';
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
    if(k==='components')return v.map(p=>`${p.name||'未命名'}：${fmt(p.amount)} / ${{monthly:'月',annual:'年',once:'次'}[p.frequency]}${p.terms?'；'+p.terms:''}`).join('\n')||'待补充';
    if(k==='contributions')return v.map(p=>`${p.name||'缴费项目'}：个人 ${p.mode==='rate'?show(p.employee)+'%':fmt(p.employee)}，单位 ${p.mode==='rate'?show(p.employer)+'%':fmt(p.employer)}；${p.from||'?'} 至 ${p.to||'?'}`).join('\n')||'待补充';
    if(k==='taxYears')return v.map(p=>`${p.year}：其他收入 ${fmt(p.income)}，全年专项附加扣除 ${fmt(p.annualSpecial)}`).join('\n')||'待补充';
    if(k==='custom')return v.map(p=>`${p.name}：${p.value||'待补充'}`).join('\n')||'添加自定义项目';
    return k==='quotedPackage'?fmt(v):show(v);
  }
  function renderTable(list){
    const scroller=$('#comparison-table')?.parentElement;const scrollTop=scroller?.scrollTop||0,scrollLeft=scroller?.scrollLeft||0;
    const opened=new Set(Array.from(document.querySelectorAll('details[data-section]')).filter(x=>x.open).map(x=>x.dataset.section));
    let html=`<div class="controls"><label><input id="unknownOnly" type="checkbox" ${unknownOnly?'checked':''}> 只看待补充</label><a href="#salary-analysis">薪酬分析 ↓</a><span class="help">点击内容编辑；金额自动计算。未知留空，明确没有填 0。</span></div><div class="table-wrap"><table class="compare compact" id="comparison-table"><thead><tr><th>对比项目</th>${list.map(r=>`<th><button class="cell-edit" data-inline="${esc(r.id)}" data-key="company">${esc(title(r))}</button></th>`).join('')}</tr></thead><tbody>`;
    const row=(k,label)=>`<tr><th>${esc(label)}</th>${list.map(r=>`<td><button class="cell-edit" data-inline="${esc(r.id)}" data-key="${k}">${esc(displayValue(r,k))}</button></td>`).join('')}</tr>`;
    for(const [name,,fields]of C.groups){
      let entries=fields.filter(([k])=>k!=='company');
      if(name==='待遇与兑现')entries=[['components','收入组成与发放条件'],...entries,['contributions','社保公积金缴费参数']];
      if(name==='测算条件')entries=[...entries,['taxYears','年度税务背景']];
      entries=entries.filter(([k])=>!unknownOnly||list.some(r=>isMissing(C.val(r,k))));
      if(!entries.length)continue;
      html+=`<tr class="section-row"><th colspan="${list.length+1}">${name}</th></tr>`;
      for(const [k,label]of entries)html+=row(k,label);
      if(name==='待遇与兑现'){
        const results=list.map(r=>C.calculate(r,calcYear,scenario,bonusMode));
        html+=`<tr class="section-row"><th colspan="${list.length+1}">自动汇总 · ${calcYear} 年 · ${scenario==='fixed'?'固定现金':'目标现金'} · ${bonusMode==='combined'?'奖金并入':'合格全年奖单独计税'}</th></tr>`;
        for(const [label,k]of [['年现金（税前）','gross'],['全年预计到账','net'],['月均到账（全年÷12）','monthly'],['汇算后现金估算','finalNet']])html+=`<tr><th>${label}</th>${results.map(x=>`<td>${fmt(k==='monthly'?(x.net===null?null:x.net/12):x[k])}${x.blocked?'<div class="meta">条件待补齐；税前为已录小计</div>':x.hypothetical?'<div class="meta">规则延用试算</div>':''}</td>`).join('')}</tr>`;
      }
    }
    html+=row('custom','自定义比较项')+'</tbody></table></div>';
    renderCalc();const calc=$('#content').innerHTML;
    const r=current();
    html+=`<section id="salary-analysis"><h2>薪酬分析</h2><p class="help">共用上表的数据；选择年份和口径，查看逐月到账或建立假设试算。</p>${calc}<details data-section="history" ${opened.has('history')?'open':''}><summary>报价历史与机会管理</summary><button id="snapshot" class="quiet">保存当前报价版本</button>${r.versions.map(v=>`<p>${esc(v.label)} · ${esc(v.date)} <button class="quiet small" data-version="${esc(v.id)}">载入为试算</button></p>`).join('')}<button id="archive" class="quiet">${C.val(r,'archived')?'恢复机会':'归档机会'}</button></details></section><details data-section="guide" ${opened.has('guide')?'open':''}><summary>使用说明与调研依据</summary>${guide()}</details>`;
    $('#content').innerHTML=html;
    const next=$('#comparison-table')?.parentElement;if(next){next.scrollTop=scrollTop;next.scrollLeft=scrollLeft;}
  }
  let calcYear=new Date().getFullYear()+1,scenario='target',bonusMode='combined';
  function renderCalc(){const r=editable();const result=C.calculate(r,calcYear,scenario,bonusMode);const begin=C.val(r,'start');const idx=C.monthIndex(begin);const results=idx===null?[]:[C.calculate(r,Math.floor(idx/12),scenario,bonusMode),C.calculate(r,Math.floor(idx/12)+1,scenario,bonusMode)];const window=idx===null?null:C.windowSummary(results,begin,C.monthString(idx+11));
    const fixed=C.calculate(r,calcYear,'fixed',bonusMode),other=C.calculate(r,calcYear,scenario,bonusMode==='combined'?'separate':'combined');
    let html=`<div class="controls">${recordSelect()}<label>年份 <input id="calcYear" type="number" min="2023" max="2100" value="${calcYear}" style="width:100px"></label><select id="scenario"><option value="target" ${scenario==='target'?'selected':''}>目标现金：包含浮动与一次性</option><option value="fixed" ${scenario==='fixed'?'selected':''}>固定现金：只计固定项目</option></select><select id="bonusMode"><option value="combined" ${bonusMode==='combined'?'selected':''}>奖金并入综合所得</option><option value="separate" ${bonusMode==='separate'?'selected':''}>合格全年奖单独计税</option></select></div>`;
    html+=`<div class="notice">${draft?'正在试算：修改不会写入真实报价。':'当前真实报价；可复制为假设方案，比较谈薪调整效果。'} <button id="startDraft" class="quiet small">${draft?'重新复制当前报价':'建立假设试算'}</button> ${draft?'<button id="discardDraft" class="quiet small">退出试算</button><button id="commitDraft" class="quiet small">对方已确认，更新报价</button>':''}</div><div class="actions">${fieldButton('components','调整收入组成')}${fieldButton('contributions','调整缴费')}${fieldButton('taxYears','年度背景')}${fieldButton('calcSettings','测算条件')}</div>`;
    if(result.blocked)html+=`<p class="warning">税后结果待确认：${result.missing.map(esc).join('；')}。已录入税前小计仅用于核对。</p>`;
    const quoted=C.val(r,'quotedPackage');
    html+=`<div class="calc-cards">${[['本年固定现金'+(fixed.blocked?'（已录小计）':''),fixed.gross],['本年目标现金'+(result.blocked?'（已录小计）':''),result.gross],['本年预计到账',result.net],['月均到账（年度÷12）',result.net===null?null:result.net/12],['年度汇算后现金估算',result.finalNet],['全年个人缴费',result.employee],['全年预扣税',result.withheld],['预计退税（负数为补税）',result.adjustment],['公积金：个人＋单位',result.housingEmployer===null?null:result.housingPersonal+result.housingEmployer],['入职前12个月税前现金',window?.gross],['入职前12个月到账',window?.net],['与HR所述年包差额',C.known(quoted)?result.gross-quoted:null]].map(([t,n])=>`<div class="stat"><span>${t}</span><strong>${fmt(n)}</strong></div>`).join('')}</div>`;
    if(draft){const real=C.calculate(current(),calcYear,scenario,bonusMode);html+=`<p class="notice">相较真实报价：税前差额 ${fmt(result.gross-real.gross)}；到账差额 ${fmt(result.net!==null&&real.net!==null?result.net-real.net:null)}</p>`;}
    html+=`<details><summary>另一种奖金计税方式</summary><p>${bonusMode==='combined'?'单独计税':'并入综合所得'}：全年个税 ${fmt(other.finalTax)}，汇算后现金 ${fmt(other.finalNet)}</p><p>${other.missing.map(esc).join('；')}</p><p class="help">只在资格、发放年度和个人全年背景完整时比较。当前已核实单独计税政策至 2027 年底。</p></details>`;
    html+=`<details><summary>计算依据与假设</summary><p>月到账＝本月现金收入－个人缴费－本月预扣税；固定／目标方案分别计算。公积金账户新增另列。</p><p>综合所得按年度税率累计预扣；汇算使用全年扣除与年度背景。跨年窗口相加各年实际预扣后的月到账，不把两年收入合并计税。</p><ul>${result.warnings.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>政策来源：<a href="https://www.chinatax.gov.cn/n810341/n810760/c3959585/content.html" target="_blank" rel="noopener">工资预扣</a> · <a href="https://fgk.chinatax.gov.cn/zcfgk/c102416/c5211524/content.html" target="_blank" rel="noopener">全年一次性奖金</a></p></details>`;
    html+='<div class="table-wrap"><table><thead><tr><th>发放月</th><th>税前现金</th><th>个人缴费</th><th>预扣税</th><th>预计到账</th><th>公积金个人</th><th>公积金单位</th></tr></thead><tbody>'+result.rows.map(x=>`<tr><td>${x.month}</td>${[x.gross,x.employee,result.blocked?null:x.tax,result.blocked?null:x.net,x.housingPersonal,x.housingEmployer].map(n=>`<td class="numbers">${fmt(n)}</td>`).join('')}</tr>`).join('')+'</tbody></table></div>';
    $('#content').innerHTML=html;
  }
  function guide(){return `<div class="panel"><h2>从一份材料到一份可比较的方案</h2><ol><li>让 AI 整理进度表中已到 Offer 阶段的岗位，或点击“新增机会”。</li><li>把 HR 文字、截图或文件交给 AI；保留出处，逐项补齐资料。页面中的编辑按钮也可直接使用。</li><li>勾选“只看待补充”筛选缺项；让 HR 说明固定与浮动、计算基数、发放时间、首年折算和返还条件。</li><li>录入收入和缴费明细、年度税务背景，再查看逐月和年度测算。未知留空，明确没有填 0。</li><li>谈判前建立假设试算；拿到调整方案后保存旧版、更新报价。</li><li>手动修改先保存在本浏览器。导出操作记录交给 AI，同步至文件后才能随工作区跨设备使用。</li></ol><h3>请 HR 提供文字方案</h3><p>方便的话，麻烦把薪酬组成、奖金和补贴的发放条件，以及社保公积金的缴纳口径发我一份文字说明，我想完整了解一下，也方便后续确认。</p><h3>核实重点</h3><p>“几薪”拆分固定和奖金；签字费核对返还是否区分主动离职、裁员；奖金核对发放时点与在职条件；股权核对归属和流动性；人才补贴核对资格、申请与服务期限。月薪里的绩效、年终奖和额外薪月避免重复录入。</p><p>每个缴费项目独立设置参保地对应的基数、上下限、个人／单位比例、生效期间和来源。已经确认月缴额时可直接填写。新就业、试用期及政策调整月份需要分别核实。</p><h3>适用范围</h3><p>计算器用于大陆居民工资方案比较。股权、报销先单列；复杂税务处理由 AI 查证后录入。部分月工资、奖金首年折算通过拆分项目填写明确金额。未来政策未核实时结果标为规则延用试算。</p><p><a href="offer-research.html">调研与核实依据 ↗</a></p></div>`;}
  const schemas={
    components:[['name','项目名'],['kind','收入性质','fixed|固定,variable|浮动,once|一次性,equity|股权（单列）,reimbursement|报销（单列）'],['amount','每次金额（元）','number'],['frequency','发放频次','monthly|每月,annual|每年,once|一次'],['from','开始／一次性发放月','month'],['to','结束月（周期项目）','month'],['payMonth','年度项目发放月 1–12','number'],['tax','计税处理','wage|工资综合所得,bonus|符合条件的全年一次性奖,exempt|有依据免税,unknown|待核实'],['trial','月项目参与试用期折扣','boolean'],['terms','发放、首年折算、返还条件'],['source','免税适用依据']],
    contributions:[['name','险种／项目名'],['category','类别','social|社会保险,housing|公积金,annuity|企业年金／其他'],['mode','输入方式','amount|直接填月缴额,rate|基数与比例'],['employee','个人月额／比例%','number'],['employer','单位月额／比例%','number'],['base','申报基数（比例模式）','number'],['min','基数下限（比例模式）','number'],['max','基数上限（比例模式）','number'],['fixed','个人额外固定费用','number'],['rounding','取整','cent|分,yuan|元'],['from','缴费开始月','month'],['to','缴费结束／政策有效月','month'],['deduct','个人部分已确认可税前扣除','boolean'],['source','缴费地、政策来源与核验日']],
    taxYears:[['year','年度','number'],['income','其他综合所得收入额（非应纳税所得额；无则0）','number'],['deduction','其他所得允许扣除（不含6万及本表已计扣除）','number'],['withheld','其他所得已预扣税（无则0）','number'],['annualSpecial','全年专项附加扣除总额','number'],['bonusUsed','其他单位已用本年奖金单独计税','boolean'],['source','依据与年度假设']],
    custom:[['name','比较项'],['value','内容'],['source','出处／确认程度']]
  };
  function input(name,value,type){if(type==='boolean')return `<select name="${name}"><option value="">待确认</option><option value="true" ${value===true?'selected':''}>是</option><option value="false" ${value===false?'selected':''}>否</option></select>`;
    if(type?.includes('|'))return `<select name="${name}">${type.split(',').map(x=>{const [v,t]=x.split('|');return `<option value="${v}" ${v===value?'selected':''}>${t}</option>`;}).join('')}</select>`;
    if(type==='number'||type==='month')return `<input name="${name}" type="${type}" ${type==='number'?'step="any" min="0"':''} value="${esc(value)}">`;
    return `<textarea name="${name}">${esc(value)}</textarea>`;}
  function read(form,name,type){const value=form.elements.namedItem(name).value;return type==='number'?(value===''?null:Number(value)):type==='boolean'?(value===''?null:value==='true'):value;}
  let editRows=[];
  function openEdit(k){const r=editable();if(!r)return;editAction=k;$('#editError').textContent='';
    if(k==='calcSettings'){editRows=C.groups[5][2];$('#editTitle').textContent='测算条件';$('#editBody').innerHTML='<div class="edit-grid">'+editRows.map(([key,t,type])=>`<label>${t}${input(key,C.val(r,key),type)}</label>`).join('')+'</div>';}
    else if(schemas[k]){editRows=C.clone(C.val(r,k)||[]);renderRows();}
    else{const def=C.groups.flatMap(g=>g[2]).find(x=>x[0]===k),c=r.cells[k]||C.cell();$('#editTitle').textContent=def?.[1]||k;$('#editBody').innerHTML=`<label>内容${input('value',c.value,def?.[2])}</label>`;}
    $('#editor').showModal();}
  function renderRows(){const k=editAction;$('#editTitle').textContent=({components:'收入项目',contributions:'缴费项目',taxYears:'年度税务背景',custom:'自定义比较项'})[k];$('#editBody').innerHTML=`<p class="help">留空表示待确认。周期重叠的项目会相加；调薪或政策调整请拆成不重叠期间。</p>${editRows.map((row,i)=>`<div class="item-editor"><div class="edit-grid">${schemas[k].filter(([name])=>name!=='source'||k==='components'&&row.tax==='exempt').map(([name,t,type])=>`<label>${t}${input(i+'_'+name,row[name],type)}</label>`).join('')}</div><button type="button" class="quiet small" data-remove-row="${i}">移除此项</button></div>`).join('')}<button type="button" id="addRow" class="quiet">＋ 添加一项</button>`;}
  function collectRows(){return editRows.map((row,i)=>{const x={...row};for(const [name,,type]of schemas[editAction])if($('#editForm').elements.namedItem(i+'_'+name))x[name]=read($('#editForm'),i+'_'+name,type);return x;});}
  $('#editForm').onsubmit=e=>{e.preventDefault();try{const r=editable(),k=editAction,copy=C.clone(r);
    if(schemas[k]){const value=collectRows();copy.cells[k]=C.cell(value);C.validate({schema:1,boardId:seed.boardId,records:[copy]});update(k,value,draft?'假设':'本人确认','手动编辑',new Date().toISOString().slice(0,10),'');}
    else if(k==='calcSettings'){for(const [key,,type] of editRows)copy.cells[key]=C.cell(read(e.target,key,type),'手动编辑',draft?'假设':'本人确认');C.validate({schema:1,boardId:seed.boardId,records:[copy]});r.cells=copy.cells;if(!draft)persist();else render();}
    else{const type=C.groups.flatMap(g=>g[2]).find(x=>x[0]===k)?.[2];copy.cells[k]={...(copy.cells[k]||C.cell()),value:read(e.target,'value',type)};C.validate({schema:1,boardId:seed.boardId,records:[copy]});update(k,copy.cells[k].value);}
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
    if(b.id==='archive'){update('archived',!C.val(current(),'archived'),'本人确认','','','');}
    if(b.id==='snapshot'){const label=prompt('本轮方案名称，例如：首次书面报价');if(label){snapshot(label);persist();}}
    if(b.id==='startDraft'){draft=C.clone(current());render();}if(b.id==='discardDraft'){draft=null;render();}
    if(b.id==='commitDraft'&&draft&&confirm('确认对方已提供这一调整方案？将保留旧版，并把试算更新为当前报价。')){snapshot('调整前报价');current().cells=C.clone(draft.cells);current().updatedAt=new Date().toISOString();draft=null;persist();}
    if(b.dataset.version){const v=current().versions.find(v=>v.id===b.dataset.version);draft=C.clone(current());draft.cells=C.clone(v.cells);tab='compare';render();}
    if(b.dataset.resolve!==undefined){const c=conflicts[Number(b.dataset.resolve)];state.records.find(r=>r.id===c.id).cells[c.key]=C.clone(c[b.dataset.side]);conflicts.splice(Number(b.dataset.resolve),1);persist();}

  });
  document.addEventListener('change',e=>{const t=e.target;if(editAction==='components'&&t.name?.endsWith('_tax')){editRows=collectRows();renderRows();return;}if(t.id==='recordSelect'){activeId=t.value;draft=null;}if(t.id==='unknownOnly')unknownOnly=t.checked;if(t.id==='calcYear')calcYear=Math.min(2100,Math.max(2023,Number(t.value)||2027));if(t.id==='scenario')scenario=t.value;if(t.id==='bonusMode')bonusMode=t.value;if(['recordSelect','unknownOnly','audience','calcYear','scenario','bonusMode','archived'].includes(t.id))render();});
  $('#import').onchange=async e=>{try{const data=C.validate(JSON.parse(await e.target.files[0].text()));if(data.boardId!==seed.boardId)throw Error('这份导出属于另一张看板；请由 AI 核实合并');const result=C.merge(data.base?C.validate(data.base):base,state,data);state=result.data;conflicts.push(...result.conflicts,...(data.conflicts||[]));persist();}catch(err){alert('导入失败：'+err.message);}e.target.value='';};
  window.addEventListener('storage',e=>{if(e.key===key)$('#saveState').textContent='另一个标签页修改了资料。先导出当前记录，再刷新核对，避免覆盖。';});
  render();
})();
