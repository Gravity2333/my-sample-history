import { HistoryState, Location, Path, To } from "../typings";
import { v4 as uuidv4 } from "uuid";

/** freeze对象，让对象只读 */
export const readOnly: <T>(obj: T) => T = (obj) => {
  return Object.freeze(obj);
};

/** 解析Path类型的对象 */
export function parsePath(to: To): Partial<Path> {
  if (typeof to === "string") {
    const parsedPath: Partial<Path> = {};
    let cachePath = to;
    /** 先解析hash 从后往前 */
    const hashIndex = cachePath.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = cachePath.substring(hashIndex);
      cachePath = cachePath.substring(0, hashIndex);
    }
    /** 解析完hash 去掉hash部分 继续解析search */
    const searchIndex = cachePath?.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = cachePath.substring(searchIndex);
      cachePath = cachePath.substring(0, searchIndex);
    }
    /** 剩下的就是 pathname */
    parsedPath.pathname = cachePath;
    return parsedPath;
  } else {
    return to;
  }
}

/** 生成随key */
export function createKey() {
  return uuidv4();
}

/** 把Location转换成historyState */
export function parseLocationToHistoryState(
  location: Location,
  index: number
): HistoryState {
  return readOnly<HistoryState>({
    usr: location.state,
    idx: index,
    key: location.key,
  });
}

/** 生成jumpUrl
 *  原生location中，没有描述 pathname+search+hash的属性
 *  history-dev 库中的href应该是 origin+pathname+search+hash
 *  所以这里我愿意成为 jumpUrl，也就是history.push(url) 内部传入的在域内部跳转的路径!
 */
export function generateJumpUrl({
  pathname = "/",
  search = "",
  hash = "",
}: Partial<Path>): string {
  let jumpUrl = pathname;
  // 如果无search 或者 search为一个单一？ 忽略
  if (search && search !== "?") {
    jumpUrl += search?.startsWith("?") ? search : `?${search}`;
  }
  // 如果无hash  或者 hash为单一一个 # 忽略
  if (hash && hash !== "#") {
    jumpUrl += hash?.startsWith("#") ? hash : `#${hash}`;
  }
  return jumpUrl;
}

/** 把to类型统一转换成字符串类型的url */
export function createHref(to: To) {
  if (typeof to === "string") {
    return to;
  }
  return generateJumpUrl(to);
}
