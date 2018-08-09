const TODO = "todo";
const DONE = "done";

let onSubmitCallback = ()=>undefined;
let onClearListCallback = ()=>undefined;
let onRemoveListCallback = ()=>undefined;
let onDoneItemCallback = ()=>undefined;
let onRemoveItemCallback = ()=>undefined;

const Delegate = require("dom-delegate").Delegate;
const PubSub = require("pubsub-js");
const TempleUtils = require("temple-wat");

function init (callbacks) {
    onClearListCallback = callbacks.onClearListCallback;
    onRemoveListCallback = callbacks.onRemoveListCallback;
    onSubmitCallback = callbacks.onSubmitCallback;
    onDoneItemCallback = callbacks.onDoneItemCallback;
    onRemoveItemCallback = callbacks.onRemoveItemCallback;
    
    let delegate = new Delegate(window.document.body);
    delegate.on(
        "click", 
        '.remove-list-button', 
        function(event, target) {
            onRemoveList(target.parentNode.parentNode);
        }
    );
    delegate.on(
        "click", 
        '.clear-list-button', 
        function(event, target) {
            onClearList(target.parentNode.parentNode);
        }
    );
    delegate.on(
        "click", 
        '.submit-button', 
        function(event, target) {
            submitPublisher(target);
        }
    );
    delegate.on(
        "keypress", 
        '.submit-field',
        function (event, target) {
            var key = event.which || event.keyCode;
            if (key === 13) { 
                submitPublisher(target);
            }
        }
    );
    delegate.on(
        "click", 
        '.done-item-button', 
        function(event, target) {
            onDoneItem(target.parentNode);
        }
    );
    delegate.on(
        "click", 
        '.remove-item-button', 
        function(event, target) {
            onRemoveItem(target.parentNode);
        }
    );

    let listTemplate = TempleUtils.pool(require("./list.temple")).get("list");
    let itemTemplate = TempleUtils.pool(require("./item.temple")).get("item");
}

function addList(node, listId, list) {
    let tmpl = window.document.querySelector("#todolist-tmpl");
    let root = window.document.importNode(tmpl.content, true).querySelector("div");
    root.id = listId;

    let todolist = root.querySelector("ol");
    
    for (let i = 0; i < list.length; ++i) {
        let text = list[i].text;
        let type = list[i].type;

        let item = createItem(i, text, type);
        todolist.appendChild(item);
    }

    node.appendChild(root);

    let token = PubSub.subscribe(
        "ON_SUBMIT", 
        function (msg, text) {
            onSubmit(root, text);
        }
    );
}

function createItem(itemIndex, text, type) {
    let tmpl = window.document.querySelector("#todoitem-tmpl");
    let item = window.document.importNode(tmpl.content, true).querySelector("li");
    
    item.setAttribute("itemIndex", itemIndex);
    item.className = "todoitem";

    let span = item.querySelector("span");
    span.innerHTML = text;
    if (type == DONE) {
        span.className = "donefont";
    }

    return item;
}

function submitPublisher(target) {
    let root = target.parentNode.parentNode;
    let textfield = root.querySelector("div").querySelector("input");
    PubSub.publish("ON_SUBMIT", textfield.value);
    textfield.value = "";
}

function onSubmit(root, text) {
    if (!text)
        return;

    let todolist = root.querySelector("ol");
    let itemIndex = todolist.querySelectorAll("li").length;
    let item = createItem(itemIndex, text, TODO);
    todolist.appendChild(item);

    let listId = root.id;
    onSubmitCallback(listId, text);
}

function onClearList(root) {
    let todolist = root.querySelector("ol");
    todolist.innerHTML = "";
    onClearListCallback(root.id);
}

function onRemoveList(root) {
    let parent = root.parentNode;
    parent.removeChild(root);
    onRemoveListCallback(root.id);
}

function onDoneItem(item) {
    let span = item.querySelector("span");
    span.className = "donefont";

    let root = item.parentNode.parentNode;
    onDoneItemCallback(root.id, item.getAttribute("itemIndex"));
}

function onRemoveItem(item) {
    let todolist = item.parentNode;
    let itemIndex = +item.getAttribute("itemIndex");

    let i = itemIndex;
    let next = item.nextSibling;

    while (next !== null) {
        next.setAttribute("itemIndex", i++);
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