import createStore, { Store } from "../createStore";


interface State {
  x: number;
  deep: {
    nested: {
      obj: number;
    };
    other?: string;
  };
}

let store: Store<State>;

describe("createStore", () => {
  beforeEach(() => {
    store = createStore<State>({
      x: 100,
      deep: {
        nested: {
          obj: 2,
        },
      }
    });
  });

  it("should react to simple value changes appropriately", () => {
    const changeCB = jest.fn();
    store.subscribe(
      (state) => state.x,
      changeCB,
    );
    const setX = (x: number) => store.update((state) => ({
      ...state,
      x,
    }));
    expect(changeCB).toHaveBeenCalledWith(100);
    expect(store.state.x).toBe(100);
    setX(10);
    expect(store.state.x).toBe(10);
    expect(changeCB).toHaveBeenCalledWith(10);
    setX(11);
    expect(store.state.x).toBe(11);
    expect(changeCB).toHaveBeenCalledWith(11);
  });

  it("should unsubscribe", () => {
    const changeCB = jest.fn();
    const unsubscribe = store.subscribe(
      (state) => state.x,
      changeCB,
    );
    const setX = (x: number) => store.update((state) => ({
      ...state,
      x,
    }));
    expect(changeCB).toHaveBeenCalledWith(100);
    setX(10);
    expect(changeCB).toHaveBeenCalledWith(10);
    changeCB.mockClear();
    unsubscribe();
    setX(11);
    expect(changeCB).not.toHaveBeenCalled();
  });

});
