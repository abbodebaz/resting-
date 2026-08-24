const STORAGE_KEY = 'bayt-alebaa-cx-responses-demo-v2';
const workflow = ['جديد','قيد المراجعة','تم التواصل','بانتظار العميل','تم الحل','مغلق'];
const assignees = ['أحمد السلمي','سارة الغامدي','خالد الزهراني'];

const seedResponses = [
  {id:1,name:'محمد العتيبي',phone:'050 812 4412',order:'SV-41872',invoice:'INV-803214',city:'جدة',service:'تركيب',team:'فريق جدة 03',score:5,nps:10,ces:5,resolved:'yes',priority:'positive',status:'مغلق',assignee:'سارة الغامدي',sla:420,created:'اليوم 10:14 ص',issue:'تجربة ممتازة',reasons:['احترافية الفريق','جودة العمل'],comment:'الخدمة ممتازة والفني محترم جدًا، فقط الموعد تأخر تقريبًا نصف ساعة.',ratings:{'جودة التركيب':5,'نظافة موقع العمل':5,'احترافية الفني':5,'الالتزام بالموعد':4},callback:false,image:false,audio:false,summary:'العميل راضٍ جدًا عن جودة التركيب واحترافية الفريق، مع ملاحظة بسيطة على تأخير الموعد.',recommendation:'لا يحتاج إجراء تصحيحي. يمكن استخدام الملاحظة لتحسين دقة المواعيد.',history:['10:14 ص — وصل تقييم 5/5','10:18 ص — تم تصنيف الحالة إيجابية','10:25 ص — أغلقت آليًا'],notes:[],customerHistory:'3 طلبات سابقة · متوسط الرضا 4.6'},
  {id:2,name:'نورة الحربي',phone:'055 334 1088',order:'DL-29115',invoice:'INV-801972',city:'الرياض',service:'توصيل',team:'فريق الرياض 01',score:2,nps:3,ces:2,resolved:'partial',priority:'high',status:'قيد المراجعة',assignee:'أحمد السلمي',sla:68,created:'اليوم 11:07 ص',issue:'التأخر عن الموعد',reasons:['التأخر عن الموعد','ضعف التواصل'],comment:'تأخر التوصيل أكثر من ساعتين ولم يصلني تحديث بالموعد.',ratings:{'الالتزام بموعد التوصيل':1,'حالة المنتج عند الاستلام':4,'تعامل مندوب التوصيل':3,'وضوح التواصل والتحديثات':2},callback:true,callbackTime:'مساءً',image:false,audio:true,transcript:'التوصيل تأخر أكثر من ساعتين وما كان فيه أي تحديث واضح عن الموعد.',summary:'العميلة غير راضية بسبب تأخر التوصيل وضعف تحديثات الموعد. الخدمة اكتملت جزئيًا وطلبت التواصل مساءً.',recommendation:'التواصل مساءً، الاعتذار عن التأخير، ومراجعة آلية إشعارات فريق الرياض 01.',history:['11:07 ص — وصل تقييم 2/5','11:09 ص — صُنفت أولوية عالية','11:15 ص — أُسندت إلى أحمد السلمي'],notes:[{by:'أحمد السلمي',time:'11:22 ص',text:'تمت مراجعة الطلب، بانتظار التواصل مع العميلة مساءً.'}],customerHistory:'طلبان سابقان · متوسط الرضا 3.5'},
  {id:3,name:'خالد الزهراني',phone:'053 901 2770',order:'MT-88241',invoice:'INV-799140',city:'الدمام',service:'صيانة',team:'فريق الدمام 02',score:4,nps:8,ces:4,resolved:'yes',priority:'positive',status:'تم الحل',assignee:'خالد الزهراني',sla:260,created:'أمس 4:32 م',issue:'تم حل المشكلة',reasons:['سرعة الخدمة'],comment:'تم حل المشكلة بسرعة والتعامل كان ممتاز.',ratings:{'جودة حل المشكلة':5,'جودة الإصلاح':4,'شرح الفني لما تم عمله':4,'سرعة إنجاز الخدمة':5},callback:false,image:false,audio:false,summary:'تجربة إيجابية، وتم حل المشكلة بالكامل مع رضا واضح عن سرعة الإنجاز.',recommendation:'لا يوجد إجراء عاجل. يمكن اعتبار الحالة مثالًا إيجابيًا لفريق الصيانة.',history:['أمس 4:32 م — وصل تقييم 4/5','أمس 4:40 م — تم الحل'],notes:[],customerHistory:'4 طلبات سابقة · متوسط الرضا 4.2'},
  {id:4,name:'ريم القحطاني',phone:'056 781 6032',order:'SV-41704',invoice:'INV-803011',city:'جدة',service:'تركيب',team:'فريق جدة 01',score:1,nps:1,ces:2,resolved:'no',priority:'critical',status:'جديد',assignee:'غير معيّن',sla:42,created:'اليوم 12:03 م',issue:'جودة التركيب',reasons:['جودة التنفيذ','عدم حل المشكلة'],comment:'التركيب يحتاج إعادة ضبط وفيه ملاحظة واضحة على التشطيب.',ratings:{'جودة التركيب':1,'نظافة موقع العمل':3,'احترافية الفني':2,'الالتزام بالموعد':3},callback:true,callbackTime:'مساءً',image:true,audio:true,transcript:'التركيب مو مضبوط والتشطيب واضح فيه مشكلة وأحتاج أحد يرجع يشوف الموقع.',summary:'العميلة غير راضية بشدة عن جودة التشطيب، والخدمة لم تكتمل بالشكل المطلوب. أرفقت صورة وتسجيلًا وطلبت التواصل مساءً.',recommendation:'تحويل الحالة فورًا إلى مشرف تركيب جدة وتحديد إعادة زيارة للموقع خلال نفس اليوم.',history:['12:03 م — وصل تقييم 1/5','12:04 م — صُنفت الحالة حرجة','12:04 م — تم إنشاء مرجع متابعة CX-10428'],notes:[],followupRef:'CX-10428',customerHistory:'أول تقييم لهذا العميل'},
  {id:5,name:'سامي الغامدي',phone:'050 443 9210',order:'DL-28876',invoice:'INV-797442',city:'مكة',service:'توصيل',team:'فريق مكة 01',score:5,nps:9,ces:5,resolved:'yes',priority:'positive',status:'مغلق',assignee:'سارة الغامدي',sla:390,created:'أمس 1:18 م',issue:'تجربة ممتازة',reasons:['الالتزام بالموعد','احترافية الفريق'],comment:'كل شيء تم بالوقت وباحترافية، شكرًا لكم.',ratings:{'الالتزام بموعد التوصيل':5,'حالة المنتج عند الاستلام':5,'تعامل مندوب التوصيل':5,'وضوح التواصل والتحديثات':5},callback:false,image:false,audio:false,summary:'تجربة ممتازة في جميع مراحل التوصيل مع رضا كامل عن الموعد والتعامل.',recommendation:'لا يحتاج متابعة.',history:['أمس 1:18 م — وصل تقييم 5/5','أمس 1:20 م — أغلقت الحالة'],notes:[],customerHistory:'5 طلبات سابقة · متوسط الرضا 4.8'},
  {id:6,name:'هدى السلمي',phone:'054 118 7054',order:'MT-87831',invoice:'INV-796118',city:'الرياض',service:'صيانة',team:'فريق الرياض 02',score:3,nps:7,ces:3,resolved:'yes',priority:'medium',status:'بانتظار العميل',assignee:'خالد الزهراني',sla:-192,created:'أمس 9:42 ص',issue:'وضوح الضمان',reasons:['وضوح الخطوات'],comment:'التجربة جيدة وأتمنى توضيح مدة الضمان بعد الصيانة.',ratings:{'جودة حل المشكلة':4,'جودة الإصلاح':4,'شرح الفني لما تم عمله':3,'سرعة إنجاز الخدمة':4},callback:true,callbackTime:'ظهرًا',image:false,audio:false,summary:'الخدمة حلت المشكلة، لكن العميلة تحتاج توضيحًا أفضل لمدة الضمان بعد الصيانة.',recommendation:'إرسال تفاصيل الضمان والتأكد من استلام العميلة للمعلومة قبل إغلاق الحالة.',history:['أمس 9:42 ص — وصل تقييم 3/5','أمس 10:05 ص — تم التواصل','أمس 10:16 ص — بانتظار تأكيد العميلة'],notes:[{by:'خالد الزهراني',time:'أمس 10:16 ص',text:'تم إرسال تفاصيل الضمان عبر الواتساب وننتظر تأكيد الاستلام.'}],customerHistory:'3 طلبات سابقة · متوسط الرضا 3.9'},
  {id:7,name:'عبدالله الشهري',phone:'057 340 6641',order:'SV-41491',invoice:'INV-795620',city:'جدة',service:'تركيب',team:'فريق جدة 02',score:2,nps:4,ces:2,resolved:'partial',priority:'high',status:'تم التواصل',assignee:'أحمد السلمي',sla:-74,created:'أمس 8:15 ص',issue:'التأخر عن الموعد',reasons:['التأخر عن الموعد','ضعف التواصل'],comment:'الفريق وصل متأخرًا ولم يتم إبلاغي مسبقًا.',ratings:{'جودة التركيب':3,'نظافة موقع العمل':4,'احترافية الفني':2,'الالتزام بالموعد':1},callback:true,callbackTime:'صباحًا',image:false,audio:false,summary:'العميل غير راضٍ عن التأخير وعدم الإبلاغ المسبق. جودة التركيب مقبولة لكن التجربة التشغيلية ضعيفة.',recommendation:'متابعة سبب تأخر فريق جدة 02 وتأكيد آلية التواصل قبل المواعيد القادمة.',history:['أمس 8:15 ص — وصل تقييم 2/5','أمس 8:20 ص — صُنفت أولوية عالية','أمس 9:00 ص — تم التواصل مع العميل'],notes:[],customerHistory:'طلب واحد سابق · متوسط الرضا 3.0'},
  {id:8,name:'منى الدوسري',phone:'050 677 1482',order:'DL-28741',invoice:'INV-794902',city:'الرياض',service:'توصيل',team:'فريق الرياض 01',score:5,nps:10,ces:5,resolved:'yes',priority:'positive',status:'مغلق',assignee:'سارة الغامدي',sla:500,created:'قبل يومين',issue:'تجربة ممتازة',reasons:['سرعة الخدمة','وضوح التواصل'],comment:'تجربة ممتازة من البداية للنهاية.',ratings:{'الالتزام بموعد التوصيل':5,'حالة المنتج عند الاستلام':5,'تعامل مندوب التوصيل':5,'وضوح التواصل والتحديثات':5},callback:false,image:false,audio:false,summary:'رضا كامل عن تجربة التوصيل من البداية للنهاية.',recommendation:'لا يحتاج متابعة.',history:['قبل يومين — وصل تقييم 5/5','قبل يومين — أغلقت الحالة'],notes:[],customerHistory:'طلبان سابقان · متوسط الرضا 5.0'}
];

