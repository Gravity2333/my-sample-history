/******/ var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * 实现一个事件中心，用来存储history变动处理函数，Block处理函数
 *
 */
class EventCenter {
    events = [];
    /** 获取事件数量 */
    get length() {
        return this.events.length;
    }
    /** 监听函数 */
    listen(event) {
        this.events.push(event);
        return () => {
            this.events = this.events.filter(e => e !== event);
        };
    }
    /** call函数 触发事件 */
    call(arg) {
        this.events.forEach(fn => fn && fn(arg));
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventCenter);


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generateUniqueKey)
/* harmony export */ });
function generateUniqueKey(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}


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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Action: () => (/* binding */ Action),
/* harmony export */   createBrowserHistory: () => (/* binding */ createBrowserHistory),
/* harmony export */   createHashHistory: () => (/* binding */ createHashHistory)
/* harmony export */ });
/* harmony import */ var _EventCenter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _generateUniqueKey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


var Action;
(function (Action) {
    // 历史变动 不分方向 默认
    Action["POP"] = "POP";
    // 新增动作
    Action["PUSH"] = "PUSH";
    // 替换动作
    Action["REPLACE"] = "REPLACE";
})(Action || (Action = {}));
/** hash变动事件名称 */
const ON_HASH_CHANGE = "onhashchange";
/** popstate事件名称 */
const POP_STATE = "popstate";
/** 卸载之前beforeunload */
const BEFORE_UNLOAD = "beforeunload";
/** readonly函数 */
function readOnly(obj) {
    return Object.freeze(obj);
}
/** warning函数 只告警 不抛Error */
function warning(message) {
    console.error(message);
}
/**
 * 处理浏览器url回撤跳转的情况，让浏览器弹出弹框提示用户
 * @param e
 */
function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = "";
}
/**
 * createPath 解析Path对象 => path字符串
 * @param param0 Partial<Path>
 * @returns string
 */
function createPath({ 
/** 需要给参数设置初始值，以保证获得一个完整的Path对象 */
pathname = "/", search = "", hash = "", }) {
    let pathStr = pathname;
    if (search) {
        if (search?.startsWith("?")) {
            pathStr += search;
        }
        else {
            pathStr += `?${search}`;
        }
    }
    if (hash) {
        if (hash?.startsWith("#")) {
            pathStr += hash;
        }
        else {
            pathStr += `#${hash}`;
        }
    }
    return pathStr;
}
/**
 * parsePath: 根据path路径 创建path对象
 * @param pathStr string
 * @returns Path
 */
