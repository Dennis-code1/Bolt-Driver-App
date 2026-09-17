// ==========================================
// LOUISE TRANSPORT - SAFETY PAGE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // MOBILE MENU
  // ==========================================

  const menuBtn = document.getElementById("menuBtn");
  const nav = document.querySelector(".nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("show");

      // Change menu icon
      if (nav.classList.contains("show")) {
        menuBtn.textContent = "✕";
      } else {
        menuBtn.textContent = "☰";
      }
    });

    // Close menu after clicking a navigation link
    const navLinks = nav.querySelectorAll("a");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("show");
        menuBtn.textContent = "☰";
      });
    });
  }

  // ==========================================
  // FAQ ACCORDION
  // ==========================================

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all FAQ items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");

        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherIcon = otherItem.querySelector(".faq-icon");

        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }

        if (otherIcon) {
          otherIcon.textContent = "+";
        }
      });

      // Open selected FAQ
      if (!isOpen) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";

        if (icon) {
          icon.textContent = "−";
        }
      }
    });
  });

  // ==========================================
  // SHARE TRIP
  // ==========================================

  const shareTripBtn = document.getElementById("shareTripBtn");

  if (shareTripBtn) {
    shareTripBtn.addEventListener("click", async () => {
      const shareData = {
        title: "Louise Transport",
        text: "I'm using Louise Transport. You can use this link to check my trip information.",
        url: window.location.href,
      };

      // Use phone's native share menu when available
      if (navigator.share) {
        try {
          await navigator.share(shareData);

          showTemporaryMessage(shareTripBtn, "Trip shared!", "Share Trip");
        } catch (error) {
          // User cancelled sharing
          console.log("Share cancelled.");
        }
      } else {
        // Fallback: copy link to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);

          showTemporaryMessage(shareTripBtn, "Link copied!", "Share Trip");
        } catch (error) {
          alert("Please copy the page link manually.");
        }
      }
    });
  }

  // ==========================================
  // SAFETY REPORT FORM
  // ==========================================

  const safetyReportForm = document.getElementById("safetyReportForm");
  const reportMessageStatus = document.getElementById("reportMessageStatus");

  if (safetyReportForm) {
    safetyReportForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const reportName = document.getElementById("reportName");
      const reportContact = document.getElementById("reportContact");
      const rideId = document.getElementById("rideId");
      const issueType = document.getElementById("issueType");
      const reportMessage = document.getElementById("reportMessage");

      // Check required fields
      if (!reportName || !reportContact || !issueType || !reportMessage) {
        return;
      }

      if (
        reportName.value.trim() === "" ||
        reportContact.value.trim() === "" ||
        issueType.value === "" ||
        reportMessage.value.trim() === ""
      ) {
        showReportMessage("Please complete all required fields.", "error");
        return;
      }

      // Create report object
      const safetyReport = {
        name: reportName.value.trim(),
        contact: reportContact.value.trim(),
        rideId: rideId ? rideId.value.trim() : "",
        issueType: issueType.value,
        message: reportMessage.value.trim(),
        submittedAt: new Date().toISOString(),
      };

      // Save report temporarily in browser
      const existingReports =
        JSON.parse(localStorage.getItem("louiseSafetyReports")) || [];

      existingReports.push(safetyReport);

      localStorage.setItem(
        "louiseSafetyReports",
        JSON.stringify(existingReports),
      );

      // Show success message
      showReportMessage(
        "Thank you. Your safety report has been submitted successfully.",
        "success",
      );

      // Clear form
      safetyReportForm.reset();
    });
  }

  // ==========================================
  // REPORT MESSAGE FUNCTION
  // ==========================================

  function showReportMessage(message, type) {
    if (!reportMessageStatus) return;

    reportMessageStatus.textContent = message;

    reportMessageStatus.className = "report-message " + type;

    // Remove message after a few seconds
    setTimeout(() => {
      reportMessageStatus.textContent = "";
      reportMessageStatus.className = "report-message";
    }, 5000);
  }

  // ==========================================
  // TEMPORARY BUTTON MESSAGE
  // ==========================================

  function showTemporaryMessage(button, temporaryText, originalText) {
    button.textContent = temporaryText;
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  }

  // ==========================================
  // SMOOTH SCROLLING
  // ==========================================

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ==========================================
  // EMERGENCY BUTTON
  // ==========================================

  const emergencyButtons = document.querySelectorAll('a[href="tel:112"]');

  emergencyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Emergency call button selected.");
    });
  });
});
