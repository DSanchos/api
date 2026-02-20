export type METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type CacheEntry = {
  data: any;
  timestamp: number;
};

export type headersMap = {
  "Content-Type":
    | "application/json"
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/html"
    | "text/plain";

  Accept: "application/json" | "text/html" | "*/*";

  Authorization: `Bearer ${string}` | `Basic ${string}` | `ApiKey ${string}`;

  "Cache-Control": "no-cache" | "no-store" | "max-age=3600";

  "Accept-Encoding": "gzip" | "deflate" | "gzip, deflate";
};

export type Headers = {
  [K in keyof headersMap]?: headersMap[K];
};

export interface API {
  method: METHODS;
  url: string;
  headers?: Headers;
  body?: any;
  keepUnusedDataFor?: number;
  pollingInterval?: number;
  stopAfter?: number;
  provideCache?: string;
  invalidateCache?: string[];
}

export interface APIResponse {
  data: any;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
}

export type OnData = (res: any, stop: () => void) => void;

export interface CORE {
  baseUrl: string;
  baseKeepUnusedDataFor: number;
  baseHeader: Headers;
  interceptors?: {
    request?: (props: API) => API | Promise<API>;
    response?: (res: APIResponse) => APIResponse | Promise<APIResponse>;
  };
}
