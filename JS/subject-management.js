// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);
const subjectsList = currentUser.subjects;

// Elements Retrieve
const mainContainer = document.getElementById("main-content");
const addSubjectButton = document.getElementById("add-subject");
const subjectModal = document.getElementById("modal");
const subjectModalOverlay = document.getElementById("modal-overlay");
const closeModalButton = document.getElementById("cancel-btn");
const saveNewSubjectButton = document.getElementById("save-btn");
const subjectName = document.getElementById("subject-name");
const colorContainer = document.getElementById("color-recommendation");
const colorList = colorContainer.children;

// Variable
let selectedColor = "#9ca3af"; // default, if changed -> change

// Functions and Events
for (let color of colorList) {
  color.addEventListener("click", () => {
    selectedColor = color.dataset.color;
  });
}
addSubjectButton.addEventListener("click", () => {
  subjectModalOverlay.classList.remove("hidden");
});
closeModalButton.addEventListener("click", () => {
  subjectModalOverlay.classList.add("hidden");
});
saveNewSubjectButton.addEventListener("click", () => {
  let id;
  if (subjectsList.length === 0) {
    id = 1;
  } else {
    id = subjectsList[subjectsList.length - 1].id + 1;
  }
  const name = subjectName.value;
  const color = selectedColor;
  if (name.trim().length === 0) {
    alert("Please enter subject's name!");
    return;
  } else {
    const newSubject = {
      id: id,
      name: name,
      color: color,
    };
    subjectsList.push(newSubject);
    alert("Subject created!");
    localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
  }
});
