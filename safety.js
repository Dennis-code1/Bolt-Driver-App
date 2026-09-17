// LOUISE TRANSPORT - SAFETY PAGE
// FIREBASE + JAVASCRIPT
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyC8kJ0q0TNa-LwtpkUawdhQ1RxkBsdCeEI",
  authDomain: "louise-transport-668ba.firebaseapp.com",
  projectId: "louise-transport-668ba",
  storageBucket: "louise-transport-668ba.firebasestorage.app",
  messagingSenderId: "1017349797885",
  appId: "1:1017349797885:web:2df6d87175e9b7acb68b94",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// ==========================================
// PAGE LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupFAQ();
  setupShareTrip();
  setupSafetyReport();
  setupSmoothScrolling();
});

// ==========================================
// MOBILE MENU
// ==========================================

function setupMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.querySelector(".nav");

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("show");

    if (nav.classList.contains("show")) {
      menuBtn.textContent = "✕";
    } else {
      menuBtn.textContent = "☰";
    }
  });

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

function setupFAQ() {
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
}

// ==========================================
// SHARE TRIP
// ==========================================

function setupShareTrip() {
  const shareTripBtn = document.getElementById("shareTripBtn");

  if (!shareTripBtn) return;

  shareTripBtn.addEventListener("click", async () => {
    const shareData = {
      title: "Louise Transport",
      text: "I'm using Louise Transport. Check my trip information.",
      url: window.location.href,
    };

    // Mobile / supported browsers
    if (navigator.share) {
      try {
        await navigator.share(shareData);

        showTemporaryButtonMessage(shareTripBtn, "Trip Shared!", "Share Trip");
      } catch (error) {
        console.log("Share cancelled.");
      }

      return;
    }

    // Fallback for browsers without Web Share API
    try {
      await navigator.clipboard.writeText(window.location.href);

      showTemporaryButtonMessage(shareTripBtn, "Link Copied!", "Share Trip");
    } catch (error) {
      alert("Unable to copy the link. Please copy it manually.");
    }
  });
}

// ==========================================
// SAFETY REPORT
// ==========================================

function setupSafetyReport() {
  const form = document.getElementById("safetyReportForm");

  const statusMessage = document.getElementById("reportMessageStatus");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const reportName = document.getElementById("reportName");

    const reportContact = document.getElementById("reportContact");

    const rideId = document.getElementById("rideId");

    const issueType = document.getElementById("issueType");

    const reportMessage = document.getElementById("reportMessage");

    // ==========================================
    // VALIDATION
    // ==========================================

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

    // ==========================================
    // DISABLE BUTTON
    // ==========================================

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    // ==========================================
    // CREATE SAFETY REPORT
    // ==========================================

    const safetyReport = {
      name: reportName.value.trim(),

      contact: reportContact.value.trim(),

      rideId: rideId ? rideId.value.trim() : "",

      issueType: issueType.value,

      message: reportMessage.value.trim(),

      status: "new",

      submittedAt: serverTimestamp(),
    };

    try {
      // ==========================================
      // SAVE TO FIRESTORE
      // ==========================================

      await addDoc(collection(db, "safetyReports"), safetyReport);

      // ==========================================
      // SUCCESS
      // ==========================================

      showReportMessage(
        "Your safety report has been submitted successfully. Thank you for reporting this issue.",
        "success",
      );

      // Clear form
      form.reset();
    } catch (error) {
      console.error("Error submitting safety report:", error);

      showReportMessage(
        "Unable to submit your report right now. Please try again.",
        "error",
      );
    }

    // ==========================================
    // ENABLE BUTTON
    // ==========================================

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Report";
    }
  });
}

// ==========================================
// SHOW REPORT MESSAGE
// ==========================================

function showReportMessage(message, type) {
  const statusMessage = document.getElementById("reportMessageStatus");

  if (!statusMessage) return;

  statusMessage.textContent = message;

  statusMessage.className = "report-message " + type;

  setTimeout(() => {
    statusMessage.textContent = "";
    statusMessage.className = "report-message";
  }, 6000);
}

// ==========================================
// TEMPORARY BUTTON MESSAGE
// ==========================================

function showTemporaryButtonMessage(button, temporaryText, originalText) {
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

function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

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
}
