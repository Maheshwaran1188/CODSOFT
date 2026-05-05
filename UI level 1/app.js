// ── State ──
let currentScreen = 0;
const totalSteps = 4;
const formData = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', interests: [], otp: '' };
let otpTimer = null;
let otpSeconds = 30;

// ── Screen Navigation ──
function goToScreen(index) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach((s, i) => {
    s.classList.remove('active', 'exit-left');
    if (i < index) s.classList.add('exit-left');
  });
  screens[index].classList.add('active');
  currentScreen = index;
  updateProgress();
  if (index === 4) startOtpTimer();
  if (index === 5) launchConfetti();
}

function goBack() {
  if (currentScreen > 1) goToScreen(currentScreen - 1);
  else if (currentScreen === 1) goToScreen(0);
}

function updateProgress() {
  const stepMap = { 2: 0, 3: 1, 4: 2 };
  document.querySelectorAll('.progress-step').forEach((step, i) => {
    step.classList.remove('completed', 'current');
    const fill = step.querySelector('.fill');
    const activeStep = stepMap[currentScreen];
    if (activeStep === undefined) return;
    if (i < activeStep) { step.classList.add('completed'); fill.style.width = '100%'; }
    else if (i === activeStep) { step.classList.add('current'); }
    else { fill.style.width = '0%'; }
  });
}

// ── Validation ──
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    const span = el.querySelector('span');
    if (span) span.textContent = msg;
    else el.textContent = msg;
    el.classList.add('visible');
  }
  const input = el?.closest('.form-group')?.querySelector('.form-input');
  if (input) input.classList.add('error');
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) {
    const span = el.querySelector('span');
    if (span) span.textContent = '';
    else el.textContent = '';
    el.classList.remove('visible');
  }
  const input = el?.closest('.form-group')?.querySelector('.form-input');
  if (input) input.classList.remove('error');
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(e => {
    const span = e.querySelector('span');
    if (span) span.textContent = '';
    else e.textContent = '';
    e.classList.remove('visible');
  });
  document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
}

// ── Step 1: Sign Up Options → Step 2 ──
function continueWithEmail() { goToScreen(2); }

function continueWithGoogle() {
  simulateLoading(document.querySelector('[onclick="continueWithGoogle()"]'), () => goToScreen(2));
}

function continueWithApple() {
  simulateLoading(document.querySelector('[onclick="continueWithApple()"]'), () => goToScreen(2));
}

// ── Step 2: Name & Email Validation ──
function validateStep2() {
  clearAllErrors();
  let valid = true;
  const fn = document.getElementById('firstName').value.trim();
  const ln = document.getElementById('lastName').value.trim();
  const em = document.getElementById('email').value.trim();

  if (!fn) { showError('err-fn', 'First name is required'); valid = false; }
  if (!ln) { showError('err-ln', 'Last name is required'); valid = false; }
  if (!em) { showError('err-email', 'Email is required'); valid = false; }
  else if (!validateEmail(em)) { showError('err-email', 'Please enter a valid email'); valid = false; }

  if (valid) {
    formData.firstName = fn;
    formData.lastName = ln;
    formData.email = em;
    const btn = document.getElementById('btn-step2');
    simulateLoading(btn, () => goToScreen(3));
  }
}

// ── Step 3: Password Validation ──
function validateStep3() {
  clearAllErrors();
  let valid = true;
  const pw = document.getElementById('password').value;
  const cpw = document.getElementById('confirmPassword').value;

  if (!pw) { showError('err-pw', 'Password is required'); valid = false; }
  else if (pw.length < 8) { showError('err-pw', 'Password must be at least 8 characters'); valid = false; }
  if (!cpw) { showError('err-cpw', 'Please confirm your password'); valid = false; }
  else if (pw !== cpw) { showError('err-cpw', 'Passwords do not match'); valid = false; }

  const terms = document.getElementById('termsCheck');
  if (!terms.checked) { showError('err-terms', 'You must accept the terms'); valid = false; }

  if (valid) {
    formData.password = pw;
    const btn = document.getElementById('btn-step3');
    simulateLoading(btn, () => goToScreen(4));
  }
}