let responses = loadState();
let activeTab = 'all';
let selected = new Set();
let currentId = null;

const els = {
  tbody: document.getElementById('tbody'), mobileList: document.getElementById('mobileList'), resultCount: document.getElementById('resultCount'),
  search: document.getElementById('search'), city: document.getElementById('city'), service: document.getElementById('service'), rating: document.getElementById('rating'), priority: document.getElementById('priority'), sort: document.getElementById('sort'),
  tabs: document.getElementById('statusTabs'), bulkbar: document.getElementById('bulkbar'), selectedCount: document.getElementById('selectedCount'), selectAll: document.getElementById('selectAll'),
  drawer: document.getElementById('drawer'), backdrop: document.getElementById('drawerBackdrop'), drawerBody: document.getElementById('drawerBody'), drawerTitle: document.getElementById('drawerTitle'), drawerSubtitle: document.getElementById('drawerSubtitle'), toast: document.getElementById('toast')
};

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : structuredClone(seedResponses);
  }catch{return structuredClone(seedResponses)}
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(responses))}
function esc(v=''){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
function initials(name){return name.split(' ').slice(0,2).map(x=>x[0]).join('')}
function stars(score){return `<span class="stars">${'★'.repeat(score)}<span class="off">${'★'.repeat(5-score)}</span></span>`}
function priorityLabel(p){return {critical:'حرجة',high:'عالية',medium:'متوسطة',positive:'إيجابية'}[p]||p}
function priorityBadge(p){return `<span class="badge ${p}">${priorityLabel(p)}</span>`}
function statusClass(s){return {'جديد':'new','قيد المراجعة':'review','تم التواصل':'contact','بانتظار العميل':'waiting','تم الحل':'solved','مغلق':'closed'}[s]||'new'}
function statusBadge(s){return `<span class="badge ${statusClass(s)}">${esc(s)}</span>`}
function resolvedLabel(v){return {yes:'نعم، بالكامل',partial:'جزئيًا',no:'لا'}[v]||'—'}
function slaInfo(minutes){if(minutes<0)return {cls:'over',text:`متجاوز ${Math.abs(minutes)} د`};if(minutes<=60)return {cls:'due',text:`متبقي ${minutes} د`};return {cls:'safe',text:`متبقي ${Math.floor(minutes/60)}س ${minutes%60}د`}}
function showToast(msg){els.toast.textContent=msg;els.toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>els.toast.classList.remove('show'),2200)}

