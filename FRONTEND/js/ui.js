// ui.js
const modalContainer = document.querySelector(".modal-overlay");
const modalContent = document.querySelector("#modal-form-container");
const modalCloseButton = document.querySelector(".modal-close");
const tooltip = document.querySelector(".tooltip");

function showModal(form) {
  //Shows the modal with the provided form
  modalContent.innerHTML = "";
  modalContent.appendChild(form);
  modalContainer.classList.add("active");
}

function hideModal() {
  //Hides the modal
  modalContainer.classList.remove("active");
}
function handleCloseModal() {
  // Closes modal from close button click
  hideModal();
}
function showTooltip(element, message) {
  //Shows a tooltip with a given message
  tooltip.textContent = message;
  const rect = element.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
  tooltip.setAttribute("aria-hidden", "false"); // Make the tooltip visible for screen readers
  tooltip.classList.add("visible");
}

function hideTooltip() {
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.classList.remove("visible");
}
export { showModal, hideModal, handleCloseModal, showTooltip, hideTooltip };
