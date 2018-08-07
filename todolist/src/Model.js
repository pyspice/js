function initModel() {
    if (localStorage.lastTodoItemIndex === undefined) {
        localStorage.lastTodoItemIndex = 0;
    }
}

function* getAllItems() {
    for (key in localStorage) {
        if (("0" <= key[0]) && (key[0] <= "9"))
            yield [key, localStorage[key]];
    }
}

function clearAll() {
    localStorage.clear();
    localStorage.lastTodoItemIndex = 0;
}

function addItem(id, text) {
    localStorage[id] = text + "," + TODO;
}

function doneItem(id) {
    let item = localStorage[id].slice(0, -1) + DONE;
    localStorage[id] = item;
}

function removeItem(id) {
    delete localStorage[id];
}

function getNewIndex() {
    return localStorage.lastTodoItemIndex++;
}

const TODO = 0;
const DONE = 1;

module.exports = {
    initModel: initModel,
    getAllItems: getAllItems,
    clearAll: clearAll,
    addItem: addItem,
    doneItem: doneItem,
    removeItem: removeItem,
    getNewIndex: getNewIndex,
    TODO: TODO,
    DONE: DONE
}