function updateCounters(){
  const count = key => responses.filter(r => key==='followup' ? ['critical','high','medium'].includes(r.priority) && !['تم الحل','مغلق'].includes(r.status) : key==='critical' ? r.priority==='critical' : r.status===key).length;
  document.getElementById('tabAll').textContent=responses.length;
  document.getElementById('tabNew').textContent=count('جديد');
  document.getElementById('tabFollowup').textContent=count('followup');
  document.getElementById('tabCritical').textContent=count('critical');
  document.getElementById('tabSolved').textContent=count('تم الحل');
  document.getElementById('sideCount').textContent=count('followup');
  document.getElementById('kpiFollowup').textContent=count('followup');
  document.getElementById('kpiOverdue').textContent=responses.filter(r=>r.sla<0&&!['تم الحل','مغلق'].includes(r.status)).length;
  const avg=responses.reduce((a,r)=>a+r.score,0)/responses.length;document.getElementById('kpiScore').textContent=avg.toFixed(2);
}

function matchesTab(r){
  if(activeTab==='all')return true;
  if(activeTab==='followup')return ['critical','high','medium'].includes(r.priority)&&!['تم الحل','مغلق'].includes(r.status);
  if(activeTab==='critical')return r.priority==='critical';
  return r.status===activeTab;
}
function filtered(){
  const q=els.search.value.trim().toLowerCase(), city=els.city.value, service=els.service.value, rating=els.rating.value, priority=els.priority.value;
  let list=responses.filter(r=>matchesTab(r)&&(!q||`${r.name} ${r.phone} ${r.order} ${r.invoice} ${r.team}`.toLowerCase().includes(q))&&(!city||r.city===city)&&(!service||r.service===service)&&(!rating||(rating==='low'?r.score<=2:r.score===Number(rating)))&&(!priority||r.priority===priority));
  const rank={critical:0,high:1,medium:2,positive:3};
  if(els.sort.value==='lowest')list.sort((a,b)=>a.score-b.score);
  else if(els.sort.value==='priority')list.sort((a,b)=>rank[a.priority]-rank[b.priority]);
  else if(els.sort.value==='sla')list.sort((a,b)=>a.sla-b.sla);
  else list.sort((a,b)=>b.id-a.id);
  return list;
}

