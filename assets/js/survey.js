const params = new URLSearchParams(window.location.search);

const profile = {
  customer: params.get('customer') || 'محمد',
  service: params.get('service') || 'تركيب',
  city: params.get('city') || 'جدة',
  order: params.get('order') || 'SV-41872',
  invoice: params.get('invoice') || 'INV-803214',
  date: params.get('date') || '23 أغسطس 2026',
  team: params.get('team') || 'فريق جدة 03',
  status: params.get('status') || 'active',
  googleReview: params.get('googleReview') || ''
};

const ratingLabels = ['سيئة جدًا', 'غير مرضية', 'مقبولة', 'جيدة جدًا', 'ممتازة'];
const flow = ['overall', 'adaptive', 'service', 'final'];
const draftKey = `bayt-alebaa-cx-draft-${profile.order}`;

const serviceQuestions = {
  'تركيب': [
    ['quality', 'جودة التركيب', '🧱'],
    ['cleanliness', 'نظافة موقع العمل', '✨'],
    ['professionalism', 'احترافية الفني', '🤝'],
    ['punctuality', 'الالتزام بالموعد', '⏱️']
  ],
  'توصيل': [
    ['punctuality', 'الالتزام بموعد التوصيل', '⏱️'],
    ['condition', 'حالة المنتج عند الاستلام', '📦'],
    ['professionalism', 'تعامل مندوب التوصيل', '🤝'],
    ['communication', 'وضوح التواصل والتحديثات', '💬']
  ],
  'صيانة': [
    ['solution', 'جودة حل المشكلة', '🛠️'],
    ['repair', 'جودة الإصلاح', '✅'],
    ['explanation', 'شرح الفني لما تم عمله', '💬'],
    ['speed', 'سرعة إنجاز الخدمة', '⚡']
  ]
};

const genericQuestions = [
  ['quality', 'جودة الخدمة', '⭐'],
  ['professionalism', 'احترافية الفريق', '🤝'],
  ['punctuality', 'الالتزام بالموعد', '⏱️'],
  ['communication', 'وضوح التواصل', '💬']
];

const adaptiveContent = {
  high: {
    kicker: 'خلّنا نعرف وش نجح',
    title: 'وش أكثر شيء أعجبك؟',
    help: 'اختر كل الأشياء اللي حسّنت تجربتك معنا.',
    icon: '💙',
    bannerTitle: 'يسعدنا هذا جدًا.',
    bannerText: 'رأيك يساعدنا نعرف الأشياء اللي لازم نستمر عليها ونكررها.',
    options: ['الالتزام بالموعد', 'احترافية الفريق', 'جودة العمل', 'سرعة الخدمة', 'وضوح التواصل']
  },
  mid: {
    kicker: 'فرصة للتحسين',
    title: 'وش الشيء اللي كان ممكن يخلي تجربتك أفضل؟',
    help: 'اختر النقاط اللي لو تحسنت كان تقييمك أعلى.',
    icon: '✨',
    bannerTitle: 'واضح إن التجربة كانت مقبولة، لكن نقدر نخليها أفضل.',
    bannerText: 'حدد لنا أكثر شيء يحتاج تحسين عشان نعرف وين نركز.',
    options: ['الالتزام بالموعد', 'جودة التنفيذ', 'التواصل', 'وضوح الخطوات', 'سرعة الخدمة', 'تعامل الفريق']
  },
  low: {
    kicker: 'نحتاج نفهم المشكلة',
    title: 'إيش أكثر شيء سبب لك عدم رضا؟',
    help: 'اختر سببًا واحدًا أو أكثر — ملاحظتك ستظهر لفريق تجربة العملاء.',
    icon: '🤍',
    bannerTitle: 'نأسف إن تجربتك ما كانت بالمستوى اللي نطمح له.',
    bannerText: 'ساعدنا نعرف السبب عشان نقدر نتابع المشكلة بشكل صحيح.',
    options: ['التأخر عن الموعد', 'جودة التنفيذ', 'تعامل الفريق', 'عدم حل المشكلة', 'تلف أو ملاحظة على المنتج', 'ضعف التواصل', 'أخرى']
  }
};

const state = {
  stepIndex: 0,
  overall: 0,
  adaptiveChoices: [],
  serviceRatings: {},
  resolved: null,
  ces: null,
  nps: null,
  comment: '',
  callback: false,
  callbackTime: '',
  imageName: '',
  voiceAttached: false,
  followupRef: ''
};

