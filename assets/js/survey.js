const ratingLabels = ['سيئة جدًا', 'غير مرضية', 'مقبولة', 'جيدة جدًا', 'ممتازة'];

const state = {
  overall: 0,
  currentIndex: 0,
  flow: ['overall', 'adaptive', 'final'],
  adaptiveChoices: new Set(),
  details: {},
  nps: null,
  comment: '',
  callback: false
};

const els = {
  card: document.getElementById('surveyCard'),
  stars: document.getElementById('stars'),
  ratingCopy: document.getElementById('ratingCopy'),
  progress: document.getElementById('progress'),
  stepText: document.getElementById('stepText'),
  percent: document.getElementById('percent'),
  adaptiveKicker: document.getElementById('adaptiveKicker'),
  adaptiveTitle: document.getElementById('adaptiveTitle'),
  adaptiveHelp: document.getElementById('adaptiveHelp'),
  adaptiveBanner: document.getElementById('adaptiveBanner'),
  adaptiveIcon: document.getElementById('adaptiveIcon'),
  adaptiveBannerTitle: document.getElementById('adaptiveBannerTitle'),
  adaptiveBannerText: document.getElementById('adaptiveBannerText'),
  adaptiveChoices: document.getElementById('adaptiveChoices'),
  npsGrid: document.getElementById('npsGrid'),
  comment: document.getElementById('comment'),
  count: document.getElementById('count'),
  callbackCard: document.getElementById('callbackCard'),
  callbackRequest: document.getElementById('callbackRequest'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  actionBar: document.getElementById('actionBar'),
  toast: document.getElementById('toast')
};

let autoAdvanceTimer;

function starSvg() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.82 5.72 6.31.92-4.57 4.45 1.08 6.28L12 17.2l-5.64 2.97 1.08-6.28-4.57-4.45 6.31-.92L12 2.8Z"/></svg>';
}

function ratingGroup(score = state.overall) {
  if (score <= 2) return 'low';
  if (score === 3) return 'mid';
  return 'high';
}

function setFlow() {
  state.flow = state.overall >= 4
    ? ['overall', 'adaptive', 'final']
    : ['overall', 'adaptive', 'details', 'final'];
}

function buildStars() {
  for (let score = 1; score <= 5; score += 1) {
    const button = document.createElement('button');
    button.className = 'star';
    button.type = 'button';
    button.innerHTML = starSvg();
    button.setAttribute('aria-label', `${score} نجوم`);
    button.setAttribute('aria-pressed', 'false');

    button.addEventListener('click', () => selectOverall(score));
    els.stars.appendChild(button);
  }
}

function selectOverall(score) {
  clearTimeout(autoAdvanceTimer);

  if (state.overall !== score) {
    state.adaptiveChoices.clear();
    state.details = {};
  }

  state.overall = score;
  setFlow();
  configureAdaptive();

  [...els.stars.children].forEach((star, index) => {
    const active = index < score;
    star.classList.toggle('on', active);
    star.setAttribute('aria-pressed', String(index === score - 1));
  });

  els.ratingCopy.textContent = `${score} من 5 — ${ratingLabels[score - 1]}`;
  els.ratingCopy.style.color = 'var(--brand)';
  updateNextState();

  const selectedScore = score;
  autoAdvanceTimer = setTimeout(() => {
    if (state.overall === selectedScore && state.flow[state.currentIndex] === 'overall') {
      state.currentIndex = 1;
      renderStep(true);
    }
  }, 520);
}

const adaptiveContent = {
  high: {
    kicker: 'خلّنا نعرف وش نجح',
    title: 'وش أكثر شيء أعجبك؟',
    help: 'اختر كل الأشياء اللي حسّنت تجربتك معنا.',
    icon: '💙',
    bannerTitle: 'سعدنا إن تجربتك كانت جميلة.',
    bannerText: 'رأيك يساعدنا نعرف الأشياء اللي لازم نستمر عليها ونكررها.',
    options: ['الالتزام بالموعد', 'احترافية الفريق', 'جودة العمل', 'سرعة الخدمة', 'وضوح التواصل']
  },
  mid: {
    kicker: 'فرصة للتحسين',
    title: 'وش الشيء اللي كان ممكن يخلي تجربتك أفضل؟',
    help: 'اختر النقاط اللي لو تحسنت كان تقييمك أعلى.',
    icon: '✨',
    bannerTitle: 'تجربتك كانت مقبولة، ونقدر نخليها أفضل.',
    bannerText: 'حدد لنا أكثر شيء يحتاج تحسين عشان نعرف وين نركز.',
    options: ['الالتزام بالموعد', 'جودة التنفيذ', 'التواصل', 'وضوح الخطوات', 'سرعة الخدمة', 'تعامل الفريق']
  },
  low: {
    kicker: 'نبي نفهم المشكلة',
    title: 'وش اللي ما كان بالمستوى المطلوب؟',
    help: 'اختر كل الأسباب اللي أثرت على تجربتك.',
    icon: '♡',
    bannerTitle: 'نأسف إن تجربتك ما كانت بالمستوى اللي نطمح له.',
    bannerText: 'ملاحظتك مهمة، وهدفنا نوصل لسبب المشكلة ونمنع تكرارها.',
    options: ['التأخر عن الموعد', 'جودة التنفيذ', 'تعامل الفريق', 'عدم حل المشكلة', 'تلف أو ملاحظة على المنتج', 'عدم وضوح التواصل', 'أخرى']
  }
};