function render(){
  updateCounters();
  const list=filtered();
  els.resultCount.textContent=`عرض ${list.length} من ${responses.length} حالة`;
  if(!list.length){els.tbody.innerHTML=`<tr><td colspan="9"><div class="empty"><b>ما لقينا نتائج</b>جرّب تغيير الفلاتر أو البحث.</div></td></tr>`;els.mobileList.innerHTML='<div class="empty"><b>ما لقينا نتائج</b>جرّب تغيير الفلاتر.</div>';return}
  els.tbody.innerHTML=list.map(r=>{
    const sla=slaInfo(r.sla), checked=selected.has(r.id)?'checked':'';
    return `<tr class="${selected.has(r.id)?'selected':''}" data-row="${r.id}">
      <td><input class="check row-check" type="checkbox" data-select="${r.id}" ${checked} aria-label="تحديد ${esc(r.name)}"></td>
      <td><div class="customer"><div class="avatar">${initials(r.name)}</div><div><b>${esc(r.name)}</b><small>${esc(r.order)} · ${esc(r.invoice)}</small><span class="subtle">${esc(r.phone)}</span></div></div></td>
      <td><b>${esc(r.service)}</b><span class="subtle">${esc(r.city)} · ${esc(r.team)}</span></td>
      <td><div class="score-cell"><span class="score-number">${r.score}.0</span>${stars(r.score)}</div><span class="subtle">NPS ${r.nps} · CES ${r.ces}</span></td>
      <td><div class="issue-text" title="${esc(r.issue)}">${esc(r.issue)}</div>${priorityBadge(r.priority)}</td>
      <td>${statusBadge(r.status)}</td>
      <td><div class="assignee"><span class="mini-avatar">${r.assignee==='غير معيّن'?'—':initials(r.assignee)}</span><span>${esc(r.assignee)}</span></div></td>
      <td><span class="sla ${sla.cls}">${sla.text}</span></td>
      <td><button class="row-open" type="button" data-open="${r.id}">فتح</button></td>
    </tr>`}).join('');
  els.mobileList.innerHTML=list.map(r=>{const sla=slaInfo(r.sla);return `<button class="mobile-card" type="button" data-open="${r.id}"><div class="mobile-top"><div class="customer"><div class="avatar">${initials(r.name)}</div><div><b>${esc(r.name)}</b><small>${esc(r.order)} · ${esc(r.city)}</small></div></div>${priorityBadge(r.priority)}</div><div class="mobile-score"><div><b>${r.score}.0</b> ${stars(r.score)}</div>${statusBadge(r.status)}</div><p>${esc(r.comment)}</p><div class="mobile-foot"><span class="subtle">${esc(r.service)} · ${esc(r.team)}</span><span class="sla ${sla.cls}">${sla.text}</span></div></button>`}).join('');
  bindRows();updateBulk();
}

