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

  const user = database.users.find(
    (element) => element.email === email && element.password === password
  );

  if (user) {
    localStorage.setItem("currentUserId", user.id);
    window.location.replace("../HTML/dashboard.html");
  } else {
    alert("Incorrect email or password! Try again!");
  }
});
