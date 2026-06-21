/**
 * Declarations
 */
const buttonClasses = [
  "btn-primary",
  "btn-success",
  "btn-danger",
  "btn-warning",
  "btn-info",
  "btn-secondary",
];

const storageKeys = ["question", "options", "showCounter", "beep", "vibrate"];

/**
 * Storage
 */
function updateOptionsFromInputs() {
  let options = [];

  const optionInputs = optionsContainer.querySelectorAll(".qp-option-input");

  optionInputs.forEach((optionInput) => {
    let option = {};
    option.label = optionInput.querySelector(".qp-option-label").value;
    option.count = optionInput.querySelector(".qp-option-count").value;
    option.buttonClass =
      optionInput.querySelector(".qp-button-class").dataset.buttonClass;

    if (option.label.trim() !== "") options.push(option);
  });

  localStorage.setItem("options", JSON.stringify(options));
}

function getOptions() {
  try {
    const storage = localStorage.getItem("options");
    console.log("Storage: " + storage);
    return JSON.parse(storage) || [];
  } catch (e) {
    return [];
  }
}

function getQuestion() {
  let question = localStorage.getItem("question");

  if (question === null) return "";
  return question;
}

function setBeep(set) {
  if (set) localStorage.setItem("beep", "true");
  else localStorage.setItem("beep", "false");
}

function getBeep() {
  const beep = localStorage.getItem("beep");

  // default false
  if (beep === null || beep !== "true") return false;
  else return true;
}

function setshowCounter(set) {
  if (set) localStorage.setItem("showCounter", "true");
  else localStorage.setItem("showCounter", "false");
}

function getshowCounter() {
  const showCounter = localStorage.getItem("showCounter");

  // default true
  if (showCounter === null || showCounter !== "false") return true;
  else return false;
}

function setWakeLock(set) {
  if (set) localStorage.setItem("wakeLock", "true");
  else localStorage.setItem("wakeLock", "false");
}

function getWakeLock() {
  const wakeLockSetting = localStorage.getItem("wakeLock");

  // default false
  if (wakeLockSetting === null || wakeLockSetting !== "true") return false;
  else return true;
}

function setVibrate(set) {
  if (set) localStorage.setItem("vibrate", "true");
  else localStorage.setItem("vibrate", "false");
}

function getVibrate() {
  const vibrate = localStorage.getItem("vibrate");

  // default true
  if (vibrate === null || vibrate !== "false") return true;
  return false;
}

function getTotal() {
  let total = 0;
  getOptions().forEach((option) => {
    total += Number(option.count);
  });

  return total;
}

function emptyStorage() {
  storageKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Rendering
 */
const questionText = document.querySelector(".qp-question-text");
if (questionText) {
  questionText.textContent = getQuestion();
}

const totalCount = document.querySelector(".qp-total-count");
if (totalCount) {
  totalCount.textContent = "Total count: " + getTotal();
}

/**
 * Other
 */

function nextButtonClass(className) {
  const currentIndex = buttonClasses.indexOf(className);
  const nextIndex = (currentIndex + 1) % buttonClasses.length;
  return buttonClasses[nextIndex];
}

// Beep
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Chrome can suspend the context (e.g. after inactivity or before user gesture)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

const beepFreqs = [2000, 3000];
let beepIndex = 0;

function beep() {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "square";
  oscillator.frequency.value = beepFreqs[beepIndex];
  beepIndex = (beepIndex + 1) % beepFreqs.length;

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.2);
}
