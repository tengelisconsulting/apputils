import createStore from "../util/createStore";


interface HttpState {
  baseUrl: string;
}

export default createStore<HttpState>({
  baseUrl: "",
});
