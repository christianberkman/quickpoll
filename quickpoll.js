/**
 * Storage
 */
function updateOptionsFromInput() {
  console.log("updateOptionsFromInput triggered");

  let options = [];

  const optionInputs = optionsContainer.querySelectorAll(".qp-option-input");

  optionInputs.forEach((optionInput) => {
    let option = {};
    option.label = optionInput.querySelector(".qp-option-label").value;
    option.count = optionInput.querySelector(".qp-option-count").value;

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

/**
 * Question
 */
const questionInput = document.getElementById("questionInput");

if (questionInput) {
  questionInput.value = getQuestion();

  let debounceTimer;
  questionInput.addEventListener("input", function (e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      const question = questionInput.value.trim();
      localStorage.setItem("question", question);
    }, 300);
  });
}

const questionHeading = document.getElementById("questionHeading");

if (questionHeading) {
  const question = getQuestion();
  questionHeading.textContent = question;
}

/**
 * Options
 */
const optionsContainer = document.getElementById("optionsContainer");
if (optionsContainer) {
  const optionTemplate = document.getElementById("optionTemplate");

  // Render Option Inputs
  const options = getOptions();

  options.forEach((option) => {
    appendOptionInput(option);
  });

  appendOptionInput();

  function appendOptionInput(option) {
    const clone = optionTemplate.content.cloneNode(true);

    if (typeof option === "object") {
      if (option.label.trim() !== "")
        clone.querySelector(".qp-option-label").value = option.label;
      clone.querySelector(".qp-option-count").value = option.count;
    }

    optionsContainer.appendChild(clone);
  }

  // Sync options, append empty input
  let debounceTimer;
  optionsContainer.addEventListener("input", function (e) {
    if (!e.target.matches(".qp-option-label")) return;

    // Append empty input
    const optionInputs = optionsContainer.querySelectorAll(".qp-option-label");
    const last = optionInputs[optionInputs.length - 1];

    if (e.target === last && e.target.value.trim() !== "") {
      appendOptionInput();
    }

    // Update storage
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      updateOptionsFromInput();
    }, 300);
  });

  // Save options, remove empty input
  optionsContainer.addEventListener("focusout", function (e) {
    if (!e.target.matches(".qp-option-label")) return;

    const optionInputs = optionsContainer.querySelectorAll(".qp-option-label");
    const last = optionInputs[optionInputs.length - 1];

    if (e.target !== last && e.target.value.trim() === "") {
      e.target.closest(".input-group").remove();
    }

    updateOptionsFromInput();
  });

  // Delete input
  optionsContainer.addEventListener("click", function (e) {
    if (!e.target.closest(".qp-delete-option")) return;

    const toDelete = e.target.closest(".qp-option-input");
    const optionInputs = optionsContainer.querySelectorAll(".qp-option-input");
    const last = optionInputs[optionInputs.length - 1];

    toDelete.remove();

    if (toDelete === last) appendOptionInput();

    updateOptionsFromInput();
  });
}

/**
 * Buttons
 */
const buttonsContainer = document.getElementById("buttonsContainer");
if (buttonsContainer) {
  const buttonTemplate = document.getElementById("buttonTemplate");
  let options = getOptions();
  const beepSetting = getBeep();
  const showCounterSetting = getshowCounter();
  const vibrateSetting = getVibrate();

  options.forEach((option, index) => {
    const clone = buttonTemplate.content.cloneNode(true);

    console.log(option);

    clone.querySelector(".qp-label").textContent = option.label;

    clone.querySelector(".qp-count").textContent = option.count;

    if (!showCounterSetting)
      clone.querySelector(".qp-count").classList.add("d-none");

    clone.querySelector(".qp-button").dataset.index = index;
    clone.querySelector(".qp-button").dataset.count = option.count;

    buttonsContainer.appendChild(clone);
  });

  buttonsContainer.addEventListener("click", function (e) {
    const button = e.target.closest(".qp-button");
    if (!button) return false;

    if (beepSetting) beep();

    if (vibrateSetting && "vibrate") {
      if ("vibrate" in navigator) navigator.vibrate(50);
    }

    // Count up
    let count = Number(button.dataset.count);
    const index = Number(button.dataset.index);

    count++;
    button.dataset.qpCount = count;
    button.dataset.count = count;
    if (showCounterSetting)
      button.querySelector(".qp-count").textContent = count;

    options[index].count = count;

    localStorage.setItem("options", JSON.stringify(options));
  });
}

/**
 * Settings
 */
const beepSwitch = document.getElementById("beepSwitch");
if (beepSwitch) {
  beepSwitch.checked = getBeep();

  beepSwitch.addEventListener("change", function (e) {
    setBeep(beepSwitch.checked);
  });
}

const showCounterSwitch = document.getElementById("showCounterSwitch");
if (showCounterSwitch) {
  showCounterSwitch.checked = getshowCounter();

  showCounterSwitch.addEventListener("change", function (e) {
    setshowCounter(showCounterSwitch.checked);
  });
}

const vibrateSwitch = document.getElementById("vibrateSwitch");
if (vibrateSwitch) {
  vibrateSwitch.checked = getVibrate();

  vibrateSwitch.addEventListener("change", function (e) {
    setVibrate(vibrateSwitch.checked);
  });
}

/**
 * Other
 */

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