function parsePath(pathStr) {
    const pathObj = { pathname: "/", hash: "", search: "" };
    /** 从后向前解析 */
    const hashIndex = pathStr.indexOf("#");
    if (hashIndex >= 0) {
        pathObj.hash = pathStr.slice(hashIndex);
        pathStr = pathStr.slice(0, hashIndex);
    }
    const searchIndex = pathStr.indexOf("?");
    if (searchIndex >= 0) {
        pathObj.search = pathStr.slice(searchIndex);
        pathStr = pathStr.slice(0, searchIndex);
    }
    /** 赋值patiname */
    pathObj.pathname = pathStr;
    return pathObj;
}
/** 创建browser路由 */
function createBrowserHistory(options = {}) {
    /** 设置默认window */
    if (options?.window) {
        document.defaultView != options?.window;
    }
    /** 获得window.history对象 其中可以存储location */
    const globalHistory = document.defaultView.history;
    /** 获取当前的location 和 index */
    function getCurrentLocationAndIndex() {
        const { pathname, hash, search } = window.location;
        const { state } = globalHistory;
        return [
            readOnly({
                pathname,
                hash,
                search,
                state: state?.usr || null,
                key: state?.key || "default",
            }),
            state?.idx,
        ];
    }
    /** 创建监听和block事件函数 */
    const listener = new _EventCenter__WEBPACK_IMPORTED_MODULE_0__["default"]();
    const blocker = new _EventCenter__WEBPACK_IMPORTED_MODULE_0__["default"]();
    /** 获取当前的location和index 从当前window.location中取 */
    let [location, index] = getCurrentLocationAndIndex();
    /** 设置默认Action 初始为POP */
    let action = Action.POP;
    /** 如果index为undefined 说明当前页面还没有初始化过history对象
     * 如果是页面刷新，当前的state里一定有idx
     */
    if (index === void 0) {
        /** 初始化 idx赋 0 */
        index = 0;
        /** 使用replaceState在当前state里加入idx */
        globalHistory.replaceState({
            ...globalHistory.state,
            idx: index,
        }, "");
    }
    /**
     * createHref方法 支持传入
     * @param {to} To
     * @returns href string
     */
    function createHref(to) {
        return typeof to === "string" ? to : createPath(to);
    }
    /**
     * 生成下一个（新的 带插入的）Location对象
     * @param to
     * @param state
     * @returns Location
     */
    function getNextLocation(to, state) {
        /** 获得新的path */
        const nextPath = typeof to === "string" ? parsePath(to) : to;
        /** 以当前的pathname为base，生成location */
        return readOnly({
            pathname: window.location.pathname,
            search: "",
            hash: "",
            ...nextPath,
            state,
            key: (0,_generateUniqueKey__WEBPACK_IMPORTED_MODULE_1__["default"])(),
        });
    }
    /** 判断transition是否能执行 */
    function allowTx(transition) {
        return !blocker.length || blocker.call(transition) || false;
    }
    /** 应用 事务 变更内部状态 调用listener */
    function applyTx(nextAction) {
        action = nextAction;
        /** 此时新的location已经被设置，需要调用listener 更新location和index状态 */
        [location, index] = getCurrentLocationAndIndex();
        listener.call({ location, action });
    }
    function getHistoryStateAndUrl(nextLocation, nextIndex) {
        return [
            readOnly({
                usr: nextLocation.state,
                key: nextLocation.key,
                idx: nextIndex,
            }),
            /** nextLocation即成自Path 可以直接传 */
            createHref(nextLocation),
        ];
    }
    /**
     * push方法
     * @param to To
     * @param state any
     */
    function push(to, state) {
        /** 生成新的location */
        const nextLocation = getNextLocation(to, state);
        const retry = () => {
            push(to, state);
        };
        /** 判断transiton是否允许 */
        if (allowTx({ location: nextLocation, action: Action.PUSH, retry })) {
            /** 把location转成存入globalHistory的state 以及URL */
            const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
            /** 保存到GlobalHistory */
            globalHistory.pushState(historyState, "", url);
            /**更新状态 调用listener */
            applyTx(Action.POP);
        }
    }
    /**
     * replace
     * @param to To
     * @param state any
     */
    function replace(to, state) {
        /** 生成新的location */
        const nextLocation = getNextLocation(to, state);
        const retry = () => {
            push(to, state);
        };
        /** 判断transiton是否允许 */
        if (allowTx({ location: nextLocation, action: Action.PUSH, retry })) {
            /** 把location转成存入globalHistory的state 以及URL */
            const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
            /** 保存到GlobalHistory */
            globalHistory.replaceState(historyState, "", url);
            /**更新状态 调用listener */
            applyTx(Action.POP);
        }
    }
    function go(delta) {
        globalHistory.go(delta);
    }
    /** 监听popstate 也就是监听go back forware 以及 浏览器前进后退*/
    /** 其逻辑是，获取当前最新的location和index 并且封装一个retry go(delta)
     *  由于POP_state事件监听到的时候，浏览器已经完成跳转了，所以如果allowTx为false的情况下，需要先将浏览器倒退
     *  使用当前index - location.idx 算出浏览器这次POP到的位置和index的step
     *   比如 浏览器向前pop 3步骤
     *   假设当前index = 5
     *   则location.idx = 8 此时index - location.idx = -3 那么需要先回退-3 执行blocker
     *   同时封装retry为 go(-(index-location.idx)) 反向同理
     */
    let blockTx = null;
    /** blockTx是个全局的transition 下面函数做的事情就是
     * 1. 如果blockTx存在，则调用blocker，blocker中处理 在允许跳转之后需要unblock 再retry 否则可能死循环
     * 2. 如果不存在blockTx 判断是否有blocker 如果有责创建blockTx 并且回退
     */
    window.addEventListener(POP_STATE, () => {
        if (blockTx) {
            // 运行blocker逻辑
            blocker.call(blockTx);
            blockTx = null;
        }
        else {
            if (blocker.length > 0) {
                /** 回退 */
                const [nextLocation, nextIndex] = getCurrentLocationAndIndex();
                if (nextIndex !== void 0) {
                    const backDelta = index - nextIndex;
                    blockTx = {
                        location: nextLocation,
                        action: Action.POP,
                        retry: () => {
                            go(-backDelta);
                        },
                    };
                    // 回退 触发下一次popstate
                    go(backDelta);
                }
                else {
                    /** 我们知道 使用history时，state.idx 一定是由history中的 push/replace函数放入的 如果state.idx为空 则一定是手动调用pushState / repalcState */
                    warning("请不要直接使用pushState / replaceState 操作路由！");
                }
            }
            else {
                /** 更新状态 */
                applyTx(Action.POP);
            }
        }
    });
    return {
        action,
        location,
        createHref,
        push,
        replace,
        go,
        forward: () => {
            go(1);
        },
        back: () => {
            go(-1);
        },
        listen: (fn) => {
            return listener.listen(fn);
        },
        block: (fn) => {
            const unbloack = blocker.listen(fn);
            /** 需要处理跳转到站外的情况 url enter的情况 */
            if (blocker?.length > 0) {
                window.addEventListener(BEFORE_UNLOAD, handleBeforeUnload);
            }
            /** 返回unblock */
            return () => {
                window.removeEventListener(BEFORE_UNLOAD, handleBeforeUnload);
                unbloack();
            };
        },
    };
}
/** 创建hash路由 */
function createHashHistory({ window }) { }

})();

var __webpack_exports__Action = __webpack_exports__.Action;
var __webpack_exports__createBrowserHistory = __webpack_exports__.createBrowserHistory;
var __webpack_exports__createHashHistory = __webpack_exports__.createHashHistory;
export { __webpack_exports__Action as Action, __webpack_exports__createBrowserHistory as createBrowserHistory, __webpack_exports__createHashHistory as createHashHistory };
