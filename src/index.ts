import EventBus from "./eventBus";
import {
  Action,
  BrowerHistory,
  DEFAULT_INDEX_VALUE,
  DEFAULT_KEY,
  DEFAULT_STATE,
  HistoryState,
  Location,
  State,
  To,
  Update,
} from "./typings";
import {
  createHref,
  createKey,
  generateJumpUrl,
  parseLocationToHistoryState,
  parsePath,
  readOnly,
} from "./utils";

/** 返回一个browserHistory */
export function createBrowserHistory({
  globalWindow = document.defaultView!,
}: {
  globalWindow?: Window & typeof globalThis;
}): BrowerHistory {
  // window可以传入，不传入默认使用系统自带
  // 通过globalWindow 获取globalHistory
  const globalHistory = globalWindow.history;

  // 创建监听事件总线，处理注册事件
  const eventBus = new EventBus();

  // 上一个Action, 默认为POP
  let lastAction = Action.POP;
  /**
   *  注意，这里的Location是history中定义的Location， 包含pathname,search,hash,state,key
   *  这里需要根据当前globalWindow对象中的location对象，结合globalWindow中的state对象生成
   */
  function getCurrentIndexAndLocation(): [number | string, Location] {
    /** 其中，pathname search hash 在原生的location都存在，可以直接取得 */
    const { pathname, search, hash } = globalWindow.location;
    /** state需要从history.state中取出
     *  注意，history中存储的state要满足 HistoryState ，其中的usr才对应Location中的state
     */
    const state: HistoryState = globalHistory.state || {};
    return [
      isNaN(+state.idx)?  DEFAULT_INDEX_VALUE: state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || DEFAULT_STATE,
        key: state.key || DEFAULT_KEY,
      }),
    ];
  }

  /**
   * 根据to,state 生成新的Location对象
   * @param to 满足To约束，可以是一个路径或者Path类型的对象
   * @param state 满足State约束
   * 注意 该函数的to如果传递对象，可以只传递Path的部分，可以理解为增量修改当前location内容
   */
  function generateNewLocation(to: To, state?: State): Location {
    const { pathname, search, hash } = globalWindow.location;
    return readOnly<Location>({
      pathname,
      search,
      hash,
      state,
      ...parsePath(to),
      key: createKey(),
    });
  }

  /** 处理PopState事件
   *  browser模式下，有两个途径可以触发路由变动
   *  1. 使用 go back forward 或者点击浏览器前进后退 会触发popstate事件
   *  2. 调用history.push/replace方法，内部在调用pushState/replaceState时会触发事件中心，调用监听函数
   */
  function handlePopState(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    lastAction = Action.POP;
    // 触发事件总线
    eventBus.trigger({
      action: lastAction,
      location: getCurrentIndexAndLocation()[1],
    } as Update);
  }
  globalWindow.addEventListener("popstate", handlePopState);

  /** 处理初始化情况，此时history.state不存在规范的HistoryState约束，也不存在index */
  if (getCurrentIndexAndLocation()[0] === DEFAULT_INDEX_VALUE) {
    // 注意 这里无法直接给globalHistory.state赋值，需要通过replaceState的方式替换
    globalHistory.replaceState(
      {
        ...(globalHistory.state || {}),
        // 初始化index
        idx: 0,
      } as HistoryState,
      ""
    );
  }

  /** push函数，向history增加一条记录 并且触发事件总线 */
  function push(to: To, state?: State) {
    /** 生成新的Location */
    const newLocation = generateNewLocation(to, state);
    /** 获取当前index */
    const [index] = getCurrentIndexAndLocation();
    /** 把新生成的Location转换为historyState */
    const newHistoryState = parseLocationToHistoryState(
      newLocation,
      +index + 1
    );
    /** 拼接新的jumpUrl */
    const jumpUrl = generateJumpUrl({
      pathname: newLocation.pathname,
      search: newLocation.search,
      hash: newLocation.hash,
    });
    /** 加入到history中 */
    globalHistory.pushState(newHistoryState, "", jumpUrl);
    /** 触发监听事件 */
    lastAction = Action.PUSH;
    eventBus.trigger({
      action: lastAction,
      location: newLocation,
    });
  }

  /** replace函数，替换当前history条目 并且触发事件总线 */
  function replace(to: To, state?: State) {
    /** 生成新的location */
    const newLocation = generateNewLocation(to, state);
    /** 获取当前index */
    const [index] = getCurrentIndexAndLocation();
    /** 把新的location转换成historyState */
    const newHistoryState = parseLocationToHistoryState(newLocation, +index);
    /** 生成新的jumpUrl */
    const jumpUrl = generateJumpUrl({
      pathname: newLocation.pathname,
      search: newLocation.search,
      hash: newLocation.hash,
    });
    /** replaceState */
    globalHistory.replaceState(newHistoryState, "", jumpUrl);
    /** 触发总线 */
    lastAction = Action.REPLACE;
    eventBus.trigger({
      action: lastAction,
      location: newLocation,
    });
  }

  /** 跳转函数 */
  function go(delta: number) {
    globalHistory.go(delta);
  }

  return {
    createHref,
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
export function createHashHistory() {
  return {
    // TODO
  };
}
