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

let todo = __webpack_require__(2);
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

let presenter = __webpack_require__(3);

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const model = __webpack_require__(4);
const view = __webpack_require__(5);

function init() {
    model.init();
    view.init( 
        {
            onClearListCallback: clearList,
            onRemoveListCallback: removeList,
            onSubmitCallback: addItem,
            onDoneItemCallback: doneItem,
            onRemoveItemCallback: removeItem
        } 
    );
}

function addList(node, listId) {
    let list = model.getList(listId);
    for (let i = 0; i < list.length; ++i) {
        if (list[i].type == model.TODO) {
            list[i].type = view.TODO;
        }
        else {
            list[i].type = view.DONE;
        }
    }
    
    view.addList(node, listId, list);
}

function removeList(listId) {
    model.removeList(listId);
}

function addItem(listId, text) {
    model.addItem(listId, text);
}

function doneItem(listId, itemIndex) {
    model.doneItem(listId, itemIndex);
}

function removeItem(listId, itemIndex) {
    model.removeItem(listId, itemIndex);
}

function clearList(listId) {
    model.clearList(listId);
}

module.exports = {
    init,
    addList
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const TODO = "todofont";
const DONE = "donefont";

let onSubmitCallback = ()=>undefined;
let onClearListCallback = ()=>undefined;
let onRemoveListCallback = ()=>undefined;
let onDoneItemCallback = ()=>undefined;
let onRemoveItemCallback = ()=>undefined;

const Delegate = __webpack_require__(6).Delegate;
const PubSub = __webpack_require__(8);
const TempleUtils = __webpack_require__(0);

const listPool = TempleUtils.pool(__webpack_require__(10));
const itemPool = TempleUtils.pool(__webpack_require__(11));
let listTemplates = {};
let itemTemplates = {};

function init (callbacks) {
    onClearListCallback = callbacks.onClearListCallback;
    onRemoveListCallback = callbacks.onRemoveListCallback;
    onSubmitCallback = callbacks.onSubmitCallback;
    onDoneItemCallback = callbacks.onDoneItemCallback;
    onRemoveItemCallback = callbacks.onRemoveItemCallback;
    
    let delegate = new Delegate(window.document.body);
    delegate.on(
        "click", 
        '.remove-list-button', 
        function(event, target) {
            onRemoveList(target.parentNode.parentNode);
        }
    );
    delegate.on(
        "click", 
        '.clear-list-button', 
        function(event, target) {
            onClearList(target.parentNode.parentNode.id);
        }
    );
    delegate.on(
        "click", 
        '.submit-button', 
        function(event, target) {
            submitPublisher(target);
        }
    );
    delegate.on(
        "keypress", 
        '.submit-field',
        function (event, target) {
            var key = event.which || event.keyCode;
            if (key === 13) { 
                submitPublisher(target);
            }
        }
    );
    delegate.on(
        "click", 
        '.done-item-button', 
        function(event, target) {
            onDoneItem(target.parentNode);
        }
    );
    delegate.on(
        "click", 
        '.remove-item-button', 
        function(event, target) {
            onRemoveItem(target.parentNode);
        }
    );

    window.listTemplates = listTemplates;
    window.itemTemplates = itemTemplates;
}

function addList(node, listId, list) {
    let listTemplate = listPool.get("todolistTemplate");

    itemTemplates[listId] = [];
    for (let i = 0; i < list.length; ++i) {
        let text = list[i].text;
        let type = list[i].type;

        let item = {
            itemIndex: i, 
            text, 
            itemClass: type
        };
        itemTemplates[listId].push({data: item});
    }
    
    listTemplate[1].update({
        listId,
        items: itemTemplates[listId]
    }); 

    listTemplates[listId] = listTemplate[1];

    node.appendChild(listTemplate[1].root());

    let token = PubSub.subscribe(
        "ON_SUBMIT", 
        function (msg, text) {
            onSubmit(listId, text);
        }
    );
}

function submitPublisher(target) {
    let root = target.parentNode.parentNode;
    let textfield = root.querySelector("div").querySelector("input");
    PubSub.publish("ON_SUBMIT", textfield.value);
    textfield.value = "";
}

function onSubmit(listId, text) {
    if (!text)
        return;

    let item = {
        itemIndex: itemTemplates[listId].length,
        text, 
        itemClass: TODO
    };
    itemTemplates[listId].push({data: item});
    updateList(listId);

    onSubmitCallback(listId, text);
}

function onClearList(listId) {
    itemTemplates[listId] = [];
    listTemplates[listId].update({
        items: []
    });
    onClearListCallback(listId);
}

function onRemoveList(root) {
    let parent = root.parentNode;
    parent.removeChild(root);
    onRemoveListCallback(root.id);
}

function onDoneItem(item) {
    let itemIndex = +item.dataset.itemIndex;
    let root = item.parentNode.parentNode.parentNode;
    let listId = root.id;
    
    itemTemplates[listId][itemIndex].data.itemClass = DONE;
    updateList(listId);

    onDoneItemCallback(listId, itemIndex);
}

function onRemoveItem(item) {
    let itemIndex = +item.dataset.itemIndex;
    let root = item.parentNode.parentNode.parentNode;
    let listId = root.id;

    itemTemplates[listId].splice(itemIndex, 1);
    for (let i = itemIndex; i < itemTemplates[listId].length; ++i) {
        itemTemplates[listId][i].data.itemIndex = i;
    }
    updateList(listId);

    onRemoveItemCallback(listId, itemIndex);
}

function updateList(listId) {
    listTemplates[listId].update({
        items: itemTemplates[listId]
    });
}

module.exports = {
    init,
    addList,
    TODO,
    DONE
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*jshint browser:true, node:true*/



/**
 * @preserve Create and manage a DOM event delegator.
 *
 * @version 0.3.0
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */
var Delegate = __webpack_require__(7);

module.exports = function(root) {
  return new Delegate(root);
};

module.exports.Delegate = Delegate;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*jshint browser:true, node:true*/



module.exports = Delegate;

/**
 * DOM event delegator
 *
 * The delegator will listen
 * for events that bubble up
 * to the root node.
 *
 * @constructor
 * @param {Node|string} [root] The root node or a selector string matching the root node
 */
function Delegate(root) {

  /**
   * Maintain a map of listener
   * lists, keyed by event name.
   *
   * @type Object
   */
  this.listenerMap = [{}, {}];
  if (root) {
    this.root(root);
  }

  /** @type function() */
  this.handle = Delegate.prototype.handle.bind(this);
}

/**
 * Start listening for events
 * on the provided DOM element
 *
 * @param  {Node|string} [root] The root node or a selector string matching the root node
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.root = function(root) {
  var listenerMap = this.listenerMap;
  var eventType;

  // Remove master event listeners
  if (this.rootElement) {
    for (eventType in listenerMap[1]) {
      if (listenerMap[1].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, true);
      }
    }
    for (eventType in listenerMap[0]) {
      if (listenerMap[0].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, false);
      }
    }
  }

  // If no root or root is not
  // a dom node, then remove internal
  // root reference and exit here
  if (!root || !root.addEventListener) {
    if (this.rootElement) {
      delete this.rootElement;
    }
    return this;
  }

  /**
   * The root node at which
   * listeners are attached.
   *
   * @type Node
   */
  this.rootElement = root;

  // Set up master event listeners
  for (eventType in listenerMap[1]) {
    if (listenerMap[1].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, true);
    }
  }
  for (eventType in listenerMap[0]) {
    if (listenerMap[0].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, false);
    }
  }

  return this;
};

