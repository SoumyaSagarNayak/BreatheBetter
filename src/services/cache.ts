interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export const CacheService = {
  get<T>(key: string): T | null {
    // 1. Check in-memory
    const memEntry = memoryCache.get(key);
    const now = Date.now();
    if (memEntry && now - memEntry.timestamp < memEntry.ttl) {
      return memEntry.data as T;
    }

    // 2. Check localStorage
    try {
      const stored = localStorage.getItem(`bb_cache_${key}`);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        if (now - parsed.timestamp < parsed.ttl) {
          memoryCache.set(key, parsed);
          return parsed.data;
        } else {
          localStorage.removeItem(`bb_cache_${key}`);
        }
      }
    } catch {
      // Storage unavailable or quota exceeded
    }

    return null;
  },

  set<T>(key: string, data: T, ttlMs = 10 * 60 * 1000): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    memoryCache.set(key, entry);

    try {
      localStorage.setItem(`bb_cache_${key}`, JSON.stringify(entry));
    } catch {
      // Ignore quota errors
    }
  },

  remove(key: string): void {
    memoryCache.delete(key);
    try {
      localStorage.removeItem(`bb_cache_${key}`);
    } catch {
      // Ignore
    }
  },

  clearAll(): void {
    memoryCache.clear();
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('bb_cache_'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
  },

  getCoordinateKey(lat: number, lon: number): string {
    return `aq_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  },
};

