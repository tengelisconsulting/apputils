import { makeState } from "src/util/state";


export const HttpState = makeState<{
  baseUrl: string;
}>({
  baseUrl: "",
});
