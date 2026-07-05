const options = getOptions();

/**
 * Render Adjust Controls
 */
const adjustContainer = document.getElementById("adjustContainer");
const adjustTemplate = document.getElementById("adjustTemplate");
const totalCountText = document.querySelector(".qp-total-count");

function renderAdjusts() {
  options.forEach((option, index) => {
    const clone = adjustTemplate.content.cloneNode(true);

    clone.querySelector(".qp-option-label").textContent = option.label;
    clone.querySelector(".qp-count").value = option.count;
    clone.querySelector(".qp-count").dataset.qpIndex = index;

    adjustContainer.appendChild(clone);
  });
}
renderAdjusts();

/**
 * Decrease button
 */
adjustContainer.addEventListener("click", function (e) {
  const button = e.target.closest(".qp-button-decrease");
  if (!button) return;

  const countInput = button.closest(".input-group").querySelector(".qp-count");
  const index = Number(countInput.dataset.qpIndex);
  if (countInput.value > 0) countInput.value--;

  options[index].count = Number(countInput.value);
  setOptions(options);
  totalCountText.textContent = getTotalCount();
});

/**
 * Increase button
 */
adjustContainer.addEventListener("click", function (e) {
  const button = e.target.closest(".qp-button-increase");
  if (!button) return;

  const countInput = button.closest(".input-group").querySelector(".qp-count");
  const index = Number(countInput.dataset.qpIndex);
  countInput.value++;

  options[index].count = Number(countInput.value);
  setOptions(options);
  totalCountText.textContent = getTotalCount();
});
