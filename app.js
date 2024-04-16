let tasks = [];

let body = document.querySelector("body");
let personalTab = document.getElementById("personal-tab-pane");
let workTab = document.getElementById("work-tab-pane");
let othersTab = document.getElementById("others-tab-pane");
const addTaskTitleInp = document.getElementById("addTask-title");
const addTaskDescInp = document.getElementById("addTask-Desc");
const addTaskGrpInp = document.getElementById("taskGroup");
let addTaskBtn = document.getElementById("btnAddTask");
let addTaskToast = document.getElementById("addTaskToast");
let addTaskModal = new bootstrap.Modal("#modalAddTask");
let updateTaskModal = new bootstrap.Modal("#modalUpdateTask");
let updateTaskToast = document.getElementById("updateTaskToast");
let addtaskToast = document.getElementById("addTaskToast");
let addTaskFailedToast = document.getElementById("addTaskFailedToast");
const addTFToast = bootstrap.Toast.getOrCreateInstance(addTaskFailedToast);
const addTToast = bootstrap.Toast.getOrCreateInstance(addTaskToast);
const updateTToast = bootstrap.Toast.getOrCreateInstance(updateTaskToast);
const updateDropdown = document.getElementById("updateTaskDropdown");
const udpateTaskBtn = document.getElementById("taskUpdateOuterBtn");
const updateTaskModalTitle = document.getElementById("updateTaskTitle");
const updateTaskModalDesc = document.getElementById("updateTaskDesc");
const updateTaskModalTGrp = document.getElementById("updateTaskGroup");
const deleteTaskOBtn = document.getElementById("deleteTaskOuterBtn");
const deleteDropdown = document.getElementById("deleteTaskDropdown");
const deleteTaskModalBtn = document.getElementById("deleteTaskModalBtn");
const deleteTaskModal = new bootstrap.Modal("#modalDeleteTask");
const deleteTaskToast = document.getElementById("deleteTaskToast");
const deleteTToast = bootstrap.Toast.getOrCreateInstance(deleteTaskToast);
loopCreateDivTask();
addTaskBtn.addEventListener("click", function addTask() {
  const title = addTaskTitleInp.value;
  const description = addTaskDescInp.value;
  const taskGrp = addTaskGrpInp.value;
  const newTask = {
    title: title,
    description: description,
    taskGrp: taskGrp,
  };
  tasks.push(newTask);
  addTaskModal.hide();
  createDivTasks(newTask.title, newTask.description, newTask.taskGrp);
  if (newTask.grp != "") {
    addTToast.show();
  }
  clearInpContent(addTaskTitleInp, addTaskDescInp, addTaskGrpInp);
});
function clearInpContent(clearTitle, clearDesc, clearTaskGrp) {
  clearTitle.value = "";
  clearDesc.value = "";
  clearTaskGrp.value = "Open this select menu";
}
function loopCreateDivTask() {
  personalTab.innerHTML = "";
  workTab.innerHTML = "";
  othersTab.innerHTML = "";
  tasks.forEach((task) => {
    createDivTasks(task.title, task.description, task.taskGrp);
  });
}
function createDivTasks(title, desc, grp) {
  try {
    // Create a container div for the task
    let taskContainer = document.createElement("div");
    taskContainer.id = "divCreateContainerId";
    taskContainer.classList.add("form-check");

    // Create the checkbox input element
    let checkboxInput = document.createElement("input");
    checkboxInput.classList.add("form-check-input");
    checkboxInput.type = "checkbox";
    checkboxInput.id = "personalTaskAssign"; // Make sure this ID is unique
    taskContainer.appendChild(checkboxInput);

    // Create the label element for the checkbox
    let labelElement = document.createElement("label");
    labelElement.classList.add("form-check-label");
    labelElement.htmlFor = checkboxInput.id; // Associate label with checkbox

    // Create a <strong> element for the title to make it bold
    let titleElement = document.createElement("strong");
    titleElement.textContent = `${title}:`;

    // Append the title and description text nodes to the label element
    labelElement.appendChild(titleElement);
    labelElement.appendChild(document.createTextNode(` ${desc}`));

    // Append the label element to the task container
    taskContainer.appendChild(labelElement);

    // Append the task container to the personalTab

    switch (grp) {
      case "Personal":
        personalTab.appendChild(taskContainer);
        break;
      case "Work":
        workTab.appendChild(taskContainer);
        break;
      case "Others":
        othersTab.appendChild(taskContainer);
        break;
      default:
        tasks.pop();
        addTFToast.show();
    }
  } catch (error) {}
}
function dropdownEventsShowFunc(dropdown) {
  dropdown.innerHTML = "<option>Open this select menu</option>";
  for (let i = 0; i < tasks.length; i++) {
    let descShort =
      tasks[i].description.length > 25
        ? tasks[i].description.substring(0, 25) + "..."
        : tasks[i].description;
    let dropdownValues = `${tasks[i].title}: ${descShort} | ${tasks[i].taskGrp}`;
    let updateDropdownOpt = document.createElement("option");
    updateDropdownOpt.setAttribute("value", i);
    updateDropdownOpt.innerText = dropdownValues;
    dropdown.appendChild(updateDropdownOpt);
  }
}

