let view = {
    
    init: function () {

        btnSubmit = document.getElementById("todosubmit-id");
        btnClear = document.getElementById("todoclear-id");
        textfield = document.getElementById("todoinput-id");
        todolist = document.getElementById("todolist-id");
        
        for (it of presenter.getAllItems()) {
            let item = this.createItem(it[0], it[1], it[2]);
            todolist.appendChild(item);
        }

        btnSubmit.addEventListener("click", onSubmit);
        btnClear.addEventListener("click", onClear);
    },

    onSubmit: function () {

        let todo = textfield.value;
        if (!todo)
            return;

        let id = presenter.getNewId();
        let item = this.createItem(id, todo, "todo");
        todolist.appendChild(item);

        textfield.value = "";

        presenter.addItem(id, todo);
    },

    onClear: function () {
        todolist.innerHTML = "";
        presenter.clearAll();
    },

    onDone: function (item) {

        item.className = "doneitem";
        presenter.doneItem(this.toInt(item.id));
    },

    onRemove: function (item) {
        item.parentNode.removeChild(item);
        presenter.removeItem(toInt(item.id));
    },

    createButton: function (id, text) {

        let btn = document.createElement("button");
        btn.id = "todo" + text + id + "-id";
        btn.className = "todobtn";
        btn.innerText = text;

        return btn;
    },

    createItem: function (id, text, type) {

        let item = document.createElement("li");
        if (type == "todo") {
            item.className = "todoitem";
        }
        else {
            item.className = "doneitem";
        }
        item.id = "todoitem" + id + "-id";
        item.innerText = text;
        
        let btnDone = this.createButton(id, "done");
        let btnRemove = this.createButton(id, "remove");

        item.appendChild(btnDone);
        item.appendChild(btnRemove);

        btnDone.addEventListener("click", function() { this.onDone(item); });
        btnRemove.addEventListener("click", function() { this.onRemove(item); });

        return item;
    },
    
    toInt: function (stringId) {
        return parseInt(stringId.slice(8));
    },

    presenter: require("./Presenter").presenter,

    btnSubmit: null,
    btnClear: null,
    textfield: null,
    todolist: null    
};

module.exports = {
    view
}