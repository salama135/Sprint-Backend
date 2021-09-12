//"use strict";
let tasks = [];
let editTaskIndex = 0;

const getPriorityName = function(priority) {
    switch (priority) {
        case "1":
            return "High";
        case "2":
            return "Medium";
        case "3":
            return "Low";
        default:
            return "";
    }
};

const deleteTask = function(i) {
    if (!confirm("Are you sure ?")) return;
    tasks.splice(i, 1);
    renderTable();
};
const moveUp = function(i) {
    if (i == 0) return;
    const oldTask = tasks[i];
    tasks[i] = tasks[i - 1];
    tasks[i - 1] = oldTask;
    renderTable();
};
const moveDown = function(i) {
    if (i == tasks.length - 1) return;
    const oldTask = tasks[i];
    tasks[i] = tasks[i + 1];
    tasks[i + 1] = oldTask;
    renderTable();
};

const renderTable = function() {
        const tbody = document.querySelector("#tasks_tbody");
        tbody.innerHTML = "";
        tasks.forEach((t, i) => {
                    const row = `
        <tr>
        <td>${i + 1}</td>
        <td>${t.name}</td>
        <td>${getPriorityName(t.priority)}</td>
        <td>
        ${
          i > 0
            ? `<button class="btn btn-sm btn-secondary" onclick="moveUp(${i})">Up</button>`
            : ``
        }
        ${
          i < tasks.length - 1
            ? `<button class="btn btn-sm btn-secondary" onclick="moveDown(${i})">Down</button>`
            : ``
        }
        </td>
        <td>
        <button id="edit" type="button" class="btn-sm btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="editTask(${i})">Edit</button>
        <button id="save" class="btn btn-success btn-sm" style="display:none;">Save</button>
        <button id="cancel" class="btn btn-danger btn-sm" style="display:none;">Cancel</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTask(${i})">Delete</button></td>
        </tr>
        `;
    tbody.insertAdjacentHTML("beforeEnd", row);
  });
};

const addTask = function () {
  console.log(this);
  const taskName = document.querySelector("#task_name").value;
  const priority = document.querySelector("#task_priority").value;
  if (taskName !== "" && priority > 0) {
    tasks.push({
      name: taskName,
      priority: priority,
    });
    renderTable();
  }
};

const editTask = function (i) {
  document.querySelector("#task_name_edit").value = tasks[i].name;
  document.querySelector("#task_priority_edit").value = tasks[i].priority;
  document.querySelector("#save").addEventListener("click", saveEditTask);
  editTaskIndex = i;
};

const saveEditTask = function() {
  const taskName = document.querySelector("#task_name_edit").value;
  const priority = document.querySelector("#task_priority_edit").value;
  if (taskName !== "" && priority > 0) {
    tasks[editTaskIndex].name = taskName;
    tasks[editTaskIndex].priority = priority; 
    renderTable();
  }
}

document.querySelector("#add").addEventListener("click", addTask);

var name = "Test3";
var age = 22;
const calcFunction = () => {
  console.log(this);
  console.log(`My name is ${this.name} I'm ${this.age} years old`);
};
const obj = {
  name: "Test",
  age: 35,
  cal: calcFunction,
};

const obj2 = {
  name: "Test2",
  age: 22,
  cal: calcFunction,
};

function thisTest() {
  let obj1 = "Ramy";
  var obj2 = "Ahmed";
  console.log(this);
  const x = () => {
    console.log(this);
  };
  x();
}