function configureAdaptive() {
  if (!state.overall) return;

  const group = ratingGroup();
  const content = adaptiveContent[group];

  els.adaptiveKicker.textContent = content.kicker;
  els.adaptiveTitle.textContent = content.title;
  els.adaptiveHelp.textContent = content.help;
  els.adaptiveIcon.textContent = content.icon;
  els.adaptiveBannerTitle.textContent = content.bannerTitle;
  els.adaptiveBannerText.textContent = content.bannerText;
  els.adaptiveBanner.className = `adaptive-banner ${group === 'high' ? '' : group}`.trim();
  els.callbackCard.classList.toggle('show', group === 'low');

  els.adaptiveChoices.innerHTML = '';
  content.options.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `choice ${group === 'low' ? 'low' : ''}`.trim();
    button.textContent = label;
    button.setAttribute('aria-pressed', 'false');

    button.addEventListener('click', () => {
      if (state.adaptiveChoices.has(label)) {
        state.adaptiveChoices.delete(label);
        button.classList.remove('on');
        button.setAttribute('aria-pressed', 'false');
      } else {
        state.adaptiveChoices.add(label);
        button.classList.add('on');
        button.setAttribute('aria-pressed', 'true');
      }
      updateNextState();
    });

    els.adaptiveChoices.appendChild(button);
  });
}

const moodOptions = [
  { value: 1, emoji: '😞', label: 'ضعيف' },
  { value: 2, emoji: '😐', label: 'مقبول' },
  { value: 3, emoji: '🙂', label: 'جيد' },
  { value: 4, emoji: '🤩', label: 'ممتاز' }
];

function buildMoodScales() {
  document.querySelectorAll('.mood-scale').forEach((scale) => {
    moodOptions.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mood-option';
      button.innerHTML = `<span>${option.emoji}</span>${option.label}`;
      button.setAttribute('aria-label', `${scale.parentElement.querySelector('h3').textContent}: ${option.label}`);

      button.addEventListener('click', () => {
        state.details[scale.dataset.question] = option.value;
        [...scale.children].forEach((item) => item.classList.remove('on'));
        button.classList.add('on');
        updateNextState();
      });

      scale.appendChild(button);
    });
  });
}

function buildNps() {
  for (let score = 0; score <= 10; score += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nps-button';
    button.textContent = score;
    button.setAttribute('aria-label', `احتمالية التوصية ${score} من 10`);

    button.addEventListener('click', () => {
      state.nps = score;
      [...els.npsGrid.children].forEach((item) => item.classList.remove('on'));
      button.classList.add('on');
      updateNextState();
    });

    els.npsGrid.appendChild(button);
  }
}

function currentPanel() {
  return state.flow[state.currentIndex];
}

function isCurrentValid() {
  switch (currentPanel()) {
    case 'overall':
      return state.overall > 0;
    case 'adaptive':
      return state.adaptiveChoices.size > 0;
    case 'details':
      return ['communication', 'quality', 'punctuality'].every((key) => Boolean(state.details[key]));
    case 'final':
      return state.nps !== null;
    default:
      return false;
  }
}

function updateNextState() {
  els.next.disabled = !isCurrentValid();
}

