function toInt(id) {
    return parseInt(id.slice(8));
}

function onSubmit() {
    let todo = textfield.value;
    if (!todo)
        return;

    let item = createItem(require("./Presenter").getNewIndex(), todo, "todo");
    todolist.appendChild(item);
    textfield.value = "";

    require("./Presenter").addItem(toInt(item.id), todo);
}

function onClear() {
    todolist.innerHTML = "";
    require("./Presenter").clearAll();
}

function onDone(item) {
    item.className = "doneitem";
    require("./Presenter").doneItem(toInt(item.id));
}

function onRemove(item) {
    item.parentNode.removeChild(item);
    require("./Presenter").removeItem(toInt(item.id));
}

function createButton(id, text) {
    let btn = document.createElement("button");
    btn.id = "todo" + text + id + "-id";
    btn.className = "todobtn";
    btn.innerText = text;

    return btn;
}

function createItem(id, text, type) {
    let item = document.createElement("li");
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

function initView() {
    btnSubmit = document.getElementById("todosubmit-id");
    btnClear = document.getElementById("todoclear-id");
    textfield = document.getElementById("todoinput-id");
    todolist = document.getElementById("todolist-id");
    
    for (it of require("./Presenter").getAllItems()) {
        let item = createItem(it[0], it[1], it[2]);
        todolist.appendChild(item);
    }

    btnSubmit.addEventListener("click", onSubmit);
    btnClear.addEventListener("click", onClear);
}

let btnSubmit, btnClear, textfield, todolist;

module.exports = {
    initView: initView
}