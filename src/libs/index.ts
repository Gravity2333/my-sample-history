import EventCenter from "./EventCenter";
import generateUniqueKey from "./generateUniqueKey";

export enum Action {
  // 历史变动 不分方向 默认
  POP = "POP",
  // 新增动作
  PUSH = "PUSH",
  // 替换动作
  REPLACE = "REPLACE",
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

/** hash变动事件名称 */
const ON_HASH_CHANGE = "onhashchange";

/** popstate事件名称 */
const POP_STATE = "popstate";

/** 卸载之前beforeunload */
const BEFORE_UNLOAD = "beforeunload";

/** readonly函数 */
function readOnly<T>(obj: T) {
  return Object.freeze(obj) as T;
}

/** warning函数 只告警 不抛Error */
function warning(message: string) {
  console.error(message);
}

/**
 * 处理浏览器url回撤跳转的情况，让浏览器弹出弹框提示用户
 * @param e
 */
function handleBeforeUnload(e: any) {
  e.preventDefault();
  e.returnValue = "";
}

/** HistoryState history的state在window.history中的存储格式 */
type HistoryState = {
  usr: any;
  key: Key;
  idx: number;
};

/**
 * createPath 解析Path对象 => path字符串
 * @param param0 Partial<Path>
 * @returns string
 */
function createPath({
  /** 需要给参数设置初始值，以保证获得一个完整的Path对象 */
  pathname = "/",
  search = "",
  hash = "",
}: PartialPath): string {
  let pathStr = pathname;
  if (search) {
    if (search?.startsWith("?")) {
      pathStr += search;
    } else {
      pathStr += `?${search}`;
    }
  }

  if (hash) {
    if (hash?.startsWith("#")) {
      pathStr += hash;
    } else {
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
function parsePath(pathStr: string): Path {
  const pathObj: Path = { pathname: "/", hash: "", search: "" };
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
export function createBrowserHistory(
  {
    window = document.defaultView!
  }: {
    window?: Window;
  } = {}
): History {
  /** 获得window.history对象 其中可以存储location */
  const globalHistory = window.history;

  /** 获取当前的location 和 index */
  function getCurrentLocationAndIndex() {
    const { pathname, hash, search } = window.location;
    const { state } = globalHistory as { state: HistoryState };
    return [
      readOnly<Location>({
        pathname,
        hash,
        search,
        state: state?.usr || null,
        key: state?.key || "default",
      }),
      state?.idx,
    ] as [Location, number];
  }

  /** 创建监听和block事件函数 */
  const listener = new EventCenter<Listener>();
  const blocker = new EventCenter<Blocker>();

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
    globalHistory.replaceState(
      {
        ...globalHistory.state,
        idx: index,
      },
      ""
    );
  }

  /**
   * createHref方法 支持传入
   * @param {to} To
   * @returns href string
   */
  function createHref(to: To): string {
    return typeof to === "string" ? to : createPath(to);
  }

  /**
   * 生成下一个（新的 带插入的）Location对象
   * @param to
   * @param state
   * @returns Location
   */
  function getNextLocation(to: To, state: State): Location {
    /** 获得新的path */
    const nextPath = typeof to === "string" ? parsePath(to) : to;
    /** 以当前的pathname为base，生成location */
    return readOnly<Location>({
      pathname: window.location.pathname,
      search: "",
      hash: "",
      ...nextPath,
      state,
      key: generateUniqueKey(),
    });
  }

  /** 判断transition是否能执行 */
  function allowTx(transition: Transition) {
    return !blocker.length || blocker.call(transition) || false;
  }

  /** 应用 事务 变更内部状态 调用listener */
  function applyTx(nextAction: Action) {
    action = nextAction;
    /** 此时新的location已经被设置，需要调用listener 更新location和index状态 */
    [location, index] = getCurrentLocationAndIndex();
    listener.call({ location, action } as Update);
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    nextIndex: number
  ): [HistoryState, string] {
    return [
      readOnly<HistoryState>({
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
  function push(to: To, state: State) {
    /** 生成新的location */
    const nextLocation = getNextLocation(to, state);
    const retry = () => {
      push(to, state);
    };
    /** 判断transiton是否允许 */
    if (allowTx({ location: nextLocation, action: Action.PUSH, retry })) {
      /** 把location转成存入globalHistory的state 以及URL */
      const [historyState, url] = getHistoryStateAndUrl(
        nextLocation,
        index + 1
      );
      /** 保存到GlobalHistory */
      globalHistory.pushState(historyState, "", url);
      /**更新状态 调用listener */
      applyTx(Action.PUSH);
    }
  }

  /**
   * replace
   * @param to To
   * @param state any
   */
  function replace(to: To, state: State) {
    /** 生成新的location */
    const nextLocation = getNextLocation(to, state);
    const retry = () => {
      push(to, state);
    };
    /** 判断transiton是否允许 */
    if (allowTx({ location: nextLocation, action: Action.REPLACE, retry })) {
      /** 把location转成存入globalHistory的state 以及URL */
      const [historyState, url] = getHistoryStateAndUrl(
        nextLocation,
        index + 1
      );
      /** 保存到GlobalHistory */
      globalHistory.replaceState(historyState, "", url);
      /**更新状态 调用listener */
      applyTx(Action.REPLACE);
    }
  }

  function go(delta: number) {
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
  let blockTx: Transition | null = null;
  /** blockTx是个全局的transition 下面函数做的事情就是
   * 1. 如果blockTx存在，则调用blocker，blocker中处理 在允许跳转之后需要unblock 再retry 否则可能死循环
   * 2. 如果不存在blockTx 判断是否有blocker 如果有责创建blockTx 并且回退
   */
  window.addEventListener(POP_STATE, () => {
    if (blockTx) {
      // 运行blocker逻辑
      blocker.call(blockTx);
      blockTx = null;
    } else {
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
        } else {
          /** 我们知道 使用history时，state.idx 一定是由history中的 push/replace函数放入的 如果state.idx为空 则一定是手动调用pushState / repalcState */
          warning("请不要直接使用pushState / replaceState 操作路由！");
        }
      } else {
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
    listen: (fn: Listener) => {
      return listener.listen(fn);
    },
    block: (fn: Blocker) => {
      const unblock = blocker.listen(fn);

      /** 需要处理跳转到站外的情况 url enter的情况 */
      if (blocker?.length > 0) {
        window.addEventListener(BEFORE_UNLOAD, handleBeforeUnload);
      }
      /** 返回unblock */
      return () => {
        unblock();
        if (blocker.length === 0) {
          window.removeEventListener(BEFORE_UNLOAD, handleBeforeUnload);
        }
      };
    },
  };
}

/** 创建hash路由
 *  hash路由以 #/ 记录路由信息，其内容也包含 #/pathname?search#hash
 *  由于hash变动，不会导致浏览器重新请求资源，所以刷新页面的时候不会出现404问题，不需要后端设置默认index.html路径 / historyApiFallback
 */
export function createHashHistory({
  window = document.defaultView!
}: { window?: Window }): History {
  const globalHistory = window.history

  /** 获得当前的Location和index  注意 这里需要从location.hash 获取 并且使用parsePath解析
   *  hash模式下，由于真正的路由信息在# 后 所以浏览器不会自动解析好Path: {pathname,search,hash}
   */
  function getCurrentLocationAndIndex() {
    /** 注意区别 这里是从location.hash取hash信息 并且自己Parse */
    const hashStr = window.location.hash
    const state = globalHistory.state as HistoryState
    const { pathname, search, hash } = parsePath(hashStr)
    return [
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state?.usr,
        key: state?.key
      }),
      state?.idx
    ] as const
  }

  /**
   * 获得下一个Location / 创建新的Location
   * 传入to，state
   */
  function getNextLocation(to: To, state: any) {
    const nextPath = typeof to === 'string' ? parsePath(to) : to
    return readOnly<Location>({
      pathname: window.location.pathname,
      search: '',
      hash: '',
      ...nextPath,
      state,
      key: generateUniqueKey()
    })
  }

  /**
   * 这是一个和browser不同的地方
   * 如果html文件的head中 包含<base> 标签，一般写法为:
   *  <head>
   *    <base href='/center/'>
   *  ...</head>
   * 当base包含属性href时，html中的 “相对” 路径计算，都会基于这个base的href
   * 比如 <a href="./user"/> 则 解析出来的地址 不是 http://example.com/user 而是 /center/user 这是一个绝对路径了 拼接上origin为http://example.com/center/user
   * 
   * 在使用browser history时，由于history.pushState/repalceState时，都是传入一个绝对的url 也就是解析出来的path 所以base.href不起作用
   * 但是，在使用hash router的时候，由于pushState/replaceState传入的路径是一个 #开头的字符串 即#/aaa/bbb/ccc 浏览器不会认为这是一个绝对路径，如果不存在base 则会将其加到当前路径下 http://example#/aaa/bbb/ccc
   * 如果存在base 则会按照计算相对路径的方式 结合base生成一个绝对路径 即/center#/aaa/bbb/ccc => http://example/center#/aaa/bbb/ccc 就会凭空多出一个/center/ 
   * 所以在这里就是 忽略base的影响，如果base标签存在 则直接返回一个绝对路径
   */
  function getBaseHref() {
    const base = document.querySelector('base')
    let baseHref = ""

    if (base && base.href) {
      const url = window.location.href
      const hashIndex = url.indexOf("#")

      baseHref = hashIndex >= 0 ? url.slice(0, hashIndex) : url
    }

    return ""
  }

  /** 用来创建一个Href信息
   *  用来生成url存入GlobalState中 或者生成一个可以被a使用的href信息
   */
  function createHref(to: To) {
    /** 这里多了一个getBaseHref方法 和browser不同 */
    return getBaseHref() + '#' + (typeof to === "string" ? to : createPath(to));
  }

  /** 获取GlobalHistory格式的state以及存入GlobalHistory的url */
  function getHistoryStateAndUrl(location: Location, index: number) {
    return [
      readOnly<HistoryState>({
        usr: location.search,
        key: location.key,
        idx: index
      }),
      createHref(location)
    ] as const
  }

  /** 判断事务是否允许运行 */
  function allowTx(tx: Transition) {
    return !blocker?.length || (blocker.call(tx), false)
  }

  /** 应用事务 */
  function applyTx(nextAction: Action) {
    action = nextAction;
    /** 更新index和next */
    [location, index] = getCurrentLocationAndIndex();
    /** call listenener */
    listener.call({ location, action } as Update)
  }

  /** 初始化Action 默认为Action.POP */
  let action = Action.POP
  /** 获取index和location */
  let [location, index] = getCurrentLocationAndIndex()
  /** 创建listener和blocker事件中心 */
  const listener = new EventCenter<Listener>()
  const blocker = new EventCenter<Blocker>()

  if (index === void 0) {
    /** 不存在idx 初始化index */
    index = 0
    /** replace idx到当前history.state中 */
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "")
  }


  function push(to: To, state: any) {
    const nextLocation = getNextLocation(to, state)
    function retry() {
      push(to, state)
    }
    /** 是否允许事务 */
    if (allowTx({ location: nextLocation, action: Action.PUSH, retry })) {
      /** 生成HistoryState */
      const [nextHistoryState, url] = getHistoryStateAndUrl(nextLocation, index + 1)

      globalHistory.pushState(nextHistoryState, "", url)

      /** 更改状态 */
      applyTx(Action.PUSH)
    }
  }

  function replace(to: To, state: any) {
    const nextLocation = getNextLocation(to, state)
    function retry() {
      push(to, state)
    }
    /** 是否允许事务 */
    if (allowTx({ location: nextLocation, action: Action.REPLACE, retry })) {
      /** 生成HistoryState */
      const [nextHistoryState, url] = getHistoryStateAndUrl(nextLocation, index + 1)

      globalHistory.replaceState(nextHistoryState, "", url)

      /** 更改状态 */
      applyTx(Action.REPLACE)
    }
  }

  /** GO */
  function go(delta: number) {
    globalHistory.go(delta)
  }

  /** 监听popstate函数 监听go 浏览器前进后退按钮事件 */
  let blockTx: Transition | null = null
  window.addEventListener(POP_STATE, () => {
    if (blockTx) {
      /** 如果存在blockTx 直接调用blocker处理tx */
      blocker.call(blockTx)
      blockTx = null
    } else {
      /** 不存在blockTx */
      if (blocker.length) {
        /** 有阻塞 会退 设置blockTx */
        /** 由于此时location已经修改完成 直接获取当前location和index即可 */
        const [nextLocation, nextIndex] = getCurrentLocationAndIndex()
        if (nextIndex !== void 0) {
          /** 计算会退step */
          const steps = index - nextIndex

          /** 封装retry */
          function retry() {
            go(-steps)
          }

          /** 封装blockTx */
          blockTx = {
            location: nextLocation,
            action: Action.POP,
            retry
          }

          /** 回退 */
          go(steps)
        } else {
          warning("请不要绕过history调用 pushState/replaceState")
        }
      } else {
        /** 没有阻塞 应用tx */
        applyTx(Action.POP)
      }
    }
  })

  return {
    action,
    location,
    push,
    replace,
    createHref,
    go,
    back: () => { go(-1) },
    forward: () => { go(1) },
    listen: listener.listen,
    block: (fn: Blocker) => {
      const unblock = blocker.listen(fn)

      if (blocker.length > 0) {
        window.addEventListener(BEFORE_UNLOAD, handleBeforeUnload)
      }

      return () => {
        unblock();
        if (blocker.length === 0) {
          window.removeEventListener(BEFORE_UNLOAD, handleBeforeUnload);
        }
      };
    }
  }

}
