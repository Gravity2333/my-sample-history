import { HistoryState, Location, Path, To } from "../typings";
/** freeze对象，让对象只读 */
export declare const readOnly: <T>(obj: T) => T;
/** 解析Path类型的对象 */
export declare function parsePath(to: To): Partial<Path>;
/** 生成随key */
export declare function createKey(): string;
/** 把Location转换成historyState */
export declare function parseLocationToHistoryState(location: Location, index: number): HistoryState;
/** 生成jumpUrl
 *  原生location中，没有描述 pathname+search+hash的属性
 *  history-dev 库中的href应该是 origin+pathname+search+hash
 *  所以这里我愿意成为 jumpUrl，也就是history.push(url) 内部传入的在域内部跳转的路径!
 */
export declare function generateJumpUrl({ pathname, search, hash, }: Partial<Path>): string;
/** 把to类型统一转换成字符串类型的url */
export declare function createHref(to: To): string;
