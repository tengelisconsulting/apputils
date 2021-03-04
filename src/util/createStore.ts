const vanillaEq = (a: any, b: any) => a === b;


export class Store<T> {

  private current: T;
  private changeSubscribers: {
    [index: string]: (newState: T) => void;
  } = {};

  constructor(initial: T) {
    this.current = initial;
  }

  public update = (updater: (state: T)  => T): void => {
    this.current = updater(this.current);
    Object.values(this.changeSubscribers).forEach((cb) => cb(this.current));
  }

  public getState = (): T => this.current;

  public subscribe = <S>(
    selector: (state: T) => any,
    subscriber: (value: any) => void,
    comparitor = vanillaEq,
  ) => {
    const id = Date.now().toString();
    let lastVal: S = selector(this.current);
    this.changeSubscribers[id] = (newState: T) => {
      const newVal: S = selector(newState);
      if (!comparitor(lastVal, newVal)) {
        lastVal = newVal;
        subscriber(newVal);
      }
    };
    // first call
    subscriber(lastVal);
    return id;
  }

  public unsubscribe = (id: string) => {
    delete this.changeSubscribers[id];
  }

}

const createStore = <T>(
  initial: T
) => new Store<T>(initial);

export default createStore;
