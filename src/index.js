import "../node_modules/normalize.css/normalize.css";
import "./styles/style.css";

import {
	folderController,
	folderFactory,
	toDoFactory,
	REfolderFactory,
	REtoDoFactory,
} from "./todomechanism";

import format from "date-fns/format";
import isEqual from "date-fns/isEqual";
import set from "date-fns/set";
import parseISO from "date-fns/parseISO";
import isValid from "date-fns/isValid";
import isExists from "date-fns/isExists";
import { isSameDay } from "date-fns";

import expandMoreSvg from "./assets/svg/expand-more.svg";
import expandLessSvg from "./assets/svg/expand-less.svg";
import blankCheckSvg from "./assets/svg/check-blank.svg";
import filledCheckSvg from "./assets/svg/check-filled.svg";
import cancelSvg from "./assets/svg/cancel.svg";
import doneSvg from "./assets/svg/done.svg";
import imptBtnSvg from "./assets/svg/important.svg";
import editBtnSvg from "./assets/svg/edit.svg";
import delBtnSvg from "./assets/svg/delete.svg";

let defaultFolder = folderFactory("myProject");

const projWrapper = document.querySelector("#proj-name-wrapper");
const todoWrapper = document.querySelector("#todo-wrapper");
const displaySectionWrapper = document.querySelector(
	"#display-section-wrapper"
);
const initGreeting = document.querySelector("#init-greeting");

const addNewProjBtn = document.querySelector("#add-new-btn");

const todoModal = document.querySelector("#todo-modal");
const toDoDetailsForm = document.querySelector("#toDoDetails");
const todoModalBtn = document.querySelector("#todoModalBtn");

let titleInput = document.querySelector("input#title");
const titleError = document.querySelector("input#title + span.error");
titleInput.addEventListener("keyup", () => {
	if (titleInput.value !== "") {
		titleError.innerText = "";
	} else {
		titleError.innerText = "Come on, at least give your task a title!";
	}
});

let dateInput = document.querySelector("input#dueDate");
const dateError = document.querySelector("input#dueDate + span.error");
dateInput.addEventListener("keyup", () => {
	if (dateInput.value !== "") {
		dateError.innerText = "";
	} else {
		dateError.innerText = "Enter a valid date!";
	}
});

todoModalBtn.addEventListener("click", handleDetailsClick);

const isString = (value) =>
	Object.prototype.toString.call(value) === "[object String]";

// bring out the local storage memory

let FIRST_VISIT = true;

if (localStorage.getItem("main")) {
	FIRST_VISIT = false;
	console.log("First visit: " + FIRST_VISIT);
	JSON.parse(localStorage.getItem("main")).forEach((folder) => {
		const newFolder = folderFactory(folder.name, folder.id);

		folder.toDoArray.forEach((todo) => {
			const newToDo = toDoFactory(
				todo.title,
				todo.description,
				todo.dueDate,
				todo.priority,
				todo.isDone,
				todo.id
			);

			newFolder.addToDoIntoFolder(newToDo);
		});

		folderController.addFolderIntoArray(newFolder);
	});
	console.log(folderController.mainAppArray);
}

window.addEventListener("beforeunload", () => {
	localStorage.setItem("main", JSON.stringify(folderController.mainAppArray));

	return null;
});

// initialize default folder on first visit
if (FIRST_VISIT) {
	console.log("IT ENTERS HERE");
	console.log("First visit: " + FIRST_VISIT);
	folderController.addFolderIntoArray(defaultFolder);
	const currentDate = Date.now();

	// set(new Date(), {
	// 	hours: 8,
	// 	minutes: 0,
	// 	seconds: 0,
	// 	milliseconds: 0,
	// });
	const exampleToDo = toDoFactory(
		"Create your first task!",
		"Go on, we'll wait",
		currentDate,
		false,
		false
	);
	const exampleToDo2 = toDoFactory(
		"Here's an example of a priority task!",
		"See the exclamation point icon on the right?",
		currentDate,
		true,
		false
	);
	const exampleToDo3 = toDoFactory(
		"Tasks that are done will appear like so.",
		"Once you're ready, you can delete these example tasks.",
		currentDate,
		false,
		true
	);
	defaultFolder.addToDoIntoFolder(exampleToDo);
	defaultFolder.addToDoIntoFolder(exampleToDo2);
	defaultFolder.addToDoIntoFolder(exampleToDo3);
	console.log("First visit initialization");
	displayFolderName();
} else {
	displayFolderName();
}

addNewProjBtn.addEventListener("click", addNewFolder);

