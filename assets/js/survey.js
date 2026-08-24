const ratingLabels = ['سيئة جدًا', 'غير مرضية', 'مقبولة', 'جيدة', 'ممتازة'];
const scaleLabels = ['سيئ جدًا', 'سيئ', 'محايد', 'جيد', 'ممتاز'];

const state = {
  step: 1,
  overall: 0,
  scales: {},
  reason: ''
};

const starWrap = document.getElementById('stars');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

function starSvg() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.82 5.72 6.31.92-4.57 4.45 1.08 6.28L12 17.2l-5.64 2.97 1.08-6.28-4.57-4.45 6.31-.92L12 2.8Z"/></svg>';
}

function buildStars() {
  for (let i = 1; i <= 5; i += 1) {
    const button = document.createElement('button');
    button.className = 'star';
    button.type = 'button';
    button.innerHTML = starSvg();
    button.setAttribute('aria-label', `${i} نجوم`);

    button.addEventListener('click', () => {
      state.overall = i;
      [...starWrap.children].forEach((star, index) => {
        star.classList.toggle('on', index < i);
      });

      const ratingCopy = document.getElementById('ratingCopy');
      ratingCopy.textContent = `${i} من 5 — ${ratingLabels[i - 1]}`;
      ratingCopy.style.color = 'var(--b)';
      document.getElementById('reason').classList.toggle('show', i <= 2);
    });

    starWrap.appendChild(button);
  }
}

function buildScales() {
  document.querySelectorAll('.scale').forEach((scale) => {
    for (let i = 1; i <= 5; i += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<span>${i}</span>${scaleLabels[i - 1]}`;

      button.addEventListener('click', () => {
        state.scales[scale.dataset.q] = i;
        [...scale.children].forEach((option, index) => {
          option.classList.toggle('on', index === i - 1);
        });
      });

      scale.appendChild(button);
    }
  });
}

function bindReasons() {
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach((item) => item.classList.remove('on'));
      chip.classList.add('on');
      state.reason = chip.textContent.trim();
    });
  });
}

function renderStep() {
  document.querySelectorAll('.step').forEach((step) => {
    step.classList.toggle('active', Number(step.dataset.step) === state.step);
  });

  document.getElementById('stepText').textContent = `الخطوة ${state.step} من 3`;
  document.getElementById('percent').textContent = `${Math.round((state.step / 3) * 100)}%`;
  document.getElementById('progress').style.width = `${(state.step / 3) * 100}%`;

  prevButton.style.visibility = state.step === 1 ? 'hidden' : 'visible';
  nextButton.textContent = state.step === 3 ? 'إرسال التقييم ✓' : 'التالي ←';
}

function showSuccess() {
  const surveyCard = document.getElementById('surveyCard');
  surveyCard.innerHTML = `
    <div class="success">
      <div class="success-icon">✓</div>
      <span class="pill good">تم الاستلام بنجاح</span>
      <h2>شكرًا لك.</h2>
      <p>وصلنا تقييمك وتم ربطه بطلب الخدمة <b>SV-41872</b>. ملاحظتك تساعدنا على تحسين تجربة ما بعد البيع.</p>
      <button class="btn secondary" id="restartSurvey" type="button" style="margin-top:22px">عرض النموذج مرة أخرى</button>
    </div>`;

  document.getElementById('restartSurvey').addEventListener('click', () => window.location.reload());
}

prevButton.addEventListener('click', () => {
  if (state.step > 1) {
    state.step -= 1;
    renderStep();
  }
});

nextButton.addEventListener('click', () => {
  if (state.step === 1 && !state.overall) {
    document.getElementById('ratingCopy').textContent = 'اختر عدد النجوم أولًا';
    return;
  }

  if (state.step === 2 && Object.keys(state.scales).length < 3) {
    window.alert('فضلاً قيّم الأسئلة الثلاثة للمتابعة');
    return;
  }

  if (state.step < 3) {
    state.step += 1;
    renderStep();
    return;
  }

  showSuccess();
});

document.getElementById('comment').addEventListener('input', (event) => {
  document.getElementById('count').textContent = event.target.value.length;
});

buildStars();
buildScales();
bindReasons();
renderStep();
