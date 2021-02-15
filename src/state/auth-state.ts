import { makeState } from "../util/state";


export const AuthState = makeState<{
  sessionToken: string,
}>({
  sessionToken: "",
});
