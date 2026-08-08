const database = JSON.parse(localStorage.getItem("studyPlannerDatabase")) || {
  users: [],
};
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);

if (!currentUser) {
  window.location.replace("authentication-login.html");
  throw new Error("A signed-in user is required to manage subjects.");
}

const subjectsList = currentUser.subjects || [];
const tasksList = currentUser.tasks || [];

const subjectsContainer = document.getElementById("subjects-container");
const addSubjectButton = document.getElementById("add-subject");
const subjectModalOverlay = document.getElementById("modal-overlay");
const closeModalButton = document.getElementById("cancel-btn");
const deleteSubjectButton = document.getElementById("del-btn");
const saveNewSubjectButton = document.getElementById("save-btn");
const subjectNameInput = document.getElementById("subject-name");
const colorContainer = document.getElementById("color-recommendation");

let selectedColor = "#9ca3af";

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSubjects() {
  if (subjectsList.length === 0) {
    subjectsContainer.innerHTML = `
      <p class="no-task-notification">
        No subjects yet. Add your first subject to start organizing tasks.
      </p>
    `;
    return;
  }

  subjectsContainer.innerHTML = subjectsList
    .map((subject) => {
      const remainingTasks = tasksList.filter(
        (task) => task.subjectId === subject.id
      ).length;

      return `
        <article class="subject-card" style="--subject-color:${escapeHTML(
          subject.color
        )}">
          <h3>${escapeHTML(subject.name)}</h3>
          <p>${remainingTasks} task${remainingTasks !== 1 ? "s" : ""} remaining</p>
        </article>
      `;
    })
    .join("");
}

function closeModal() {
  subjectModalOverlay.classList.add("hidden");
}

function resetForm() {
  subjectNameInput.value = "";
  selectedColor = "#9ca3af";
  colorContainer.querySelectorAll(".color").forEach((color) => {
    color.classList.toggle("selected", color.dataset.color.toLowerCase() === selectedColor);
  });
}

function selectColor(button) {
  selectedColor = button.dataset.color.toLowerCase();
  colorContainer.querySelectorAll(".color").forEach((color) => {
    color.classList.toggle("selected", color === button);
  });
}

colorContainer.addEventListener("click", (event) => {
  const colorButton = event.target.closest(".color");
  if (colorButton) selectColor(colorButton);
});

renderSubjects();
resetForm();

addSubjectButton.addEventListener("click", () => {
  subjectModalOverlay.classList.remove("hidden");
  subjectNameInput.focus();
});

closeModalButton.addEventListener("click", closeModal);

subjectModalOverlay.addEventListener("click", (event) => {
  if (event.target === subjectModalOverlay) closeModal();
});

deleteSubjectButton.addEventListener("click", () => {
  const name = subjectNameInput.value.trim();
  const index = subjectsList.findIndex(
    (subject) => subject.name.toLowerCase() === name.toLowerCase()
  );

  if (name === "") {
    alert("Please enter the subject name.");
    return;
  }

  if (index === -1) {
    alert("No subject found. Please check the subject name again.");
    return;
  }

  const deletedSubjectId = subjectsList[index].id;
  for (let taskIndex = tasksList.length - 1; taskIndex >= 0; taskIndex -= 1) {
    if (tasksList[taskIndex].subjectId === deletedSubjectId) {
      tasksList.splice(taskIndex, 1);
    }
  }
  subjectsList.splice(index, 1);

  localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
  renderSubjects();
  resetForm();
  closeModal();
  alert("Subject deleted.");
});

saveNewSubjectButton.addEventListener("click", () => {
  const name = subjectNameInput.value.trim();

  if (name === "") {
    alert("Please enter the subject name.");
    return;
  }
  if (
    subjectsList.some(
      (subject) => subject.name.trim().toLowerCase() === name.toLowerCase()
    )
  ) {
    alert("That subject already exists.");
    return;
  }

  const nextId = subjectsList.length
    ? subjectsList[subjectsList.length - 1].id + 1
    : 1;

  subjectsList.push({
    id: nextId,
    name,
    color: selectedColor,
  });
  localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
  renderSubjects();
  resetForm();
  closeModal();
  alert("Subject created.");
});
