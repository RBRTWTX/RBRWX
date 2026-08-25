export interface SharedCacheEntry<T> {
  value: T;
  loadedAt: number;
}

export class SharedDataCache {
  private readonly values = new Map<string, SharedCacheEntry<unknown>>();
  private readonly inflight = new Map<string, Promise<unknown>>();

  get<T>(key: string): SharedCacheEntry<T> | undefined {
    return this.values.get(key) as SharedCacheEntry<T> | undefined;
  }

  async getOrLoad<T>(key: string, loader: () => Promise<T>): Promise<SharedCacheEntry<T>> {
    const existing = this.get<T>(key);
    if (existing) return existing;

    const running = this.inflight.get(key);
    if (running) {
      const value = await running as T;
      return this.get<T>(key) ?? { value, loadedAt: Date.now() };
    }

    const promise = loader();
    this.inflight.set(key, promise);
    try {
      const value = await promise;
      const entry = { value, loadedAt: Date.now() };
      this.values.set(key, entry);
      return entry;
    } finally {
      this.inflight.delete(key);
    }
  }

  invalidate(key: string): void {
    this.values.delete(key);
  }

  clear(): void {
    this.values.clear();
    this.inflight.clear();
  }
}

export const sharedDataCache = new SharedDataCache();
