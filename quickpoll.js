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

function setBeepSetting(set) {
  if (set) localStorage.setItem("beep", "true");
  else localStorage.setItem("beep", "false");
}

function getBeepSetting() {
  const beep = localStorage.getItem("beep");

  // default false
  if (beep === null || beep !== "true") return false;
  else return true;
}

function setShowCounterSetting(set) {
  if (set) localStorage.setItem("showCounter", "true");
  else localStorage.setItem("showCounter", "false");
}

function sgtShowCounterSetting() {
  const showCounter = localStorage.getItem("showCounter");

  // default true
  if (showCounter === null || showCounter !== "false") return true;
  else return false;
}

function setWakeLockSetting(set) {
  if (set) localStorage.setItem("wakeLock", "true");
  else localStorage.setItem("wakeLock", "false");
}

function getWakeLockSetting() {
  const wakeLockSetting = localStorage.getItem("wakeLock");

  // default false
  if (wakeLockSetting === null || wakeLockSetting !== "true") return false;
  else return true;
}

function setVibrateSetting(set) {
  if (set) localStorage.setItem("vibrate", "true");
  else localStorage.setItem("vibrate", "false");
}

function getVibrateSetting() {
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

function nextButtonClass(className) {
  const currentIndex = buttonClasses.indexOf(className);
  const nextIndex = (currentIndex + 1) % buttonClasses.length;
  return buttonClasses[nextIndex];
}