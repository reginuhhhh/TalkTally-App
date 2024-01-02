// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

// Import Router
import { setRouter } from "./router/router.js";


// Import supabase
import { createClient } from "@supabase/supabase-js";

// Set Router
setRouter();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://yamqrggncmryqabtohcb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbXFyZ2duY21yeXFhYnRvaGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMzg3NDIsImV4cCI6MjAxNTYxNDc0Mn0.j-CRkaQQeOq2tiL-oXzCqdJA8fS3U7On0DXUvgVjJbc"
);

// Success Notification
function successNotification(message, seconds = 0) {
  document.querySelector(".alert-success").classList.remove("d-none");
  document.querySelector(".alert-success").classList.add("d-block");
  document.querySelector(".alert-success").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-success").classList.remove("d-block");
      document.querySelector(".alert-success").classList.add("d-none");
    }, seconds * 1000);
  }
}

// Error Notification
function errorNotification(message, seconds = 0) {
  document.querySelector(".alert-danger").classList.remove("d-none");
  document.querySelector(".alert-danger").classList.add("d-block");
  document.querySelector(".alert-danger").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-danger").classList.remove("d-block");
      document.querySelector(".alert-danger").classList.add("d-none");
    }, seconds * 1000);
  }
}

// Logout Function
async function doLogout() {
  // Supabase Logout
  let { error } = await supabase.auth.signOut();

  if (error == null) {
    successNotification("Logout Successfully!");

    // Clear local Storage
    localStorage.clear();

    // Redirect to login page
    window.location.pathname = "/login.html";
  } else {
    errorNotification("Logout Failed!", 15);
  }
}

export { supabase, successNotification, errorNotification, doLogout };