type Updater<T> = (s: T) => T;

const vanillaEq = (a: any, b: any) => a === b;

function createStore<T>(
  initial: T,
) {
  let current = initial;

  const changeSubscribers: {
    [index: string]: (newState: T) => void;
  } = {};

  return {
    update: (updater: Updater<T>): void => {
      current = updater(current);
      Object.values(changeSubscribers).forEach((cb) => cb(current));
    },
    getState: (): T => current,
    subscribe: <S>(
      selector: (state: T) => any,
      subscriber: (value: any) => void,
      comparitor = vanillaEq,
    ) => {
      const id = Date.now().toString();
      let lastVal: S = selector(current);
      changeSubscribers[id] = (newState: T) => {
        const newVal: S = selector(newState);
        if (!comparitor(lastVal, newVal)) {
          lastVal = newVal;
          subscriber(newVal);
        }
      };
      // first call
      subscriber(lastVal);
      return id;
    },
    unsubscribe: (id: string) => {
      delete changeSubscribers[id];
    },
  };
}

export default createStore;
