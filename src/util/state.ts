import shallowMerge from "./obj";


export function makeState<S>(
  initial: S,
) {
  const impl = {
    state: initial,
  };
  const updateCbs: {
    [index: string]: (update: Partial<S>) => void,
  } = {};
  return {

    // return the state
    get: () => impl.state,

    // update the state, which also triggers
    // any update listeners to fire
    update: (stateUpdate: Partial<S>): void => {
      const oldState = {...impl.state};
      impl.state = shallowMerge(impl.state, stateUpdate);
      Object.values(updateCbs).forEach((updateFn) => {
        updateFn(oldState);
      });
    },

    // add a listener for state updates
    addUpdateCb: (
      filter: (update: Partial<S>) => boolean,
      cb: (update: Partial<S>) => void,
    ): string => {
      const id = Date.now().toString();
      updateCbs[id] = (update: Partial<S>) => {
        if (filter(update)) {
          cb(update);
        }
      };
      return id;
    },

    // remove a listener for state updates
    clearUpdateCb: (id: string): void => {
      delete updateCbs[id];
    },

  };
}
