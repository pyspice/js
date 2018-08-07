function init () {
    btnSubmit = window.document.getElementById("todosubmit-id");
    btnClear = window.document.getElementById("todoclear-id");
    textfield = window.document.getElementById("todoinput-id");
    todolist = window.document.getElementById("todolist-id");
    
    for (it of presenter.getAllItems()) {
        let item = createItem(it[0], it[1], it[2]);
        todolist.appendChild(item);
    }

    btnSubmit.addEventListener("click", onSubmit);
    btnClear.addEventListener("click", onClear);
}

function onSubmit() {
    let todo = textfield.value;
    if (!todo)
        return;

    let id = presenter.getNewId();
    let item = createItem(id, todo, "todo");
    todolist.appendChild(item);

    textfield.value = "";

    presenter.addItem(id, todo);
}

function onClear() {
    todolist.innerHTML = "";
    presenter.clearAll();
}

function onDone(item) {
    item.className = "doneitem";
    presenter.doneItem(toInt(item.id));
}

function onRemove(item) {
    item.parentNode.removeChild(item);
    presenter.removeItem(toInt(item.id));
}

function createButton(id, text) {
    let btn = window.document.createElement("button");
    btn.id = "todo" + text + id + "-id";
    btn.className = "todobtn";
    btn.innerText = text;

    return btn;
}

function createItem(id, text, type) {
    let item = window.document.createElement("li");
    if (type == "todo") {
        item.className = "todoitem";
    }
    else {
        item.className = "doneitem";
    }
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

function toInt(stringId) {
    return parseInt(stringId.slice(8));
}

let btnSubmit, btnClear, textfield, todolist; 
let presenter = require("./Presenter");

module.exports = {
    init
}