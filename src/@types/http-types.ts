export interface AppHttpRequest {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: any;
  headers: {
    [index: string]: string
  };
  cache: RequestCache,
  mode?: RequestMode,
  credentials?: RequestCredentials,
  isRawData?: boolean;
  isExternal?: boolean;
  noAuth?: boolean;
};

export interface AppHttpResponse<T> {
  data?: T;
  status: number;
  error?: string;
}
