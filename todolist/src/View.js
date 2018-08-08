let btnSubmit, btnClear, textfield, todolist; 
let presenter;

function init (listId) {
    presenter = require("./Presenter");
}

function addList(node, listId, list) {
    let tmpl = window.document.querySelector("#todolist-tmpl");
    let root = window.document.importNode(tmpl.content, true).querySelector("div");
    root.id = listId;

    let head = root.querySelector("div");
    let todolist = root.querySelector("ol");

    let textfield = head.querySelector("input");
    let [btnSubmit, btnClear] = head.querySelectorAll("button");
    
    for (let i = 0; i < list.length; ++i) {
        let text = list[i].text;
        let type = list[i].type;

        let item = createItem(i, text, type);
        todolist.appendChild(item);
    }

    node.appendChild(root);    

    btnSubmit.addEventListener("click", function() { onSubmit(root); });
    btnClear.addEventListener("click", function() { onClear(root); });
}

function createItem(itemIndex, text, type) {
    let tmpl = window.document.querySelector("#todoitem-tmpl");
    let item = window.document.importNode(tmpl.content, true).querySelector("li");
    
    item.setAttribute("itemIndex", itemIndex);
    if (type == "todo") {
        item.className = "todoitem";
    }
    else {
        item.className = "doneitem";
    }

    let [btnDone, btnRemove] = item.querySelectorAll("button");
    let textNode = window.document.createTextNode(text);

    item.insertBefore(textNode, btnDone);

    btnDone.addEventListener("click", function() { onDone(item); });
    btnRemove.addEventListener("click", function() { onRemove(item); });

    return item;
}

function onSubmit(root) {
    let textfield = root.querySelector("div").querySelector("input");
    let text = textfield.value;
    if (!text)
        return;

    let todolist = root.querySelector("ol");
    let itemIndex = todolist.querySelectorAll("li").length;
    let item = createItem(itemIndex, text, "todo");
    todolist.appendChild(item);

    textfield.value = "";

    let listId = root.id;
    presenter.addItem(listId, text);
}

function onClear(root) {
    let todolist = root.querySelector("ol");
    todolist.innerHTML = "";
    presenter.clearAllItems(root.id);
}

function onDone(item) {
    item.className = "doneitem";

    let root = item.parentNode.parentNode;
    presenter.doneItem(root.id, item.getAttribute("itemIndex"));
}

function onRemove(item) {
    let todolist = item.parentNode;
    let itemIndex = +item.getAttribute("itemIndex");
    let listItems = todolist.querySelectorAll("li");

    for (let i = itemIndex + 1; i < listItems.length; ++i) {
        listItems[i].setAttribute("itemIndex", i - 1); 
    }

    todolist.removeChild(item);

    let root = todolist.parentNode;
    presenter.removeItem(root.id, itemIndex);
}

module.exports = {
    init,
    addList
}