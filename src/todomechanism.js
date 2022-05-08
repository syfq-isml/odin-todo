
import { compareAsc } from "date-fns";
import format from "date-fns/format";
import { v4 as uuidv4 } from 'uuid';

const folderController = (function(){
    let mainAppArray = [];

    const rearrangeFolderOrder = function() {

    }

    const addFolderIntoArray = (folderObj) => {
        mainAppArray.push(folderObj);
    }

    const removeFolderFromArray = (index) => {
        mainAppArray.splice(index, 1);
    }

    return {
        mainAppArray, 
        addFolderIntoArray, 
        removeFolderFromArray
    };
})();

const folderFactory = function(name) {
    let _name = name;

    const _id = uuidv4();

    let toDoArray = [];

    const addToDoIntoFolder = (toDoObj) => {
        toDoArray.push(toDoObj);
    }

    const removeToDoFromFolder = (index) => {
        toDoArray.splice(index, 1);
    }

    const changeName = (newName) => {
        _name = newName;
    }

    const sortByDueDate = () => {
        toDoArray.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    }


    return {
        get name() {
            return _name;
        },

        get id() {
            return _id;
        },

        get toDoArray() {
            return toDoArray;
        },

        addToDoIntoFolder,
        removeToDoFromFolder,
        changeName,
        sortByDueDate
    }
}

const toDoFactory = function(title, description, dueDate, priority, isDone) {
    let _title = title;
    let _description = description;
    let _dueDate = dueDate;
    let _priority = priority;
    let _isDone = isDone;
    const _id = uuidv4();

    const changeStatus = (newStatus) => {
        _isDone = newStatus;
    }

    const editAllDetails = (newTitle, newDesc, newDate, newPrio) => {
        _title = newTitle;
        _description = newDesc;
        _dueDate = newDate;
        _priority = newPrio;
    }



    return {
        get title() {
            return _title
        },

        get description() {
            return _description
        },

        get dueDate() {
            return _dueDate
        },

        get priority() {
            return _priority
        },

        get id() {
            return _id
        },

        get isDone() {
            return _isDone
        },

        changeStatus,
        editAllDetails
    }
}

const REfolderFactory = function(name, id, arr) {
    let _name = name;

    const _id = id;

    let toDoArray = arr;

    const addToDoIntoFolder = (toDoObj) => {
        toDoArray.push(toDoObj);
    }

    const removeToDoFromFolder = (index) => {
        toDoArray.splice(index, 1);
    }

    const changeName = (newName) => {
        _name = newName;
    }

    const sortByDueDate = () => {
        toDoArray.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    }


    return {
        get name() {
            return _name;
        },

        get id() {
            return _id;
        },

        get toDoArray() {
            return toDoArray;
        },

        addToDoIntoFolder,
        removeToDoFromFolder,
        changeName,
        sortByDueDate
    }
}

const REtoDoFactory = function(title, description, dueDate, priority, isDone, id) {
    let _title = title;
    let _description = description;
    let _dueDate = dueDate;
    let _priority = priority;
    let _isDone = isDone;
    const _id = id;

    const changeStatus = (newStatus) => {
        _isDone = newStatus;
    }

    const editAllDetails = (newTitle, newDesc, newDate, newPrio) => {
        _title = newTitle;
        _description = newDesc;
        _dueDate = newDate;
        _priority = newPrio;
    }



    return {
        get title() {
            return _title
        },

        get description() {
            return _description
        },

        get dueDate() {
            return _dueDate
        },

        get priority() {
            return _priority
        },

        get id() {
            return _id
        },

        get isDone() {
            return _isDone
        },

        changeStatus,
        editAllDetails
    }
}


export { folderController, folderFactory, toDoFactory, REfolderFactory, REtoDoFactory };