const els = {
  card: document.getElementById('surveyCard'),
  hero: document.getElementById('heroSection'),
  host: document.getElementById('stepHost'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  skip: document.getElementById('skip'),
  actionBar: document.getElementById('actionBar'),
  progressArea: document.getElementById('progressArea'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  progressDots: document.getElementById('progressDots'),
  timeHint: document.getElementById('timeHint'),
  toast: document.getElementById('toast'),
  resumeBanner: document.getElementById('resumeBanner'),
  resumeDraft: document.getElementById('resumeDraft'),
  restartDraft: document.getElementById('restartDraft')
};

let autoAdvanceTimer = null;
let mediaRecorder = null;
let mediaStream = null;
let audioChunks = [];
let audioUrl = '';
let recordingTimer = null;
let recordingSeconds = 0;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function ratingGroup(score = state.overall) {
  if (score <= 2) return 'low';
  if (score === 3) return 'mid';
  return 'high';
}

function starSvg() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.82 5.72 6.31.92-4.57 4.45 1.08 6.28L12 17.2l-5.64 2.97 1.08-6.28-4.57-4.45 6.31-.92L12 2.8Z"/></svg>';
}

function setProfileUI() {
  document.getElementById('helloName').textContent = `أهلًا ${profile.customer} 👋`;
  document.getElementById('servicePrompt').textContent = `كيف كانت تجربة ${profile.service} الأخيرة مع بيت الإباء؟`;
  document.getElementById('serviceMeta').textContent = profile.service;
  document.getElementById('cityMeta').textContent = profile.city;
  document.getElementById('orderMeta').textContent = `#${profile.order}`;
  document.getElementById('invoiceMeta').textContent = `فاتورة #${profile.invoice}`;
  document.getElementById('dateMeta').textContent = `تم التنفيذ: ${profile.date}`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove('show'), 2600);
}

function saveDraft() {
  const serializable = {
    ...state,
    savedAt: Date.now()
  };
  localStorage.setItem(draftKey, JSON.stringify(serializable));
}

function clearDraft() {
  localStorage.removeItem(draftKey);
}

function loadDraft() {
  const raw = localStorage.getItem(draftKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    clearDraft();
    return null;
  }
}

function restoreDraft(draft) {
  Object.assign(state, {
    stepIndex: Math.min(Math.max(Number(draft.stepIndex) || 0, 0), flow.length - 1),
    overall: Number(draft.overall) || 0,
    adaptiveChoices: Array.isArray(draft.adaptiveChoices) ? draft.adaptiveChoices : [],
    serviceRatings: draft.serviceRatings || {},
    resolved: draft.resolved ?? null,
    ces: draft.ces ?? null,
    nps: draft.nps ?? null,
    comment: draft.comment || '',
    callback: Boolean(draft.callback),
    callbackTime: draft.callbackTime || '',
    imageName: draft.imageName || '',
    voiceAttached: Boolean(draft.voiceAttached),
    followupRef: draft.followupRef || ''
  });
  els.resumeBanner.classList.add('hidden');
  renderStep();
  showToast('رجعناك لنفس المكان اللي وقفت عنده');
}

function setupDraftResume() {
  const draft = loadDraft();
  if (!draft || !draft.overall) return;
  els.resumeBanner.classList.remove('hidden');
  els.resumeDraft.addEventListener('click', () => restoreDraft(draft));
  els.restartDraft.addEventListener('click', () => {
    clearDraft();
    els.resumeBanner.classList.add('hidden');
    Object.assign(state, {
      stepIndex: 0,
      overall: 0,
      adaptiveChoices: [],
      serviceRatings: {},
      resolved: null,
      ces: null,
      nps: null,
      comment: '',
      callback: false,
      callbackTime: '',
      imageName: '',
      voiceAttached: false,
      followupRef: ''
    });
    renderStep();
    showToast('بدأنا تقييم جديد');
  });
}

