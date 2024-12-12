export declare enum Action {
    POP = "POP",
    PUSH = "PUSH",
    REPLACE = "REPLACE"
}
/** 路径 */
export type Pathname = string;
/** 搜索参数 ? 后 */
export type Search = string;
/** hash #后 */
export type Hash = string;
/** 唯一的key */
export type Key = string | number;
/** state 表示每个history位置携带的信息 类型任意 */
export type State = any;
/** 表示当前路由路径，包含pathname, search, hash */
export interface Path {
    pathname: Pathname;
    search: Search;
    hash: Hash;
}
/** 部分的path */
export type PartialPath = Partial<Path>;
/** to 目的路径 */
export type To = string | PartialPath;
/** Location 一个位置，继承Path 包含Path信息和携带的state 以及一个Key */
export interface Location extends Path {
    state: any;
    key: Key;
}
/** 更新，包含动作action和新的Location */
export type Update = {
    action: Action;
    location: Location;
};
/** 表示一个事务 block时用 */
export interface Transition extends Update {
    retry: () => void;
}
/** 监听事件函数 */
export type Listener = (updates: Update) => void;
/** 阻塞事件函数 */
export type Blocker = (transition: Transition) => void;
/** History对象 */
export interface History {
    /** 最近的一个Action */
    action: Action;
    /** 当前的Location */
    location: Location;
    /** createHref 创建href */
    /** Returns a string suitable for use as an <a href> value that will navigate to the given destination. */
    createHref: (to: To) => string;
    /** push */
    push: (to: To, state?: State) => void;
    /** replace */
    replace: (to: To, state?: State) => void;
    /** go */
    go: (delta: number) => void;
    /** forward */
    forward: () => void;
    /** back */
    back: () => void;
    /** listen  returns unlisten*/
    listen: (listener: Listener) => () => void;
    /** black returns unblock*/
    block: (blocker: Blocker) => () => void;
}
/** 创建browser路由 */
export declare function createBrowserHistory(options?: {
    window?: Window;
}): History;
/** 创建hash路由 */
export declare function createHashHistory({ window }: {
    window?: Window;
}): void;
