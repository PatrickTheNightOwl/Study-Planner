const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const currentUserId = localStorage.getItem("currentUserId");
const currentUser = database.users.find((user) => user.id === currentUserId);
const subjectsList = currentUser.subjects;
const tasksList = currentUser.tasks;
