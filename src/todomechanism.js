let mainAppArray = [];

const rearrangeFolderOrder = function() {

}

const addFolderIntoArray = function(folderObj) {
    mainAppArray.push(folderObj);
}

const folderFactory = function(name) {
    let _name = name;

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


    return {
        get name() {
            return _name;
        },

        get toDoArray() {
            return toDoArray;
        },

        addToDoIntoFolder,
        removeToDoFromFolder,
        changeNameOfFolder
    }
}

const toDoFactory = function(title, description, dueDate, priority) {
    let _title = title;
    let _description = description;
    let _dueDate = dueDate;
    let _priority = priority;

    const changeContent = (prop, newProp) => {
        prop = newProp;
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

        changeContent
    }
}

export { folderFactory, toDoFactory };