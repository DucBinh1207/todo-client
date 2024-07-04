var TASK__KEY = "task__list";
const PER_PAGE = 10;

var taskList = [];
var searchText = ""; // search text default
var filterOption = "all"; // filter default
var isAddMode = true; // True when Add and False when Edit
var editTaskIndex; // index of the edit task
var totalPage = 1;
var page = 1;
var pageSelectedIndex = 1;

function $(value) {
  return document.querySelector(value);
}

function $$(value) {
  return document.querySelectorAll(value);
}

function getTask() {
  var tasks = localStorage.getItem(TASK__KEY);
  if (tasks) {
    taskList = JSON.parse(tasks);
  }
}

function setTask(taskList) {
  var taskListString = JSON.stringify(taskList);

  localStorage.setItem(TASK__KEY, taskListString);
}

function removeTask() {
  localStorage.removeItem(TASK__KEY);
}

// Render the functions of a task (checked, edit, delete)
function renderTaskFunc() {
  //Render checkbox can get check or uncheck
  var checkTasks = $$(".check__tasks");
  var checkTaskList = Array.from(checkTasks);

  checkTaskList.forEach((checkTask) => {
    checkTask.onclick = function () {
      getTask();
      var taskId = checkTask.getAttribute("data-id");

      taskList.find(function (task) {
        return task.id === taskId;
      }).isChecked = checkTask.checked ? true : false;

      setTask(taskList);
      renderFilter();
    };
  });

  // Delete task
  var deleteTasks = $$(".delete__task");

  deleteTasks.forEach((deleteTask) => {
    deleteTask.onclick = function () {
      getTask();
      var taskId = deleteTask.getAttribute("data-id");

      taskList.splice(
        taskList.findIndex(function (task) {
          return task.id === taskId;
        }),
        1
      );

      setTask(taskList);
      renderFilter();
    };
  });

  // Edit task
  var editTasks = $$(".edit__task");

  editTasks.forEach((editTask) => {
    editTask.onclick = function () {
      var title = $(".form__title");
      var overlay = $(".overlay");
      var addTaskSection = $(".add__task__section");
      var task = $(".input__task");

      overlay.classList.toggle("hidden");
      addTaskSection.classList.toggle("hidden");
      title.innerHTML = "EDIT TASK";
      var taskId = editTask.getAttribute("data-id");

      var taskIndex = taskList.findIndex(function (task) {
        return task.id === taskId;
      });
      task.value = taskList[taskIndex].value;
      editTaskIndex = taskIndex;

      isAddMode = false;
    };
  });
}