// function to add folder on click
function addNewFolder() {
	// opens up an input + 'confirm' btn below
	const input = document.createElement("input");
	input.setAttribute("type", "text");
	input.classList.add("folder-input");

	const confirm = document.createElement("button");
	confirm.innerText = "ADD";
	confirm.setAttribute("type", "button");
	confirm.classList.add("side-buttons");

	projWrapper.append(input, confirm);

	// hide the big 'add new proj' btn for now
	addNewProjBtn.style.display = "none";

	confirm.addEventListener("click", () => {
		// get input & produce new folder
		const newFolder = folderFactory(input.value);
		folderController.addFolderIntoArray(newFolder);
		console.log("added new folder into controller");
		console.log(folderController.mainAppArray);

		// display folder name on sidebar
		displayFolderName();

		// reset everything (hide confirm, hide input, reappear big btn)
		input.remove();
		confirm.remove();
		addNewProjBtn.style.display = "block";
	});
}

// function to display folder name on sidebar
function displayFolderName() {
	// wipe DOM clean
	removeChildFromParent(projWrapper);

	// get folder names from array
	// const currentFolderNames = folderController.mainAppArray.map((folder) => folder.name);

	// sort by alphabetical order
	// currentFolderNames.sort((a,b) => a>b? 1:-1);

	// create DOM elements for each element in array
	folderController.mainAppArray.forEach((item) => {
		const folderWrapper = document.createElement("div");
		folderWrapper.classList.add("indiv-proj-wrapper");
		folderWrapper.setAttribute("data-parent-folder-id", `${item.id}`);
		folderWrapper.addEventListener("click", displayFolderContent);

		const folderName = document.createElement("h3");
		folderName.innerText = `${item.name}`;
		console.log("now showing the name");

		folderWrapper.append(folderName);
		projWrapper.append(folderWrapper);
	});
}

// function to display folder contents in display section
function displayFolderContent(e) {
	// wipe DOM entire section
	initGreeting.style.display = "none";

	// attempt to remove everything within wrapper except for todo-wrapper
	// const _prev = document.querySelectorAll('[data-erase]');
	// _prev.forEach((elem) => elem.remove());
	// const allTodos = document.querySelectorAll('.todo-box');
	// allTodos.forEach((todo) => todo.remove());
	wipeDOMCarefully();

	// find the folder
	const folder = folderController.mainAppArray.find(
		(item) => item.id === e.target.dataset.parentFolderId
	);
	console.log(folder);

	// create new DOM elements
	const headerDiv = document.createElement("div");
	headerDiv.classList.add("header-div");
	headerDiv.setAttribute("data-erase", "");

	const headerName = document.createElement("div");
	headerName.classList.add("header-name");

	const headerActions = document.createElement("div");
	headerActions.classList.add("header-actions");

	const editBtn = document.createElement("img");
	editBtn.src = editBtnSvg;
	editBtn.classList.add("big-icons");
	editBtn.setAttribute("title", "Edit project name");
	editBtn.setAttribute("data-parent-folder-id", `${folder.id}`);
	editBtn.addEventListener("click", editFolderName);

	const delBtn = document.createElement("img");
	delBtn.src = delBtnSvg;
	delBtn.classList.add("big-icons");
	delBtn.setAttribute("title", "Delete project folder");
	delBtn.setAttribute("data-delete-header", "");
	delBtn.addEventListener("click", () => deleteFolder(folder));

	headerActions.append(editBtn, delBtn);

	const headerWords = document.createElement("h1");

	headerWords.innerText = `${folder.name}`;
	headerName.append(headerWords);

	headerDiv.append(headerName, headerActions);
	displaySectionWrapper.append(headerDiv);

	displayToDo(folder);

	const bottomArea = document.createElement("div");
	bottomArea.classList.add("bottom-area");
	bottomArea.setAttribute("data-erase", "");

	const newBtn = document.createElement("button");
	newBtn.innerText = "+ ADD NEW TASK";
	newBtn.setAttribute("data-parent-folder-id", `${folder.id}`);
	newBtn.addEventListener("click", addNewTodoIntoFolder);

	bottomArea.append(newBtn);
	displaySectionWrapper.append(bottomArea);
}

