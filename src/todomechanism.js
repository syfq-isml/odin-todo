
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

    const removeToDoFromFolder = (toDoObj) => {
        let index = toDoArray.findIndex((obj) => {
            obj.title === toDoObj.title;
        });
        toDoArray.splice(index, 1);
    }

    const changeNameOfFolder = (newName) => {
        name = newName;
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
        changeNameOfFolder,
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

    const changeContent = (prop, newProp) => {
        prop = newProp;
    }

    const changeStatus = (newStatus) => {
        _isDone = newStatus;
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

        changeContent,
        changeStatus
    }
}

export { folderController, folderFactory, toDoFactory };