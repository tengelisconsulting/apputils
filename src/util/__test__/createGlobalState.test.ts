import createStore from "../createStore";


interface State {
  x: number;
  deep: {
    nested: {
      obj: number;
    };
    other?: string;
  };
}

let store;

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
    const subId = store.subscribe(
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
    setX(11);
    expect(changeCB).toHaveBeenCalledWith(11);
  });

  it("should unsubscribe", () => {
    const changeCB = jest.fn();
    const subId = store.subscribe(
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
    store.unsubscribe(subId);
    setX(11);
    expect(changeCB).not.toHaveBeenCalled();
  });

});
