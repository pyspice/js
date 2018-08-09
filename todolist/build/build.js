/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

(function(context) {
  var render_children = function(after, template, data, pool, children) {
    data = data || [];

    for (var i = children.length - data.length; i > 0; i--) {
      pool.release(template, children.pop());
    }

    for (var i = children.length - 1; i >= 0; i--) {
      children[i].update(data[i]);
    }

    if (children.length < data.length) {
      var fragment = document.createDocumentFragment();

      for (var lb = children.length, ub = data.length; lb < ub; lb++) {
        var nested = pool.get(template);

        children.push(nested[1]);
        fragment.appendChild(nested[0]);
        nested[1].update(data[lb]);
      }

      after.parentNode.insertBefore(fragment, after);
    }
  };

  var render_child = function(after, template, data, pool, children) {
    render_children(after, template, data ? [data] : [], pool, children);
  };

  var templates_cache = {};
  var templates = {};
  var templates_creation = {};

  var methods = {
      info: function() {
          var tor = {
                  free: {},
                  templates_creation: templates_creation
              },
              fkeys = Object.keys(templates_cache);

          for (var i = 0, l = fkeys.length; i < l; i++) {
              var k = fkeys[i];
              tor.free[k] = templates_cache[k].length;
          }

          return tor;
      },
      release: function(template, instance) {
          instance.remove();
          templates_cache[template].push(instance);
      },
      build_cache: function(to_cache) {
          var keys = Object.keys(to_cache);

          for (var i = 0, l = keys.length; i < l; i++) {
              var key = keys[i];
              var arr = templates_cache[key];

              for (var j = 0, k = to_cache[key]; j < k; j++) {
                  arr.push(templates[key](methods));
              }
          }
      },
      get: function(template, data) {
          var tor = templates_cache[template].pop();
          if(!tor) {
            tor = templates[template](methods);
            templates_creation[template]++;
          }

          if (data) {
              tor.update(data);
          }

          return [tor.root(), tor];
      }
  };

  var pool = function() {
      for (var i = 0; i < arguments.length; i++) {
        var component = arguments[i];

        for (var template in component) { if (component.hasOwnProperty(template)) {
            templates[template] = component[template];
            templates_creation[template] = 0;
          }
        }
        for (var keys = Object.keys(component), j = keys.length - 1; j >= 0; j--) {
            templates_cache[keys[j]] = [];
        }
      }

      return methods;
  };

  var container =  true ? module.exports : (undefined);

  container.render_children = render_children;
  container.render_child = render_child;
  container.pool = pool;
}).call(this);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// let todo = require("./todo");
// todo.init();

// let node1 = window.document.querySelector("#list-node1");
// todo.addList(node1, "todolist1-id");

// let node2 = window.document.querySelector("#list-node2");
// todo.addList(node2, "todolist2-id");

var temple_utils = __webpack_require__(0);
var template = __webpack_require__(2);
var pool = temple_utils.pool(template);
var temple_data = pool.get("index");
temple_data[1].update({
    name: "Hello",
    names: [ {data: "name1"}, {data: "name2"}, {data: "name3"} ]
});
const main = document.body.querySelector('.main');
main.appendChild(temple_data[1].root());


window.temple_data = temple_data;

function updateName( _name ) {
    temple_data[1].update( {
        name: _name
    })
}

window.updateName = updateName;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var temple_utils = __webpack_require__(0);module.exports = { "index": function(pool){var n59 = document.createElement("ul"),n58 = document.createElement("div"),n58_text77 = document.createTextNode("\n    \n\n    "),child_index_forall_6079 = [],after_index_forall_6079 = document.createTextNode(""),child_index_if_6280 = [],after_index_if_6280 = document.createTextNode("");n58.appendChild(n58_text77);n59.appendChild(after_index_forall_6079);n58.appendChild(n59);n58.appendChild(after_index_if_6280);return {remove:function(){n58.parentNode.removeChild(n58);},name:function(a){n58_text77.nodeValue = "\n    "+a+"\n\n    "},names:function(a){temple_utils.render_children(after_index_forall_6079, "index_forall_60", a, pool, child_index_forall_6079)},hi:function(a){temple_utils.render_child(after_index_if_6280, "index_if_62", a, pool, child_index_if_6280)},update:function(a){var t = a.name;if(undefined !== t) this.name(t);t = a.names;if(undefined !== t) this.names(t);t = a.hi;if(undefined !== t) this.hi(t)},root: function(){return n58;}};},"index_forall_60": function(pool){var n61 = document.createElement("li"),n61_text81 = document.createTextNode("  ");n61.appendChild(n61_text81);return {remove:function(){n61.parentNode.removeChild(n61);},data:function(a){n61_text81.nodeValue = " "+a+" "},update:function(a){var t = a.data;if(undefined !== t) this.data(t)},root: function(){return n61;}};},"index_if_62": function(pool){var root_text83 = document.createTextNode("\n        \n    ");return {remove:function(){root_text83.parentNode.removeChild(root_text83);},data:function(a){root_text83.nodeValue = "\n        "+a+"\n    "},update:function(a){var t = a.data;if(undefined !== t) this.data(t)},root: function(){var root = document.createDocumentFragment();root.appendChild(root_text83); return root;}};}};

/***/ })
/******/ ]);