import { makeState } from "../util/state";


export const HttpState = makeState<{
  baseUrl: string;
}>({
  baseUrl: "",
});