function bindRows(){
  document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openDrawer(Number(b.dataset.open))}));
  document.querySelectorAll('.row-check').forEach(c=>c.addEventListener('change',e=>{const id=Number(c.dataset.select);c.checked?selected.add(id):selected.delete(id);render()}));
  document.querySelectorAll('[data-row]').forEach(row=>row.addEventListener('click',e=>{if(e.target.closest('input,button'))return;openDrawer(Number(row.dataset.row))}));
}

function renderMeasures(r){
  return `<div class="measure-grid"><div class="measure"><small>التقييم العام</small><strong>${r.score}/5</strong><span>${stars(r.score)}</span></div><div class="measure"><small>NPS</small><strong>${r.nps}/10</strong><span>درجة التوصية</span></div><div class="measure"><small>CES</small><strong>${r.ces}/5</strong><span>سهولة الخدمة</span></div><div class="measure"><small>اكتمال الخدمة</small><strong>${resolvedLabel(r.resolved)}</strong><span>حسب العميل</span></div></div>`;
}
function renderQuestions(r){
  return Object.entries(r.ratings).map(([label,value])=>`<div class="question-row"><span>${esc(label)}</span><div class="track"><div class="fill" style="width:${Math.min(Number(value),5)*20}%"></div></div><b>${value}/5</b></div>`).join('');
}
function renderHistory(r){return r.history.map(item=>{const [title,...rest]=item.split('—');return `<div class="timeline-item"><b>${esc(rest.join('—').trim()||title)}</b><span>${rest.length?esc(title.trim()):''}</span></div>`}).join('')}
function renderNotes(r){return r.notes.length?r.notes.map(n=>`<div class="note"><b>${esc(n.by)} · ${esc(n.time)}</b>${esc(n.text)}</div>`).join(''):'<div class="note muted">لا توجد ملاحظات داخلية حتى الآن.</div>'}

