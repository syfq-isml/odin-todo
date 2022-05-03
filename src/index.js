import '../node_modules/normalize.css/normalize.css';
import './styles/style.css';

import { folderController, folderFactory, toDoFactory } from './todomechanism';

import format from 'date-fns/format';
import isEqual from 'date-fns/isEqual';
import parseISO from 'date-fns/parseISO';

import expandMoreSvg from './assets/svg/expand-more.svg';
import expandLessSvg from './assets/svg/expand-less.svg';
import blankCheckSvg from './assets/svg/check-blank.svg';
import filledCheckSvg from './assets/svg/check-filled.svg';
import doneSvg from './assets/svg/done.svg';
import imptBtnSvg from './assets/svg/important.svg';
import editBtnSvg from './assets/svg/edit.svg';
import delBtnSvg from './assets/svg/delete.svg';

let defaultFolder = folderFactory('myProject');

const projWrapper = document.querySelector('#proj-name-wrapper');
const todoWrapper = document.querySelector('#todo-wrapper');
const displaySectionWrapper = document.querySelector('#display-section-wrapper');
const initGreeting = document.querySelector('#init-greeting');

const addNewProjBtn = document.querySelector('#add-new-btn');

const todoModal = document.querySelector('#todo-modal');
const toDoDetailsForm = document.querySelector('#toDoDetails');
const todoModalBtn = document.querySelector('#todoModalBtn');

todoModalBtn.addEventListener('click', handleDetailsClick);


// initialize default folder on first visit
if (folderController.mainAppArray.length === 0) {
    folderController.addFolderIntoArray(defaultFolder);
    const exampleToDo = toDoFactory('Create your first task!', "Go on, we'll wait", new Date(), false, false);
    const exampleToDo2 = toDoFactory("Here's an example of a priority task!", 'See the exclamation point icon on the right?', new Date(), true, false);
    const exampleToDo3 = toDoFactory("Tasks that are done will appear like so.", "Once you're ready, you can delete these example tasks.", new Date(), false, true);
    defaultFolder.addToDoIntoFolder(exampleToDo);
    defaultFolder.addToDoIntoFolder(exampleToDo2);
    defaultFolder.addToDoIntoFolder(exampleToDo3);
    console.log(folderController.mainAppArray);
    displayFolderName();
}

addNewProjBtn.addEventListener('click', addNewFolder);

// function to add folder on click
function addNewFolder() {
    // opens up an input + 'confirm' btn below
    const input = document.createElement('input');
    input.setAttribute('type','text');
    input.classList.add('folder-input');

    const confirm = document.createElement('button');
    confirm.innerText = 'ADD';
    confirm.setAttribute('type','button');
    confirm.classList.add('side-buttons');

    projWrapper.append(input, confirm);

    // hide the big 'add new proj' btn for now
    addNewProjBtn.style.display = 'none';

    confirm.addEventListener('click', () => {

        // get input & produce new folder
        const newFolder = folderFactory(input.value);
        folderController.addFolderIntoArray(newFolder);
    
        // display folder name on sidebar
        displayFolderName();

        // reset everything (hide confirm, hide input, reappear big btn)
        input.remove();
        confirm.remove();
        addNewProjBtn.style.display = 'block';

    })
}


// function to display folder name on sidebar
function displayFolderName() {

    console.log('I am called');

    // wipe DOM clean
    removeChildFromParent(projWrapper);


    // get folder names from array
    // const currentFolderNames = folderController.mainAppArray.map((folder) => folder.name);
    
    // sort by alphabetical order
    // currentFolderNames.sort((a,b) => a>b? 1:-1);

    // create DOM elements for each element in array
    folderController.mainAppArray.forEach((item) => {
        const folderWrapper = document.createElement('div');
        folderWrapper.classList.add('indiv-proj-wrapper');
        folderWrapper.setAttribute('data-parent-folder-id', `${item.id}`);
        folderWrapper.addEventListener('click', displayFolderContent);

        const folderName = document.createElement('h3');
        folderName.innerText = `${item.name}`;

        folderWrapper.append(folderName);
        projWrapper.append(folderWrapper);
        
    });
}