function renderStep(auto = false) {
  const panelName = currentPanel();

  document.querySelectorAll('.step').forEach((step) => {
    step.classList.toggle('active', step.dataset.panel === panelName);
  });

  const total = state.flow.length;
  const current = state.currentIndex + 1;
  const percent = Math.round((current / total) * 100);

  els.stepText.textContent = `الخطوة ${current} من ${total}`;
  els.percent.textContent = `${percent}%`;
  els.progress.style.width = `${percent}%`;
  els.prev.style.visibility = state.currentIndex === 0 ? 'hidden' : 'visible';
  els.next.textContent = state.currentIndex === total - 1 ? 'إرسال التقييم ✓' : 'التالي ←';

  els.callbackCard.classList.toggle('show', state.overall <= 2 && panelName === 'final');
  updateNextState();

  if (!auto && window.innerWidth < 700) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  window.setTimeout(() => els.toast.classList.remove('show'), 2600);
}

function validationMessage() {
  switch (currentPanel()) {
    case 'overall': return 'اختر عدد النجوم أولًا.';
    case 'adaptive': return 'اختر نقطة واحدة على الأقل للمتابعة.';
    case 'details': return 'جاوب على الأسئلة الثلاثة السريعة للمتابعة.';
    case 'final': return 'اختر درجة التوصية من 0 إلى 10.';
    default: return 'أكمل الإجابة للمتابعة.';
  }
}

function showSuccess() {
  const low = state.overall <= 2;
  const perfect = state.overall === 5;
  const callbackCopy = state.callback
    ? '<p style="margin-top:8px;color:var(--brand);font-weight:600">وسجلنا رغبتك في أن يتم التواصل معك بخصوص هذه التجربة.</p>'
    : '';

  let title = 'شكرًا لك، رأيك وصلنا.';
  let message = 'تم ربط تقييمك بطلب الخدمة، وملاحظتك تساعدنا على تحسين تجربة ما بعد البيع.';

  if (perfect) {
    title = 'سعدنا جدًا إن تجربتك كانت ممتازة 💙';
    message = 'شكرًا لثقتك. تقييمك يساعدنا نحافظ على مستوى الخدمة ونكرره في كل تجربة.';
  } else if (state.overall === 4) {
    title = 'سعدنا بتجربتك معنا 💙';
    message = 'شكرًا لمشاركتنا رأيك. بنستخدم ملاحظتك عشان نخلي التجربة القادمة أفضل.';
  } else if (low) {
    title = 'ملاحظتك وصلت لفريق تجربة العملاء.';
    message = 'نأسف إن التجربة ما كانت بالمستوى المطلوب. تم تسجيل تفاصيل المشكلة وربطها بطلب الخدمة للمتابعة.';
  }

  const shareBox = perfect ? `
    <div class="share-box">
      <b>كانت تجربتك ممتازة؟</b>
      <p>في النسخة التشغيلية نقدر نوصل العميل السعيد مباشرة لصفحة تقييم Google بعد إكمال التقييم الداخلي.</p>
      <button class="btn btn-ghost" id="shareReview" type="button">مشاركة تجربتي ★</button>
    </div>` : '';

  els.card.innerHTML = `
    <div class="success">
      <div class="success-mark ${low ? 'low' : ''}">${low ? '♡' : '✓'}</div>
      <span class="success-badge">تم استلام التقييم بنجاح</span>
      <h2>${title}</h2>
      <p>${message}</p>
      ${callbackCopy}
      <div class="success-context">
        <span>تركيب</span>
        <span>جدة</span>
        <span>#SV-41872</span>
        <span>فاتورة #INV-803214</span>
      </div>
      ${shareBox}
      <div class="success-actions">
        <button class="btn btn-secondary" id="restartSurvey" type="button">عرض النموذج مرة أخرى</button>
        <a class="btn btn-ghost" href="index.html" style="text-decoration:none">مركز المحاكاة</a>
      </div>
    </div>`;

  document.getElementById('restartSurvey').addEventListener('click', () => window.location.reload());

  const shareButton = document.getElementById('shareReview');
  if (shareButton) {
    shareButton.addEventListener('click', () => {
      showToast('هنا يمكن ربط العميل مباشرة بصفحة Google Reviews في النسخة الفعلية.');
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

els.prev.addEventListener('click', () => {
  clearTimeout(autoAdvanceTimer);
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderStep();
  }
});

els.next.addEventListener('click', () => {
  if (!isCurrentValid()) {
    showToast(validationMessage());
    return;
  }

  if (state.currentIndex < state.flow.length - 1) {
    state.currentIndex += 1;
    renderStep();
    return;
  }

  showSuccess();
});

els.comment.addEventListener('input', (event) => {
  state.comment = event.target.value;
  els.count.textContent = event.target.value.length;
});

els.callbackRequest.addEventListener('change', (event) => {
  state.callback = event.target.checked;
});

buildStars();
buildMoodScales();
buildNps();
renderStep();
