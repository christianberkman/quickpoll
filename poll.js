let options = getOptions();
const showCounterSetting = getshowCounter();
const vibrateSetting = getVibrate();
const beepSetting = getBeep();

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

  if (!showCounterSetting)
    clone.querySelector(".qp-count").classList.add("d-none");

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
  if (showCounterSetting) button.querySelector(".qp-count").textContent = count;

  options[index].count = count;

  localStorage.setItem("options", JSON.stringify(options));
});

/**
 * Wake Lock
 */
if (getWakeLock()) {
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
      if (getWakeLock()) {
        await requestWakeLock();
      }
    }
  });
}
