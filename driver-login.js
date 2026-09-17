// ==========================================
// LOUISE TRANSPORT - DRIVER LOGIN
// Firebase Authentication
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

console.log("Firebase Authentication connected successfully!");

// ==========================================
// GET ELEMENTS
// ==========================================

const form = document.getElementById("driverLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const forgotPassword = document.getElementById("forgotPassword");

// ==========================================
// MESSAGE FUNCTION
// ==========================================

function showMessage(message, type = "error") {
  loginMessage.textContent = message;
  loginMessage.className = `login-message ${type}`;
}

// ==========================================
// LOGIN FORM
// ==========================================

if (!form) {
  console.error("Driver login form was not found.");
} else {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Clear previous message
    showMessage("");

    // Basic validation
    if (!email || !password) {
      showMessage("Please enter your email and password.");
      return;
    }

    // Disable button
    loginButton.disabled = true;
    loginButton.innerHTML = "Signing In...";

    try {
      // ==========================================
      // REMEMBER ME
      // ==========================================

      if (rememberMe.checked) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }

      // ==========================================
      // SIGN IN
      // ==========================================

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      console.log("Driver signed in successfully:", user.uid);

      // ==========================================
      // SUCCESS
      // ==========================================

      showMessage("Login successful! Redirecting...", "success");

      loginButton.innerHTML = "Signed In ✓";

      // Redirect to driver dashboard
      setTimeout(() => {
        window.location.href = "driver-dashboard.html";
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      let message = "Unable to sign in. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/invalid-credential":
          message = "Incorrect email or password.";
          break;

        case "auth/user-not-found":
          message = "No driver account was found with this email.";
          break;

        case "auth/wrong-password":
          message = "Incorrect email or password.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many failed attempts. Please wait and try again later.";
          break;

        case "auth/network-request-failed":
          message = "Network error. Please check your internet connection.";
          break;
      }

      showMessage(message, "error");

      // Restore button
      loginButton.disabled = false;
      loginButton.innerHTML = `
        Sign In
        <span>→</span>
      `;
    }
  });
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

if (forgotPassword) {
  forgotPassword.addEventListener("click", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      showMessage("Please enter your email address first.");
      emailInput.focus();
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      showMessage(
        "Password reset email sent. Please check your inbox.",
        "success",
      );
    } catch (error) {
      console.error("Password reset error:", error);

      let message = "Unable to send password reset email.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/user-not-found":
          message = "No account was found with this email.";
          break;
      }

      showMessage(message, "error");
    }
  });
}

// ==========================================
// CHECK CURRENT LOGIN STATUS
// ==========================================

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Currently signed in:", user.email);
  } else {
    console.log("No driver is currently signed in.");
  }
});
