/******/ var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventBus)
/* harmony export */ });
class EventBus {
    handlers = [];
    constructor() { }
    /** 注册监听 */
    listen = (listener) => {
        this.handlers.push(listener);
        return () => {
            this.handlers.filter((handler) => handler !== listener);
        };
    };
    trigger = (update) => {
        this.handlers.forEach((handler) => handler(update));
    };
    getLength = () => {
        return this.handlers.length;
    };
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Action: () => (/* binding */ Action),
/* harmony export */   DEFAULT_INDEX_VALUE: () => (/* binding */ DEFAULT_INDEX_VALUE),
/* harmony export */   DEFAULT_KEY: () => (/* binding */ DEFAULT_KEY),
/* harmony export */   DEFAULT_STATE: () => (/* binding */ DEFAULT_STATE)
/* harmony export */ });
var Action;
(function (Action) {
    /** POP状态 使用push go forward back 点击浏览器前进后退按钮时，都触发POP类型的Action */
    Action["POP"] = "POP";
    /** 向history堆栈中添加item */
    Action["PUSH"] = "PUSH";
    /** 替换history堆栈中顶部item */
    Action["REPLACE"] = "REPLACE";
})(Action || (Action = {}));
/** 默认初始化状态下INDEX VAKLUE */
const DEFAULT_INDEX_VALUE = 'DEFAULT_INDEX_VALUE';
const DEFAULT_KEY = "default";
const DEFAULT_STATE = null;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHref: () => (/* binding */ createHref),
/* harmony export */   createKey: () => (/* binding */ createKey),
/* harmony export */   generateJumpUrl: () => (/* binding */ generateJumpUrl),
/* harmony export */   parseLocationToHistoryState: () => (/* binding */ parseLocationToHistoryState),
/* harmony export */   parsePath: () => (/* binding */ parsePath),
/* harmony export */   readOnly: () => (/* binding */ readOnly)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

/** freeze对象，让对象只读 */
const readOnly = (obj) => {
    return Object.freeze(obj);
};
/** 解析Path类型的对象 */
function parsePath(to) {
    if (typeof to === "string") {
        const parsedPath = {};
        let cachePath = to;
        /** 先解析hash 从后往前 */
        const hashIndex = cachePath.indexOf("#");
        if (hashIndex >= 0) {
            parsedPath.hash = cachePath.substring(hashIndex);
            cachePath = cachePath.substring(0, hashIndex);
        }
        /** 解析完hash 去掉hash部分 继续解析search */
        const searchIndex = cachePath?.indexOf("?");
        if (searchIndex >= 0) {
            parsedPath.search = cachePath.substring(searchIndex);
            cachePath = cachePath.substring(0, searchIndex);
        }
        /** 剩下的就是 pathname */
        parsedPath.pathname = cachePath;
        return parsedPath;
    }
    else {
        return to;
    }
}
/** 生成随key */
function createKey() {
    return (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])();
}
/** 把Location转换成historyState */
function parseLocationToHistoryState(location, index) {
    return readOnly({
        usr: location.state,
        idx: index,
        key: location.key,
    });
}
/** 生成jumpUrl
 *  原生location中，没有描述 pathname+search+hash的属性
 *  history-dev 库中的href应该是 origin+pathname+search+hash
 *  所以这里我愿意成为 jumpUrl，也就是history.push(url) 内部传入的在域内部跳转的路径!
 */
function generateJumpUrl({ pathname = "/", search = "", hash = "", }) {
    let jumpUrl = pathname;
    // 如果无search 或者 search为一个单一？ 忽略
    if (search && search !== "?") {
        jumpUrl += search?.startsWith("?") ? search : `?${search}`;
    }
    // 如果无hash  或者 hash为单一一个 # 忽略
    if (hash && hash !== "#") {
        jumpUrl += hash?.startsWith("#") ? hash : `#${hash}`;
    }
    return jumpUrl;
}
/** 把to类型统一转换成字符串类型的url */
function createHref(to) {
    if (typeof to === "string") {
        return to;
    }
    return generateJumpUrl(to);
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);



