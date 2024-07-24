import { Update } from "./typings";
export default class EventBus {
    private handlers;
    constructor();
    /** 注册监听 */
    listen: (listener: any) => () => void;
    trigger: (update: Update) => void;
    getLength: () => number;
}
