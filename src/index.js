import '../node_modules/normalize.css/normalize.css';
import './styles/style.css';

import { folderController, folderFactory, toDoFactory } from './todomechanism';

import format from '../node_modules/date-fns/format';

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
    const exampleToDo = toDoFactory('Create my first To Do', 'Create my first To Do!', format(new Date(), 'dd/MM/yyyy'), true);
    const exampleToDo2 = toDoFactory('Create my first To Do', 'Create my first To Do!', format(new Date(), 'dd/MM/yyyy'), false);
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

    folder.toDoArray.forEach((todo, index) => {

    // create DOM elements
    const date = document.createElement('h2');
    date.classList.add('date-heading');
    
    // initialise create date
    if (index === 0) date.parentElement.append(date); 

    // if current date !== last date, create date 
    if (todo[index].dueDate === todo[index-1].dueDate) date.parentElement.append(date);

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

    
    if (todo.priority === true) todoActionsBox.append(imptBtn);
    todoActionsBox.append(editBtn, delBtn);

    todoBox.append(checkBoxWrap, todoTitle, todoActionsBox);
    todoWrapper.append(todoBox);

    });

    
    

    // display due date on top of the todo box


}

displayToDo(defaultFolder);

// functon to display folder name on display section

// function to display date on display section


function handleDetailsClick(e) {
    e.preventDefault();

    // make new todo and add into array
    const newToDo = toDoFactory(toDoDetailsForm.title.value, toDoDetailsForm.description.value, toDoDetailsForm.dueDate.value, toDoDetailsForm.priority.checked);
    defaultFolder.addToDoIntoFolder(newToDo);
    console.log(defaultFolder.toDoArray);
    console.log(folderController.mainAppArray);
}

