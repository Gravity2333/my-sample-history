export enum Action {
    // 历史变动 不分方向 默认
    POP = 'POP',
    // 新增动作
    PUSH = 'PUSH',
    // 替换动作
    REPLACE = 'REPLACE'
}

/** 路径 */
export type Pathname = string
/** 搜索参数 ? 后 */
export type Search = string
/** hash #后 */
export type Hash = string
/** 唯一的key */
export type Key = string
/** state 表示每个history位置携带的信息 类型任意 */
export type State = any
/** 表示当前路由路径，包含pathname, search, hash */
export interface Path {
    pathname: Pathname,
    search: Search,
    hash: Hash
}
/** 部分的path */
export type PartialPath = Partial<Path>
/** to 目的路径 */
export type To = string | PartialPath
/** Location 一个位置，继承Path 包含Path信息和携带的state 以及一个Key */
export interface Location extends Path {
    state: any,
    key: Key
}

/** 更新，包含动作action和新的Location */
export type Update = {
    action: Action,
    location: Location
}

/** 表示一个事务 block时用 */
export interface Transition extends Update {
    retry: () => void
}

/** 监听事件函数 */
export type Listener = (updates: Update) => void
/** 阻塞事件函数 */
export type Blocker = (transition: Transition) => void

/** History对象 */
export interface History {
    /** 最近的一个Action */
    action: Action,

    /** 当前的Location */
    location: Location,

    /** push */
    push: (to: To, state?: State) => void

    /** replace */
    replace: (to: To, state?: State) => void

    /** go */
    go: (delta: number) => void

    /** forward */
    forward: () => void

    /** back */
    back: () => void

    /** listen  returns unlisten*/
    listen: (listener: Listener) => (() => void)

    /** black returns unblock*/
    block: (blocker: Blocker) => (() => void)
}

/** hash变动事件名称 */
const ON_HASH_CHANGE = 'onhashchange'

/** popstate事件名称 */
const POP_STATE = 'popstate'

/** 卸载之前beforeunload */
const BEFORE_UNLOAD = 'beforeunload'

/** 创建browser路由 */
export function createBrowserHistory({ window }: {
    window?: Window
}) {
    /** 设置默认window */
    if (window) {
        document.defaultView != window
    }
    /** 获得window.history对象 其中可以存储location */
    const globalHistory = document.defaultView!.history

    

}

/** 创建hash路由 */
export function createHashHistory({ window }: {
    window?: Window
}) {

}
