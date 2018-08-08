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

function clearAllItems(listId) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    lists[listId] = [];
    window.localStorage.setItem("todoLists", JSON.stringify(lists));
}

function addItem(listId, text) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    lists[listId].push({"text": text, "type": "todo"});
    window.localStorage.setItem("todoLists", JSON.stringify(lists));
}

function doneItem(listId, itemIndex) {
    let lists = JSON.parse(window.localStorage.getItem("todoLists"));
    lists[listId][itemIndex].type = "done";    
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
    clearAllItems,
    addItem,
    doneItem,
    removeItem
}