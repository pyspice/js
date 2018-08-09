const TODO = "0";
const DONE = "1";

function init () {
    if (!("todoLists" in window.localStorage)) {
        window.localStorage.setItem("todoLists", "{}");
    }
}

function getList(listId) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    if (listId in lists) {
        return lists[listId];
    }
    else {
        lists[listId] = [];
        window.localStorage.setItem("todoLists", JSON.stringify(lists));
        return [];
    }
}

function removeList(listId) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    delete lists[listId];
    window.localStorage.setItem("todoLists", JSON.stringify(lists));
}

function clearList(listId) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    lists[listId] = [];
    window.localStorage.setItem("todoLists", JSON.stringify(lists));
}

function addItem(listId, text) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    lists[listId].push({text, type: TODO});
    window.localStorage.setItem("todoLists", JSON.stringify(lists));
}

function doneItem(listId, itemIndex) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    lists[listId][itemIndex].type = DONE;    
    window.localStorage.setItem("todoLists", JSON.stringify(lists));
}

function removeItem(listId, itemIndex) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    lists[listId].splice(itemIndex, 1);    
    window.localStorage.setItem("todoLists", JSON.stringify(lists));
}

module.exports = {
    init,
    getList,
    removeList,
    clearList,
    addItem,
    doneItem,
    removeItem,
    TODO,
    DONE
}