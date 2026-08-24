const data = [
  {city:'جدة',service:'تركيب',team:'فريق جدة 01',responses:148,invites:430,rating:3.82,csat:72,nps:31,ces:3.55,critical:5,negative:31,recovered:22,slaMet:24,first:54,resolution:258,full:111,partial:24,no:13,reasons:{'التأخر عن الموعد':13,'جودة التنفيذ':16,'ضعف التواصل':8,'عدم حل المشكلة':7},stars:[12,19,28,47,42]},
  {city:'جدة',service:'تركيب',team:'فريق جدة 02',responses:132,invites:392,rating:3.58,csat:66,nps:22,ces:3.32,critical:7,negative:36,recovered:23,slaMet:25,first:61,resolution:286,full:92,partial:27,no:13,reasons:{'التأخر عن الموعد':20,'جودة التنفيذ':11,'ضعف التواصل':10,'عدم حل المشكلة':6},stars:[16,20,26,39,31]},
  {city:'جدة',service:'توصيل',team:'فريق جدة 04',responses:122,invites:355,rating:4.31,csat:88,nps:59,ces:4.24,critical:2,negative:13,recovered:11,slaMet:12,first:31,resolution:178,full:109,partial:9,no:4,reasons:{'التأخر عن الموعد':8,'جودة التنفيذ':1,'ضعف التواصل':5,'عدم حل المشكلة':1},stars:[3,5,11,35,68]},
  {city:'الرياض',service:'توصيل',team:'فريق الرياض 01',responses:154,invites:426,rating:4.54,csat:92,nps:68,ces:4.48,critical:1,negative:8,recovered:8,slaMet:8,first:27,resolution:164,full:145,partial:7,no:2,reasons:{'التأخر عن الموعد':4,'جودة التنفيذ':1,'ضعف التواصل':3,'عدم حل المشكلة':1},stars:[2,3,7,39,103]},
  {city:'الرياض',service:'صيانة',team:'فريق الرياض 02',responses:119,invites:350,rating:4.42,csat:90,nps:64,ces:4.16,critical:2,negative:10,recovered:9,slaMet:9,first:33,resolution:211,full:106,partial:10,no:3,reasons:{'التأخر عن الموعد':3,'جودة التنفيذ':3,'ضعف التواصل':4,'عدم حل المشكلة':2},stars:[2,4,9,31,73]},
  {city:'الدمام',service:'صيانة',team:'فريق الدمام 02',responses:126,invites:337,rating:4.61,csat:94,nps:73,ces:4.47,critical:1,negative:7,recovered:7,slaMet:7,first:25,resolution:151,full:120,partial:5,no:1,reasons:{'التأخر عن الموعد':2,'جودة التنفيذ':2,'ضعف التواصل':2,'عدم حل المشكلة':1},stars:[1,2,5,29,89]},
  {city:'مكة',service:'توصيل',team:'فريق مكة 01',responses:103,invites:266,rating:4.72,csat:96,nps:79,ces:4.66,critical:0,negative:4,recovered:4,slaMet:4,first:22,resolution:139,full:100,partial:3,no:0,reasons:{'التأخر عن الموعد':2,'جودة التنفيذ':0,'ضعف التواصل':2,'عدم حل المشكلة':0},stars:[0,1,3,19,80]},
  {city:'الدمام',service:'تركيب',team:'فريق الدمام 03',responses:89,invites:251,rating:4.49,csat:92,nps:69,ces:4.31,critical:1,negative:6,recovered:5,slaMet:6,first:30,resolution:181,full:83,partial:5,no:1,reasons:{'التأخر عن الموعد':3,'جودة التنفيذ':2,'ضعف التواصل':2,'عدم حل المشكلة':1},stars:[1,2,5,21,60]}
];

const $ = id => document.getElementById(id);
const E = {
  period:$('period'), city:$('cityFilter'), service:$('serviceFilter'), team:$('teamFilter'),
  filterLabel:$('filterLabel'), briefText:$('briefText'), briefBest:$('briefBest'),
  briefProblem:$('briefProblem'), briefAction:$('briefAction'), toast:$('toast')
};
let metric = 'csat';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const sum=(a,k)=>a.reduce((t,r)=>t+(typeof k==='function'?k(r):(r[k]||0)),0);
const wavg=(a,k,w='responses')=>{const d=sum(a,w);return d?sum(a,r=>r[k]*r[w])/d:0};
const fmt=n=>Math.round(n).toLocaleString('en-US');
const qlink=o=>`responses.html?${new URLSearchParams(o).toString()}`;

