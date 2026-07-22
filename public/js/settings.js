/**
 * Beep
 */
const beepSwitch = document.getElementById("beepSwitch");
beepSwitch.checked = getBeepSetting();

beepSwitch.addEventListener("change", function (e) {
  setBeepSetting(beepSwitch.checked);
});

/**
 * Show Counter
 */
const showCounterSwitch = document.getElementById("showCounterSwitch");
showCounterSwitch.checked = sgtShowCounterSetting();

showCounterSwitch.addEventListener("change", function (e) {
  setShowCounterSetting(showCounterSwitch.checked);
});

/**
 * Wake Lock
 */
const wakeLockSwitch = document.getElementById("wakeLockSwitch");
wakeLockSwitch.checked = getWakeLockSetting();

wakeLockSwitch.addEventListener("change", function (e) {
  setWakeLockSetting(wakeLockSwitch.checked);
});

/**
 * Vibrate
 */
const vibrateSwitch = document.getElementById("vibrateSwitch");
if (!("vibrate" in navigator)) {
  document.getElementById("vibrateSwitchContainer").remove();
}

vibrateSwitch.checked = getVibrateSetting();

vibrateSwitch.addEventListener("change", function (e) {
  setVibrateSetting(vibrateSwitch.checked);
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
  window.location.href = "/question.html";
});