function v4(options, buf, offset) {
  if (_native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID && !buf && !options) {
    return _native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__["default"])();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  randomUUID
});

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).

var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);


/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
  var uuid = unsafeStringify(arr, offset);
  // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }
  return uuid;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);

function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i);

/***/ })
/******/ ]);
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBrowserHistory: () => (/* binding */ createBrowserHistory),
/* harmony export */   createHashHistory: () => (/* binding */ createHashHistory)
/* harmony export */ });
/* harmony import */ var _eventBus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _typings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);



/** 返回一个browserHistory */
function createBrowserHistory({ globalWindow = document.defaultView, }) {
    // window可以传入，不传入默认使用系统自带
    // 通过globalWindow 获取globalHistory
    const globalHistory = globalWindow.history;
    // 创建监听事件总线，处理注册事件
    const eventBus = new _eventBus__WEBPACK_IMPORTED_MODULE_0__["default"]();
    // 上一个Action, 默认为POP
    let lastAction = _typings__WEBPACK_IMPORTED_MODULE_1__.Action.POP;
    /**
     *  注意，这里的Location是history中定义的Location， 包含pathname,search,hash,state,key
     *  这里需要根据当前globalWindow对象中的location对象，结合globalWindow中的state对象生成
     */
    function getCurrentIndexAndLocation() {
        /** 其中，pathname search hash 在原生的location都存在，可以直接取得 */
        const { pathname, search, hash } = globalWindow.location;
        /** state需要从history.state中取出
         *  注意，history中存储的state要满足 HistoryState ，其中的usr才对应Location中的state
         */
        const state = globalHistory.state || {};
        return [
            isNaN(+state.idx) ? _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_INDEX_VALUE : state.idx,
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.readOnly)({
                pathname,
                search,
                hash,
                state: state.usr || _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_STATE,
                key: state.key || _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_KEY,
            }),
        ];
    }
    /**
     * 根据to,state 生成新的Location对象
     * @param to 满足To约束，可以是一个路径或者Path类型的对象
     * @param state 满足State约束
     * 注意 该函数的to如果传递对象，可以只传递Path的部分，可以理解为增量修改当前location内容
     */
    function generateNewLocation(to, state) {
        const { pathname, search, hash } = globalWindow.location;
        return (0,_utils__WEBPACK_IMPORTED_MODULE_2__.readOnly)({
            pathname,
            search,
            hash,
            state,
            ...(0,_utils__WEBPACK_IMPORTED_MODULE_2__.parsePath)(to),
            key: (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createKey)(),
        });
    }
    /** 处理PopState事件
     *  browser模式下，有两个途径可以触发路由变动
     *  1. 使用 go back forward 或者点击浏览器前进后退 会触发popstate事件
     *  2. 调用history.push/replace方法，内部在调用pushState/replaceState时会触发事件中心，调用监听函数
     */
    function handlePopState(e) {
        e.preventDefault();
        e.stopPropagation();
        lastAction = _typings__WEBPACK_IMPORTED_MODULE_1__.Action.POP;
        // 触发事件总线
        eventBus.trigger({
            action: lastAction,
            location: getCurrentIndexAndLocation()[1],
        });
    }
    globalWindow.addEventListener("popstate", handlePopState);
    /** 处理初始化情况，此时history.state不存在规范的HistoryState约束，也不存在index */
    if (getCurrentIndexAndLocation()[0] === _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_INDEX_VALUE) {
        // 注意 这里无法直接给globalHistory.state赋值，需要通过replaceState的方式替换
        globalHistory.replaceState({
            ...(globalHistory.state || {}),
            // 初始化index
            idx: 0,
        }, "");
    }
    /** push函数，向history增加一条记录 并且触发事件总线 */
    function push(to, state) {
        /** 生成新的Location */
        const newLocation = generateNewLocation(to, state);
        /** 获取当前index */
        const [index] = getCurrentIndexAndLocation();
        /** 把新生成的Location转换为historyState */
        const newHistoryState = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.parseLocationToHistoryState)(newLocation, +index + 1);
        /** 拼接新的jumpUrl */
        const jumpUrl = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createHref)(to);
        /** 加入到history中 */
        globalHistory.pushState(newHistoryState, "", jumpUrl);
        /** 触发监听事件 */
        lastAction = _typings__WEBPACK_IMPORTED_MODULE_1__.Action.PUSH;
        eventBus.trigger({
            action: lastAction,
            location: newLocation,
        });
    }
    /** replace函数，替换当前history条目 并且触发事件总线 */
    function replace(to, state) {
        /** 生成新的location */
        const newLocation = generateNewLocation(to, state);
        /** 获取当前index */
        const [index] = getCurrentIndexAndLocation();
        /** 把新的location转换成historyState */
        const newHistoryState = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.parseLocationToHistoryState)(newLocation, +index);
        /** 生成新的jumpUrl */
        const jumpUrl = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createHref)(to);
        /** replaceState */
        globalHistory.replaceState(newHistoryState, "", jumpUrl);
        /** 触发总线 */
        lastAction = _typings__WEBPACK_IMPORTED_MODULE_1__.Action.REPLACE;
        eventBus.trigger({
            action: lastAction,
            location: newLocation,
        });
    }
    /** 跳转函数 */
    function go(delta) {
        globalHistory.go(delta);
    }
    return {
        createHref: _utils__WEBPACK_IMPORTED_MODULE_2__.createHref,
        listen: eventBus.listen,
        push,
        replace,
        go,
        back() {
            go(-1);
        },
        forward() {
            go(1);
        },
        get location() {
            return getCurrentIndexAndLocation()[1];
        },
        get action() {
            return lastAction;
        },
    };
}
/** 返回一个hashHistory */
function createHashHistory({ globalWindow = document.defaultView, }) {
    // window可以传入，不传入默认使用系统自带
    // 通过globalWindow 获取globalHistory
    const globalHistory = globalWindow.history;
    // 创建监听事件总线，处理注册事件
    const eventBus = new _eventBus__WEBPACK_IMPORTED_MODULE_0__["default"]();
    // 上一个Action, 默认为POP
    let lastAction = _typings__WEBPACK_IMPORTED_MODULE_1__.Action.POP;
    /** 这里的处理方式和browser不一样
     * 正常location对象的pathname是从origin后的/ 开始到？或 # 结束的
     * 但是我们在hash模式下，应该以 # 为锚点 即结构为
     * # pathname search hash
     * 我们需要进行转换，只保留锚点之后的部分，并且进行解析
     */
    function getCurrentIndexAndLocation() {
        /** 我们需要的，pathname search hash 在原生的location中不存在，我们必须将 # 后面的部分 作为路径，传递给path解析函数 */
        const { pathname = "/", search = "", hash = "", } = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.parsePath)(globalWindow.location?.hash.substring(1));
        /** state需要从history.state中取出
         *  注意，history中存储的state要满足 HistoryState ，其中的usr才对应Location中的state
         */
        const state = globalHistory.state || {};
        return [
            isNaN(+state.idx) ? _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_INDEX_VALUE : state.idx,
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.readOnly)({
                pathname,
                search,
                hash,
                state: state.usr || _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_STATE,
                key: state.key || _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_KEY,
            }),
        ];
    }
    /**
     * 根据to,state 生成新的Location对象
     * @param to 满足To约束，可以是一个路径或者Path类型的对象
     * @param state 满足State约束
     * 注意 该函数的to如果传递对象，可以只传递Path的部分，可以理解为增量修改当前location内容
     */
    function generateNewLocation(to, state) {
        /** 同上，这里也和browser有区别 ，直接从globalWindow.location 拿出来的pathname,hash,search不对应我们需要的hash路由的这三个值
         * 我们一样也要先找到锚点，确定当前的Location，这里我们可以调用getCurrentIndexAndLocation
         */
        const { pathname, search, hash } = getCurrentIndexAndLocation()[1];
        return (0,_utils__WEBPACK_IMPORTED_MODULE_2__.readOnly)({
            pathname,
            search,
            hash,
            state,
            ...(0,_utils__WEBPACK_IMPORTED_MODULE_2__.parsePath)(to),
            key: (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createKey)(),
        });
    }
    /** 监听hashchange事件
     *  在这里只需要对hashchange进行监听即可，源码中为了保证ios的兼容性，使用了popstate和hashchange双监听，这里简化一下
     */
    function handleHashChange(e) {
        e.preventDefault();
        e.stopPropagation();
        lastAction = _typings__WEBPACK_IMPORTED_MODULE_1__.Action.POP;
        // 触发事件总线
        eventBus.trigger({
            action: lastAction,
            location: getCurrentIndexAndLocation()[1],
        });
    }
    globalWindow.addEventListener("hashchange", handleHashChange);
    /** 处理初始化情况，此时history.state不存在规范的HistoryState约束，也不存在index */
    if (getCurrentIndexAndLocation()[0] === _typings__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_INDEX_VALUE) {
        // 注意 这里无法直接给globalHistory.state赋值，需要通过replaceState的方式替换
        globalHistory.replaceState({
            ...(globalHistory.state || {}),
            // 初始化index
            idx: 0,
        }, "");
    }
    /** 和browser区别是 hash需要用完整的路径
     *  因为相对路径默认是通过origin后面/的部分跳转的，但是这部分不对应pathname
     *  我们需要手动找到锚点#的位置 并进行拼接
     */
    function _createCompleteHref(to) {
        // hash部分的url
        const hashUrl = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createHref)(to);
        // 找到锚点index
        const anchorIndex = globalWindow.location?.href?.indexOf("#");
        const baseUrl = anchorIndex >= 0
            ? globalWindow.location?.href?.substring(0, anchorIndex)
            : globalWindow.location?.href;
        return baseUrl + "#" + hashUrl;
    }
    function push(to, state) {
        /** 生成新的Location */
        const newLocation = generateNewLocation(to, state);
        /** 获得当前index */
        const index = getCurrentIndexAndLocation()[0];
        /** 生成histroyState */
        const newHistoryState = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.parseLocationToHistoryState)(newLocation, +index + 1);
        /** 获得完整的jumpUrl */
        const jumpUrl = _createCompleteHref(to);
        /** 跳转 */
        globalHistory.pushState(newHistoryState, "", jumpUrl);
        eventBus.trigger({ action: _typings__WEBPACK_IMPORTED_MODULE_1__.Action.PUSH, location: newLocation });
    }
    function replace(to, state) {
        /** 生成新的Location */
        const newLocation = generateNewLocation(to, state);
        /** 获得当前index */
        const index = getCurrentIndexAndLocation()[0];
        /** 生成histroyState */
        const newHistoryState = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.parseLocationToHistoryState)(newLocation, +index);
        /** 获得完整的jumpUrl */
        const jumpUrl = _createCompleteHref(to);
        /** 跳转 */
        globalHistory.replaceState(newHistoryState, "", jumpUrl);
        eventBus.trigger({ action: _typings__WEBPACK_IMPORTED_MODULE_1__.Action.REPLACE, location: newLocation });
    }
    function go(delta) {
        globalHistory.go(delta);
    }
    return {
        createHref: _createCompleteHref,
        listen: eventBus.listen,
        push,
        replace,
        go,
        back() {
            go(-1);
        },
        forward() {
            go(1);
        },
        get location() {
            return getCurrentIndexAndLocation()[1];
        },
        get action() {
            return lastAction;
        },
    };
}

})();

var __webpack_exports__createBrowserHistory = __webpack_exports__.createBrowserHistory;
var __webpack_exports__createHashHistory = __webpack_exports__.createHashHistory;
export { __webpack_exports__createBrowserHistory as createBrowserHistory, __webpack_exports__createHashHistory as createHashHistory };