function updateProgress() {
  const percent = Math.round(((state.stepIndex + 1) / flow.length) * 100);
  els.progressText.textContent = `${percent}%`;
  els.progressBar.style.width = `${percent}%`;
  const timeHints = ['باقي أقل من 40 ثانية', 'باقي أقل من 30 ثانية', 'باقي أقل من 20 ثانية', 'آخر خطوة'];
  els.timeHint.textContent = timeHints[state.stepIndex];
  els.progressDots.innerHTML = flow.map((_, index) => `<span class="progress-dot ${index <= state.stepIndex ? 'on' : ''}" aria-hidden="true"></span>`).join('');
}

function renderOverall() {
  const selected = state.overall;
  els.host.innerHTML = `
    <section class="step active">
      <div class="step-kicker">التقييم العام</div>
      <h2 class="step-title">كيف تقيم تجربتك بشكل عام؟</h2>
      <p class="step-help">اختر عدد النجوم الأقرب لتجربتك.</p>

      <div class="rating-stage">
        <div class="stars" id="stars">
          ${[1,2,3,4,5].map(score => `<button class="star ${selected >= score ? 'on' : ''}" type="button" data-score="${score}" aria-label="${score} نجوم">${starSvg()}</button>`).join('')}
        </div>
        <div class="rating-copy" id="ratingCopy">${selected ? `${selected} من 5 — ${ratingLabels[selected - 1]}` : 'اختر تقييمك'}</div>
        <div class="rating-hint">يمكنك تغيير التقييم قبل الإرسال.</div>
      </div>

      <div class="emotion-message ${selected ? ratingGroup(selected) : 'hidden'}" id="emotionMessage">
        ${selected ? emotionalCopy(selected) : ''}
      </div>
    </section>`;

  els.host.querySelectorAll('.star').forEach((button) => {
    button.addEventListener('click', () => selectOverall(Number(button.dataset.score)));
  });
}

function emotionalCopy(score) {
  if (score === 5) return '<b>يسعدنا هذا جدًا 💙</b><span>خلّنا نعرف وش الأشياء اللي خلت التجربة ممتازة.</span>';
  if (score === 4) return '<b>جميل جدًا، شكرًا لك 💙</b><span>باقي كم نقطة بسيطة ونكون خلصنا.</span>';
  if (score === 3) return '<b>شكرًا لصراحتك.</b><span>واضح إن التجربة كانت جيدة جزئيًا، ونقدر نخليها أفضل.</span>';
  return '<b>نأسف على التجربة.</b><span>ملاحظتك مهمة لنا وراح تساعدنا نتابع سبب المشكلة.</span>';
}

function selectOverall(score) {
  window.clearTimeout(autoAdvanceTimer);
  if (state.overall !== score) {
    state.adaptiveChoices = [];
    state.serviceRatings = {};
    state.resolved = null;
  }
  state.overall = score;
  els.resumeBanner.classList.add('hidden');
  saveDraft();
  renderOverall();
  updateActionState();

  autoAdvanceTimer = window.setTimeout(() => {
    if (state.stepIndex === 0 && state.overall === score) {
      state.stepIndex = 1;
      saveDraft();
      renderStep(true);
    }
  }, 620);
}

function renderAdaptive() {
  const group = ratingGroup();
  const content = adaptiveContent[group];
  els.host.innerHTML = `
    <section class="step active">
      <div class="step-kicker">${content.kicker}</div>
      <h2 class="step-title">${content.title}</h2>
      <p class="step-help">${content.help}</p>

      <div class="adaptive-banner ${group}">
        <div class="adaptive-icon">${content.icon}</div>
        <div><b>${content.bannerTitle}</b><span>${content.bannerText}</span></div>
      </div>

      <div class="choice-grid" id="adaptiveChoices">
        ${content.options.map(option => `<button class="choice ${group === 'low' ? 'low' : ''} ${state.adaptiveChoices.includes(option) ? 'on' : ''}" type="button" data-choice="${escapeHtml(option)}"><span class="choice-check">✓</span>${escapeHtml(option)}</button>`).join('')}
      </div>
    </section>`;

  els.host.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.choice;
      state.adaptiveChoices = state.adaptiveChoices.includes(choice)
        ? state.adaptiveChoices.filter(item => item !== choice)
        : [...state.adaptiveChoices, choice];
      button.classList.toggle('on');
      saveDraft();
      updateActionState();
    });
  });
}

