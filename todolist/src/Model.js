let model = {
    init: function () {
        if (!("lastTodoItemIndex" in localStorage))
            localStorage.setItem("lastTodoItemIndex", "0");
    },

    getAllItems: function* () {
        for (key in localStorage) {
            if (("0" <= key[0]) && (key[0] <= "9"))
                yield [key, localStorage.getItem(key)];
        }
    },

    clearAll: function () {
        localStorage.clear();
        localStorage.setItem("lastTodoItemIndex", "0");
    },

    addItem: function (id, text) {
        localStorage.setItem(id, text + "," + TODO);
    },

    doneItem: function (id) {
        let item = localStorage.getItem(id).slice(0, -1) + DONE;
        localStorage.setItem(id, item);
    },

    removeItem: function (id) {
        localStorage.removeItem(id);
    },

    getNewIndex: function () {
        let index = localStorage.getItem("lastTodoItemIndex");
        localStorage.setItem("lastTodoItemIndex", ++index);
        return index;
    },

    TODO: 0,
    DONE: 1
};

module.exports = {
    model
}