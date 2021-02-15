import { makeState } from "src/util/state";


export const AuthState = makeState<{
  sessionToken: string,
}>({
  sessionToken: "",
});