function subset(){
  return data.filter(r=>(!E.city.value||r.city===E.city.value)&&(!E.service.value||r.service===E.service.value)&&(!E.team.value||r.team===E.team.value));
}
function calc(a){
  const responses=sum(a,'responses'), invites=sum(a,'invites'), negative=sum(a,'negative'), recovered=sum(a,'recovered');
  const slaMet=sum(a,'slaMet');
  return {
    responses,invites,negative,recovered,critical:sum(a,'critical'),
    rating:wavg(a,'rating'),csat:wavg(a,'csat'),nps:wavg(a,'nps'),ces:wavg(a,'ces'),
    response:invites?responses/invites*100:0,recovery:negative?recovered/negative*100:100,
    sla:negative?slaMet/negative*100:100,first:wavg(a,'first','negative'),resolution:wavg(a,'resolution','negative')
  };
}
function group(a,key){
  const m=new Map();
  a.forEach(r=>{if(!m.has(r[key]))m.set(r[key],[]);m.get(r[key]).push(r)});
  return [...m].map(([name,items])=>({name,items,m:calc(items)}));
}
function reasonTop(a){
  const c={};
  a.forEach(r=>Object.entries(r.reasons).forEach(([k,v])=>c[k]=(c[k]||0)+v));
  return Object.entries(c).sort((x,y)=>y[1]-x[1]);
}
function worst(a){
  const m=new Map();
  a.forEach(r=>{const k=`${r.city} — ${r.service}`;if(!m.has(k))m.set(k,[]);m.get(k).push(r)});
  return [...m].map(([name,items])=>({name,items,m:calc(items)})).sort((x,y)=>x.m.rating-y.m.rating)[0];
}
function toast(t){E.toast.textContent=t;E.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>E.toast.classList.remove('show'),2200)}

