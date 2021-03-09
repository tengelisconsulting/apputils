import { AppHttpRequest, AppHttpResponse } from "../@types/http-types";
import shallowMerge from "../util/obj";
import httpStore from "../state/http-store";
import authStore from "../state/auth-store";



const SET_SESSION_HEADER = "set-session-token";

const baseReqDefaults: Partial<AppHttpRequest> = {
  cache: "default",
  credentials: "include",
  headers: {
    'Content-type': 'application/json',
  },
};

const getAuthedHeaders = () => ({
  "Authorization": `Bearer ${authStore.state.sessionToken}`,
});

async function doRequest<T>(req: AppHttpRequest): Promise<AppHttpResponse<T>> {
  const headers = new Headers(
    shallowMerge(
      req.headers,
      req.noAuth
        ? {}
        : getAuthedHeaders()
    )
  );
  const reqParams = shallowMerge(
    {
      method: req.method,
      headers,
    },
    req.data
      ? {
        body: req.isRawData
          ? req.data
          : JSON.stringify(req.data)}
      : {},
  );
  const baseUrl = httpStore.state.baseUrl;
  const url = `${baseUrl}${req.path}`;
  const request = new Request(url, reqParams);
  const requestInit: RequestInit = {
    cache: req.cache,
    mode: req.mode,
    credentials: req.credentials,
  };
  try {
    const response = await fetch(request, requestInit);
    // we check for an updated session header
    // on every successful request
    if (response.headers[SET_SESSION_HEADER]) {
      authStore.shallowSet("sessionToken", response.headers[SET_SESSION_HEADER]);
    }
    if (!response.ok) {
      return {
        status: response.status,
        ok: false,
        error: await response.text(),
      };
    }
    const data = await response.json();
    return {
      data,
      status: response.status,
      ok: true,
    };
  } catch (e) {
    console.trace("req failed ", req, e)
    return {
      status: 0,
      error: e,
      ok: false,
    };
  }
}

const requestFactoryWithData = (method: string) =>
  <D, R>(path: string) =>
  (data: D): Promise<AppHttpResponse<R>> =>
  doRequest(
    shallowMerge(
      {},
      baseReqDefaults,
      {
        method,
        path,
        data,
      },
    ) as AppHttpRequest
  );

const requestFactoryNoData = (method: string) =>
  <R>(path: string) =>
  (): Promise<AppHttpResponse<R>> =>
  doRequest(
    shallowMerge(
      {},
      baseReqDefaults,
      {
        method,
        path,
      },
    ) as AppHttpRequest
  );

export const httpService = {
  httpGet: requestFactoryNoData("GET"),
  httpPost: requestFactoryWithData("POST"),
  httpPut: requestFactoryWithData("PUT"),
  httpPutNoData: requestFactoryNoData("PUT"),
};
