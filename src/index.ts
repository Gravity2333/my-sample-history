import EventCenter from "./eventCenter"

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
export type Key = string | number
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

/** readonly函数 */
function readOnly<T>(obj: T) {
    return Object.freeze(obj) as T
}

/** HistoryState history的state在window.history中的存储格式 */
type HistoryState = {
    usr: any,
    key: number,
    idx: number
}


/** 创建browser路由 */
export function createBrowserHistory(options: {
    window?: Window
} = {}) {
    /** 设置默认window */
    if (options?.window) {
        document.defaultView != options?.window
    }
    /** 获得window.history对象 其中可以存储location */
    const globalHistory = document.defaultView!.history

    /** 获取当前的location 和 index */
    function getCurrentLocationAndIndex() {
        const { pathname, hash, search } = window.location
        const { state } = globalHistory as { state: HistoryState }
        return [
            readOnly<Location>({
                pathname,
                hash,
                search,
                state: state.usr || null,
                key: state.key || 'default',
            }),
            state.idx
        ] as [Location, number]
    }

    /** 创建监听和block事件函数 */
    const listener = new EventCenter()
    const blocker = new EventCenter()

    /** 获取初始化的location和index */
    let [location, index] = getCurrentLocationAndIndex()

    if (index === void 0) {
        /** 初始化 idx赋 0 */
        index = 0
        globalHistory.replaceState({
            ...globalHistory.state,
            idx: index
        }, "")
    }

}

/** 创建hash路由 */
export function createHashHistory({ window }: {
    window?: Window
}) {

}
