let todo = require("./todo");
todo.init();

let node1 = window.document.querySelector("#list-node1");
todo.addList(node1, "todolist1-id");

let node2 = window.document.querySelector("#list-node2");
todo.addList(node2, "todolist2-id");