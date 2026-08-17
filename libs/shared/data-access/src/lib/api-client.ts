import { InjectionToken } from '@angular/core';

/** Transport-only client. What it talks to is irrelevant to the talk. */
export interface ZooApiClient {
  get<T>(path: string): Promise<T>;
}

/** Base URL, swappable per app via DI. */
export const ZOO_API_BASE_URL = new InjectionToken<string>('ZOO_API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});

/** A tiny fetch-based implementation. */
export function createZooApiClient(baseUrl: string): ZooApiClient {
  return {
    async get<T>(path: string): Promise<T> {
      const res = await fetch(`${baseUrl}${path}`);
      if (!res.ok) {
        throw new Error(`Request to ${path} failed: ${res.status}`);
      }
      return (await res.json()) as T;
    },
  };
}
