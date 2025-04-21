import generateUniqueKey from "../src/generateUniqueKey";

enum Action {
  "POP" = "POP",
  "PUSH" = "PUSH",
  "REPLACE" = "REPLACE",
}

type Pathname = string;
type Hash = string;
type Search = string;
type State = any;

interface Path {
  pathname: Pathname;
  search: Search;
  hash: Hash;
}

type PartialPath = Partial<Path>;

type To = PartialPath | string;

interface Location extends Path {
  state: State;
  key: string;
}

interface HistoryState {
  usr: State;
  key: string;
  idx: number;
}

function Readonly<T>(obj: Record<string, any>) {
  return Object.freeze(obj) as T;
}

interface Update {
  action: Action;
  locaton: Location;
}

interface Transition extends Update {
  retry: () => void;
}

/** 监听函数 */
type Listener = (update: Update) => void;

/** 阻塞函数 */
type Blocker = (tx: Transition) => void;

/** POPSTATE 事件类型 */
const POP_STATE_TYPE = "popstate";
/** 卸载之前beforeunload */
const BEFORE_UNLOAD = "beforeunload";

/**
 * 处理浏览器url回撤跳转的情况，让浏览器弹出弹框提示用户
 * @param e
 */
function handleBeforeUnload(e: any) {
  e.preventDefault();
  e.returnValue = "";
}

function createEventCenter<T extends Function>() {
  const listeners: T[] = [];

  function listen(listener: T) {
    listeners.push(listener);

    return () => {
      listeners.filter((_listener) => _listener !== listener);
    };
  }

  function trigger(param: any) {
    listeners.forEach((_listener) => {
      _listener(param);
    });
  }

  return { listen, trigger, length: () => listeners.length };
}

export function createBrowserHistorty() {
  /** 获取当前的Location对象 和 index */
  function getCurrentLocationAndIndex(): [Location, number] {
    const { pathname, search, hash } = window.location;
    const state: HistoryState = window.history.state;

    return [
      Readonly<Location>({
        pathname,
        search,
        hash,
        state: state.usr,
        key: state.key,
      }),
      state.idx,
    ];
  }

  let [currentLocation, idx] = getCurrentLocationAndIndex();

  /** 初始化的action */
  let currentAction = Action.POP;
  /** 监听函数 */
  const listeners = createEventCenter<Listener>();
  /** 阻塞函数 */
  const blockers = createEventCenter<Blocker>();

  /** 判断idx=void 0的情况，初始化idx */
  if (idx === void 0) {
    idx = 0;
    history.replaceState(
      {
        ...(history.state || {}),
        idx,
      } as HistoryState,
      ""
    );
  }

  /** 把 URL解析为Path */
  function parseUrlToPath(url: string) {
    const parsedPath: Path = { pathname: "/", hash: "", search: "" };
    const hashIndex = url.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = url.slice(hashIndex);
      url = url.slice(0, hashIndex - 1);
    }

    const searchIndex = url.indexOf("?");
    if (hashIndex >= 0) {
      parsedPath.search = url.slice(searchIndex);
      url = url.slice(0, searchIndex - 1);
    }

    parsedPath.pathname = url;
    return parsedPath;
  }

  /** 把path转换成url */
  function parsePathToUrl(to: To) {
    if (typeof to === "string") return to;
    const { pathname = "/", search = "", hash = "" } = to;
    let url = pathname;

    if (search) {
      if (search.startsWith("?")) {
        url += search;
      } else {
        url += `?${search}`;
      }
    }

    if (hash) {
      if (hash.startsWith("#")) {
        url += hash;
      } else {
        url += `#${hash}`;
      }
    }

    return url;
  }

  /** 获取下一个Location */
  function getNextLocation(to: To, state: State = {}): Location {
    const nextPath: Partial<Path> =
      typeof to === "string" ? parseUrlToPath(to) : to;
    return Readonly<Location>({
      ...currentLocation,
      ...nextPath,
      state,
    });
  }

  /** 创建完整的url */
  function createHref(to: To): string {
    return typeof to === "string" ? to : parsePathToUrl(to);
  }

  /** 把Location 转换成 histrot State */
  function parseLocationToHistoryStateAndUrl(
    location: Location,
    index: number
  ): [HistoryState, string] {
    return [
      Readonly<HistoryState>({
        usr: location.state,
        key: generateUniqueKey(),
        idx: index,
      }),
      createHref(location),
    ];
  }

  /** 运行事物 listener 更新index currentLocation currenyAction */
  function applyTx(nextAction: Action) {
    currentAction = nextAction;
    let [currentLocation, idx] = getCurrentLocationAndIndex();
    listeners.trigger({
      action: nextAction,
      locaton: currentLocation,
    } as Update);
  }

  /** 是否运行事物运行 */
  function allowTx(tx: Transition) {
    return !blockers.length() || (blockers.trigger(tx), false);
  }

  /** 推入新的路径 */
  function push(to: To, state: State) {
    /** 获取下一个location */
    const nextLocation = getNextLocation(to, state);
    /** 判断是否可以 push*/
    if (
      allowTx({
        action: Action.PUSH,
        locaton: nextLocation,
        retry: () => {
          push(to, state);
        },
      })
    ) {
      /** location 转 historyState存入history */
      const [nextHistoryState, href] = parseLocationToHistoryStateAndUrl(
        nextLocation,
        idx + 1
      );
      /** push */
      history.pushState(nextHistoryState, "", href);
      /** 运行事物listener 并且修改 currentAction currentLocation idx */
      applyTx(Action.POP);
    }
  }

  /** 推入新的路径 */
  function replace(to: To, state: State) {
    /** 获取下一个location */
    const nextLocation = getNextLocation(to, state);
    /** 判断是否可以 push*/
    if (
      allowTx({
        action: Action.REPLACE,
        locaton: nextLocation,
        retry: () => {
          replace(to, state);
        },
      })
    ) {
      /** location 转 historyState存入history */
      const [nextHistoryState, href] = parseLocationToHistoryStateAndUrl(
        nextLocation,
        idx + 1
      );
      /** push */
      history.replaceState(nextHistoryState, "", href);
      /** 运行事物listener 并且修改 currentAction currentLocation idx */
      applyTx(Action.REPLACE);
    }
  }

  function go(steps: number) {
    window.history.go(steps);
  }

  /** 阻塞的事务 */
  let blockedTx: Transition | null = null;
  window.addEventListener(POP_STATE_TYPE, () => {
    if (blockedTx) {
      // 当前存在待处理的tx
      blockers.trigger(blockedTx);
      // 处理完 重制blockedTx
      blockedTx = null;
    } else {
      // 当前不存在tx 此时需要检查blocker是否存在
      // 即 是否运行当前跳转 如果存在blocker 先把tx存储，再回退，等下一次popstate事件处理
      if (blockers.length()) {
        const [targetLocation, targetIndex] = getCurrentLocationAndIndex();
        if (targetIndex === void 0)
          throw new Error("请不要在history之外修改state!");
        blockedTx = {
          action: Action.POP,
          locaton: targetLocation,
          retry: () => {
            go(targetIndex - idx);
          },
        };

        go(idx - targetIndex);
      } else {
        applyTx(Action.POP);
      }
    }
  });

  return {
    action: currentAction,
    createHref,
    push,
    replace,
    go,
    back: () => {
      go(-1);
    },
    forward: () => {
      go(1);
    },
    listen: listeners.listen,
    block: (blocker: Blocker) => {
      const unblock = blockers.listen(blocker);

      if (blockers.length() > 0) {
        // 设置跳转到外站监听
        window.addEventListener(BEFORE_UNLOAD, handleBeforeUnload);
      }

      return () => {
        unblock();
        if (blockers.length() === 0) {
          // 设置跳转到外站监听
          window.removeEventListener(BEFORE_UNLOAD, handleBeforeUnload);
        }
      };
    },
  };
}

