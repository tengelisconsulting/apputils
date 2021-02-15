import shallowMerge from "./obj";


export function makeState<S>(
  initial: S,
) {
  const impl = {
    state: initial,
  };
  return {
    get: () => impl.state,
    update: (stateUpdate: Partial<S>): void => {
      impl.state = shallowMerge(impl.state, stateUpdate);
    },
  };
}
