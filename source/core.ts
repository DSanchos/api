import type { API, CORE } from "./api.types.ts";

const config: CORE = {
  baseUrl: "",
  baseKeepUnusedDataFor: 60,
  baseHeader: {},
  interceptors: {},
};

export function ApiCore(props: CORE) {
  config.baseUrl = props.baseUrl;
  config.baseKeepUnusedDataFor = props.baseKeepUnusedDataFor;
  config.baseHeader = props.baseHeader;
  if (props.interceptors) {
    config.interceptors = props.interceptors;
  }
}

export function getConfig() {
  return config;
}

export function defineApi<T extends Record<string, API>>(props: T) {
  return props;
}

ApiCore({
  baseUrl: "https://jsonplaceholder.typicode.com",
  baseKeepUnusedDataFor: 0,
  baseHeader: {},
  interceptors: {
    request: (props) => ({
      ...props,
      headers: { Authorization: `Bearer ${"string"}` },
    }),
  },
});