/**
 * @param {string} eventType
 * @returns boolean
 */
Delegate.prototype.captureForType = function(eventType) {
  return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(eventType) !== -1;
};

/**
 * Attach a handler to one
 * event for all elements
 * that match the selector,
 * now or in the future
 *
 * The handler function receives
 * three arguments: the DOM event
 * object, the node that matched
 * the selector while the event
 * was bubbling and a reference
 * to itself. Within the handler,
 * 'this' is equal to the second
 * argument.
 *
 * The node that actually received
 * the event can be accessed via
 * 'event.target'.
 *
 * @param {string} eventType Listen for these events
 * @param {string|undefined} selector Only handle events on elements matching this selector, if undefined match root element
 * @param {function()} handler Handler function - event data passed here will be in event.data
 * @param {Object} [eventData] Data to pass in event.data
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.on = function(eventType, selector, handler, useCapture) {
  var root, listenerMap, matcher, matcherParam;

  if (!eventType) {
    throw new TypeError('Invalid event type: ' + eventType);
  }

  // handler can be passed as
  // the second or third argument
  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  }

  // Fallback to sensible defaults
  // if useCapture not set
  if (useCapture === undefined) {
    useCapture = this.captureForType(eventType);
  }

  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a type of Function');
  }

  root = this.rootElement;
  listenerMap = this.listenerMap[useCapture ? 1 : 0];

  // Add master handler for type if not created yet
  if (!listenerMap[eventType]) {
    if (root) {
      root.addEventListener(eventType, this.handle, useCapture);
    }
    listenerMap[eventType] = [];
  }

  if (!selector) {
    matcherParam = null;

    // COMPLEX - matchesRoot needs to have access to
    // this.rootElement, so bind the function to this.
    matcher = matchesRoot.bind(this);

  // Compile a matcher for the given selector
  } else if (/^[a-z]+$/i.test(selector)) {
    matcherParam = selector;
    matcher = matchesTag;
  } else if (/^#[a-z0-9\-_]+$/i.test(selector)) {
    matcherParam = selector.slice(1);
    matcher = matchesId;
  } else {
    matcherParam = selector;
    matcher = matches;
  }

  // Add to the list of listeners
  listenerMap[eventType].push({
    selector: selector,
    handler: handler,
    matcher: matcher,
    matcherParam: matcherParam
  });

  return this;
};

/**
 * Remove an event handler
 * for elements that match
 * the selector, forever
 *
 * @param {string} [eventType] Remove handlers for events matching this type, considering the other parameters
 * @param {string} [selector] If this parameter is omitted, only handlers which match the other two will be removed
 * @param {function()} [handler] If this parameter is omitted, only handlers which match the previous two will be removed
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.off = function(eventType, selector, handler, useCapture) {
  var i, listener, listenerMap, listenerList, singleEventType;

  // Handler can be passed as
  // the second or third argument
  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  }

  // If useCapture not set, remove
  // all event listeners
  if (useCapture === undefined) {
    this.off(eventType, selector, handler, true);
    this.off(eventType, selector, handler, false);
    return this;
  }

  listenerMap = this.listenerMap[useCapture ? 1 : 0];
  if (!eventType) {
    for (singleEventType in listenerMap) {
      if (listenerMap.hasOwnProperty(singleEventType)) {
        this.off(singleEventType, selector, handler);
      }
    }

    return this;
  }

  listenerList = listenerMap[eventType];
  if (!listenerList || !listenerList.length) {
    return this;
  }

  // Remove only parameter matches
  // if specified
  for (i = listenerList.length - 1; i >= 0; i--) {
    listener = listenerList[i];

    if ((!selector || selector === listener.selector) && (!handler || handler === listener.handler)) {
      listenerList.splice(i, 1);
    }
  }

  // All listeners removed
  if (!listenerList.length) {
    delete listenerMap[eventType];

    // Remove the main handler
    if (this.rootElement) {
      this.rootElement.removeEventListener(eventType, this.handle, useCapture);
    }
  }

  return this;
};


/**
 * Handle an arbitrary event.
 *
 * @param {Event} event
 */
