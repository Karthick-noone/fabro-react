document.getElementById("logoutButton").addEventListener("click", function() {
  sessionStorage.removeItem("name");
  window.location.href = "/register";
  setTimeout(function() {
      window.location.reload();
  }, 1000);
});
document.addEventListener("DOMContentLoaded", function() {
  const name = sessionStorage.getItem("name");
  console.log("name", name);
  const welcomeElement = document.getElementById("welcomeMessage");
  if (welcomeElement) {
      if (name) {
          welcomeElement.innerText = "Welcome, " + name;
      } else {
          redirectToLogin();
      }
  } else {
      console.error("Element with ID 'welcomeMessage' not found.");
  }
});
function redirectToLogin() {
  sessionStorage.removeItem("name");
  window.location.href = "/register";
}

document.getElementById("logoutButton").addEventListener("click", function() {
  sessionStorage.removeItem("name");
  redirectToLogin(); // Redirect immediately after removing the name from session storage
});

document.addEventListener("DOMContentLoaded", function() {
  const name = sessionStorage.getItem("name");
  console.log("name", name);
  const welcomeElement = document.getElementById("welcomeMessage");
  if (welcomeElement) {
      if (name) {
          welcomeElement.innerText = "Welcome, " + name;
      } else {
          redirectToLogin();
      }
  } else {
      console.error("Element with ID 'welcomeMessage' not found.");
  }
});

function redirectToLogin() {
  sessionStorage.removeItem("name");
  window.location.href = "/register";
}