function renderService() {
  const questions = serviceQuestions[profile.service] || genericQuestions;
  const resolutionLabel = profile.service === 'صيانة'
    ? 'هل تم حل المشكلة بالكامل؟'
    : 'هل اكتملت الخدمة بالشكل المطلوب؟';

  els.host.innerHTML = `
    <section class="step active">
      <div class="step-kicker">تفاصيل ${escapeHtml(profile.service)}</div>
      <h2 class="step-title">خلّنا نفهم التجربة بشكل أدق</h2>
      <p class="step-help">التقييم هنا مرتبط بـ <b>${escapeHtml(profile.team)}</b>. اختر «لا ينطبق» إذا السؤال ما يخص تجربتك.</p>

      <div class="detail-list">
        ${questions.map(([key, label, icon]) => renderServiceQuestion(key, label, icon)).join('')}
      </div>

      <div class="resolution-card">
        <div><span class="mini-icon">✓</span><b>${resolutionLabel}</b></div>
        <div class="resolution-grid">
          ${[['yes','نعم، بالكامل'],['partial','جزئيًا'],['no','لا']].map(([value,label]) => `<button type="button" class="resolution-option ${state.resolved === value ? 'on' : ''}" data-resolution="${value}">${label}</button>`).join('')}
        </div>
      </div>
    </section>`;

  els.host.querySelectorAll('[data-rating-key]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.ratingKey;
      state.serviceRatings[key] = button.dataset.ratingValue;
      const container = button.closest('.mood-scale');
      container.querySelectorAll('.mood-option').forEach(item => item.classList.toggle('on', item === button));
      saveDraft();
      updateActionState();
    });
  });

  els.host.querySelectorAll('[data-resolution]').forEach((button) => {
    button.addEventListener('click', () => {
      state.resolved = button.dataset.resolution;
      els.host.querySelectorAll('[data-resolution]').forEach(item => item.classList.toggle('on', item === button));
      saveDraft();
      updateActionState();
    });
  });
}

function renderServiceQuestion(key, label, icon) {
  const selected = state.serviceRatings[key];
  const options = [
    ['1','😞','سيئ'],
    ['2','😐','مقبول'],
    ['3','🙂','جيد'],
    ['4','😍','ممتاز'],
    ['na','—','لا ينطبق']
  ];
  return `
    <div class="detail-card">
      <h3><span>${icon}</span>${escapeHtml(label)}</h3>
      <div class="mood-scale">
        ${options.map(([value,emoji,text]) => `<button type="button" class="mood-option ${selected === value ? 'on' : ''}" data-rating-key="${key}" data-rating-value="${value}"><span>${emoji}</span>${text}</button>`).join('')}
      </div>
    </div>`;
}

function renderFinal() {
  const low = state.overall <= 2;
  els.host.innerHTML = `
    <section class="step active">
      <div class="step-kicker">آخر خطوة</div>
      <h2 class="step-title">في شيء تحب تقوله لنا؟</h2>
      <p class="step-help">ملاحظتك توصل مباشرة لفريق تجربة العملاء. كل ما يلي اختياري.</p>

      <div class="measure-card">
        <div class="measure-head"><b>هل تنصح ببيت الإباء لأحد من أهلك أو أصدقائك؟</b><span>NPS</span></div>
        <div class="range-value"><strong id="npsValue">${state.nps ?? '—'}</strong><span>من 10</span></div>
        <input class="range-input" id="npsRange" type="range" min="0" max="10" step="1" value="${state.nps ?? 5}" aria-label="درجة التوصية من صفر إلى عشرة">
        <div class="range-labels"><span>0 · لن أنصح</span><span>10 · بالتأكيد أنصح</span></div>
      </div>

      <div class="measure-card">
        <div class="measure-head"><b>كم كان الحصول على الخدمة سهلًا بالنسبة لك؟</b><span>CES</span></div>
        <div class="ces-grid">
          ${[['1','صعب جدًا'],['2','صعب'],['3','مقبول'],['4','سهل'],['5','سهل جدًا']].map(([value,label]) => `<button class="ces-option ${String(state.ces) === value ? 'on' : ''}" type="button" data-ces="${value}"><span>${value}</span>${label}</button>`).join('')}
        </div>
      </div>

      <div class="comment-wrap">
        <div class="comment-label"><b>اكتب ملاحظتك</b><span>اختياري</span></div>
        <textarea id="comment" maxlength="500" placeholder="اكتب ملاحظتك أو اقتراحك هنا...">${escapeHtml(state.comment)}</textarea>
        <div class="counter"><span id="count">${state.comment.length}</span> / 500</div>
      </div>

      ${low ? renderRecoveryTools() : ''}
    </section>`;

  bindFinalEvents(low);
}

