import { Update } from "./typings";

export default class EventBus {
  private handlers: any[] = [];
  constructor() {}

  /** 注册监听 */
  public listen(listener: any) {
    this.handlers.push(listener);
    return () => {
      this.handlers.filter((handler) => handler !== listener);
    };
  }

  public trigger(update: Update) {
    this.handlers.forEach((handler) => handler(update));
  }

  public getLength = () => {
    return this.handlers.length;
  };
}