udpateTaskBtn.addEventListener("click", () => {
  dropdownEventsShowFunc(updateDropdown);
});

updateTaskDropdown.addEventListener("change", () => {
  try {
    const selectedIndex = updateTaskDropdown.value;
    const selectedTask = tasks[selectedIndex];
    const options = updateTaskModalTGrp.options;
    if (selectedTask == undefined) {
      updateTaskModalTitle.value = "";
      updateTaskModalDesc.value = "";
      options.selected = updateTaskModalTGrp.setAttribute("disabled", "");
      if (options.value != "Open this select menu") {
        options[0].selected = true;
      }
    }
    updateTaskModalTitle.value = selectedTask.title;
    updateTaskModalDesc.value = selectedTask.description;
    updateTaskModalTGrp.removeAttribute("disabled");

    for (let i = 0; i < options.length; i++) {
      if (options[i].value === selectedTask.taskGrp) {
        options[i].selected = true;
        break; // Exit loop once the option is selected
      }
    }
  } catch (error) {}
});
// Function to update the task and replace its value in the task object array
function updateTask() {
  const selectedIndex = updateTaskDropdown.value;
  const selectedTask = tasks[selectedIndex];

  // Get updated values from the modal inputs
  const updatedTitle = updateTaskModalTitle.value;
  const updatedDesc = updateTaskModalDesc.value;
  const updatedTaskGrp = updateTaskModalTGrp.value;

  // Update properties of the selected task
  selectedTask.title = updatedTitle;
  selectedTask.description = updatedDesc;
  selectedTask.taskGrp = updatedTaskGrp;

  // Replace the task object at the selected index with the updated task object
  tasks[selectedIndex] = selectedTask;

  clearInpContent(
    updateTaskModalTitle,
    updateTaskModalDesc,
    updateTaskModalTGrp
  );
  updateTaskModalTGrp.setAttribute("disabled", true); // Disable task group dropdown

  // Close the modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalUpdateTask")
  );
  modal.hide();
  loopCreateDivTask();
}

// Event listener for the "Update Task" button click
document.getElementById("btnUpdateTask").addEventListener("click", () => {
  updateTask();
  updateTToast.show();
});

deleteTaskOBtn.addEventListener("click", () => {
  dropdownEventsShowFunc(deleteDropdown);
});

// Function to delete the selected task
function deleteTask() {
  try {
    const selectedIndex = updateTaskDropdown.value;
    tasks.splice(selectedIndex, 1);
  } catch (error) {
    console.error(error);
  }
}

deleteTaskModalBtn.addEventListener("click", () => {
  deleteTask();
  loopCreateDivTask();
  deleteTaskModal.hide();
  deleteTToast.show();
});
