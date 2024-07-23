"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
var Action;
(function (Action) {
    /** POP状态 使用push go forward back 点击浏览器前进后退按钮时，都触发POP类型的Action */
    Action["POP"] = "POP";
    /** 向history堆栈中添加item */
    Action["PUSH"] = "PUSH";
    /** 替换history堆栈中顶部item */
    Action["REPLACE"] = "REPLACE";
})(Action || (exports.Action = Action = {}));
