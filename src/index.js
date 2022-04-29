import '../node_modules/normalize.css/normalize.css';
import './styles/style.css';

import { folderController, folderFactory, toDoFactory } from './todomechanism';

const toDoDetailsForm = document.querySelector('#toDoDetails');
const toDoDetailsBtn = document.querySelector('#toDoDetailsBtn');

toDoDetailsBtn.addEventListener('click', handleDetailsClick);

let defaultFolder = folderFactory('My Projects');

// initialize default folder on first visit
if (folderController.mainAppArray.length === 0) {
    folderController.addFolderIntoArray(defaultFolder);
    console.log(folderController.mainAppArray);
}

function handleDetailsClick(e) {
    e.preventDefault();

    // make new todo and add into array
    const newToDo = toDoFactory(toDoDetailsForm.title.value, toDoDetailsForm.description.value, toDoDetailsForm.dueDate.value, toDoDetailsForm.priority.checked);
    defaultFolder.addToDoIntoFolder(newToDo);
    console.log(defaultFolder.toDoArray);
    console.log(folderController.mainAppArray);
}

