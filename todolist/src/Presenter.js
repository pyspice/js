function addItem(id, text) {
    model.addItem(id, text);
}

function doneItem(id) {
    model.doneItem(id);
}

function removeItem(id) {
    model.removeItem(id);
}

function* getAllItems() {
    for (let item of model.getAllItems()) {
        let key = item[0];
        let [text, type] = item[1].split(",");

        if (type == model.TODO) {
            type = "todo";
        }
        else {
            type = "done";
        }

        yield [key, text, type];
    }
}

function clearAll() {
    model.clearAll();
}

function getNewId() {
    return model.getNewIndex();
}

let model = require("./Model");

module.exports = {
    addItem,
    doneItem,
    removeItem,
    getAllItems,
    clearAll,
    getNewId
}