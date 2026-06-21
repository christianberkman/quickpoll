/**
 * Beep
 */
const beepSwitch = document.getElementById("beepSwitch");
beepSwitch.checked = getBeep();

beepSwitch.addEventListener("change", function (e) {
  setBeep(beepSwitch.checked);
});

/**
 * Show Counter
 */
const showCounterSwitch = document.getElementById("showCounterSwitch");
showCounterSwitch.checked = getshowCounter();

showCounterSwitch.addEventListener("change", function (e) {
  setshowCounter(showCounterSwitch.checked);
});

/**
 * Wake Lock
 */
const wakeLockSwitch = document.getElementById("wakeLockSwitch");
wakeLockSwitch.checked = getWakeLock();

wakeLockSwitch.addEventListener("change", function (e) {
  setWakeLock(wakeLockSwitch.checked);
});

/**
 * Vibrate
 */
const vibrateSwitch = document.getElementById("vibrateSwitch");
if (!("vibrate" in navigator)) {
  document.getElementById("vibrateSwitchContainer").remove();
}

vibrateSwitch.checked = getVibrate();

vibrateSwitch.addEventListener("change", function (e) {
  setVibrate(vibrateSwitch.checked);
});

/**
 * Reset everything
 */
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function (e) {
  const areYouSure = window.confirm(
    "Are you sure you want to reset everything? Options and results will be lost. This cannot be undone.",
  );

  if (!areYouSure) return;

  emptyStorage();
  window.location.href = "index.html";
});
