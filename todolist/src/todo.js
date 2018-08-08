let presenter;

function init() {
    presenter = require("./Presenter");
    presenter.init();
}

function addList(node, listId) {
    presenter.addList(node, listId);
}

module.exports = {
    init,
    addList
}