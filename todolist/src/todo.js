let presenter = require("./Presenter");

function init() {
    presenter.init();
}

function addList(node, listId) {
    presenter.addList(node, listId);
}

module.exports = {
    init,
    addList
}