// function to display folder contents in display section
function displayFolderContent(e) {
    
    // wipe DOM entire section 
    initGreeting.style.display ='none';
    // attempt to remove everything within wrapper except for todo-wrapper
    const _prev = document.querySelectorAll('[data-erase]');
    _prev.forEach((elem) => elem.remove());
    const allTodos = document.querySelectorAll('.todo-box');
    allTodos.forEach((todo) => todo.remove());
    

    // create new DOM elements
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header-div');
    headerDiv.setAttribute('data-erase',"");

    const headerName = document.createElement('div');
    headerName.classList.add('header-name');

    const headerActions = document.createElement('div');
    headerActions.classList.add('header-actions');

    const editBtn = document.createElement('img');
    editBtn.src = editBtnSvg;
    
    const delBtn = document.createElement('img');
    delBtn.src = delBtnSvg;
    delBtn.setAttribute('data-delete-header',"");

    headerActions.append(editBtn, delBtn);
    
    const headerWords = document.createElement('h1');

    // find the folder
    const folder = folderController.mainAppArray.find((item) => item.id === e.target.dataset.parentFolderId);
    
    console.log(folder);

    headerWords.innerText = `${folder.name}`;
    headerName.append(headerWords);

    headerDiv.append(headerName, headerActions);
    displaySectionWrapper.append(headerDiv);

    displayToDo(folder);

    const bottomArea = document.createElement('div');
    bottomArea.classList.add('bottom-area');
    bottomArea.setAttribute('data-erase',"");

    const newBtn = document.createElement('button');
    newBtn.innerText = "+ ADD NEW TASK";
    newBtn.setAttribute('data-parent-folder-id',`${folder.id}`);
    newBtn.addEventListener('click', addNewTodoIntoFolder);

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
        const warning = document.createElement('h2');
        warning.setAttribute('data-erase',"");
        warning.innerText='You have no current tasks...';
        todoWrapper.append(warning);
    }

    // sort the todos by due date
    folder.sortByDueDate();

    folder.toDoArray.forEach((todo, index, arr) => {

    // create DOM elements
    const date = document.createElement('h2');
    date.classList.add('date-heading');
    date.setAttribute('data-date',"");
    date.setAttribute('data-erase',"");
    date.innerText = `${format(todo.dueDate, "cccc, do MMMM yyyy")}`;
    
    // initialise create date
    if (index === 0) todoWrapper.append(date);

    // if current date !== last date, create date 
    if (index !==0 && !isEqual(arr[index].dueDate, arr[index-1].dueDate)) todoWrapper.append(date);

    const todoBox = document.createElement('div');
    todoBox.classList.add('todo-box');
    // adding id to add function to expand the todo box
    todoBox.setAttribute('data-todo-id',`${todo.id}`);

    
    const checkBoxWrap = document.createElement('div');
    checkBoxWrap.classList.add('check-box');
    
    const blankCheck = document.createElement('img');
    if (!todo.isDone) {
        blankCheck.src = blankCheckSvg;

    } else {
        blankCheck.src = filledCheckSvg;
        todoBox.classList.add('status-done');
    };
    
    blankCheck.classList.add('icons', 'bl-chk');
    blankCheck.addEventListener('click', () => {
        // if checked, uncheck it
        if (blankCheck.src === filledCheckSvg) {
            blankCheck.src = blankCheckSvg;
            todo.changeStatus(false);
            todoBox.classList.remove('status-done');
        }

        // if unchecked, check it (meaning its complete)
        else {
            blankCheck.src = filledCheckSvg;
            todo.changeStatus(true);
            todoBox.classList.add('status-done');
        }
    });

    checkBoxWrap.append(blankCheck);
    
    const expandBtn = document.createElement('img');
    expandBtn.src = expandMoreSvg;
    expandBtn.classList.add('icons');
    expandBtn.setAttribute('title','Expand');
    expandBtn.onclick = function() {
        // if not expanded, expand it
        if (expandBtn.src === expandMoreSvg) {
            expandBtn.src = expandLessSvg;
            expanding.style.display = 'block';
        }
        else {
            expandBtn.src = expandMoreSvg;
            expanding.style.display = 'none';
        }
    }
    
    const mainWrapper = document.createElement('div');

    const todoTitle = document.createElement('p');
    todoTitle.innerText = `${todo.title}`;

    const expanding = document.createElement('div');
    const expandingP = document.createElement('p');
    expanding.classList.add('todo-expanding');
    expandingP.innerText = `Description:\n"${todo.description}"`;
    expanding.append(expandingP);
    expanding.style.display = 'none';

    mainWrapper.append(todoTitle,expanding);

    const todoActionsBox = document.createElement('div');
    todoActionsBox.classList.add('todo-actions');

    const imptBtn = document.createElement('img');
    imptBtn.src = imptBtnSvg;
    imptBtn.classList.add('icons','prio-btn');
    imptBtn.setAttribute('title','This task is of high priority!');

    const editBtn = document.createElement('img');
    editBtn.src = editBtnSvg;
    editBtn.classList.add('icons');
    editBtn.setAttribute('title','Edit');

    const delBtn = document.createElement('img');
    delBtn.src = delBtnSvg;
    delBtn.classList.add('icons');
    delBtn.setAttribute('title','Delete');
    delBtn.setAttribute('data-delete',"");
    delBtn.setAttribute('data-parent-folder-id', `${folder.id}`)
    delBtn.addEventListener('click', deleteToDoFromArrays);

    
    todoActionsBox.append(imptBtn, editBtn, delBtn);
    
    if (!todo.priority) {
        imptBtn.style.display ='none';
    }

    todoBox.append(checkBoxWrap, expandBtn, mainWrapper, todoActionsBox);
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


// function to add todo into folder (use id that is tagged to button --- need to add parent-folder-id again)
function addNewTodoIntoFolder(e) {

    // difficult to pass the folder obj to the submit button without adding an event listener here (will be called many times otherwise)
    // for now, let's assign the id of the folder onto the modal's submit button and find it again
    todoModalBtn.setAttribute('data-parent-folder-id', `${e.target.dataset.parentFolderId}`);
    todoModal.showModal();
    
}


// function to edit folder name

// function to edit todo details

// function to delete folders

// local storage

// add isExpanded to remember if todo is expanded or not

let counter = 0;
function handleDetailsClick(e) {

    counter++;

    const folder = folderController.mainAppArray.find((item) => item.id === e.target.dataset.parentFolderId);

    // make new todo and add into array
    const newToDo = toDoFactory(toDoDetailsForm.title.value, toDoDetailsForm.description.value, new Date(toDoDetailsForm.dueDate.value), toDoDetailsForm.priority.checked);
    folder.addToDoIntoFolder(newToDo);
    console.log(folder.toDoArray);
    console.log(counter);
    // console.log(folderController.mainAppArray);

    todoModal.close();
    toDoDetailsForm.reset();

    removeChildFromParent(todoWrapper);
    displayToDo(folder);
    // displayFolderContent(e);
    
}

function isInputEmpty(selector) {
    const inputs = Array.from(document.querySelectorAll(selector));
    const result = inputs.indexOf("");
    if (result === -1) return false;
    return true;
    
}

