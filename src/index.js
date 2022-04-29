import '../node_modules/normalize.css/normalize.css';
import './styles/style.css';

import { folderFactory, toDoFactory } from './todomechanism';

let folder1 = folderFactory('MAIN');

let todo1 = toDoFactory('feed', 'feed fish', 'today', 'important');
let todo2 = toDoFactory('x','y','z','1');

folder1.addToDoIntoFolder(todo1);
folder1.addToDoIntoFolder(todo2);

console.log(folder1.toDoArray);


folder1.removeToDoFromFolder(todo1);

console.log(folder1.toDoArray);
