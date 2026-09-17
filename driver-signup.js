// ==========================================
// LOUISE TRANSPORT - DRIVER SIGNUP
// Firebase + Firestore
// ==========================================

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firestore
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

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

console.log("Firebase connected successfully!");
console.log("Firestore connected successfully!");

// ==========================================
// DRIVER APPLICATION FORM
// ==========================================

const form = document.querySelector("form");

// Make sure the form exists
if (!form) {
  console.error("Driver application form was not found.");
} else {
  form.addEventListener("submit", async function (event) {
    // Stop the page from refreshing
    event.preventDefault();

    // Get submit button
    const submitButton = form.querySelector(".submit-btn");

    // Change button while submitting
    submitButton.disabled = true;
    submitButton.innerHTML = "Submitting Application...";

    // ==========================================
    // GET FORM VALUES
    // ==========================================

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();

    const vehicleType = document.getElementById("vehicleType").value;
    const vehicleModel = document.getElementById("vehicleModel").value.trim();
    const vehicleYear = document.getElementById("vehicleYear").value;
    const plateNumber = document.getElementById("plateNumber").value.trim();

    const license = document.getElementById("license").value.trim();
    const experience = document.getElementById("experience").value;
    const availability = document.getElementById("availability").value;

    // ==========================================
    // CREATE DRIVER APPLICATION
    // ==========================================

    const driverApplication = {
      // Personal information
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      location: location,

      // Vehicle information
      vehicleType: vehicleType,
      vehicleModel: vehicleModel,
      vehicleYear: Number(vehicleYear),
      plateNumber: plateNumber,

      // Driver information
      license: license,
      experience: experience,
      availability: availability,

      // Application status
      status: "pending",

      // Time application was submitted
      submittedAt: serverTimestamp(),
    };

    // ==========================================
    // SAVE TO FIRESTORE
    // ==========================================

    try {
      const docRef = await addDoc(
        collection(db, "driverApplications"),
        driverApplication,
      );

      console.log("Driver application saved successfully!", docRef.id);

      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================

      submitButton.innerHTML = "Application Submitted ✓";

      submitButton.style.background = "#16a34a";

      alert(
        "Thank you! Your driver application has been submitted successfully.",
      );

      // Clear the form
      form.reset();

      // Restore button
      setTimeout(() => {
        submitButton.disabled = false;

        submitButton.innerHTML = `
                    Submit Driver Application
                    <span>→</span>
                `;

        submitButton.style.background = "";
      }, 2000);
    } catch (error) {
      console.error("Error submitting driver application:", error);

      // Restore button
      submitButton.disabled = false;

      submitButton.innerHTML = `
                Submit Driver Application
                <span>→</span>
            `;

      // Show error
      alert(
        "There was a problem submitting your application. Please try again.",
      );
    }
  });
}
