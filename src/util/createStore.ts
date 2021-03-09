/*
  A fairly simple store.
  The gist:
   - We maintain a plain JS object of state.
   - We can update the state with the 'update' function,
     from which we return the updated state.
   - We can register change callbacks with 'subscribe'.
     Subscriptions have two parts: a 'selector' and a 'subscriber'.
     'selector' is a function of the state that returns a value.
     When it's output changes, we call the subscriber with this
     changed value.  The subscriber is also called once initially.
*/

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

  public get state(): T {
    return this.current;
  }

  public subscribe = <S>(
    // selector could also be a Paths<T>,
    // but this lets us cache more complex logic than just key lookup
    selector: (state: T) => S,
    subscriber: (value: S) => void,
    comparitor = vanillaEq,
  ): (() => void) => {
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
    return () => {
      delete this.changeSubscribers[id];
    };
  }

  // convenience methods for updating
  public shallowSet = <K extends keyof T>(key: K, val: T[K]) => {
    this.update((state) => ({
      ...state,
      [key]: val,
    }));
  };

}

const createStore = <T>(
  initial: T
) => new Store<T>(initial);

export default createStore;
