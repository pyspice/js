let model;
let view;

function init() {
    model = require("./Model");
    model.init();

    view = require("./View");
    view.init();
}

function addList(node, listId) {
    let list = model.getList(listId);
    
    view.addList(node, listId, list);
}

function removeList(listId) {
    model.removeList(listId);
}

function addItem(listId, text) {
    model.addItem(listId, text);
}

function doneItem(listId, itemIndex) {
    model.doneItem(listId, itemIndex);
}

function removeItem(listId, itemIndex) {
    model.removeItem(listId, itemIndex);
}

function clearAllItems(listId) {
    model.clearAllItems(listId);
}

module.exports = {
    init,
    addList,
    removeList,
    addItem,
    doneItem,
    removeItem,
    clearAllItems
}