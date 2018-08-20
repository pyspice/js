let todo = require("./todo");
todo.init();

let node1 = window.document.querySelector("#list-node1");
todo.addList(node1, "todolist1-id");

let node2 = window.document.querySelector("#list-node2");
todo.addList(node2, "todolist2-id");

// var temple_utils = require('temple-wat');
// var template = require("./index.temple");
// var pool = temple_utils.pool(template);
// var temple_data = pool.get("index");
// temple_data[1].update({
//     name: "Hello",
//     names: [ {data: "name1"}, {data: "name2"}, {data: "name3"} ]
// });
// const main = document.body.querySelector('.main');
// main.appendChild(temple_data[1].root());


// window.temple_data = temple_data;

// function updateName( _name ) {
//     temple_data[1].update( {
//         name: _name
//     })
// }

// window.updateName = updateName;
