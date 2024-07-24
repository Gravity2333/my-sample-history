import { BrowerHistory } from "./typings";
/** 返回一个browserHistory */
export declare function createBrowserHistory({ globalWindow, }: {
    globalWindow?: Window & typeof globalThis;
}): BrowerHistory;
/** 返回一个hashHistory */
export declare function createHashHistory(): {};