function openDrawer(id){
  const r=responses.find(x=>x.id===id);if(!r)return;currentId=id;
  els.drawerTitle.textContent=`${r.name} — ${r.score}.0/5`;els.drawerSubtitle.textContent=`${r.service} · ${r.city} · ${r.order} · ${r.invoice}`;
  const sla=slaInfo(r.sla);
  els.drawerBody.innerHTML=`
    <section class="drawer-section"><div class="profile-row"><div class="avatar">${initials(r.name)}</div><div class="profile-main"><b>${esc(r.name)}</b><span>${esc(r.phone)} · ${esc(r.customerHistory)}</span></div><div class="profile-score"><strong>${r.score}.0</strong><small>من 5</small></div></div><div class="meta-grid"><div class="meta-item"><small>الخدمة</small><b>${esc(r.service)}</b></div><div class="meta-item"><small>المدينة</small><b>${esc(r.city)}</b></div><div class="meta-item"><small>الفريق</small><b>${esc(r.team)}</b></div><div class="meta-item"><small>الحالة</small><b>${esc(r.status)}</b></div><div class="meta-item"><small>المسؤول</small><b>${esc(r.assignee)}</b></div><div class="meta-item"><small>SLA</small><b class="sla ${sla.cls}">${sla.text}</b></div>${r.followupRef?`<div class="meta-item"><small>رقم المتابعة</small><b>${esc(r.followupRef)}</b></div>`:''}</div></section>
    <section class="drawer-section ai-card"><div class="drawer-section-head"><h3>ملخص الحالة</h3><span class="ai-badge">AI Summary · Demo</span></div><p class="ai-summary">${esc(r.summary)}</p><div class="ai-tags"><span class="tag">${priorityLabel(r.priority)}</span>${r.reasons.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}${r.callback?`<span class="tag">طلب تواصل${r.callbackTime?` · ${esc(r.callbackTime)}`:''}</span>`:''}</div><div class="recommendation"><b>الإجراء المقترح:</b> ${esc(r.recommendation)}</div></section>
    <section class="drawer-section"><h3>مؤشرات التقييم</h3>${renderMeasures(r)}</section>
    <section class="drawer-section"><div class="drawer-section-head"><h3>تفاصيل الخدمة</h3><span class="muted">${esc(r.team)}</span></div><div class="question-list">${renderQuestions(r)}</div></section>
    <section class="drawer-section"><h3>ملاحظة العميل</h3><div class="comment-box">${esc(r.comment)}</div><div class="reason-tags">${r.reasons.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div></section>
    ${(r.image||r.audio)?`<section class="drawer-section"><h3>المرفقات</h3><div class="attachments">${r.image?`<div class="attachment"><b>صورة المشكلة</b><span>مرفق من العميل · Demo</span><div class="photo-placeholder">▧ معاينة صورة المشكلة</div></div>`:''}${r.audio?`<div class="attachment"><b>ملاحظة صوتية</b><span>مرفق صوتي · Demo</span><div class="audio-mock"><button class="play" type="button" id="playMock">▶</button><div class="wave"></div><span>00:18</span></div>${r.transcript?`<div class="transcript"><b>تفريغ التسجيل:</b> ${esc(r.transcript)}</div>`:''}</div>`:''}</div></section>`:''}
    <section class="drawer-section"><div class="drawer-section-head"><h3>معالجة الحالة</h3>${priorityBadge(r.priority)}</div><div class="workflow">${workflow.map(s=>`<button type="button" data-status="${s}" class="${r.status===s?'on':''}">${s}</button>`).join('')}</div><div class="assign-row"><select id="assigneeSelect"><option>غير معيّن</option>${assignees.map(a=>`<option ${r.assignee===a?'selected':''}>${a}</option>`).join('')}</select><button id="assignButton" type="button">تعيين المسؤول</button></div></section>
    <section class="drawer-section"><h3>سجل الحالة</h3><div class="timeline">${renderHistory(r)}</div></section>
    <section class="drawer-section"><h3>ملاحظات داخلية</h3><div class="note-form"><textarea id="internalNote" placeholder="اكتب ملاحظة لا يراها العميل..."></textarea><div class="note-actions"><button id="addNote" type="button">إضافة ملاحظة</button></div></div><div class="notes">${renderNotes(r)}</div></section>
    <div class="drawer-actions"><button class="main-action" id="odooAction" type="button">إنشاء/تحديث متابعة في Odoo</button><button id="contactAction" type="button">تم التواصل</button><button id="solveAction" type="button">تم الحل</button></div>`;
  els.drawer.classList.add('show');els.backdrop.classList.add('show');els.drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';bindDrawer(r);
}

