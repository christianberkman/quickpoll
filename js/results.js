/**
 * Render Results
 */
const resultsContainer = document.getElementById("resultsContainer");
const options = getOptions();
const total = getTotalCount();
const resultTemplate = document.getElementById("resultTemplate");

// Render results
options.forEach((option, index) => {
  const clone = resultTemplate.content.cloneNode(true);

  clone.querySelector(".qp-result").dataset.label = option.label;
  clone.querySelector(".qp-result").dataset.count = option.count;
  clone.querySelector(".qp-label").textContent = option.label;
  clone.querySelector(".qp-count").textContent = option.count;

  resultsContainer.appendChild(clone);
});

/**
 * Sort by label (A-Z)
 */
document
  .getElementById("sortByLabelLink")
  .addEventListener("click", function (e) {
    const resultDivs = Array.from(
      resultsContainer.querySelectorAll(".qp-result"),
    );

    resultDivs.sort((a, b) => {
      let valA, valB;

      valA = (a.dataset.label || "").toLowerCase();
      valB = (b.dataset.label || "").toLowerCase();

      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });

    resultDivs.forEach((div) => resultsContainer.appendChild(div));
  });

/**
 * Sort by count (0-9)
 */
document
  .getElementById("sortByCountLink")
  .addEventListener("click", function (e) {
    const resultDivs = Array.from(
      resultsContainer.querySelectorAll(".qp-result"),
    );

    resultDivs.sort((a, b) => {
      let valA, valB;

      valA = Number(a.dataset.count) || 0;
      valB = Number(b.dataset.count) || 0;
      if (valA < valB) return 1;
      if (valA > valB) return -1;
      return 0;
    });

    resultDivs.forEach((div) => resultsContainer.appendChild(div));
  });

/**
 * Copy to clipboard
 */
document
  .getElementById("copyResultsLink")
  .addEventListener("click", function (e) {
    let text = getQuestion() + "\n";

    resultDivs = resultsContainer.querySelectorAll(".qp-result");

    resultDivs.forEach((div) => {
      text += `${div.dataset.label}: ${div.dataset.count}\n`;
    });

    text += `Total answers: ${total}\n`;

    navigator.clipboard
      .writeText(text)
      .then(() => console.log("Copied!"))
      .catch((err) => console.error("Failed to copy:", err));
  });
