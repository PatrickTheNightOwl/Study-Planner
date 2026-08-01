// Initialize
const logInForm = document.getElementById("form");
const inputEmail = document.getElementById("input-email");
const inputPassword = document.getElementById("input-password");
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));

// Functions and Events
logInForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = inputEmail.value;
  const password = inputPassword.value;
  database.users.forEach((element) => {
    const correctEmail = element.email;
    const correctPassword = element.password;
    if (correctEmail === email && correctPassword === password) {
      localStorage.setItem("currentUserId", element.id);
      window.location.replace("../HTML/dashboard.html");
    } else {
      alert("Incorrect email or password! Try again!");
      return;
    }
  });
});
