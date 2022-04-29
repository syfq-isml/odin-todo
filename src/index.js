import '../node_modules/normalize.css/normalize.css';
import './styles/style.css';

import { folderFactory, toDoFactory } from './todomechanism';

const toDoDetailsForm = document.querySelector('#toDoDetails');
const toDoDetailsBtn = document.querySelector('#toDoDetailsBtn');

toDoDetailsBtn.addEventListener('click', handleDetailsClick);

let folder1 = folderFactory('MAIN');

function handleDetailsClick(e) {
    e.preventDefault();

    // make new todo and add into array
    const newToDo = toDoFactory(toDoDetailsForm.title.value, toDoDetailsForm.description.value, toDoDetailsForm.dueDate.value, toDoDetailsForm.priority.checked);
    folder1.addToDoIntoFolder(newToDo);
    console.log(folder1.toDoArray);
}

