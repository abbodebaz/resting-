const responses = [
  {id:1,name:'محمد العتيبي',order:'SV-41872',city:'جدة',service:'تركيب',team:'جدة 03',score:5,status:'مكتمل',c:5,q:5,p:4,comment:'الخدمة ممتازة والفني محترم جدًا، فقط الموعد تأخر تقريبًا نصف ساعة.'},
  {id:2,name:'نورة الحربي',order:'DL-29115',city:'الرياض',service:'توصيل',team:'الرياض 01',score:2,status:'متابعة',c:3,q:4,p:1,reason:'التأخر عن الموعد',comment:'تأخر التوصيل أكثر من ساعتين ولم يصلني تحديث بالموعد.'},
  {id:3,name:'خالد الزهراني',order:'MT-88241',city:'الدمام',service:'صيانة',team:'الدمام 02',score:4,status:'مكتمل',c:5,q:4,p:4,comment:'تم حل المشكلة بسرعة والتعامل كان ممتاز.'},
  {id:4,name:'ريم القحطاني',order:'SV-41704',city:'جدة',service:'تركيب',team:'جدة 01',score:1,status:'حرج',c:2,q:1,p:3,reason:'جودة التركيب',comment:'التركيب يحتاج إعادة ضبط وفيه ملاحظة واضحة على التشطيب.'},
  {id:5,name:'سامي الغامدي',order:'DL-28876',city:'مكة',service:'توصيل',team:'مكة 01',score:5,status:'مكتمل',c:5,q:5,p:5,comment:'كل شيء تم بالوقت وباحترافية، شكرًا لكم.'},
  {id:6,name:'هدى السلمي',order:'MT-87831',city:'الرياض',service:'صيانة',team:'الرياض 02',score:4,status:'مكتمل',c:4,q:4,p:5,comment:'التجربة جيدة وأتمنى توضيح مدة الضمان بعد الصيانة.'},
  {id:7,name:'عبدالله الشهري',order:'SV-41491',city:'جدة',service:'تركيب',team:'جدة 02',score:2,status:'متابعة',c:2,q:3,p:1,reason:'التأخر عن الموعد',comment:'الفريق وصل متأخرًا ولم يتم إبلاغي مسبقًا.'},
  {id:8,name:'منى الدوسري',order:'DL-28741',city:'الرياض',service:'توصيل',team:'الرياض 01',score:5,status:'مكتمل',c:5,q:5,p:5,comment:'تجربة ممتازة من البداية للنهاية.'}
];

function initials(name) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('');
}

function badge(status) {
  const tone = status === 'حرج' ? 'bad' : status === 'متابعة' ? 'warn' : 'good';
  return `<span class="pill ${tone}">${status}</span>`;
}

function stars(score) {
  return `<span class="mini-stars">${'★'.repeat(score)}<span style="color:#d9e0e2">${'★'.repeat(5 - score)}</span></span>`;
}

function filteredResponses() {
  const query = (document.getElementById('search').value || '').trim();
  const city = document.getElementById('city').value;
  const service = document.getElementById('service').value;
  const rating = document.getElementById('rating').value;

  return responses.filter((response) => {
    const matchesQuery = !query || `${response.name} ${response.order}`.includes(query);
    const matchesCity = !city || response.city === city;
    const matchesService = !service || response.service === service;
    const matchesRating = !rating || (rating === 'low' ? response.score <= 2 : response.score === Number(rating));
    return matchesQuery && matchesCity && matchesService && matchesRating;
  });
}

function renderResponses() {
  const list = filteredResponses();

  document.getElementById('tbody').innerHTML = list.map((response) => `
    <tr>
      <td><div class="customer"><div class="avatar">${initials(response.name)}</div><div><b>${response.name}</b><small>${response.order}</small></div></div></td>
      <td><span class="pill">${response.service}</span></td>
      <td>${response.city}</td>
      <td>${response.team}</td>
      <td>${stars(response.score)}</td>
      <td>${badge(response.status)}</td>
      <td><button class="rowbtn" type="button" data-detail-id="${response.id}">التفاصيل</button></td>
    </tr>`).join('');

  document.getElementById('mobileList').innerHTML = list.map((response) => `
    <button class="mobile-card" type="button" data-detail-id="${response.id}" style="text-align:right;width:100%">
      <div class="toprow">
        <div class="customer"><div class="avatar">${initials(response.name)}</div><div><b>${response.name}</b><small>${response.order} · ${response.city}</small></div></div>
        ${badge(response.status)}
      </div>
      <div style="margin-top:9px">${stars(response.score)} <span class="pill">${response.service}</span></div>
      <p>${response.comment}</p>
    </button>`).join('');

  document.getElementById('resultCount').textContent = `عرض ${list.length} من ${responses.length} إجابات`;
  bindDetailButtons();
}

function renderDetail(id) {
  const response = responses.find((item) => item.id === id);
  const detail = document.getElementById('detail');
  if (!response) return;

  detail.style.display = 'block';
  detail.innerHTML = `
    <div class="panel-head"><h2>تفاصيل الإجابة</h2>${badge(response.status)}</div>
    <div class="detail-user">
      <div class="avatar">${initials(response.name)}</div>
      <div><b>${response.name}</b><div style="font-size:11px;color:var(--muted)">${response.order}</div></div>
      <div class="score"><strong>${response.score}.0</strong><small>من 5</small></div>
    </div>
    <div class="detail-grid">
      <div class="dm"><small>الخدمة</small><b>${response.service}</b></div>
      <div class="dm"><small>المدينة</small><b>${response.city}</b></div>
      <div class="dm"><small>الفريق</small><b>${response.team}</b></div>
      <div class="dm"><small>الحالة</small><b>${response.status}</b></div>
    </div>
    ${[
      ['الاحترافية', response.c],
      ['جودة العمل', response.q],
      ['الالتزام بالموعد', response.p]
    ].map(([label, value]) => `
      <div class="scoreline">
        <span>${label}</span>
        <div class="track"><div class="fill" style="width:${value * 20}%"></div></div>
        <b>${value}/5</b>
      </div>`).join('')}
    <div class="comment">
      <small>ملاحظة العميل</small>
      <p>${response.comment}</p>
      ${response.reason ? `<span class="pill bad">سبب عدم الرضا: ${response.reason}</span>` : ''}
    </div>
    ${response.score <= 2 ? '<button class="btn primary" id="createOdooFollowup" type="button" style="width:100%;margin-top:12px">إنشاء متابعة في Odoo</button>' : ''}`;

  const followupButton = document.getElementById('createOdooFollowup');
  if (followupButton) {
    followupButton.addEventListener('click', () => window.alert('تم إنشاء حالة متابعة في Odoo'));
  }

  if (window.innerWidth < 900) {
    detail.scrollIntoView({behavior:'smooth'});
  }
}

function bindDetailButtons() {
  document.querySelectorAll('[data-detail-id]').forEach((button) => {
    button.addEventListener('click', () => renderDetail(Number(button.dataset.detailId)));
  });
}

['search', 'city', 'service', 'rating'].forEach((id) => {
  const element = document.getElementById(id);
  element.addEventListener(id === 'search' ? 'input' : 'change', renderResponses);
});

renderResponses();