function renderTasks(tasksParam) {
  var tasks = $(".tasks__content");
  $(".tasks__content").innerHTML = ``;
  var tasksRender = tasksParam || taskList;
  if (taskList.length === 0) {
    tasks.innerHTML = `<div class="no__task" >Let's start adding your first note</div>`;
    $(".no__task").onclick = function () {
      $(".add__btn").click();
    };
  } else {
    //Render tasks
    var taskListHtml = tasksRender.map(function (task) {
      return `<div class="task">
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

function renderFilter() {
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

  // renderTasks(tasksParam);
  renderPages(tasksParam);
}

function renderPagination(totalPageParam, tasksParam) {
  var paginationHTML = [];
  var totalPageRender = totalPageParam || totalPage;

  var pagesIndexRender = [];
  if (totalPageRender > 5) {
    // Handle page numbers to be rendered
    if (pageSelectedIndex === 1 || pageSelectedIndex === 2) {
      pagesIndexRender = [1, 2, 3, totalPageRender];
    } else if (
      pageSelectedIndex === totalPageRender ||
      pageSelectedIndex === totalPageRender - 1
    ) {
      pagesIndexRender = [
        1,
        totalPageRender - 2,
        totalPageRender - 1,
        totalPageRender,
      ];
    } else {
      pagesIndexRender = [
        1,
        pageSelectedIndex - 1,
        pageSelectedIndex,
        pageSelectedIndex + 1,
        totalPageRender,
      ];
    }

    // Render
    if (pagesIndexRender.length === 4) {
      // Case page 1 and page2
      if (pageSelectedIndex === 1 || pageSelectedIndex === 2) {
        for (let index = 0; index < pagesIndexRender.length - 1; index++) {
          paginationHTML.push(
            `<button class="page__button" data-page-number="${pagesIndexRender[index]}">${pagesIndexRender[index]}</button>`
          );
        }
        paginationHTML.push(
          `...<button class="page__button" data-page-number="${totalPageRender}">${totalPageRender}</button>`
        );
      }

      // Case (last page) and (last page - 1 page)
      else {
        paginationHTML.push(
          `<button class="page__button" data-page-number="1">1</button>...`
        );
        for (let index = 1; index < pagesIndexRender.length; index++) {
          paginationHTML.push(
            `<button class="page__button" data-page-number="${pagesIndexRender[index]}">${pagesIndexRender[index]}</button>`
          );
        }
      }
    } else {
      // Case page 3
      if (pageSelectedIndex === 3) {
        for (let index = 0; index < pagesIndexRender.length - 1; index++) {
          paginationHTML.push(
            `<button class="page__button" data-page-number="${pagesIndexRender[index]}">${pagesIndexRender[index]}</button>`
          );
        }
        paginationHTML.push(
          `...<button class="page__button" data-page-number="${totalPageRender}">${totalPageRender}</button>`
        );
      }

      // Case page (last page - 2 pages)
      else if (pageSelectedIndex === totalPageRender - 2) {
        paginationHTML.push(
          `<button class="page__button" data-page-number="1">1</button>...`
        );
        for (let index = 1; index < pagesIndexRender.length; index++) {
          paginationHTML.push(
            `<button class="page__button" data-page-number="${pagesIndexRender[index]}">${pagesIndexRender[index]}</button>`
          );
        }
      }
      // case other
      else {
        paginationHTML.push(
          `<button class="page__button" data-page-number="1">1</button>...`
        );

        for (let index = 1; index < pagesIndexRender.length - 1; index++) {
          paginationHTML.push(
            `<button class="page__button" data-page-number="${pagesIndexRender[index]}">${pagesIndexRender[index]}</button>`
          );
        }
        paginationHTML.push(
          `...<button class="page__button" data-page-number="${totalPageRender}">${totalPageRender}</button>`
        );
      }
    }
  }
  // Case less than 5 pages
  else {
    for (let index = 1; index <= totalPageRender; index++) {
      paginationHTML.push(
        `<button class="page__button" data-page-number="${index}">${index}</button>`
      );
    }
  }

  var pageSection = $(".pages");
  pageSection.innerHTML = paginationHTML.join("");

  var pageButtons = $$(".page__button");

  // Add color to button selected
  pageButtons.forEach((pageBtn) => {
    if (
      parseInt(pageBtn.getAttribute("data-page-number")) === pageSelectedIndex
    ) {
      pageBtn.classList.toggle("page__selected");
    }
  });

  pageButtons.forEach((pageBtn) => {
    pageBtn.onclick = function () {
      page = pageBtn.getAttribute("data-page-number");
      renderTasks(TasksPerPage(tasksParam));
      pageSelectedIndex = parseInt(page);
      renderPagination(totalPageParam, tasksParam);
    };
  });
}

function TasksPerPage(tasksParam) {
  return tasksParam.slice((page - 1) * PER_PAGE, page * PER_PAGE);
}

function calculatePages(tasksParam) {
  var task = tasksParam || taskList;
  totalPage = Math.ceil(task.length / 10);
}

// renderPages
function renderPages(tasksParam) {
  var tasks = tasksParam || taskList;

  calculatePages(tasks);
  renderTasks(TasksPerPage(tasks));
  renderPagination(totalPage, tasks);
}

// Add temp
function addDataSample() {
  var newTask;
  for (let i = 0; i < 61; i++) {
    newTask = {
      id: i.toString(),
      isChecked: false,
      value: i.toString(),
    };
    taskList.push(newTask);
  }
}

function handleOnload() {
  addDataSample();
  if (!localStorage.getItem(TASK__KEY)) {
    setTask(taskList);
  }

  getTask();
  renderFilter();

  var body = $("body");

  var search = $(".search");
  var filter = $(".task__filter");

  var dayNightMode = $(".day__night__mode");
  var addBtn = $(".add__btn");
  var cancelBtn = $(".cancel__btn");
  var applyBtn = $(".apply__btn");

  var overlay = $(".overlay");
  var addTaskSection = $(".add__task__section");
  var task = $(".input__task");

  //search
  function changeSearch() {
    searchText = search.value;
    renderFilter();
  }

  // filter
  function changeFilter() {
    filterOption = filter.value;
    renderFilter();
  }

  // day and night mode
  function changeMode() {
    mode = $$(".dn__mode");
    mode.forEach((element) => {
      element.classList.toggle("visible");
    });
    body.classList.toggle("night__mode");
  }

  //pop up "add task" form
  function openAddTaskForm() {
    isAddMode = true;
    overlay.classList.toggle("hidden");
    addTaskSection.classList.toggle("hidden");
  }

  // cancel add task form
  function cancelAddTask() {
    task.value = "";
    overlay.classList.toggle("hidden");
    addTaskSection.classList.toggle("hidden");
    checkInputEmpty();
  }

  // apply add new task
  function applyAddTask() {
    if (/^\s*$/.test(task.value)) {
      if (!task.classList.contains("error__input")) {
        task.classList.add("error__input");
        var errorNote = $(".error__note");
        errorNote.classList.toggle("visible");
        errorNote.innerHTML = `* <i> This field cannot be empty</i>`;
      }
    } else if (task.value.length > 42) {
      if (!task.classList.contains("error__input")) {
        task.classList.add("error__input");
        var errorNote = $(".error__note");
        errorNote.classList.toggle("visible");
        errorNote.innerHTML = `* <i>This field has a limit of 42 characters  </i><br> ( Your note has ${task.value.length} characters )`;
      }
    } else {
      if (isAddMode) {
        getTask();

        var newTask = {
          id: new Date().getTime().toString(),
          isChecked: false,
          value: task.value,
        };
        taskList.push(newTask);

        setTask(taskList);

        overlay.classList.toggle("hidden");
        addTaskSection.classList.toggle("hidden");
        task.value = "";
        filterOption = "all";
        searchText = "";
        filter.selectedIndex = 0;
        search.value = "";

        renderPages();
        renderFilter();
      } else {
        taskList[editTaskIndex].value = task.value;
        setTask(taskList);

        overlay.classList.toggle("hidden");
        addTaskSection.classList.toggle("hidden");
        task.value = "";

        renderPages();
        renderFilter();
      }
    }
  }

  // enter to apply add new task
  function checkAddTask(event) {
    if (event.key === "Enter") {
      applyAddTask();
    }
  }

  function checkInputEmpty() {
    if (task.classList.contains("error__input")) {
      task.classList.remove("error__input");
      var errorNote = $(".error__note");
      errorNote.classList.remove("visible");
    }
  }

  search.addEventListener("input", changeSearch);
  filter.onchange = changeFilter;
  dayNightMode.onclick = changeMode;
  addBtn.onclick = openAddTaskForm;
  cancelBtn.onclick = cancelAddTask;
  applyBtn.onclick = applyAddTask;
  task.onkeypress = checkAddTask;
  task.addEventListener("input", checkInputEmpty);
}
window.onload = handleOnload;
