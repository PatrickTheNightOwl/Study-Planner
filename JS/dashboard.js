// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const holidays = JSON.parse(localStorage.getItem("studyPlannerHolidays"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);
const subjectsList = currentUser.subjects;
const tasksList = currentUser.tasks;

// Elemenet Retrieve
const holidaysContainer = document.getElementById("holiday");
const subjectsContainer = document.getElementById("subjects");
const tasksContainer = document.getElementById("tasks");

// Functions
function getFormattedDate(rawDate, year) {
  const month = String(rawDate.getMonth() + 1).padStart(2, "0");
  const day = String(rawDate.getDate()).padStart(2, "0");
  const formatted = `${year}-${month}-${day}`;
  return formatted;
}
function getUpcomingHolidayDataFromHolidays(rawData) {
  // Holiday API Free chỉ cung cấp dữ liệu của năm trước,
  // vì vậy dashboard sử dụng năm dữ liệu của API để tính toán ngày lễ tiếp theo.
  let currentDateObj = new Date();
  const year = "2025";
  const formatted = getFormattedDate(currentDateObj, year);
  currentDateObj = new Date(formatted);
  currentDateObj.setHours(0, 0, 0, 0);
  const holidays = rawData.holidays;
  let essentialData = {
    name: null,
    upcomingHoliday: null,
  };
  const upcomingHoliday = holidays.find((holiday) => {
    const holidayDateObj = new Date(`${holiday.date}T00:00:00`);
    return holidayDateObj >= currentDateObj;
  });
  essentialData.name = upcomingHoliday.name;
  const holidayDate = new Date(`${upcomingHoliday.date}T00:00:00`);
  essentialData.upcomingHoliday = getFormattedDate(holidayDate, 2026);

  return essentialData;
}

// Essential Data Initialize
const upcomingHolidayData = getUpcomingHolidayDataFromHolidays(holidays);

// Add informations to container
let html = `
    <h2>${upcomingHolidayData.name}<h2>
    <h2>${upcomingHolidayData.upcomingHoliday}<h2>
`;
console.log(holidaysContainer);
console.log(subjectsContainer);
console.log(tasksContainer);
holidaysContainer.innerHTML = html;
