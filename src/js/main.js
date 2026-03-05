document.addEventListener("DOMContentLoaded", () => {
  const distributorForm = document.getElementById("distributorForm");
  if (distributorForm) {
    distributorForm.addEventListener("submit", handleDistributorSubmit);
  }
});

async function handleDistributorSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector(".form-submit");
  const originalText = submitBtn.textContent;

  const companyName = document.getElementById("companyName").value.trim();
  const region = document.getElementById("region").value;
  const phoneNumber = document.getElementById("phoneNumber").value.trim();

  if (!companyName || !region || region === "Select Region" || !phoneNumber) {
    showFormMessage(form, "Please fill in all fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const response = await fetch("/.netlify/functions/submit-distributor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, region, phoneNumber }),
    });

    const result = await response.json();

    if (response.ok) {
      showFormMessage(form, "Application submitted successfully! We will contact you soon.", "success");
      form.reset();
    } else {
      showFormMessage(form, result.error || "Something went wrong. Please try again.", "error");
    }
  } catch (error) {
    showFormMessage(form, "Network error. Please check your connection and try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function showFormMessage(form, message, type) {
  let msgEl = form.querySelector(".form-message");
  if (!msgEl) {
    msgEl = document.createElement("p");
    msgEl.className = "form-message";
    form.appendChild(msgEl);
  }

  msgEl.textContent = message;
  msgEl.style.marginTop = "12px";
  msgEl.style.padding = "10px";
  msgEl.style.borderRadius = "6px";
  msgEl.style.fontSize = "14px";

  if (type === "success") {
    msgEl.style.background = "#e8f5e9";
    msgEl.style.color = "#2e7d32";
  } else {
    msgEl.style.background = "#ffebee";
    msgEl.style.color = "#c62828";
  }

  setTimeout(() => {
    msgEl.remove();
  }, 5000);
}
