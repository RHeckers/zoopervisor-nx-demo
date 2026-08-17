import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

/** idle → pending → loaded, or an error string. */
export type RequestStatus = 'idle' | 'pending' | 'loaded' | { error: string };

/**
 * The base store primitive: drop `withRequestStatus()` into any signalStore to
 * get a `requestStatus` field plus `isPending` / `error` computed views. The
 * domain stores compose this instead of re-inventing loading flags.
 */
export function withRequestStatus() {
  return signalStoreFeature(
    withState<{ requestStatus: RequestStatus }>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isPending: computed(() => requestStatus() === 'pending'),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    })),
  );
}

export const setPending = () => ({ requestStatus: 'pending' as const });
export const setLoaded = () => ({ requestStatus: 'loaded' as const });
export const setError = (error: string) => ({ requestStatus: { error } });