function renderRecoveryTools() {
  return `
    <div class="recovery-section">
      <div class="recovery-title"><span>متابعة المشكلة</span><b>نقدر نساعدك أكثر</b></div>

      <label class="callback-card">
        <input id="callbackRequest" type="checkbox" ${state.callback ? 'checked' : ''}>
        <span><b>أرغب أن يتم التواصل معي</b><small>سيتم تحويل الملاحظة لفريق المتابعة.</small></span>
      </label>

      <div class="callback-times ${state.callback ? 'show' : ''}" id="callbackTimes">
        <span>أفضل وقت للتواصل</span>
        <div class="time-grid">
          ${['صباحًا','ظهرًا','مساءً'].map(time => `<button type="button" class="time-option ${state.callbackTime === time ? 'on' : ''}" data-time="${time}">${time}</button>`).join('')}
        </div>
      </div>

      <div class="attachment-grid">
        <div class="upload-card">
          <div class="upload-icon">▧</div>
          <b>أرفق صورة توضح المشكلة</b>
          <span>اختياري · JPG / PNG</span>
          <label class="upload-button">اختيار صورة<input id="imageInput" type="file" accept="image/*" hidden></label>
          <div class="image-preview ${state.imageName ? 'show' : ''}" id="imagePreview">${state.imageName ? `تم اختيار: ${escapeHtml(state.imageName)}` : ''}</div>
        </div>

        <div class="upload-card voice-card">
          <div class="upload-icon">◉</div>
          <b>سجّل ملاحظتك صوتيًا</b>
          <span>مفيد إذا كانت الملاحظة طويلة</span>
          <button class="upload-button" id="recordButton" type="button">${state.voiceAttached ? 'تسجيل صوت جديد' : 'بدء التسجيل'}</button>
          <div class="recording-status" id="recordingStatus">${state.voiceAttached ? '✓ تم إرفاق تسجيل صوتي' : ''}</div>
          <div id="audioPreview"></div>
        </div>
      </div>
    </div>`;
}

function bindFinalEvents(low) {
  const npsRange = document.getElementById('npsRange');
  const npsValue = document.getElementById('npsValue');
  npsRange.addEventListener('input', () => {
    state.nps = Number(npsRange.value);
    npsValue.textContent = state.nps;
    saveDraft();
  });

  document.querySelectorAll('[data-ces]').forEach(button => {
    button.addEventListener('click', () => {
      state.ces = Number(button.dataset.ces);
      document.querySelectorAll('[data-ces]').forEach(item => item.classList.toggle('on', item === button));
      saveDraft();
    });
  });

  const comment = document.getElementById('comment');
  comment.addEventListener('input', () => {
    state.comment = comment.value;
    document.getElementById('count').textContent = comment.value.length;
    saveDraft();
  });

  if (!low) return;

  const callback = document.getElementById('callbackRequest');
  const callbackTimes = document.getElementById('callbackTimes');
  callback.addEventListener('change', () => {
    state.callback = callback.checked;
    if (!state.callback) state.callbackTime = '';
    callbackTimes.classList.toggle('show', state.callback);
    saveDraft();
  });

  document.querySelectorAll('[data-time]').forEach(button => {
    button.addEventListener('click', () => {
      state.callbackTime = button.dataset.time;
      document.querySelectorAll('[data-time]').forEach(item => item.classList.toggle('on', item === button));
      saveDraft();
    });
  });

  const imageInput = document.getElementById('imageInput');
  imageInput.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    if (!file) return;
    state.imageName = file.name;
    const preview = document.getElementById('imagePreview');
    preview.classList.add('show');
    preview.innerHTML = `<img alt="معاينة المرفق"><span>${escapeHtml(file.name)}</span><button type="button" id="removeImage">حذف</button>`;
    const reader = new FileReader();
    reader.onload = () => { preview.querySelector('img').src = reader.result; };
    reader.readAsDataURL(file);
    preview.querySelector('#removeImage').addEventListener('click', () => {
      imageInput.value = '';
      state.imageName = '';
      preview.classList.remove('show');
      preview.innerHTML = '';
      saveDraft();
    });
    saveDraft();
  });

  document.getElementById('recordButton').addEventListener('click', toggleRecording);
}