// function to display todo in a todo box
function displayToDo(folder) {
	// create new TodoWrapper
	// const todoWrapper = document.createElement('div');
	// todoWrapper.setAttribute('id','todo-wrapper');
	// displaySectionWrapper.append(todoWrapper);

	if (folder.toDoArray.length === 0) {
		const warning = document.createElement("h2");
		warning.setAttribute("data-erase", "");
		warning.innerText = "You have no current tasks...";
		todoWrapper.append(warning);
	}

	// sort the todos by due date
	// folder.sortByDueDate();

	folder.toDoArray.forEach((todo, index, arr) => {
		// create DOM elements
		const date = document.createElement("h2");
		date.classList.add("date-heading");
		date.setAttribute("data-date", "");
		date.setAttribute("data-erase", "");

		if (isString(todo.dueDate)) {
			date.innerText = `${format(
				parseISO(todo.dueDate),
				"cccc, do MMMM yyyy"
			)}`;
		} else {
			date.innerText = `${format(todo.dueDate, "cccc, do MMMM yyyy")}`;
		}

		// initialise create date
		if (index === 0) todoWrapper.append(date);

		// if current date !== last date, create date
		if (isString(arr[index].dueDate)) {
			if (
				index !== 0 &&
				!isSameDay(
					parseISO(arr[index].dueDate),
					parseISO(arr[index - 1].dueDate)
				)
			)
				todoWrapper.append(date);
		} else {
			if (index !== 0 && !isSameDay(arr[index].dueDate, arr[index - 1].dueDate))
				todoWrapper.append(date);
		}

		const todoBox = document.createElement("div");
		todoBox.classList.add("todo-box");
		// adding id to add function to expand the todo box
		todoBox.setAttribute("data-todo-id", `${todo.id}`);

		const checkBoxWrap = document.createElement("div");
		checkBoxWrap.classList.add("check-box");

		const blankCheck = document.createElement("img");
		if (!todo.isDone) {
			blankCheck.src = blankCheckSvg;
		} else {
			blankCheck.src = filledCheckSvg;
			todoBox.classList.add("status-done");
		}

		blankCheck.classList.add("icons", "bl-chk");
		blankCheck.addEventListener("click", () => {
			// if checked, uncheck it
			if (blankCheck.src === filledCheckSvg) {
				blankCheck.src = blankCheckSvg;
				todo.changeStatus(false);
				todoBox.classList.remove("status-done");
			}

			// if unchecked, check it (meaning its complete)
			else {
				blankCheck.src = filledCheckSvg;
				todo.changeStatus(true);
				todoBox.classList.add("status-done");
			}
		});

		checkBoxWrap.append(blankCheck);

		const expandBtn = document.createElement("img");
		expandBtn.src = expandMoreSvg;
		expandBtn.classList.add("icons");
		expandBtn.setAttribute("title", "Expand");
		expandBtn.onclick = function () {
			// if not expanded, expand it
			if (expandBtn.src === expandMoreSvg) {
				expandBtn.src = expandLessSvg;
				expanding.style.display = "block";
			} else {
				expandBtn.src = expandMoreSvg;
				expanding.style.display = "none";
			}
		};

		const mainWrapper = document.createElement("div");

		const todoTitle = document.createElement("p");
		todoTitle.innerText = `${todo.title}`;

		const expanding = document.createElement("div");
		const expandingP = document.createElement("p");
		expanding.classList.add("todo-expanding");
		expandingP.innerText = `Description:\n${todo.description}`;
		expanding.append(expandingP);
		expanding.style.display = "none";

		mainWrapper.append(todoTitle, expanding);

		const todoActionsBox = document.createElement("div");
		todoActionsBox.classList.add("todo-actions");

		const imptBtn = document.createElement("img");
		imptBtn.src = imptBtnSvg;
		imptBtn.classList.add("icons", "prio-btn");
		imptBtn.setAttribute("title", "This task is of high priority!");

		const editBtn = document.createElement("img");
		editBtn.src = editBtnSvg;
		editBtn.classList.add("icons");
		editBtn.setAttribute("title", "Edit");
		editBtn.setAttribute("data-parent-folder-id", `${folder.id}`);
		editBtn.setAttribute("data-todo-id", `${todo.id}`);
		editBtn.addEventListener("click", editTodoDetails);

		const delBtn = document.createElement("img");
		delBtn.src = delBtnSvg;
		delBtn.classList.add("icons");
		delBtn.setAttribute("title", "Delete");
		delBtn.setAttribute("data-delete", "");
		delBtn.setAttribute("data-parent-folder-id", `${folder.id}`);
		delBtn.addEventListener("click", deleteToDoFromArrays);

		todoActionsBox.append(imptBtn, editBtn, delBtn);

		if (!todo.priority) {
			imptBtn.style.display = "none";
		}

		todoBox.append(checkBoxWrap, expandBtn, mainWrapper, todoActionsBox);
		todoWrapper.append(todoBox);

		// spawn in a empty box at the end to help with scrolling
		if (index === arr.length - 1) {
			console.log(index);
			const emptyBox = document.createElement("div");
			emptyBox.style.minHeight = "10px";
			emptyBox.style.width = "50px";
			emptyBox.setAttribute("data-erase", "");
			todoWrapper.append(emptyBox);
		}
	});
}