function bindDrawer(r){
  els.drawerBody.querySelectorAll('[data-status]').forEach(b=>b.addEventListener('click',()=>{r.status=b.dataset.status;r.history.unshift(`الآن — تم تغيير الحالة إلى ${r.status}`);saveState();openDrawer(r.id);render();showToast(`تم تحديث الحالة إلى ${r.status}`)}));
  document.getElementById('assignButton').addEventListener('click',()=>{r.assignee=document.getElementById('assigneeSelect').value;r.history.unshift(`الآن — تم تعيين الحالة إلى ${r.assignee}`);saveState();openDrawer(r.id);render();showToast('تم تحديث المسؤول')});
  document.getElementById('addNote').addEventListener('click',()=>{const box=document.getElementById('internalNote');const text=box.value.trim();if(!text)return showToast('اكتب الملاحظة أولًا');r.notes.unshift({by:'مدير تجربة العملاء',time:'الآن',text});saveState();openDrawer(r.id);showToast('تمت إضافة الملاحظة الداخلية')});
  document.getElementById('odooAction').addEventListener('click',()=>{if(!r.followupRef)r.followupRef=`CX-${Math.floor(10000+Math.random()*89999)}`;r.history.unshift(`الآن — تم إنشاء/تحديث متابعة Odoo ${r.followupRef}`);saveState();openDrawer(r.id);render();showToast(`تمت محاكاة متابعة Odoo ${r.followupRef}`)});
  document.getElementById('contactAction').addEventListener('click',()=>{r.status='تم التواصل';r.history.unshift('الآن — تم تسجيل التواصل مع العميل');saveState();openDrawer(r.id);render();showToast('تم تسجيل التواصل')});
  document.getElementById('solveAction').addEventListener('click',()=>{r.status='تم الحل';r.sla=Math.max(r.sla,0);r.history.unshift('الآن — تم تسجيل حل الحالة');saveState();openDrawer(r.id);render();showToast('تم تسجيل حل الحالة')});
  document.getElementById('playMock')?.addEventListener('click',()=>showToast('تشغيل صوت تجريبي — في النسخة الفعلية سيعمل الملف المرفق'));
}