async function toggleRecording() {
  const button = document.getElementById('recordButton');
  const status = document.getElementById('recordingStatus');

  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    button.textContent = 'بدء تسجيل جديد';
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    showToast('المتصفح الحالي لا يدعم التسجيل الصوتي');
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    recordingSeconds = 0;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener('dataavailable', event => audioChunks.push(event.data));
    mediaRecorder.addEventListener('stop', finishRecording);
    mediaRecorder.start();
    button.textContent = 'إيقاف التسجيل';
    button.classList.add('recording');
    status.textContent = '● جاري التسجيل 00:00';
    recordingTimer = window.setInterval(() => {
      recordingSeconds += 1;
      const seconds = String(recordingSeconds % 60).padStart(2, '0');
      const minutes = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
      status.textContent = `● جاري التسجيل ${minutes}:${seconds}`;
    }, 1000);
  } catch {
    showToast('يلزم السماح باستخدام الميكروفون للتسجيل');
  }
}

function finishRecording() {
  window.clearInterval(recordingTimer);
  mediaStream?.getTracks().forEach(track => track.stop());
  const button = document.getElementById('recordButton');
  const status = document.getElementById('recordingStatus');
  button?.classList.remove('recording');
  const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(blob);
  state.voiceAttached = true;
  status.textContent = '✓ تم إرفاق تسجيل صوتي';
  const preview = document.getElementById('audioPreview');
  preview.innerHTML = `<audio controls src="${audioUrl}"></audio><button class="remove-audio" type="button" id="removeAudio">حذف التسجيل</button>`;
  document.getElementById('removeAudio').addEventListener('click', () => {
    state.voiceAttached = false;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrl = '';
    preview.innerHTML = '';
    status.textContent = '';
    button.textContent = 'بدء التسجيل';
    saveDraft();
  });
  saveDraft();
}

function validateCurrent() {
  const key = flow[state.stepIndex];
  if (key === 'overall') return Boolean(state.overall);
  if (key === 'adaptive') return state.adaptiveChoices.length > 0;
  if (key === 'service') {
    const questions = serviceQuestions[profile.service] || genericQuestions;
    return questions.every(([questionKey]) => Boolean(state.serviceRatings[questionKey])) && Boolean(state.resolved);
  }
  return true;
}

function updateActionState() {
  const key = flow[state.stepIndex];
  els.prev.classList.toggle('invisible', state.stepIndex === 0);
  els.skip.classList.toggle('hidden', key !== 'final');
  els.next.disabled = !validateCurrent();
  els.next.textContent = key === 'final' ? 'إرسال التقييم ✓' : 'التالي ←';
}

