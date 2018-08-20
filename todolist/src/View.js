const TODO = "todofont";
const DONE = "donefont";

let onSubmitCallback = ()=>undefined;
let onClearListCallback = ()=>undefined;
let onRemoveListCallback = ()=>undefined;
let onDoneItemCallback = ()=>undefined;
let onRemoveItemCallback = ()=>undefined;

const Delegate = require("dom-delegate").Delegate;
const PubSub = require("pubsub-js");
const TempleUtils = require("temple-wat");

const listPool = TempleUtils.pool(require("./todolistTemplate.temple"));
const itemPool = TempleUtils.pool(require("./itemTemplate.temple"));
let listTemplates = {};
let itemTemplates = {};

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
            onClearList(target.parentNode.parentNode.id);
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

    window.listTemplates = listTemplates;
    window.itemTemplates = itemTemplates;
}

function addList(node, listId, list) {
    let listTemplate = listPool.get("todolistTemplate");

    itemTemplates[listId] = [];
    for (let i = 0; i < list.length; ++i) {
        let text = list[i].text;
        let type = list[i].type;

        let item = {
            itemIndex: i, 
            text, 
            itemClass: type
        };
        itemTemplates[listId].push({data: item});
    }
    
    listTemplate[1].update({
        listId,
        items: itemTemplates[listId]
    }); 

    listTemplates[listId] = listTemplate[1];

    node.appendChild(listTemplate[1].root());

    let token = PubSub.subscribe(
        "ON_SUBMIT", 
        function (msg, text) {
            onSubmit(listId, text);
        }
    );
}

function submitPublisher(target) {
    let root = target.parentNode.parentNode;
    let textfield = root.querySelector("div").querySelector("input");
    PubSub.publish("ON_SUBMIT", textfield.value);
    textfield.value = "";
}

function onSubmit(listId, text) {
    if (!text)
        return;

    let item = {
        itemIndex: itemTemplates[listId].length,
        text, 
        itemClass: TODO
    };
    itemTemplates[listId].push({data: item});
    updateList(listId);

    onSubmitCallback(listId, text);
}

function onClearList(listId) {
    itemTemplates[listId] = [];
    listTemplates[listId].update({
        items: []
    });
    onClearListCallback(listId);
}

function onRemoveList(root) {
    let parent = root.parentNode;
    parent.removeChild(root);
    onRemoveListCallback(root.id);
}

function onDoneItem(item) {
    let itemIndex = +item.dataset.itemIndex;
    let root = item.parentNode.parentNode.parentNode;
    let listId = root.id;
    
    itemTemplates[listId][itemIndex].data.itemClass = DONE;
    updateList(listId);

    onDoneItemCallback(listId, itemIndex);
}

function onRemoveItem(item) {
    let itemIndex = +item.dataset.itemIndex;
    let root = item.parentNode.parentNode.parentNode;
    let listId = root.id;

    itemTemplates[listId].splice(itemIndex, 1);
    for (let i = itemIndex; i < itemTemplates[listId].length; ++i) {
        itemTemplates[listId][i].data.itemIndex = i;
    }
    updateList(listId);

    onRemoveItemCallback(listId, itemIndex);
}

function updateList(listId) {
    listTemplates[listId].update({
        items: itemTemplates[listId]
    });
}

module.exports = {
    init,
    addList,
    TODO,
    DONE
}