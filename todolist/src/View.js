const TODO = "todo";
const DONE = "done";

let onSubmitCallback = ()=>undefined;
let onClearListCallback = ()=>undefined;
let onRemoveListCallback = ()=>undefined;
let onDoneItemCallback = ()=>undefined;
let onRemoveItemCallback = ()=>undefined;

const Delegate = require("dom-delegate").Delegate;

function init (callbacks) {
    onClearListCallback = callbacks.onClearListCallback;
    onRemoveListCallback = callbacks.onRemoveListCallback;
    onSubmitCallback = callbacks.onSubmitCallback;
    onDoneItemCallback = callbacks.onDoneItemCallback;
    onRemoveItemCallback = callbacks.onRemoveItemCallback;
    
    let btnRemoveListDelegate = new Delegate(window.document.body);
    btnRemoveListDelegate.on("click", 'div[data-input-name="remove-list-button"]', onRemoveList);
    
    let btnClearListDelegate = new Delegate(window.document.body);
    btnClearListDelegate.on("click", 'button[data-input-name="clear-list-button"]', onClearList);
    
    let btnSubmitDelegate = new Delegate(window.document.body);
    btnSubmitDelegate.on("click", 'button[data-input-name="submit-button"]', onSubmit);
    
    let keyEnterSubmitDelegate = new Delegate(window.document.body);
    keyEnterSubmitDelegate.on(
        "keypress", 
        'input[data-input-name="submit-field"]',
        function (event, target) {
            var key = event.which || event.keyCode;
            if (key === 13) { 
                onSubmit(event, target); 
            }
        }
    );
    
    let btnDoneItemDelegate = new Delegate(window.document.body);
    btnDoneItemDelegate.on("click", 'button[data-input-name="done-item-button"]', onDoneItem);
    
    let btnRemoveItemDelegate = new Delegate(window.document.body);
    btnRemoveItemDelegate.on("click", 'button[data-input-name="remove-item-button"]', onRemoveItem);
}

function addList(node, listId, list) {
    let tmpl = window.document.querySelector("#todolist-tmpl");
    let root = window.document.importNode(tmpl.content, true).querySelector("div");
    root.id = listId;

    let head = root.querySelector("div");
    let todolist = root.querySelector("ol");

    let textfield = head.querySelector("input");
    
    for (let i = 0; i < list.length; ++i) {
        let text = list[i].text;
        let type = list[i].type;

        let item = createItem(i, text, type);
        todolist.appendChild(item);
    }

    node.appendChild(root);
}

function createItem(itemIndex, text, type) {
    let tmpl = window.document.querySelector("#todoitem-tmpl");
    let item = window.document.importNode(tmpl.content, true).querySelector("li");
    
    item.setAttribute("itemIndex", itemIndex);
    item.className = "todoitem";

    let p = item.querySelector("span");
    p.innerHTML = text;
    if (type == DONE) {
        p.className = "donefont";
    }

    return item;
}

function onSubmit(event, target) {
    let root = target.parentNode.parentNode;
    let textfield = root.querySelector("div").querySelector("input");
    let text = textfield.value;
    if (!text)
        return;

    let todolist = root.querySelector("ol");
    let itemIndex = todolist.querySelectorAll("li").length;
    let item = createItem(itemIndex, text, TODO);
    todolist.appendChild(item);

    textfield.value = "";

    let listId = root.id;
    onSubmitCallback(listId, text);
}

function onClearList(event, target) {
    let root = target.parentNode.parentNode;
    let todolist = root.querySelector("ol");
    todolist.innerHTML = "";
    onClearListCallback(root.id);
}

function onRemoveList(event, target) {
    let root = target.parentNode.parentNode;
    let parent = root.parentNode;
    parent.removeChild(root);
    onRemoveListCallback(root.id);
}

function onDoneItem(event, target) {
    let item = target.parentNode;
    let p = item.querySelector("span");
    p.className = "donefont";

    let root = item.parentNode.parentNode;
    onDoneItemCallback(root.id, item.getAttribute("itemIndex"));
}

function onRemoveItem(event, target) {
    let item = target.parentNode;
    let todolist = item.parentNode;
    let itemIndex = +item.getAttribute("itemIndex");
    let next = item.nextSibling;

    while (next !== null) {
        next.setAttribute("itemIndex", itemIndex++);
        next = next.nextSibling;
    }

    todolist.removeChild(item);

    let root = todolist.parentNode;
    onRemoveItemCallback(root.id, itemIndex);
}

module.exports = {
    init,
    addList,
    TODO,
    DONE
}