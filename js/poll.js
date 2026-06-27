let options = getOptions();
const showCounterSetting = sgtShowCounterSetting();
const vibrateSetting = getVibrateSetting();
const beepSetting = getBeepSetting();
const totalCountText = document.querySelector(".qp-total-count");

/**
 * Poll Buttons
 */
const buttonsContainer = document.getElementById("buttonsContainer");
const buttonTemplate = document.getElementById("buttonTemplate");

// Render buttons
options.forEach((option, index) => {
  const clone = buttonTemplate.content.cloneNode(true);

  clone.querySelector(".qp-label").textContent = option.label;
  clone.querySelector(".qp-count").textContent = option.count;

  if (!showCounterSetting) {
    clone.querySelector(".qp-count").classList.add("d-none");
  }

  clone.querySelector(".qp-button").classList.add(option.buttonClass);
  clone.querySelector(".qp-button").dataset.index = index;
  clone.querySelector(".qp-button").dataset.count = option.count;

  buttonsContainer.appendChild(clone);
});

// Button click
buttonsContainer.addEventListener("click", function (e) {
  const button = e.target.closest(".qp-button");
  if (!button) return false;

  if (beepSetting) beep();

  if (vibrateSetting && "vibrate") {
    if ("vibrate" in navigator) navigator.vibrate(50);
  }

  let count = Number(button.dataset.count);
  const index = Number(button.dataset.index);

  count++;
  button.dataset.qpCount = count;
  button.dataset.count = count;

  
  options[index].count = count;
  
  localStorage.setItem("options", JSON.stringify(options));
 
  if (showCounterSetting) {
    button.querySelector(".qp-count").textContent = count;
    totalCountText.textContent = getTotalCount();
  }
});

/**
 * Total Count
 */
if (showCounterSetting) {
  totalCountText.textContent = getTotalCount();
} else {
  document.getElementById("totalCountContainer").remove();
}

/**
 * Wake Lock
 */
if (getWakeLockSetting()) {
  let wakeLock = null;

  async function requestWakeLock() {
    if (!("wakeLock" in navigator)) {
      return false;
    }

    try {
      wakeLock = await navigator.wakeLock.request("screen");
      return true;
    } catch (err) {
      console.error(`Wake Lock error: ${err.name}, ${err.message}`);
      return false;
    }
  }

  async function releaseWakeLock() {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  }

  requestWakeLock();

  document.addEventListener("visibilitychange", async () => {
    if (wakeLock !== null && document.visibilityState === "visible") {
      if (getWakeLockSetting()) {
        await requestWa;
        keLock();
      }
    }
  });
}

/**
 * Beep
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

/**
 * Full Screen
 */
const fullScreenContainer = document.getElementById("fullScreenContainer");
const fullScreenHideEelements = document.querySelectorAll(
  ".qp-fullscreen-hide",
);
document
  .getElementById("fullScreenLink")
  .addEventListener("click", async function () {
    // Request Full Screen
    try {
      await fullScreenContainer.requestFullscreen();

      fullScreenHideEelements.forEach((element) => {
        element.classList.add("d-none");
      });
    } catch (err) {
      console.error(
        `Error attempting to toggle full-screen mode: ${err.message}`,
      );
    }

    // Close Full Screen
    document.addEventListener("fullscreenchange", function () {
      if (!document.fullscreenElement) {
        fullScreenHideEelements.forEach((element) => {
          element.classList.remove("d-none");
        });
      }
    });
  });