// ── Password Strength ──
function checkPasswordStrength(value) {
  const bars = document.querySelectorAll('.strength-bar');
  const label = document.getElementById('strength-label');
  let strength = 0;

  if (value.length >= 8) strength++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;

  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 'weak', 'medium', 'medium', 'strong'];
  const colors = ['', 'var(--error)', 'var(--warning)', 'var(--warning)', 'var(--success)'];

  bars.forEach((bar, i) => {
    bar.classList.remove('active', 'weak', 'medium', 'strong');
    if (i < strength) { bar.classList.add('active', classes[strength]); }
  });

  if (label) {
    label.textContent = value ? levels[strength] || '' : '';
    label.style.color = colors[strength] || 'var(--text-muted)';
  }
}

// ── Password Toggle ──
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const btn = input.closest('.input-wrapper').querySelector('.toggle-password');
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
  }
}

// ── OTP ──
function handleOtpInput(el, index) {
  const value = el.value.replace(/\D/g, '');
  el.value = value.slice(-1);
  if (value && index < 5) {
    const next = document.querySelectorAll('.otp-input')[index + 1];
    if (next) next.focus();
  }
  el.classList.toggle('filled', !!el.value);
  checkOtpComplete();
}

function handleOtpKeydown(e, index) {
  if (e.key === 'Backspace' && !e.target.value && index > 0) {
    const prev = document.querySelectorAll('.otp-input')[index - 1];
    if (prev) { prev.focus(); prev.value = ''; prev.classList.remove('filled'); }
  }
}

function handleOtpPaste(e) {
  e.preventDefault();
  const data = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
  const inputs = document.querySelectorAll('.otp-input');
  data.split('').forEach((char, i) => {
    if (inputs[i]) { inputs[i].value = char; inputs[i].classList.add('filled'); }
  });
  if (data.length > 0) inputs[Math.min(data.length, 5)].focus();
  checkOtpComplete();
}

function checkOtpComplete() {
  const inputs = document.querySelectorAll('.otp-input');
  const otp = Array.from(inputs).map(i => i.value).join('');
  const btn = document.getElementById('btn-verify');
  btn.disabled = otp.length < 6;
}

function startOtpTimer() {
  otpSeconds = 30;
  const timerEl = document.getElementById('otp-timer');
  if (otpTimer) clearInterval(otpTimer);
  timerEl.innerHTML = `Resend code in <strong>${otpSeconds}s</strong>`;
  otpTimer = setInterval(() => {
    otpSeconds--;
    if (otpSeconds <= 0) {
      clearInterval(otpTimer);
      timerEl.innerHTML = `Didn't receive code? <a onclick="resendOtp()">Resend</a>`;
    } else {
      timerEl.innerHTML = `Resend code in <strong>${otpSeconds}s</strong>`;
    }
  }, 1000);
}

function resendOtp() {
  document.querySelectorAll('.otp-input').forEach(i => { i.value = ''; i.classList.remove('filled'); });
  startOtpTimer();
}

function verifyOtp() {
  const btn = document.getElementById('btn-verify');
  simulateLoading(btn, () => goToScreen(5));
}

// ── Interests ──
function toggleInterest(el) {
  el.classList.toggle('selected');
  const tag = el.dataset.tag;
  if (el.classList.contains('selected')) {
    formData.interests.push(tag);
  } else {
    formData.interests = formData.interests.filter(t => t !== tag);
  }
  // Update personalization count
  const cnt = document.querySelectorAll('.interest-tag.selected').length;
  const btn = document.getElementById('btn-interests');
  btn.disabled = cnt < 3;
  const counter = document.getElementById('interest-count');
  if (counter) counter.textContent = `${cnt} selected`;
}

// ── Helpers ──
function simulateLoading(btn, callback) {
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    callback();
  }, 1200);
}

// ── Confetti ──
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#6C5CE7', '#A29BFE', '#00CEC9', '#ec4899', '#FDCB6E', '#FF6B6B', '#81ECEC', '#a855f7'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.width = (6 + Math.random() * 6) + 'px';
    piece.style.height = (6 + Math.random() * 6) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  goToScreen(0);

  // Live validation listeners
  document.getElementById('firstName')?.addEventListener('input', () => clearError('err-fn'));
  document.getElementById('lastName')?.addEventListener('input', () => clearError('err-ln'));
  document.getElementById('email')?.addEventListener('input', () => clearError('err-email'));
  document.getElementById('password')?.addEventListener('input', function() {
    clearError('err-pw');
    checkPasswordStrength(this.value);
  });
  document.getElementById('confirmPassword')?.addEventListener('input', () => clearError('err-cpw'));
});
