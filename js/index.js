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

      clone.querySelector(".qp-button-class").dataset.buttonClass =
        option.buttonClass ?? buttonClasses[0];
      clone
        .querySelector(".qp-button-class")
        .classList.add(option.buttonClass ?? buttonClasses[0]);
    } else {
      clone.querySelector(".qp-button-class").dataset.buttonClass =
        buttonClasses[0];
      clone.querySelector(".qp-button-class").classList.add(buttonClasses[0]);
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
      updateOptionsFromInputs();
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

    updateOptionsFromInputs();
  });

  // Button Class
  optionsContainer.addEventListener("click", function (e) {
    const toggleButton = e.target.closest(".qp-button-class");
    if (!toggleButton) return;

    const currentClass = toggleButton.dataset.buttonClass;
    const newClass = nextButtonClass(currentClass);

    toggleButton.classList.remove(currentClass);
    toggleButton.classList.add(newClass);
    toggleButton.dataset.buttonClass = newClass;

    updateOptionsFromInputs();
  });

  // Delete input
  optionsContainer.addEventListener("click", function (e) {
    if (!e.target.closest(".qp-delete-option")) return;

    const toDelete = e.target.closest(".qp-option-input");
    const optionInputs = optionsContainer.querySelectorAll(".qp-option-input");
    const last = optionInputs[optionInputs.length - 1];

    toDelete.remove();

    if (toDelete === last) appendOptionInput();

    updateOptionsFromInputs();
  });
}