// only removes the specific item
function handleDelete(e) {
	// resetting btns array so that btns index is the same as folder index
	const btns = Array.from(document.querySelectorAll("[data-delete]"));

	// get index of the target btn
	const index = btns.findIndex((btn) => btn === e.target);
	console.log(index);

	// find folder with the dataset name
	const folder = folderController.mainAppArray.find(
		(item) => item.id === e.target.dataset.parentFolderId
	);
	console.log(folder);

	// simply delete a todo
	// from DOM (+ date)
	e.target.parentElement.parentElement.remove();

	// from btns array
	btns.splice(index, 1);

	// from folder array
	folder.toDoArray.splice(index, 1);
}

// bad points: wipes entire page then refreshes
function deleteToDoFromArrays(e) {
	// resetting btns array so that btns index is the same as folder index
	const btns = Array.from(document.querySelectorAll("[data-delete]"));

	// get index of the target btn
	const index = btns.findIndex((btn) => btn === e.target);
	console.log(index);

	// find folder with the dataset name
	const folder = folderController.mainAppArray.find(
		(item) => item.id === e.target.dataset.parentFolderId
	);
	console.log(folder);

	// from btns array
	btns.splice(index, 1);

	// from folder array
	folder.removeToDoFromFolder(index);
	console.log(folder.toDoArray);

	// remove everything from todo-wrapper
	removeChildFromParent(todoWrapper);

	displayToDo(folder);
}

function removeChildFromParent(elem) {
	while (elem.firstChild) {
		elem.firstChild.remove();
	}
}

// function to add todo into folder (use id that is tagged to button --- need to add parent-folder-id again)
function addNewTodoIntoFolder(e) {
	// difficult to pass the folder obj to the submit button without adding an event listener here (will be called many times otherwise)
	// for now, let's assign the id of the folder onto the modal's submit button and find it again
	todoModalBtn.setAttribute(
		"data-parent-folder-id",
		`${e.target.dataset.parentFolderId}`
	);
	todoModal.showModal();
}

function wipeDOMCarefully() {
	// attempt to remove everything within wrapper except for todo-wrapper
	const _prev = document.querySelectorAll("[data-erase]");
	_prev.forEach((elem) => elem.remove());
	const allTodos = document.querySelectorAll(".todo-box");
	allTodos.forEach((todo) => todo.remove());
}

// function to delete folders
function deleteFolder(folder) {
	// remove from main app array
	// find index from main app array
	const index = folderController.mainAppArray.findIndex(
		(item) => item.id === folder.id
	);
	// then remove it
	const deletedFolder = folderController.mainAppArray.splice(index, 1);
	wipeDOMCarefully();

	const deleteGreeting = document.createElement("h1");
	deleteGreeting.setAttribute("data-erase", "");
	deleteGreeting.innerHTML = `You've just deleted a project.<br><button type="button">Undo</button> or <button type="submit">View another?</button>`;
	displaySectionWrapper.append(deleteGreeting);

	const undoBtn = deleteGreeting.children[1];
	console.log(undoBtn);
	undoBtn.setAttribute("data-parent-folder-id", `${deletedFolder[0].id}`);
	console.log(deletedFolder[0].id);
	undoBtn.addEventListener("click", (e) =>
		undoDeleteFolder(e, deletedFolder, index)
	);

	const viewAnotherBtn = deleteGreeting.lastChild;
	// give button event object of a random folder index
	viewAnotherBtn.setAttribute(
		"data-parent-folder-id",
		`${generateRandomFolderIndex()}`
	);
	console.log(viewAnotherBtn);
	viewAnotherBtn.addEventListener("click", displayFolderContent);

	// remove from sidebar array (for now lets just reload entire array)
	displayFolderName();
}

function undoDeleteFolder(e, folder, index) {
	console.log(e);
	// add back into array
	folderController.mainAppArray.splice(index, 0, ...folder);

	// show back contents on DOM
	displayFolderContent(e);
	displayFolderName();
}

function generateRandomFolderIndex() {
	let limit = folderController.mainAppArray.length - 1;
	let rand = Math.floor(Math.random() * limit);
	return folderController.mainAppArray[rand].id;
}