Delegate.prototype.handle = function(event) {
  var i, l, type = event.type, root, phase, listener, returned, listenerList = [], target, /** @const */ EVENTIGNORE = 'ftLabsDelegateIgnore';

  if (event[EVENTIGNORE] === true) {
    return;
  }

  target = event.target;

  // Hardcode value of Node.TEXT_NODE
  // as not defined in IE8
  if (target.nodeType === 3) {
    target = target.parentNode;
  }

  root = this.rootElement;

  phase = event.eventPhase || ( event.target !== event.currentTarget ? 3 : 2 );
  
  switch (phase) {
    case 1: //Event.CAPTURING_PHASE:
      listenerList = this.listenerMap[1][type];
    break;
    case 2: //Event.AT_TARGET:
      if (this.listenerMap[0] && this.listenerMap[0][type]) listenerList = listenerList.concat(this.listenerMap[0][type]);
      if (this.listenerMap[1] && this.listenerMap[1][type]) listenerList = listenerList.concat(this.listenerMap[1][type]);
    break;
    case 3: //Event.BUBBLING_PHASE:
      listenerList = this.listenerMap[0][type];
    break;
  }

  // Need to continuously check
  // that the specific list is
  // still populated in case one
  // of the callbacks actually
  // causes the list to be destroyed.
  l = listenerList.length;
  while (target && l) {
    for (i = 0; i < l; i++) {
      listener = listenerList[i];

      // Bail from this loop if
      // the length changed and
      // no more listeners are
      // defined between i and l.
      if (!listener) {
        break;
      }

      // Check for match and fire
      // the event if there's one
      //
      // TODO:MCG:20120117: Need a way
      // to check if event#stopImmediatePropagation
      // was called. If so, break both loops.
      if (listener.matcher.call(target, listener.matcherParam, target)) {
        returned = this.fire(event, target, listener);
      }

      // Stop propagation to subsequent
      // callbacks if the callback returned
      // false
      if (returned === false) {
        event[EVENTIGNORE] = true;
        event.preventDefault();
        return;
      }
    }

    // TODO:MCG:20120117: Need a way to
    // check if event#stopPropagation
    // was called. If so, break looping
    // through the DOM. Stop if the
    // delegation root has been reached
    if (target === root) {
      break;
    }

    l = listenerList.length;
    target = target.parentElement;
  }
};

