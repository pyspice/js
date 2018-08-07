function addItem(id, text) {
    require("./Model").addItem(id, text);
}

function doneItem(id) {
    require("./Model").doneItem(id);
}

function removeItem(id) {
    require("./Model").removeItem(id);
}

function* getAllItems() {
    for (let item of require("./Model").getAllItems()) {
        let key = item[0];
        let [text, type] = item[1].split(",");

        if (type == require("./Model").TODO) {
           type = "todo";
        }
        else {
            type = "done";
        }

        yield [key, text, type];
    }
}

function clearAll() {
    require("./Model").clearAll();
}

function getNewId() {
    return require("./Model").getNewIndex();
}

module.exports = {
    addItem: addItem,
    doneItem: doneItem,
    removeItem: removeItem,
    getAllItems: getAllItems,
    clearAll: clearAll,
    getNewId: getNewId
}