function renderKPIs(m){
  $('kpiCsat').textContent=`${m.csat.toFixed(1)}%`;
  $('kpiRating').textContent=m.rating.toFixed(2);
  $('kpiNps').textContent=`+${Math.round(m.nps)}`;
  $('kpiCes').textContent=`${m.ces.toFixed(2)}/5`;
  $('kpiResponse').textContent=`${m.response.toFixed(1)}%`;
  $('kpiRecovery').textContent=`${m.recovery.toFixed(0)}%`;
  $('kpiCritical').textContent=fmt(m.critical);
  $('changeCsat').textContent=`↑ ${(m.csat>85?3.1:1.4).toFixed(1)}%`;
  $('changeNps').textContent=`↑ ${Math.max(2,Math.round(m.nps/10))} نقاط`;
  $('changeDelay').textContent=m.rating<4.2?'↑ 12%':'↓ 4%';
  $('changeDelay').className=m.rating<4.2?'down':'up';
  $('changeResolution').textContent=`↓ ${Math.max(12,Math.round(260-m.resolution))} دقيقة`;
}
function renderBrief(a,m){
  const w=worst(a), best=group(a,'team').sort((x,y)=>y.m.rating-x.m.rating)[0], reason=reasonTop(a)[0]||['لا توجد مشكلة',0];
  E.briefText.textContent=`الأداء العام ${m.csat>=88?'مستقر ويميل للتحسن':'يحتاج متابعة أقرب'}. أبرز نقطة تحتاج تدخل هي ${w?.name||'النطاق الحالي'} بمتوسط ${(w?.m.rating||m.rating).toFixed(2)} من 5، والسبب الأكثر تكرارًا في التقييمات المنخفضة هو ${reason[0]}.`;
  E.briefBest.textContent=best?`${best.name} · ${best.m.rating.toFixed(2)}/5`:'—';
  E.briefProblem.textContent=w?`${w.name} · ${w.m.rating.toFixed(2)}/5`:'—';
  E.briefAction.textContent=m.critical?`راجع ${m.critical} حالات حرجة وابدأ بالـSLA الأقرب`:'استمر على نفس مستوى الخدمة';
  $('briefLink').href=w?qlink({city:w.items[0].city,service:w.items[0].service}):'responses.html';
}
function renderTrend(m){
  const cfg={csat:[m.csat,60,100],rating:[m.rating,3,5],nps:[m.nps,0,85],ces:[m.ces,3,5]}[metric];
  const patterns={csat:[-4.4,-3.1,-3.8,-1.9,-2.2,-.7,.4,0],rating:[-.28,-.2,-.24,-.12,-.16,-.05,.04,0],nps:[-9,-7,-8,-4,-5,-2,2,0],ces:[-.3,-.22,-.25,-.13,-.16,-.06,.03,0]};
  const vals=patterns[metric].map(x=>cfg[0]+x);
  const mul=(metric==='rating'||metric==='ces')?0.08:(metric==='nps'?2:1);
  const prev=vals.map((v,i)=>v-(i<4?1.6:2.3)*mul);
  const W=700,H=210,p=18, point=(v,i)=>[p+i*(W-p*2)/(vals.length-1),H-p-(clamp(v,cfg[1],cfg[2])-cfg[1])/(cfg[2]-cfg[1])*(H-p*2)];
  const pts=vals.map(point), old=prev.map(point), line=pts.map(x=>x.join(',')).join(' '), oldLine=old.map(x=>x.join(',')).join(' ');
  const area=`${pts[0][0]},${H-p} ${line} ${pts.at(-1)[0]},${H-p}`;
  $('trendChart').innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><line class="chart-grid" x1="${p}" y1="45" x2="${W-p}" y2="45"/><line class="chart-grid" x1="${p}" y1="105" x2="${W-p}" y2="105"/><line class="chart-grid" x1="${p}" y1="165" x2="${W-p}" y2="165"/><polygon class="chart-area" points="${area}"/><polyline class="chart-prev" points="${oldLine}"/><polyline class="chart-line" points="${line}"/>${pts.map(([x,y],i)=>i%2||i===pts.length-1?`<circle class="chart-dot" cx="${x}" cy="${y}" r="4"/>`:'').join('')}</svg>`;
  const labels=E.period.value==='90'?['أ1','أ2','أ3','أ4','أ5','أ6','أ7','الآن']:['1','5','10','15','20','23','26','30'];
  $('trendLabels').innerHTML=labels.map(x=>`<span>${x}</span>`).join('');
}
function renderNPS(m){
  const det=clamp(Math.round((38-m.nps*.3)/2),4,30), prom=clamp(Math.round(m.nps+det),0,90), pass=100-prom-det;
  $('npsScore').textContent=`+${Math.round(m.nps)}`;
  $('npsBars').innerHTML=[['Promoters',prom,''],['Passives',pass,'passive'],['Detractors',det,'detractor']].map(([n,v,c])=>`<div class="nps-row"><span>${n}</span><div class="bar-track"><div class="bar-fill ${c}" style="width:${v}%"></div></div><b>${v}%</b></div>`).join('');
}
function renderHeat(a){
  const cities=[...new Set(a.map(r=>r.city))], services=[...new Set(a.map(r=>r.service))];
  const tone=v=>v>=4.5?'heat-good':v>=4.2?'heat-mid':v>=3.9?'heat-warn':'heat-bad';
  $('heatmap').innerHTML=`<table class="heat-table"><thead><tr><th>المدينة</th>${services.map(s=>`<th>${s}</th>`).join('')}</tr></thead><tbody>${cities.map(c=>`<tr><th>${c}</th>${services.map(s=>{const x=a.filter(r=>r.city===c&&r.service===s);if(!x.length)return'<td>—</td>';const v=calc(x).rating;return`<td><button class="heat-cell ${tone(v)}" data-city="${c}" data-service="${s}">${v.toFixed(2)}</button></td>`}).join('')}</tr>`).join('')}</tbody></table>`;
  $('heatmap').querySelectorAll('[data-city]').forEach(b=>b.onclick=()=>location.href=qlink({city:b.dataset.city,service:b.dataset.service}));
}
function renderTeams(a){
  $('teamRanking').innerHTML=group(a,'team').sort((x,y)=>y.m.rating-x.m.rating).slice(0,6).map((g,i)=>`<a class="rank" href="${qlink({team:g.name})}"><span class="rank-no">#${i+1}</span><span><b>${g.name}</b><small>${fmt(g.m.responses)} تقييم · CSAT ${g.m.csat.toFixed(0)}% · ${g.m.critical} حرجة</small></span><span class="rank-score"><strong>${g.m.rating.toFixed(2)}</strong><span>${i<3?'أداء قوي':'يحتاج متابعة'}</span></span></a>`).join('');
}
function renderReasons(a){
  const list=reasonTop(a), total=list.reduce((t,x)=>t+x[1],0)||1, deltas=[12,-3,5,-1];
  $('reasonList').innerHTML=list.map(([name,count],i)=>{const p=count/total*100,d=deltas[i]||0;return`<div class="reason-row"><b>${name}</b><div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div><span class="reason-trend ${d>0?'down':'up'}">${p.toFixed(0)}% · ${d>0?'↑':'↓'}${Math.abs(d)}%</span></div>`}).join('');
  const top=list[0]?.[0]||'المشكلات التشغيلية';
  $('correlation').textContent=`تحليل ارتباط تجريبي: التقييمات التي يظهر فيها «${top}» تميل إلى NPS أقل، لذلك معالجة هذا السبب مرشحة لرفع الرضا والتوصية معًا.`;
}
function renderStars(a){
  const c=[0,0,0,0,0];a.forEach(r=>r.stars.forEach((v,i)=>c[i]+=v));const t=c.reduce((x,y)=>x+y,0)||1;
  $('starDistribution').innerHTML=[5,4,3,2,1].map(s=>{const p=c[s-1]/t*100;return`<div class="star-dist"><span class="stars-label">${'★'.repeat(s)}</span><div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div><b>${p.toFixed(0)}%</b></div>`}).join('');
}
function renderRecovery(m){
  const neg=m.negative, contacted=Math.round(neg*.88), closed=Math.round(m.recovered*.8);
  const stages=[['تقييم سلبي',neg,100],['تمت المتابعة',contacted,88],['تم الحل',m.recovered,neg?m.recovered/neg*100:100],['أُغلقت الحالة',closed,neg?closed/neg*100:100]];
  $('recoveryFunnel').innerHTML=stages.map(([n,v,w])=>`<div class="funnel-step" style="width:${Math.max(42,w)}%"><b>${fmt(v)}</b><span>${n}</span></div>`).join('');
}
function renderSLA(m){
  $('slaDonut').style.setProperty('--sla',`${clamp(m.sla,0,100)}%`);
  $('slaDonut').querySelector('strong').textContent=`${m.sla.toFixed(0)}%`;
  $('slaStats').innerHTML=`<div class="sla-stat"><small>متوسط أول استجابة</small><b>${m.first.toFixed(0)} دقيقة</b></div><div class="sla-stat"><small>متوسط وقت الحل</small><b>${Math.floor(m.resolution/60)}س ${Math.round(m.resolution%60)}د</b></div><div class="sla-stat"><small>تجاوزت SLA</small><b class="down">${fmt(Math.max(0,m.negative-Math.round(m.negative*m.sla/100)))}</b></div>`;
}
function renderResolution(a){
  const full=sum(a,'full'),partial=sum(a,'partial'),no=sum(a,'no'),all=full+partial+no||1;
  $('resolutionGrid').innerHTML=[['تمت بالكامل',full,'yes'],['جزئيًا',partial,'partial'],['لم تكتمل',no,'no']].map(([n,v,k])=>`<a class="resolution" href="${qlink({resolved:k})}"><strong>${(v/all*100).toFixed(0)}%</strong><span>${n}</span></a>`).join('');
}
function renderResponse(m){
  const opened=Math.round(m.invites*.59),started=Math.round(m.invites*.38);
  $('responseFunnel').innerHTML=[['تم إرسال الرابط',m.invites,100],['فتح الرابط',opened,m.invites?opened/m.invites*100:0],['بدأ التقييم',started,m.invites?started/m.invites*100:0],['أكمل التقييم',m.responses,m.invites?m.responses/m.invites*100:0]].map(([n,v,p])=>`<div class="rf-step"><strong>${fmt(v)}</strong><span>${n}</span><b>${p.toFixed(0)}%</b></div>`).join('');
}
function renderInsights(a){
  const w=worst(a), top=reasonTop(a)[0]?.[0]||'المشكلات التشغيلية', best=group(a,'service').sort((x,y)=>y.m.rating-x.m.rating)[0];
  const city=w?.items[0]?.city||'',service=w?.items[0]?.service||'';
  $('insightGrid').innerHTML=`<div class="insight critical"><div class="insight-top"><span>🔴</span><span class="insight-type">AI Analysis · Demo</span></div><h3>منطقة تحتاج تدخل</h3><p>${w?`${w.name} هي الأقل حاليًا بمتوسط ${w.m.rating.toFixed(2)} من 5.`:'لا توجد إشارة حرجة.'}</p><a href="${w?qlink({city,service}):'responses.html'}">عرض الحالات ←</a></div><div class="insight warn"><div class="insight-top"><span>🟠</span><span class="insight-type">Pattern Detection · Demo</span></div><h3>نمط متكرر</h3><p>${top} هو السبب الأكثر ظهورًا في التقييمات المنخفضة ضمن النطاق الحالي.</p><a href="${qlink({priority:'high'})}">مراجعة الحالات السلبية ←</a></div><div class="insight good"><div class="insight-top"><span>🟢</span><span class="insight-type">Positive Signal · Demo</span></div><h3>أفضل نقطة أداء</h3><p>${best?`${best.name} يحقق أفضل متوسط حاليًا عند ${best.m.rating.toFixed(2)} من 5.`:'—'}</p><a href="${best?qlink({service:best.name}):'responses.html'}">عرض التفاصيل ←</a></div>`;
}
function render(){
  const a=subset(),m=calc(a);
  E.filterLabel.textContent=[E.period.options[E.period.selectedIndex].text,E.city.value,E.service.value,E.team.value].filter(Boolean).join(' · ');
  renderKPIs(m);renderBrief(a,m);renderTrend(m);renderNPS(m);renderHeat(a);renderTeams(a);renderReasons(a);renderStars(a);renderRecovery(m);renderSLA(m);renderResolution(a);renderResponse(m);renderInsights(a);
}
function populateTeams(){
  const old=E.team.value, teams=[...new Set(data.filter(r=>(!E.city.value||r.city===E.city.value)&&(!E.service.value||r.service===E.service.value)).map(r=>r.team))];
  E.team.innerHTML='<option value="">كل الفرق</option>'+teams.map(t=>`<option>${t}</option>`).join('');
  if(teams.includes(old))E.team.value=old;
}

