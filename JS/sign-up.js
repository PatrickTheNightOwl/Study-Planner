// Button Sign Up nếu user vượt qua các điều kiện, sẽ đưa new data vào database rồi direct user tới Log In
// Button Log In nếu user vượt qua chốt kiểm tra, sẽ từ đó lấy data ra lắp vào, rồi direct user tới Dashboard

// Initialize
const signUpForm = document.getElementById("form");
const inputEmail = document.getElementById("input-email");
const inputPassword = document.getElementById("input-password");
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));

//Function
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
// Functions and Events
signUpForm.addEventListener("submit", function (event) {
  console.log("submit fired");
  event.preventDefault();

  const email = inputEmail.value;
  const password = inputPassword.value;

  // Validation
  const emailCheck = emailFilter(email);
  const passwordCheck = passwordFilter(password);

  if (emailCheck !== true) {
    alert(emailCheck);
    return;
  } else if (passwordCheck !== true) {
    alert(passwordCheck);
    return;
  } else {
    console.log("Validation passed");
    let userId;
    if (database.users.length === 0) {
      userId = 1;
    } else {
      userId = database.users[database.users.length - 1].id + 1;
    }
    const newData = {
      id: userId,
      email: email,
      password: password,
      subjects: [],
      tasks: [],
    };
    database.users.push(newData);
    localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
    const loginPage = "../HTML/authentication-login.html";
    window.location.replace(loginPage);
  }
});
