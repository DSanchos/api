import { api } from "./api.js";
import type { API, OnData } from "./api.types.js";

export function polling(props: API, onData: OnData): void {
  const { pollingInterval = 3000, stopAfter } = props;
  let isActive = true;

  const stop = () => {
    isActive = false;
  };

  async function poll() {
    if (!isActive) return;
    const res = await api(props);
    onData(res, stop);
    if (isActive) setTimeout(poll, pollingInterval);
  }

  poll();

  if (stopAfter) setTimeout(stop, stopAfter);
}
