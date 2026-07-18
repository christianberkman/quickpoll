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
      toggleStartPollButton();
    }, 300);
  });
}

// Toggle Get Started
const startPollButton = document.getElementById("startPollButton");
function toggleStartPollButton() {
  if (getQuestion().length >= 1) startPollButton.classList.remove("disabled");
  else startPollButton.classList.add("disabled");
}
toggleStartPollButton();
