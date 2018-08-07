let presenter = {

    addItem: function (id, text) {
        model.addItem(id, text);
    },
    
    doneItem: function (id) {
        model.doneItem(id);
    },
    
    removeItem: function (id) {
        model.removeItem(id);
    },
    
    getAllItems: function* () {
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
    },
    
    clearAll: function () {
        model.clearAll();
    },
    
    getNewId: function () {
        return model.getNewIndex();
    }
}

let model = require("./Model").model;

module.exports = {
    presenter
}