function editTodoDetails(e) {
	// find parent folder
	const folder = folderController.mainAppArray.find(
		(item) => item.id === e.target.dataset.parentFolderId
	);
	// find todo within folder
	const todo = folder.toDoArray.find(
		(item) => item.id === e.target.dataset.todoId
	);

	// fill in inputs with current todo details
	toDoDetailsForm.title.value = todo.title;
	toDoDetailsForm.description.value = todo.description;
	toDoDetailsForm.priority.checked = todo.priority;
	console.log(todo.dueDate);
	toDoDetailsForm.dueDate.value = format(todo.dueDate, "yyyy-MM-dd");

	todoModalBtn.setAttribute("data-parent-folder-id", `${folder.id}`);
	todoModalBtn.setAttribute("data-todo-id", `${todo.id}`);
	todoModalBtn.setAttribute("data-edit-todo", "");

	// remove current eventlistener
	// add new eventlistener
	todoModal.showModal();
}

function editFolderName(e) {
	// find folder
	const folder = folderController.mainAppArray.find(
		(item) => item.id === e.target.dataset.parentFolderId
	);
	console.log(e.target.dataset.parentFolderId);

	// remove the name
	const headerWords = document.querySelector(".header-name h1");
	headerWords.style.display = "none";

	const headerName = document.querySelector(".header-name");

	// spawn a input box + btn
	const input = document.createElement("input");
	input.setAttribute("type", "text");
	input.value = `${folder.name}`;

	const confirm = document.createElement("img");
	confirm.src = doneSvg;
	confirm.classList.add("icons");

	const cancel = document.createElement("img");
	cancel.src = cancelSvg;
	cancel.classList.add("icons");

	headerName.append(input, confirm, cancel);

	// eventlistener for confirm
	confirm.addEventListener("click", () => {
		folder.changeName(input.value);
		console.log(folder.name);
		removeInputBtns();
		displayFolderName();
		displayFolderContent(e);
		console.log(e.target.dataset.parentFolderId);
	});

	// eventlistener for cancel
	cancel.addEventListener("click", () => {
		removeInputBtns();
		headerWords.style.display = "block";
	});

	// change folder name in array
	// display on sidebar
	//

	function removeInputBtns() {
		input.remove();
		confirm.remove();
		cancel.remove();
	}
}

// function to edit folder name

// do the stacking effect ( todos collide with "new" todo button)

// local storage

// add isExpanded to remember if todo is expanded or not

// add time aspect

function validateFormInputs() {
	// validate empty title field

	if (titleInput.value === "") {
		return false;
	}

	// display error message for empty title field

	// validate date
	// valide empty date field
	// console.log(dateInput.value);
	if (dateInput.value === "") {
		return false;
	}
	// incorrect date input automatically checked by date picker (returns "")

	// let numbers = dateInput.value.split('-');

	// numbers.forEach((number, index) => {
	//     if (number === "") numbers[index] = 99999;
	// })

	// if (isExists(numbers[0],numbers[1],numbers[2])) return false;
	// console.log('Date exists');

	return true;
}

function handleDetailsClick(e) {
	if (validateFormInputs() === false) return;

	const folder = folderController.mainAppArray.find(
		(item) => item.id === e.target.dataset.parentFolderId
	);

	// if editing todo, delete old one first
	if (todoModalBtn.hasAttribute("data-edit-todo")) {
		console.log("I am called");
		const todo = folder.toDoArray.find(
			(item) => item.id === e.target.dataset.todoId
		);
		// const index = folder.toDoArray.findIndex((item) => item === todo);
		// folder.toDoArray.splice(index, 1);
		// console.log('Todo removed');
		todo.editAllDetails(
			toDoDetailsForm.title.value,
			toDoDetailsForm.description.value,
			new Date(toDoDetailsForm.dueDate.value),
			toDoDetailsForm.priority.checked
		);

		todoModalBtn.removeAttribute("data-edit-todo");
	} else {
		// make new todo and add into array
		const newToDo = toDoFactory(
			toDoDetailsForm.title.value,
			toDoDetailsForm.description.value,
			new Date(toDoDetailsForm.dueDate.value),
			toDoDetailsForm.priority.checked,
			false
		);
		console.log(new Date(toDoDetailsForm.dueDate.value));
		folder.addToDoIntoFolder(newToDo);
		console.log(folder.toDoArray);
		// console.log(folderController.mainAppArray);
	}

	todoModal.close();
	toDoDetailsForm.reset();

	// refresh array
	removeChildFromParent(todoWrapper);
	displayToDo(folder);
	displayFolderContent(e);
}

function isInputEmpty(selector) {
	const inputs = Array.from(document.querySelectorAll(selector));
	const result = inputs.indexOf("");
	if (result === -1) return false;
	return true;
}

console.log("length @ end: " + folderController.mainAppArray.length);
