/*
function onSubmit() {
    let todo = textfield.value;
    if (!todo)
        return;

    let item = createItem(localStorage.lastTodoItemIndex++, todo);
    todolist.appendChild(item);

    localStorage[item.id] = todo;
    textfield.value = "";
}

function onClear() {
    todolist.innerHTML = "";
    localStorage.clear();
    localStorage.lastTodoItemIndex = 0;
}

function onDone(item) {
    item.className = "doneitem";
}

function onRemove(item) {
    delete localStorage[item.id];
    item.parentNode.removeChild(item);
}

function createButton(id, text) {
    let btn = document.createElement("button");
    btn.id = "todo" + text + id + "-id";
    btn.className = "todobtn";
    btn.innerText = text;

    return btn;
}

function createItem(id, text) {
    let item = document.createElement("li");
    item.className = "todoitem";
    item.id = "todoitem" + id + "-id";
    item.innerText = text;
    
    let btnDone = createButton(id, "done");
    let btnRemove = createButton(id, "remove");

    item.appendChild(btnDone);
    item.appendChild(btnRemove);

    btnDone.addEventListener("click", function() { onDone(item); });
    btnRemove.addEventListener("click", function() { onRemove(item); });

    return item;
}

let btnSubmit = document.getElementById("todosubmit-id");
let btnClear = document.getElementById("todoclear-id");
let textfield = document.getElementById("todoinput-id");
let todolist = document.getElementById("todolist-id");

if (localStorage.lastTodoItemIndex === undefined) {
    localStorage.lastTodoItemIndex = 0;
}

for (key in localStorage) {
    if (key.slice(0, 8) == "todoitem") {
        let item = createItem(parseInt(key.slice(8)), localStorage[key]);
        todolist.appendChild(item);
    }
}

btnSubmit.addEventListener("click", onSubmit);
btnClear.addEventListener("click", onClear);
*/

require("./Model").initModel();
require("./View").initView();