['period','cityFilter','serviceFilter','teamFilter'].forEach(id=>$(id).addEventListener('change',()=>{if(id==='cityFilter'||id==='serviceFilter')populateTeams();render()}));
$('resetFilters').onclick=()=>{E.period.value='30';E.city.value='';E.service.value='';E.team.value='';populateTeams();render()};
document.querySelectorAll('[data-metric]').forEach(b=>b.onclick=()=>{metric=b.dataset.metric;document.querySelectorAll('[data-metric]').forEach(x=>x.classList.toggle('on',x===b));renderTrend(calc(subset()))});
$('printReport').onclick=()=>window.print();
$('monthlyReport').onclick=()=>toast('محاكاة: سيتم إرسال التقرير الشهري تلقائيًا في النسخة الفعلية');
$('exportCsv').onclick=()=>{const a=subset(),lines=['المدينة,الخدمة,الفريق,عدد التقييمات,متوسط التقييم,CSAT,NPS,CES'];a.forEach(r=>lines.push([r.city,r.service,r.team,r.responses,r.rating,r.csat,r.nps,r.ces].join(',')));const blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),el=document.createElement('a');el.href=url;el.download='bayt-alebaa-cx-report.csv';el.click();URL.revokeObjectURL(url);toast('تم تجهيز ملف CSV للتقرير')};

populateTeams();
render();