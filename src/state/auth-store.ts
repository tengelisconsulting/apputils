import createStore from "../util/createStore";


interface AuthState {
  sessionToken: string;
}

export default createStore<AuthState>({
  sessionToken: "",
});
