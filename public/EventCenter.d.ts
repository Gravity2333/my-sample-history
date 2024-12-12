/**
 * 实现一个事件中心，用来存储history变动处理函数，Block处理函数
 *
 */
interface EventCenterType<F extends Function> {
    length: number;
    listen: (e: F) => (() => void);
    call: (arg: any) => void;
}
declare class EventCenter<F extends Function> implements EventCenterType<F> {
    events: F[];
    /** 获取事件数量 */
    get length(): number;
    /** 监听函数 */
    listen(event: F): () => void;
    /** call函数 触发事件 */
    call(arg: any): void;
}
export default EventCenter;
