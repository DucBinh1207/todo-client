import { $, $$ } from "./utils.js";
import { TASK__KEY, PER_PAGE } from "./constants.js";

var taskList = [];
export var editTaskId;
export var isAddMode = true;

export async function getTask() {
  const data = await fetch("http://localhost:4444/tasks", {
    method: "GET",
  });
  taskList = await data.json();
}

export async function getTaskById(id) {
  const data = await fetch("http://localhost:4444/tasks/" + id, {
    method: "GET",
  });
  return await data.json();
}

export async function addTask(value) {
  const taskData = {
    isChecked: false,
    value: value,
  };

  await fetch("http://localhost:4444/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(id, value, isChecked) {
  const taskUpdate = {
    value: value,
    isChecked: isChecked,
  };

  await fetch("http://localhost:4444/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskUpdate),
  });

  isAddMode = true;
}

export async function removeTask(id) {
  await fetch("http://localhost:4444/tasks/" + id, {
    method: "DELETE",
  });
}

export async function renderTaskFunc() {
  //Render checkbox can get check or uncheck
  var checkTasks = $$(".check__tasks");
  var checkTaskList = Array.from(checkTasks);

  checkTaskList.forEach((checkTask) => {
    checkTask.onclick = async function () {
      var taskId = checkTask.getAttribute("data-id");
      var task = await getTaskById(taskId);

      if (checkTask.checked) {
        await updateTask(taskId, task.value, true);
      } else {
        await updateTask(taskId, task.value, false);
      }
    };
  });

  // Delete task
  var deleteTasks = $$(".delete__task");

  deleteTasks.forEach((deleteTask) => {
    deleteTask.onclick = async function () {
      var taskId = deleteTask.getAttribute("data-id");
      await removeTask(taskId);

      renderTasks();
    };
  });

  // Edit task
  var editTasks = $$(".edit__task");

  editTasks.forEach((editTask) => {
    editTask.onclick = async function () {
      var title = $(".form__title");
      var overlay = $(".overlay");
      var addTaskSection = $(".add__task__section");
      var task = $(".input__task");

      overlay.classList.toggle("hidden");
      addTaskSection.classList.toggle("hidden");
      title.innerHTML = "EDIT TASK";
      var taskId = editTask.getAttribute("data-id");

      var taskData = await getTaskById(taskId);

      task.value = taskData.value;
      editTaskId = taskId;

      isAddMode = false;
    };
  });
}

export async function renderTasks(tasksParam) {
  var tasks = $(".tasks__content");
  $(".tasks__content").innerHTML = ``;

  await getTask();

  var tasksRender = tasksParam || taskList;

  if (taskList.length === 0) {
    tasks.innerHTML = `<div class="no__task" >Let's start adding your first note</div>`;
    $(".no__task").onclick = function () {
      $(".add__btn").click();
    };
  } else {
    //Render tasks
    var taskListHtml = tasksRender.map(function (task) {
      return `<div class="task visible__task">
              <label class="container">
                <input type="checkbox" class="check__tasks"
                ${
                  task.isChecked === true ? "checked" : ""
                } data-id="${task.id}"/>
                <span>
                  <i class="fa-solid fa-check"></i>
                </span>
                <div>${task.value}</div>
              </label>
              <div class="task__tool__section">
                <div class="edit__task task__tool" data-id="${task.id}">
                  <i class="fa-light fa-pen"></i>
                </div>
                <div class="delete__task task__tool" data-id="${task.id}">
                  <i class="fa-light fa-trash"></i>
                </div>
              </div>
            </div>`;
    });

    tasks.innerHTML = taskListHtml.join("");

    var taskElements = $$(".task");

    taskElements.forEach(function (taskElement, index) {
      setTimeout(function () {
        taskElement.classList.add("visible__task");
      }, index * 40);
    });

    renderTaskFunc();
  }
}

export async function renderFilter(searchText, filterOption) {
  var tasksParam = taskList;

  // Filter
  switch (filterOption) {
    case "done":
      tasksParam = tasksParam.filter(function (task) {
        if (task.isChecked === true) {
          return true;
        } else return false;
      });
      break;
    case "not_done":
      tasksParam = tasksParam.filter(function (task) {
        if (task.isChecked === false) {
          return true;
        } else return false;
      });
      break;
  }

  // Search
  tasksParam = tasksParam.filter(function (task) {
    if (task.value.indexOf(searchText) !== -1) {
      return true;
    } else {
      return false;
    }
  });

  renderTasks(tasksParam);
  //   renderPages(tasksParam);
}
