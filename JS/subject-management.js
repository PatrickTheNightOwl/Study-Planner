// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);
const subjectsList = currentUser.subjects;
const tasksList = currentUser.tasks;

// Elements Retrieve
const mainContainer = document.getElementById("main-content");
const subjectsContainer = document.getElementById("subjects-container");
const addSubjectButton = document.getElementById("add-subject");
const subjectModal = document.getElementById("modal");
const subjectModalOverlay = document.getElementById("modal-overlay");
const closeModalButton = document.getElementById("cancel-btn");
const deleteSubjectButton = document.getElementById("del-btn");
const saveNewSubjectButton = document.getElementById("save-btn");
const subjectName = document.getElementById("subject-name");
const colorContainer = document.getElementById("color-recommendation");
const colorList = colorContainer.children;

// Variable
let selectedColor = "#9ca3af"; // default, if changed -> change

// Render Function
function renderSubjects() {
  let html = "";

  subjectsList.forEach((subject) => {
    const remainingTasks = tasksList.filter(
      (task) => task.subjectId === subject.id
    ).length;
    html += `
            <div
                class="subject-card"
                style="background-color:${subject.color}">
                <h3>${subject.name}</h3>
                <p>${remainingTasks} task${
      remainingTasks !== 1 ? "s" : ""
    } remaining</p>
            </div>
        `;
  });

  subjectsContainer.innerHTML = html;
}
renderSubjects();
// Functions and Events

addSubjectButton.addEventListener("click", () => {
  subjectModalOverlay.classList.remove("hidden");
});
closeModalButton.addEventListener("click", () => {
  subjectModalOverlay.classList.add("hidden");
});
deleteSubjectButton.addEventListener("click", () => {
  const name = subjectName.value.trim();

  const index = subjectsList.findIndex(
    (subject) => subject.name.toLowerCase() === name.toLowerCase()
  );

  if (index !== -1) {
    const deleteSubjectId = subjectsList[index].id;
    for (let i = 0; i < tasksList.length; i++) {
      if (tasksList[i].subjectId === deleteSubjectId) {
        tasksList.splice(i, 1);
      }
    }
    subjectsList.splice(index, 1);

    localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));

    renderSubjects();

    alert("Subject deleted!");
  } else {
    alert("No subject found! Please check the subject name again.");
  }
});
saveNewSubjectButton.addEventListener("click", () => {
  for (let color of colorList) {
    color.addEventListener("click", () => {
      selectedColor = color.dataset.color;
    });
  }
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
  } else if (
    subjectsList.some(
      (subject) =>
        subject.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
  ) {
    alert("Subject's name already existed!");
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
    renderSubjects();
  }
});
