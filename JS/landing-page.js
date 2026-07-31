const currentUserContainer = document.getElementById("currentUser");
const getStartedNavigation = document.getElementById("cta");

const currentUserId = Number(localStorage.getItem("currentUserId"));
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));

const currentUser = database.users.find((user) => user.id === currentUserId);

if (currentUser) {
  currentUserContainer.innerHTML = `
        <p id="current-user-email">${currentUser.email}</p>
        <button id="btn-logout">Log Out</button>
    `;

  getStartedNavigation.innerHTML = `
        <a href="dashboard.html" class="btn-signup cta-btn">
            Get Started
        </a>
    `;
} else {
  currentUserContainer.innerHTML = `
        <a href="authentication-login.html" class="btn-login">Log In</a>
        <a href="authentication-signup.html" class="btn-signup">Sign Up</a>
    `;
}
const logOutButton = document.getElementById("btn-logout");
logOutButton.addEventListener("click", () => {
  localStorage.removeItem("currentUserId");
  window.location.replace("index.html");
});
