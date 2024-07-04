import {
  addTask,
  editTaskId,
  getTask,
  getTaskById,
  isAddMode,
  removeTask,
  renderFilter,
  renderTasks,
  updateTask,
} from "./lib.js";
import { $, $$ } from "./utils.js";

var searchText = ""; // search text default
var filterOption = "all"; // filter default

function handleOnload() {
  renderTasks();

  const body = $("body");

  const search = $(".search");
  const filter = $(".task__filter");

  const dayNightMode = $(".day__night__mode");

  const overlay = $(".overlay");
  const addTaskSection = $(".add__task__section");
  const addBtn = $(".add__btn");
  const cancelBtn = $(".cancel__btn");
  const applyBtn = $(".apply__btn");
  const task = $(".input__task");

  search.addEventListener("input", (e) => {
    searchText = search.value;
    console.log(searchText);
    renderFilter(searchText, filterOption);
  });

  filter.addEventListener("change", (e) => {
    filterOption = filter.value;
    renderFilter(searchText, filterOption);
  });

  dayNightMode.addEventListener("click", (e) => {
    const mode = $$(".dn__mode");
    mode.forEach((element) => {
      element.classList.toggle("visible");
    });
    body.classList.toggle("night__mode");
  });

  addBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    overlay.classList.toggle("hidden");
    addTaskSection.classList.toggle("hidden");
  });

  applyBtn.addEventListener("click", async (e) => {
    if (isAddMode == true) {
      await addTask(task.value);
      renderTasks();
    } else {
      const taskData = await getTaskById(editTaskId);
      await updateTask(editTaskId, task.value, taskData.isChecked);
      renderTasks();
    }

    overlay.classList.toggle("hidden");
    addTaskSection.classList.toggle("hidden");
  });

  function checkInputEmpty() {
    if (task.classList.contains("error__input")) {
      task.classList.remove("error__input");
      const errorNote = $(".error__note");
      errorNote.classList.remove("visible");
    }
  }

  cancelBtn.addEventListener("click", (e) => {
    task.value = "";
    overlay.classList.toggle("hidden");
    addTaskSection.classList.toggle("hidden");
    checkInputEmpty();
  });

  // enter to apply add new task
  task.addEventListener("keypress", (e) => {
    if (event.key === "Enter") {
      applyAddTask();
    }
  });

  task.addEventListener("input", checkInputEmpty);
}
window.onload = handleOnload;
