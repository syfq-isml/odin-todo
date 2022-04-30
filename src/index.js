import '../node_modules/normalize.css/normalize.css';
import './styles/style.css';

import { folderController, folderFactory, toDoFactory } from './todomechanism';

// const toDoDetailsForm = document.querySelector('#toDoDetails');
// const toDoDetailsBtn = document.querySelector('#toDoDetailsBtn');

// toDoDetailsBtn.addEventListener('click', handleDetailsClick);

let defaultFolder = folderFactory('myProject');


const projWrapper = document.querySelector('#proj-name-wrapper');

const displaySectionWrapper = document.querySelector('#display-section-wrapper');

// initialize default folder on first visit
if (folderController.mainAppArray.length === 0) {
    folderController.addFolderIntoArray(defaultFolder);
    console.log(folderController.mainAppArray);
}

displayFolderName();


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
function displayToDo() {
    // create DOM elements
    const todoBox = document.createElement('div');
        todoBox.innerText = `${folderName}`;
        displaySectionWrapper.append(todoBox);

}

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

