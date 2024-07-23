export type Pathname = string;
export type Hash = string;
export type Search = string;
/** 通过push传递的状态，可以是任意值 */
export type State = unknown;
export type Key = number | string;

export enum Action {
  /** POP状态 使用push go forward back 点击浏览器前进后退按钮时，都触发POP类型的Action */
  POP = "POP",
  /** 向history堆栈中添加item */
  PUSH = "PUSH",
  /** 替换history堆栈中顶部item */
  REPLACE = "REPLACE",
}

/** push传入的第一个参数类型
 * 包含 pathname , search, hash
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   * 同location对象中的pathname，从/之后开始
   */
  pathname: Pathname;
  /**
   * search 搜索参数 从? 之后开始
   * 如?queryId=JNSMJWBKWNL
   *  */
  search: Search;
  /** 哈希 从 #之后开始
   * 如 #/section1
   * */
  hash: Hash;
}

/** push方法传入的参数
 * 可以是string，也可以是部分的Path对象，
 * push会调用方法解析字符串并且覆盖当前location
 */
export type To = Partial<Path> | string;

/**
 * Location对象，继承Path
 * 在Path基础上，多了state和Key
 * 对于每个Location，都生成不同的Key
 */
export interface Location extends Path {
  /** 对应Location状态，可以是任意值 */
  state: State;
  /** 唯一的Key */
  key: Key;
}

/**
 * history对象要通过pushState存入堆栈的state
 * 包含
 * usr: 存储Location中的state
 * key: 对应location中的唯一key
 * idx: 当前item所在序号
 */
export type HistoryState = {
  usr: State;
  key: Key;
  idx: number;
};

/** location变动传入监听函数的参数 */
export type Update = {
  /** 导致location变动的action */
  action: Action;
  /** 新的location对象 */
  location: Location;
};

/**
 * history对象
 */
export interface History {
  /**
   * 只读，通过get获取
   * 修改当前loctaion的最后一个操作(action)。
   * 首次创建历史实例时的 Action.Pop,可变
   */
  readonly action: Action;
  /**
   * 当前location对象，可以通过get获取，可变
   */
  readonly location: Location;
  /**
   *  替换当前location
   * 如果堆栈中在当前条目之后还有任何条目，则它们不会丢失，这里区分于push
   */
  replace: (to: To, state?: State) => void;
  /**
   *  创建新的location
   * 如果堆栈中在当前条目之后还有任何条目，则它们是丢失的。
   */
  push: (to: To, state?: State) => void;
  /**
   *  Navigates `n` entries backward/forward in the history stack relative to the
   * current index. For example, a "back" navigation would use go(-1).
   *
   * 向前后导航n个实体，n可正可负
   */
  go: (delta: number) => void;
  /** 向后导航一个实体 等价于go(1) */
  back: () => void;
  /** 向前导航一个实体，等价于go(-1) */
  forward: () => void;
  /**
   * 监听listen
   * 当前location变化时，会调用回调函数，可以多次注册事件
   */
  listen: (listener: (update: Update) => void) => void;
}

/** 通过history方式实现的BrowserHistory */
export interface BrowerHistory extends History {}

/** 通过hash方式实现的HashHistory */
export interface HashHistory extends History {}
