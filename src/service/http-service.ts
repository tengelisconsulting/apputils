import { AppHttpRequest, AppHttpResponse } from "../@types/http-types";
import shallowMerge from "../util/obj";


const baseReqDefaults: Partial<AppHttpRequest> = {
  cache: "default",
  credentials: "include",
  headers: {
    'Content-type': 'application/json',
  },
};

const DEFAULT_HEADERS = {};

async function doRequest<T>(req: AppHttpRequest): Promise<AppHttpResponse<T>> {
  const headers = new Headers(
    shallowMerge(
      req.headers,
      DEFAULT_HEADERS,
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
  const request = new Request(req.path, reqParams);
  const requestInit: RequestInit = {
    cache: req.cache,
    mode: req.mode,
    credentials: req.credentials,
  };
  try {
    const response = await fetch(request, requestInit);
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

const requestFactoryQueryParams = (method: string) =>
  <P, R>(path: string) =>
  (queryParams: P): Promise<AppHttpResponse<R>> => {
    function pathWIthQParams(){
      if (!queryParams) {
        return path;
      }
      const queryGenerator = new URLSearchParams();
      Object.keys(queryParams).forEach((key) => {
        queryGenerator.append(key, queryParams[key]);
      });
      const queryString = queryGenerator.toString();
      return `${path}?${queryString}`;
    }
    return doRequest(
      shallowMerge(
        {},
        baseReqDefaults,
        {
          method,
          path: pathWIthQParams(),
        },
      ) as AppHttpRequest
    );
  };

export const httpService = {
  httpGetNoData: requestFactoryNoData("GET"),
  httpGet: requestFactoryQueryParams("GET"),
  httpPost: requestFactoryWithData("POST"),
  httpPut: requestFactoryWithData("PUT"),
  httpPutNoData: requestFactoryNoData("PUT"),
};
