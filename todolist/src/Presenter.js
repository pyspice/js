const model = require("./Model");
const view = require("./View");

function init() {
    model.init();
    view.init( 
        {
            onClearListCallback: clearList,
            onRemoveListCallback: removeList,
            onSubmitCallback: addItem,
            onDoneItemCallback: doneItem,
            onRemoveItemCallback: removeItem
        } 
    );
}

function addList(node, listId) {
    let list = model.getList(listId);
    for (let i = 0; i < list.length; ++i) {
        if (list[i].type == model.TODO) {
            list[i].type = view.TODO;
        }
        else {
            list[i].type = view.DONE;
        }
    }
    
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

function clearList(listId) {
    model.clearList(listId);
}

module.exports = {
    init,
    addList
}