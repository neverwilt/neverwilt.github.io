const trialModal = document.querySelector("#trial-modal");
const trialForm = document.querySelector("#trial-form");
const openTrialButtons = document.querySelectorAll("[data-open-trial]");
const closeTrialButtons = document.querySelectorAll("[data-close-trial]");
const formError = document.querySelector("#form-error");
const formStatus = document.querySelector("#form-status");
const emailInput = trialForm?.querySelector('input[name="email"]');
const phoneInput = trialForm?.querySelector('input[name="phone"]');
const firstFormField = trialForm?.querySelector("input, textarea, button");
const FORM_ENDPOINT = "";

let lastFocusedElement = null;

function openTrialModal() {
  if (!trialModal) return;
  lastFocusedElement = document.activeElement;
  trialModal.hidden = false;
  document.body.classList.add("modal-open");
  formError.textContent = "";
  formStatus.textContent = "";
  firstFormField?.focus();
}

function closeTrialModal() {
  if (!trialModal) return;
  trialModal.hidden = true;
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

function hasContactMethod() {
  return Boolean(emailInput?.value.trim() || phoneInput?.value.trim());
}

function clearContactError() {
  if (hasContactMethod()) {
    formError.textContent = "";
    emailInput?.removeAttribute("aria-invalid");
    phoneInput?.removeAttribute("aria-invalid");
  }
}

openTrialButtons.forEach((button) => {
  button.addEventListener("click", openTrialModal);
});

closeTrialButtons.forEach((button) => {
  button.addEventListener("click", closeTrialModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && trialModal && !trialModal.hidden) {
    closeTrialModal();
  }
});

emailInput?.addEventListener("input", clearContactError);
phoneInput?.addEventListener("input", clearContactError);

trialForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  formStatus.textContent = "";

  if (!trialForm.checkValidity()) {
    trialForm.reportValidity();
    return;
  }

  if (!hasContactMethod()) {
    formError.textContent = "Please enter either an email address or phone number.";
    emailInput?.setAttribute("aria-invalid", "true");
    phoneInput?.setAttribute("aria-invalid", "true");
    emailInput?.focus();
    return;
  }

  const formData = new FormData(trialForm);

  if (!FORM_ENDPOINT) {
    formStatus.textContent =
      "Form details are ready. Connect a form service before publishing so trial requests are delivered.";
    return;
  }

  try {
    const response = await fetch(FORM_ENDPOINT, {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    trialForm.reset();
    formStatus.textContent = "Thank you. We will be in touch shortly.";
  } catch (error) {
    formError.textContent =
      "There was a problem sending the request. Please try again or contact Never Wilt directly.";
  }
});