/**
 * Fire a listener on a target.
 *
 * @param {Event} event
 * @param {Node} target
 * @param {Object} listener
 * @returns {boolean}
 */
Delegate.prototype.fire = function(event, target, listener) {
  return listener.handler.call(target, event, target);
};

/**
 * Check whether an element
 * matches a generic selector.
 *
 * @type function()
 * @param {string} selector A CSS selector
 */
var matches = (function(el) {
  if (!el) return;
  var p = el.prototype;
  return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
}(Element));

/**
 * Check whether an element
 * matches a tag selector.
 *
 * Tags are NOT case-sensitive,
 * except in XML (and XML-based
 * languages such as XHTML).
 *
 * @param {string} tagName The tag name to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesTag(tagName, element) {
  return tagName.toLowerCase() === element.tagName.toLowerCase();
}

/**
 * Check whether an element
 * matches the root.
 *
 * @param {?String} selector In this case this is always passed through as null and not used
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesRoot(selector, element) {
  /*jshint validthis:true*/
  if (this.rootElement === window) return element === document;
  return this.rootElement === element;
}

/**
 * Check whether the ID of
 * the element in 'this'
 * matches the given ID.
 *
 * IDs are case-sensitive.
 *
 * @param {string} id The ID to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesId(id, element) {
  return id === element.id;
}

/**
 * Short hand for off()
 * and root(), ie both
 * with no parameters
 *
 * @return void
 */
