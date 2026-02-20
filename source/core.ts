import type { API, CORE } from "./api.types.js";

const config: CORE = {
  baseUrl: "",
  baseKeepUnusedDataFor: 60,
  baseHeader: {},
  interceptors: {},
  logger: true,
};

export function ApiCore(props: CORE) {
  config.baseUrl = props.baseUrl;
  config.baseKeepUnusedDataFor = props.baseKeepUnusedDataFor;

  config.baseHeader = props.baseHeader;

  if (props.logger) {
    config.logger = props.logger;
  }

  if (props.interceptors) {
    config.interceptors = props.interceptors;
  }
}

export function getConfig() {
  return config;
}

export function defineApi<T extends Record<string, API<any>>>(props: T): T {
  return props;
}

// Планы на будущее!
// retry.ts        — повтор запроса при ошибке (retryCount, retryDelay)
// queue.ts        — очередь запросов (не слать 100 запросов одновременно)
// abort.ts        — отмена запроса через AbortController
