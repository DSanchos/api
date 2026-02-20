import fetch from "node-fetch";
import type { API, APIResponse, CacheEntry } from "./api.types.ts";
import { getConfig } from "./core.ts";
import { logger } from "./logger.ts";

const cache = new Map<string, CacheEntry>();

export async function api(props: API): Promise<APIResponse> {
  const { baseUrl, baseKeepUnusedDataFor, baseHeader, interceptors } =
    getConfig();

  const finalProps = interceptors?.request
    ? await Promise.resolve(interceptors.request(props))
    : props;

  const {
    method,
    url,
    headers,
    body,
    keepUnusedDataFor = baseKeepUnusedDataFor,
    provideCache = "",
    invalidateCache = "",
  } = finalProps;

  let data = null;
  let isLoading = true;
  let isFetching = true;
  let isError = false;
  let error = null;

  const TTL = keepUnusedDataFor * 1000;
  const now = Date.now();

  if (provideCache) {
    const cached = cache.get(provideCache);

    if (cached && now - cached.timestamp < TTL) {
      return {
        data: cached.data,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
      };
    }
  }

  try {
    isFetching = true;
    if (!data) isLoading = true;

    const start = performance.now();
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers: headers ?? baseHeader,
      body: body ? JSON.stringify(body) : null,
    });
    const ms = Math.round(performance.now() - start);
    logger(method, url, response.status, ms);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    data = await response.json();

    isLoading = false;

    if (invalidateCache) {
      for (const key of invalidateCache) {
        cache.delete(key);
      }
    } else {
      if (provideCache) {
        cache.set(provideCache, { data, timestamp: now });
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    isError = true;
  } finally {
    isFetching = false;
  }

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  };
}