function renderStep(animate = false) {
  window.clearTimeout(autoAdvanceTimer);
  updateProgress();
  const key = flow[state.stepIndex];
  if (key === 'overall') renderOverall();
  if (key === 'adaptive') renderAdaptive();
  if (key === 'service') renderService();
  if (key === 'final') renderFinal();
  updateActionState();
  if (animate) {
    els.host.classList.remove('swap');
    requestAnimationFrame(() => els.host.classList.add('swap'));
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goNext() {
  if (!validateCurrent()) {
    showToast('كمّل هذا الجزء أولًا عشان نتابع');
    return;
  }
  if (state.stepIndex < flow.length - 1) {
    state.stepIndex += 1;
    saveDraft();
    renderStep(true);
    return;
  }
  submitSurvey();
}

function goPrev() {
  if (state.stepIndex === 0) return;
  state.stepIndex -= 1;
  saveDraft();
  renderStep(true);
}

function skipOptional() {
  if (flow[state.stepIndex] !== 'final') return;
  submitSurvey();
}

function submitSurvey() {
  clearDraft();
  if (state.overall <= 2 && !state.followupRef) {
    state.followupRef = `CX-${Math.floor(10000 + Math.random() * 89999)}`;
  }
  showSuccess();
}

function showSuccess() {
  const low = state.overall <= 2;
  const five = state.overall === 5;
  els.progressArea.classList.add('hidden');
  document.querySelector('.privacy-note')?.classList.add('success-privacy');

  els.card.innerHTML = `
    <div class="success ${low ? 'recovery' : ''}">
      <div class="success-mark ${low ? 'low' : ''}"><span>✓</span></div>
      <span class="success-badge">تم استلام تقييمك</span>
      <h2>${low ? `شكرًا ${escapeHtml(profile.customer)}، ملاحظتك وصلت لنا.` : `شكرًا ${escapeHtml(profile.customer)} 💙`}</h2>
      <p>${low
        ? 'نأسف إن تجربتك ما كانت بالمستوى المطلوب. تم تسجيل التفاصيل وسيتم تحويلها لفريق المتابعة.'
        : 'رأيك يساعدنا نعرف نقاط القوة ونطوّر تجربة خدمات ما بعد البيع باستمرار.'}</p>

      ${low ? `<div class="followup-ref"><span>رقم المتابعة</span><strong>${state.followupRef}</strong><small>${state.callback ? `طلبت التواصل معك${state.callbackTime ? ` · الوقت المفضل: ${state.callbackTime}` : ''}.` : 'يمكن لفريق تجربة العملاء استخدام هذا الرقم لمتابعة الملاحظة.'}</small></div>` : ''}

      <div class="success-context">
        <span>${escapeHtml(profile.service)}</span>
        <span>${escapeHtml(profile.city)}</span>
        <span>#${escapeHtml(profile.order)}</span>
        <span>فاتورة #${escapeHtml(profile.invoice)}</span>
      </div>

      ${five ? `<div class="share-box"><div class="share-icon">★</div><div><b>سعدنا جدًا إن تجربتك كانت ممتازة.</b><p>إذا تحب، تقدر تشارك تجربتك على Google لمساعدة عملاء آخرين.</p><button class="btn btn-google" type="button" id="googleReviewButton">مشاركة التجربة على Google ↗</button></div></div>` : ''}

      <div class="success-actions">
        <a class="btn btn-secondary link-btn" href="index.html">العودة لمركز المحاكاة</a>
        <button class="btn btn-ghost" id="restartSurvey" type="button">عرض النموذج مرة أخرى</button>
      </div>
    </div>`;

  document.getElementById('restartSurvey').addEventListener('click', () => {
    clearDraft();
    window.location.href = `survey.html?customer=${encodeURIComponent(profile.customer)}&service=${encodeURIComponent(profile.service)}&city=${encodeURIComponent(profile.city)}&order=${encodeURIComponent(profile.order)}&invoice=${encodeURIComponent(profile.invoice)}&date=${encodeURIComponent(profile.date)}&team=${encodeURIComponent(profile.team)}`;
  });

  document.getElementById('googleReviewButton')?.addEventListener('click', () => {
    if (profile.googleReview) {
      window.open(profile.googleReview, '_blank', 'noopener,noreferrer');
    } else {
      showToast('في النسخة الفعلية سيتم ربط هذا الزر بصفحة Google Business Profile');
    }
  });
}

function showLinkState(type) {
  const expired = type === 'expired';
  els.card.innerHTML = `
    <div class="state-screen">
      <div class="state-icon">${expired ? '⌛' : '✓'}</div>
      <span class="state-badge">رابط تقييم ${expired ? 'منتهي' : 'مستخدم'}</span>
      <h2>${expired ? 'انتهت صلاحية رابط التقييم' : 'تم إرسال تقييم هذا الطلب مسبقًا'}</h2>
      <p>${expired ? 'لضمان دقة النتائج، روابط التقييم تكون متاحة لفترة محددة بعد تنفيذ الخدمة.' : 'شكرًا لك. تم تسجيل تقييم هذه الخدمة بالفعل ولا نحتاج منك إرساله مرة ثانية.'}</p>
      <div class="success-context"><span>#${escapeHtml(profile.order)}</span><span>${escapeHtml(profile.service)}</span><span>${escapeHtml(profile.city)}</span></div>
      <a class="btn btn-secondary link-btn" href="index.html">العودة لمركز المحاكاة</a>
    </div>`;
}

els.prev.addEventListener('click', goPrev);
els.next.addEventListener('click', goNext);
els.skip.addEventListener('click', skipOptional);

setProfileUI();

if (profile.status === 'expired' || profile.status === 'used') {
  showLinkState(profile.status);
} else {
  renderStep();
  setupDraftResume();
}
