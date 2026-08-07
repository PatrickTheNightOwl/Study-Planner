// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);

// Elements Retrieve
const currentEmail = document.getElementById("current-email");
const changeEmailButton = document.getElementById("change-email-btn");
const currentPassword = document.getElementById("current-password");
const changePasswordButton = document.getElementById("change-password-btn");
const logOutButton = document.getElementById("logout-btn");
const modal = document.getElementById("modal");
const modalOverlay = document.getElementById("modal-overlay");
const closeModalButton = document.getElementById("cancel-btn");
const saveNewInfoButton = document.getElementById("save-btn");
const currentInfomation = document.getElementById("current-information");
const newInfoInput = document.getElementById("new-info-input");
// Functions
function renderInformations() {
  currentEmail.textContent = `Email: ${currentUser.email}`;
  currentPassword.textContent = `Password: ${currentUser.password}`;
}
function emailFilter(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Regex, giải nghĩa :
  // Bắt đầu bằng một hoặc nhiều ký tự không phải khoảng trắng/@,
  // sau đó có @, sau đó có một hoặc nhiều ký tự không phải khoảng trắng/@,
  // sau đó có dấu chấm,
  // sau đó có một hoặc nhiều ký tự không phải khoảng trắng/@, và kết thúc chuỗi.

  if (!emailPattern.test(email)) {
    return "Please enter a valid email!";
  }
  const existedUser = database.users.some((user) => user.email === email);
  if (existedUser) {
    return "Email already exists!";
  }
  return true;
}
function passwordFilter(password) {
  const passwordLength = password.length;

  const hasUpper = (str) => /[A-Z]/.test(str);
  const hasLower = (str) => /[a-z]/.test(str);
  const hasUnderscore = (str) => /_/.test(str);
  const hasRestricted = (str) => /[^a-zA-Z0-9_]/.test(str);

  if (passwordLength < 8 || passwordLength > 12) {
    return "Password must contain 8-12 characters!";
  }

  if (!hasUpper(password)) {
    return "Password must contain at least 1 uppercase!";
  }

  if (!hasLower(password)) {
    return "Password must contain at least 1 lowercase!";
  }

  if (!hasUnderscore(password)) {
    return "Password must contain at least 1 underscore (_)";
  }

  if (hasRestricted(password)) {
    return "Password must not contain any character except letters, numbers, and underscore!";
  }

  return true;
}
renderInformations();

// Add Event Listener
changeEmailButton.addEventListener("click", () => {
  currentInfomation.textContent = `Current Email: ${currentUser.email}`;
  currentInfomation.dataset.info = "email";
  modalOverlay.classList.remove("hidden");
});
changePasswordButton.addEventListener("click", () => {
  currentInfomation.textContent = `Current Password: ${currentUser.password}`;
  currentInfomation.dataset.info = "password";
  modalOverlay.classList.remove("hidden");
});
closeModalButton.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});
saveNewInfoButton.addEventListener("click", () => {
  const currentInput = newInfoInput.value;
  if (currentInput.trim().length === 0) {
    if (currentInfomation.dataset.info === "email") {
      alert("Please enter new email address!");
    } else {
      alert("Please enter new password!");
    }
    return;
  }
  if (currentInfomation.dataset.info === "email") {
    const emailCheck = emailFilter(currentInput);
    if (emailCheck !== true) {
      alert(emailCheck);
      return;
    } else {
      currentUser.email = currentInput;
      localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
      alert("Email changed!");
      renderInformations();
      modalOverlay.classList.add("hidden");
    }
  } else {
    const passwordCheck = passwordFilter(currentInput);
    if (passwordCheck !== true) {
      alert(passwordCheck);
      return;
    } else {
      currentUser.password = currentInput;
      localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
      alert("Password changed!");
      renderInformations();
      modalOverlay.classList.add("hidden");
    }
  }
});
logOutButton.addEventListener("click", () => {
  localStorage.removeItem("currentUserId");
  window.location.replace("index.html");
});