Delegate.prototype.destroy = function() {
  this.off();
  this.root();
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/*
Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org

https://github.com/mroderick/PubSubJS
*/
(function (root, factory){
    'use strict';

    var PubSub = {};
    root.PubSub = PubSub;

    var define = root.define;

    factory(PubSub);

    // AMD support
    if (typeof define === 'function' && define.amd){
        define(function() { return PubSub; });

        // CommonJS and Node.js module support
    } else if (true){
        if (module !== undefined && module.exports) {
            exports = module.exports = PubSub; // Node.js specific `module.exports`
        }
        exports.PubSub = PubSub; // CommonJS module 1.1.1 spec
        module.exports = exports = PubSub; // CommonJS
    }

}(( typeof window === 'object' && window ) || this, function (PubSub){
    'use strict';

    var messages = {},
        lastUid = -1;

    function hasKeys(obj){
        var key;

        for (key in obj){
            if ( obj.hasOwnProperty(key) ){
                return true;
            }
        }
        return false;
    }

    /**
	 *	Returns a function that throws the passed exception, for use as argument for setTimeout
	 *	@param { Object } ex An Error object
	 */
    function throwException( ex ){
        return function reThrowException(){
            throw ex;
        };
    }

    function callSubscriberWithDelayedExceptions( subscriber, message, data ){
        try {
            subscriber( message, data );
        } catch( ex ){
            setTimeout( throwException( ex ), 0);
        }
    }

    function callSubscriberWithImmediateExceptions( subscriber, message, data ){
        subscriber( message, data );
    }

    function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){
        var subscribers = messages[matchedMessage],
            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
            s;

        if ( !messages.hasOwnProperty( matchedMessage ) ) {
            return;
        }

        for (s in subscribers){
            if ( subscribers.hasOwnProperty(s)){
                callSubscriber( subscribers[s], originalMessage, data );
            }
        }
    }

    function createDeliveryFunction( message, data, immediateExceptions ){
        return function deliverNamespaced(){
            var topic = String( message ),
                position = topic.lastIndexOf( '.' );

            // deliver the message as it is now
            deliverMessage(message, message, data, immediateExceptions);

            // trim the hierarchy and deliver message to each level
            while( position !== -1 ){
                topic = topic.substr( 0, position );
                position = topic.lastIndexOf('.');
                deliverMessage( message, topic, data, immediateExceptions );
            }
        };
    }

    function messageHasSubscribers( message ){
        var topic = String( message ),
            found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic])),
            position = topic.lastIndexOf( '.' );

        while ( !found && position !== -1 ){
            topic = topic.substr( 0, position );
            position = topic.lastIndexOf( '.' );
            found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic]));
        }

        return found;
    }

    function publish( message, data, sync, immediateExceptions ){
        var deliver = createDeliveryFunction( message, data, immediateExceptions ),
            hasSubscribers = messageHasSubscribers( message );

        if ( !hasSubscribers ){
            return false;
        }

        if ( sync === true ){
            deliver();
        } else {
            setTimeout( deliver, 0 );
        }
        return true;
    }

    /**
	 *	PubSub.publish( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message, passing the data to it's subscribers
	**/
    PubSub.publish = function( message, data ){
        return publish( message, data, false, PubSub.immediateExceptions );
    };

    /**
	 *	PubSub.publishSync( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message synchronously, passing the data to it's subscribers
	**/
    PubSub.publishSync = function( message, data ){
        return publish( message, data, true, PubSub.immediateExceptions );
    };

    /**
	 *	PubSub.subscribe( message, func ) -> String
	 *	- message (String): The message to subscribe to
	 *	- func (Function): The function to call when a new message is published
	 *	Subscribes the passed function to the passed message. Every returned token is unique and should be stored if
	 *	you need to unsubscribe
	**/
    PubSub.subscribe = function( message, func ){
        if ( typeof func !== 'function'){
            return false;
        }

        // message is not registered yet
        if ( !messages.hasOwnProperty( message ) ){
            messages[message] = {};
        }

        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'messages' object
        var token = 'uid_' + String(++lastUid);
        messages[message][token] = func;

        // return token for unsubscribing
        return token;
    };

    /**
	 *	PubSub.subscribeOnce( message, func ) -> PubSub
	 *	- message (String): The message to subscribe to
	 *	- func (Function): The function to call when a new message is published
	 *	Subscribes the passed function to the passed message once
	**/
    PubSub.subscribeOnce = function( message, func ){
        var token = PubSub.subscribe( message, function(){
            // before func apply, unsubscribe message
            PubSub.unsubscribe( token );
            func.apply( this, arguments );
        });
        return PubSub;
    };

    /* Public: Clears all subscriptions
	 */
    PubSub.clearAllSubscriptions = function clearAllSubscriptions(){
        messages = {};
    };

    /*Public: Clear subscriptions by the topic
	*/
    PubSub.clearSubscriptions = function clearSubscriptions(topic){
        var m;
        for (m in messages){
            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){
                delete messages[m];
            }
        }
    };

    /* Public: removes subscriptions.
	 * When passed a token, removes a specific subscription.
	 * When passed a function, removes all subscriptions for that function
	 * When passed a topic, removes all subscriptions for that topic (hierarchy)
	 *
	 * value - A token, function or topic to unsubscribe.
	 *
	 * Examples
	 *
	 *		// Example 1 - unsubscribing with a token
	 *		var token = PubSub.subscribe('mytopic', myFunc);
	 *		PubSub.unsubscribe(token);
	 *
	 *		// Example 2 - unsubscribing with a function
	 *		PubSub.unsubscribe(myFunc);
	 *
	 *		// Example 3 - unsubscribing a topic
	 *		PubSub.unsubscribe('mytopic');
	 */
    PubSub.unsubscribe = function(value){
        var descendantTopicExists = function(topic) {
                var m;
                for ( m in messages ){
                    if ( messages.hasOwnProperty(m) && m.indexOf(topic) === 0 ){
                        // a descendant of the topic exists:
                        return true;
                    }
                }

                return false;
            },
            isTopic    = typeof value === 'string' && ( messages.hasOwnProperty(value) || descendantTopicExists(value) ),
            isToken    = !isTopic && typeof value === 'string',
            isFunction = typeof value === 'function',
            result = false,
            m, message, t;

        if (isTopic){
            PubSub.clearSubscriptions(value);
            return;
        }

        for ( m in messages ){
            if ( messages.hasOwnProperty( m ) ){
                message = messages[m];

                if ( isToken && message[value] ){
                    delete message[value];
                    result = value;
                    // tokens are unique, so we can just stop here
                    break;
                }

                if (isFunction) {
                    for ( t in message ){
                        if (message.hasOwnProperty(t) && message[t] === value){
                            delete message[t];
                            result = true;
                        }
                    }
                }
            }
        }

        return result;
    };
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(9)(module)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var temple_utils = __webpack_require__(0);module.exports = { "todolistTemplate": function(pool){var n9 = document.createElement("ol"),n8 = document.createElement("button"),n7 = document.createElement("button"),n6 = document.createElement("br"),n5 = document.createElement("input"),n4 = document.createElement("br"),n3 = document.createElement("div"),n2 = document.createElement("div"),n1 = document.createElement("div"),n0 = document.createElement("div"),child_todolistTemplate_forall_100 = [],after_todolistTemplate_forall_100 = document.createTextNode("");n9.setAttribute("name", "todo-body");n9.className = "todolist";n8.className = "todoitem clear-list-button";n7.className = "todoitem submit-button";n5.className = "todoitem submit-field";n5.setAttribute("type", "text");n3.setAttribute("name", "todo-title");n3.className = "todotitle";n2.className = "remove-list-button";n1.className = "todohead";n0.className = "todo";n2.appendChild(document.createTextNode("[x]"));n1.appendChild(n2);n3.appendChild(document.createTextNode("What to do, what to do..."));n1.appendChild(n3);n1.appendChild(n4);n1.appendChild(n5);n1.appendChild(n6);n7.appendChild(document.createTextNode("Add to-do"));n1.appendChild(n7);n8.appendChild(document.createTextNode("Clear all"));n1.appendChild(n8);n0.appendChild(n1);n9.appendChild(after_todolistTemplate_forall_100);n0.appendChild(n9);return {remove:function(){n0.parentNode.removeChild(n0);},listId:function(a){n0.id = a},items:function(a){temple_utils.render_children(after_todolistTemplate_forall_100, "todolistTemplate_forall_10", a, pool, child_todolistTemplate_forall_100)},update:function(a){var t = a.listId;if(undefined !== t) this.listId(t);t = a.items;if(undefined !== t) this.items(t)},root: function(){return n0;}};},"todolistTemplate_forall_10": function(pool){var n11 = document.createElement("li"),child_itemTemplate1 = [],after_itemTemplate1 = document.createTextNode("");n11.appendChild(after_itemTemplate1);return {remove:function(){n11.parentNode.removeChild(n11);},data:function(a){temple_utils.render_child(after_itemTemplate1, "itemTemplate", a, pool, child_itemTemplate1)},update:function(a){var t = a.data;if(undefined !== t) this.data(t)},root: function(){return n11;}};}};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var temple_utils = __webpack_require__(0);module.exports = { "itemTemplate": function(pool){var n15 = document.createElement("button"),n14 = document.createElement("button"),n13 = document.createElement("span"),n12 = document.createElement("div"),n13_text2_text = document.createTextNode("");n15.className = "todobtn remove-item-button";n14.className = "todobtn done-item-button";n12.className = "todoitem";n13.appendChild(n13_text2_text);n12.appendChild(n13);n14.appendChild(document.createTextNode("done"));n12.appendChild(n14);n15.appendChild(document.createTextNode("remove"));n12.appendChild(n15);return {remove:function(){n12.parentNode.removeChild(n12);},itemIndex:function(a){n12.setAttribute("data-item-index", a)},itemClass:function(a){n13.className = "" + a},text:function(a){n13_text2_text.nodeValue = a},update:function(a){var t = a.itemIndex;if(undefined !== t) this.itemIndex(t);t = a.itemClass;if(undefined !== t) this.itemClass(t);t = a.text;if(undefined !== t) this.text(t)},root: function(){return n12;}};}};

/***/ })
/******/ ]);