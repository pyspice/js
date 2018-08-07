function init () {
    if (!("lastTodoItemIndex" in window.localStorage))
        window.localStorage.setItem("lastTodoItemIndex", "0");
}

function* getAllItems() {
    for (key in window.localStorage) {
        if (("0" <= key[0]) && (key[0] <= "9"))
            yield [key, window.localStorage.getItem(key)];
    }
}

function clearAll() {
    window.localStorage.clear();
    window.localStorage.setItem("lastTodoItemIndex", "0");
}

function addItem(id, text) {
    window.localStorage.setItem(id, text + "," + TODO);
}

function doneItem(id) {
    let item = window.localStorage.getItem(id).slice(0, -1) + DONE;
    window.localStorage.setItem(id, item);
}

function removeItem(id) {
    window.localStorage.removeItem(id);
}

function getNewIndex() {
    let index = window.localStorage.getItem("lastTodoItemIndex");
    window.localStorage.setItem("lastTodoItemIndex", ++index);
    return index;
}

const TODO = 0;
const DONE = 1;


module.exports = {
    init,
    getAllItems,
    clearAll,
    addItem,
    doneItem,
    removeItem,
    getNewIndex,
    TODO,
    DONE
}