export function createHashHistorty() {
  /** 获取当前的Location对象 和 index */
  function getCurrentLocationAndIndex(): [Location, number] {
    // 这里不能直接从loction拿了
    const hashStr = window.location.hash;
    const { pathname, search, hash } = parseUrlToPath(hashStr);
    const state: HistoryState = window.history.state;

    return [
      Readonly<Location>({
        pathname,
        search,
        hash,
        state: state.usr,
        key: state.key,
      }),
      state.idx,
    ];
  }

  let [currentLocation, idx] = getCurrentLocationAndIndex();

  /** 初始化的action */
  let currentAction = Action.POP;
  /** 监听函数 */
  const listeners = createEventCenter<Listener>();
  /** 阻塞函数 */
  const blockers = createEventCenter<Blocker>();

  /** 判断idx=void 0的情况，初始化idx */
  if (idx === void 0) {
    idx = 0;
    history.replaceState(
      {
        ...(history.state || {}),
        idx,
      } as HistoryState,
      ""
    );
  }

  /** 把 URL解析为Path */
  function parseUrlToPath(url: string) {
    const parsedPath: Path = { pathname: "/", hash: "", search: "" };
    const hashIndex = url.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = url.slice(hashIndex);
      url = url.slice(0, hashIndex - 1);
    }

    const searchIndex = url.indexOf("?");
    if (hashIndex >= 0) {
      parsedPath.search = url.slice(searchIndex);
      url = url.slice(0, searchIndex - 1);
    }

    parsedPath.pathname = url;
    return parsedPath;
  }

  /** 把path转换成url */
  function parsePathToUrl(to: To) {
    if (typeof to === "string") return to;
    const { pathname = "/", search = "", hash = "" } = to;
    let url = pathname;

    if (search) {
      if (search.startsWith("?")) {
        url += search;
      } else {
        url += `?${search}`;
      }
    }

    if (hash) {
      if (hash.startsWith("#")) {
        url += hash;
      } else {
        url += `#${hash}`;
      }
    }

    return url;
  }

  /** 获取下一个Location */
  function getNextLocation(to: To, state: State = {}): Location {
    const nextPath: Partial<Path> =
      typeof to === "string" ? parseUrlToPath(to) : to;
    return Readonly<Location>({
      ...currentLocation,
      ...nextPath,
      state,
    });
  }

  /** 忽略base标签 */
  function createBaseHref(to: To): string {
    const baseElem = document.querySelector("base");

    if (baseElem && baseElem.href) {
      // 拿到hash # 前面的内容
      const originHref = window.location.href;
      const hashIndex = originHref.indexOf("#");
      return hashIndex >= 0 ? originHref.slice(0, hashIndex) : originHref;
    }

    return "";
  }

  /** 创建完整的url */
  function createHref(to: To): string {
    return (
      createBaseHref(to) + (typeof to === "string" ? to : parsePathToUrl(to))
    );
  }

  /** 把Location 转换成 histrot State */
  function parseLocationToHistoryStateAndUrl(
    location: Location,
    index: number
  ): [HistoryState, string] {
    return [
      Readonly<HistoryState>({
        usr: location.state,
        key: generateUniqueKey(),
        idx: index,
      }),
      createHref(location),
    ];
  }

  /** 运行事物 listener 更新index currentLocation currenyAction */
  function applyTx(nextAction: Action) {
    currentAction = nextAction;
    let [currentLocation, idx] = getCurrentLocationAndIndex();
    listeners.trigger({
      action: nextAction,
      locaton: currentLocation,
    } as Update);
  }

  /** 是否运行事物运行 */
  function allowTx(tx: Transition) {
    return !blockers.length() || (blockers.trigger(tx), false);
  }

  /** 推入新的路径 */
  function push(to: To, state: State) {
    /** 获取下一个location */
    const nextLocation = getNextLocation(to, state);
    /** 判断是否可以 push*/
    if (
      allowTx({
        action: Action.PUSH,
        locaton: nextLocation,
        retry: () => {
          push(to, state);
        },
      })
    ) {
      /** location 转 historyState存入history */
      const [nextHistoryState, href] = parseLocationToHistoryStateAndUrl(
        nextLocation,
        idx + 1
      );
      /** push */
      history.pushState(nextHistoryState, "", href);
      /** 运行事物listener 并且修改 currentAction currentLocation idx */
      applyTx(Action.POP);
    }
  }

  /** 推入新的路径 */
  function replace(to: To, state: State) {
    /** 获取下一个location */
    const nextLocation = getNextLocation(to, state);
    /** 判断是否可以 push*/
    if (
      allowTx({
        action: Action.REPLACE,
        locaton: nextLocation,
        retry: () => {
          replace(to, state);
        },
      })
    ) {
      /** location 转 historyState存入history */
      const [nextHistoryState, href] = parseLocationToHistoryStateAndUrl(
        nextLocation,
        idx + 1
      );
      /** push */
      history.replaceState(nextHistoryState, "", href);
      /** 运行事物listener 并且修改 currentAction currentLocation idx */
      applyTx(Action.REPLACE);
    }
  }

  function go(steps: number) {
    window.history.go(steps);
  }

  /** 阻塞的事务 */
  let blockedTx: Transition | null = null;
  window.addEventListener(POP_STATE_TYPE, () => {
    if (blockedTx) {
      // 当前存在待处理的tx
      blockers.trigger(blockedTx);
      // 处理完 重制blockedTx
      blockedTx = null;
    } else {
      // 当前不存在tx 此时需要检查blocker是否存在
      // 即 是否运行当前跳转 如果存在blocker 先把tx存储，再回退，等下一次popstate事件处理
      if (blockers.length()) {
        const [targetLocation, targetIndex] = getCurrentLocationAndIndex();
        if (targetIndex === void 0)
          throw new Error("请不要在history之外修改state!");
        blockedTx = {
          action: Action.POP,
          locaton: targetLocation,
          retry: () => {
            go(targetIndex - idx);
          },
        };

        go(idx - targetIndex);
      } else {
        applyTx(Action.POP);
      }
    }
  });

  return {
    action: currentAction,
    createHref,
    push,
    replace,
    go,
    back: () => {
      go(-1);
    },
    forward: () => {
      go(1);
    },
    listen: listeners.listen,
    block: (blocker: Blocker) => {
      const unblock = blockers.listen(blocker);

      if (blockers.length() > 0) {
        // 设置跳转到外站监听
        window.addEventListener(BEFORE_UNLOAD, handleBeforeUnload);
      }

      return () => {
        unblock();
        if (blockers.length() === 0) {
          // 设置跳转到外站监听
          window.removeEventListener(BEFORE_UNLOAD, handleBeforeUnload);
        }
      };
    },
  };
}
