import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 30_000);
  return () => clearInterval(t);
};

// Current minute (ms timestamp) on the client, null while prerendering: dates depend on the visitor's clock
export function useMinute(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => null
  );
}
