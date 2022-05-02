import '../node_modules/normalize.css/normalize.css';
import './styles/style.css';

import { folderController, folderFactory, toDoFactory } from './todomechanism';

import format from '../node_modules/date-fns/format';
import isEqual from 'date-fns/isEqual';

import blankCheckSvg from './assets/svg/check-blank.svg';
import imptBtnSvg from './assets/svg/important.svg';
import editBtnSvg from './assets/svg/edit.svg';
import delBtnSvg from './assets/svg/delete.svg';

// const toDoDetailsForm = document.querySelector('#toDoDetails');
// const toDoDetailsBtn = document.querySelector('#toDoDetailsBtn');

// toDoDetailsBtn.addEventListener('click', handleDetailsClick);

let defaultFolder = folderFactory('myProject');

const projWrapper = document.querySelector('#proj-name-wrapper');
const todoWrapper = document.querySelector('#todo-wrapper');
const displaySectionWrapper = document.querySelector('#display-section-wrapper');

// initialize default folder on first visit
if (folderController.mainAppArray.length === 0) {
    folderController.addFolderIntoArray(defaultFolder);
    const exampleToDo = toDoFactory('Create my first To Do', 'Create my first To Do!', new Date(2000, 11, 17), true);
    const exampleToDo2 = toDoFactory('Create my first To Do', 'Create my first To Do!', new Date(1998, 11, 17), false);
    defaultFolder.addToDoIntoFolder(exampleToDo);
    defaultFolder.addToDoIntoFolder(exampleToDo2);
    console.log(folderController.mainAppArray);
}

// function to display folder name on sidebar
function displayFolderName() {

    console.log('I am called');

    // get folder names from array
    const currentFolderNames = folderController.mainAppArray.map((folder) => folder.name);
    
    // sort by alphabetical order
    currentFolderNames.sort((a,b) => a>b? 1:-1);

    // create DOM elements for each element in array
    currentFolderNames.forEach((item) => {
        const folderWrapper = document.createElement('div');
        folderWrapper.classList.add('indiv-proj-wrapper');

        const folderName = document.createElement('h3');
        folderName.innerText = `${item}`;

        folderWrapper.append(folderName);
        projWrapper.append(folderWrapper);
        
    });
}

// function to display todo in a todo box
function displayToDo(folder) {

    // sort the todos by due date
    folder.sortByDueDate();

    folder.toDoArray.forEach((todo, index, arr) => {

    // create DOM elements
    const date = document.createElement('h2');
    date.classList.add('date-heading');
    date.setAttribute('data-date',"");
    date.innerText = `${format(todo.dueDate, "cccc, do MMMM yyyy")}`;
    
    // initialise create date
    if (index === 0) todoWrapper.append(date);

    // if current date !== last date, create date 
    if (index !==0 && !isEqual(arr[index].dueDate, arr[index-1].dueDate)) todoWrapper.append(date);

    const todoBox = document.createElement('div');
    todoBox.classList.add('todo-box');
    const checkBoxWrap = document.createElement('div');
    checkBoxWrap.classList.add('check-box');

    const blankCheck = document.createElement('img');
    blankCheck.src = blankCheckSvg;
    blankCheck.classList.add('icons', 'bl-chk');
    checkBoxWrap.append(blankCheck);

    const todoTitle = document.createElement('p');
    todoTitle.innerText = `${todo.title}`;

    const todoActionsBox = document.createElement('div');
    todoActionsBox.classList.add('todo-actions');

    const imptBtn = document.createElement('img');
    imptBtn.src = imptBtnSvg;
    imptBtn.classList.add('icons');
    const editBtn = document.createElement('img');
    editBtn.src = editBtnSvg;
    editBtn.classList.add('icons');
    const delBtn = document.createElement('img');
    delBtn.src = delBtnSvg;
    delBtn.classList.add('icons');
    delBtn.setAttribute('data-delete',"");
    delBtn.setAttribute('data-parent-folder-id', `${folder.id}`)
    delBtn.addEventListener('click', deleteToDoFromArrays);

    
    if (todo.priority === true) todoActionsBox.append(imptBtn);
    todoActionsBox.append(editBtn, delBtn);

    todoBox.append(checkBoxWrap, todoTitle, todoActionsBox);
    todoWrapper.append(todoBox);

    });

}

// only removes the specific item
function handleDelete(e) {
    // resetting btns array so that btns index is the same as folder index
    const btns = Array.from(document.querySelectorAll('[data-delete]'));

    // get index of the target btn
    const index = btns.findIndex((btn) => btn === e.target)
    console.log(index);
    
    // find folder with the dataset name
    const folder = folderController.mainAppArray.find((item) => item.id === e.target.dataset.parentFolderId);
    console.log(folder);

    // simply delete a todo 
    // from DOM (+ date)
    e.target.parentElement.parentElement.remove();

    // from btns array
    btns.splice(index, 1);
    
    // from folder array
    folder.toDoArray.splice(index, 1);

};


// bad points: wipes entire page then refreshes
function deleteToDoFromArrays(e) {
    // resetting btns array so that btns index is the same as folder index
    const btns = Array.from(document.querySelectorAll('[data-delete]'));

    // get index of the target btn
    const index = btns.findIndex((btn) => btn === e.target)
    console.log(index);
    
    // find folder with the dataset name
    const folder = folderController.mainAppArray.find((item) => item.id === e.target.dataset.parentFolderId);
    console.log(folder);
    
    // from btns array
    btns.splice(index, 1);
    
    // from folder array
    folder.toDoArray.splice(index, 1);

    // remove everything from todo-wrapper
    removeChildFromParent(todoWrapper);

    displayToDo(folder);
}

function removeChildFromParent(elem) {
    while (elem.firstChild) {
        elem.firstChild.remove();
    }
}





displayToDo(defaultFolder);

// function to delete todos

// function to delete folders

// functon to display folder name on display section

// function to display completed todos below pending todos

// local storage

function handleDetailsClick(e) {
    e.preventDefault();

    // make new todo and add into array
    const newToDo = toDoFactory(toDoDetailsForm.title.value, toDoDetailsForm.description.value, toDoDetailsForm.dueDate.value, toDoDetailsForm.priority.checked);
    defaultFolder.addToDoIntoFolder(newToDo);
    console.log(defaultFolder.toDoArray);
    console.log(folderController.mainAppArray);
}