function closeDrawer(){els.drawer.classList.remove('show');els.backdrop.classList.remove('show');els.drawer.setAttribute('aria-hidden','true');document.body.style.overflow='';currentId=null}
function updateBulk(){els.selectedCount.textContent=selected.size;els.bulkbar.classList.toggle('show',selected.size>0);els.selectAll.checked=filtered().length>0&&filtered().every(r=>selected.has(r.id))}

els.tabs.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;activeTab=b.dataset.tab;els.tabs.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===b));render()});
['search','city','service','rating','priority','sort'].forEach(id=>document.getElementById(id).addEventListener(id==='search'?'input':'change',render));
document.getElementById('clearFilters').addEventListener('click',()=>{els.search.value='';els.city.value='';els.service.value='';els.rating.value='';els.priority.value='';els.sort.value='newest';activeTab='all';els.tabs.querySelectorAll('.tab').forEach((x,i)=>x.classList.toggle('on',i===0));render()});
els.selectAll.addEventListener('change',()=>{filtered().forEach(r=>els.selectAll.checked?selected.add(r.id):selected.delete(r.id));render()});
document.getElementById('bulkClear').addEventListener('click',()=>{selected.clear();render()});
document.getElementById('bulkStatus').addEventListener('click',()=>{responses.filter(r=>selected.has(r.id)).forEach(r=>{r.status='قيد المراجعة';r.history.unshift('الآن — تغيير جماعي إلى قيد المراجعة')});saveState();showToast('تم تحديث الحالات المحددة');render()});
document.getElementById('bulkAssignee').addEventListener('change',e=>{if(!e.target.value)return;responses.filter(r=>selected.has(r.id)).forEach(r=>r.assignee=e.target.value);saveState();showToast('تم تعيين المسؤول للحالات المحددة');render();e.target.value=''});
document.getElementById('bulkExport').addEventListener('click',()=>{const data=responses.filter(r=>selected.has(r.id));const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='cx-selected-responses.json';a.click();URL.revokeObjectURL(url);showToast('تم تجهيز ملف تجريبي للتصدير')});
document.getElementById('simulateNew').addEventListener('click',()=>{const id=Math.max(...responses.map(r=>r.id))+1;responses.push({id,name:'ليان المطيري',phone:'055 920 1180',order:`SV-42${id}1`,invoice:`INV-804${id}8`,city:'جدة',service:'تركيب',team:'فريق جدة 02',score:2,nps:3,ces:2,resolved:'partial',priority:'high',status:'جديد',assignee:'غير معيّن',sla:120,created:'الآن',issue:'التأخر عن الموعد',reasons:['التأخر عن الموعد'],comment:'وصل الفريق متأخر وأحتاج أعرف موعد المتابعة.',ratings:{'جودة التركيب':3,'نظافة موقع العمل':4,'احترافية الفني':3,'الالتزام بالموعد':1},callback:true,callbackTime:'مساءً',image:false,audio:false,summary:'تقييم جديد منخفض بسبب التأخر عن الموعد، والعميلة طلبت التواصل مساءً.',recommendation:'إسناد الحالة لمشرف فريق جدة 02 والتواصل مع العميلة خلال ساعتين.',history:['الآن — وصل تقييم 2/5','الآن — صُنفت أولوية عالية'],notes:[],customerHistory:'أول تقييم لهذا العميل'});saveState();activeTab='all';els.tabs.querySelectorAll('.tab').forEach((x,i)=>x.classList.toggle('on',i===0));render();showToast('وصل تقييم جديد من جدة · 2/5')});
document.getElementById('closeDrawer').addEventListener('click',closeDrawer);els.backdrop.addEventListener('click',closeDrawer);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});

render();