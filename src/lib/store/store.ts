const STORE_VERSION = "1.0.0";
const STORE_KEY = "metabolicDebugger_store";

export interface StoreData {
  version: string;
  reportData?: Record<string, unknown>;
}

export const store = {
  get(): StoreData | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored) as StoreData;

      if (data.version !== STORE_VERSION) {
        console.warn(
          `Store version mismatch: ${data.version} → ${STORE_VERSION}`,
        );
        localStorage.removeItem(STORE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Failed to read from store:", error);
      return null;
    }
  },

  set(key: string, value: unknown): void {
    if (typeof window === "undefined") return;

    try {
      const existingData = this.get() ?? {
        version: STORE_VERSION,
      };

      const updatedData = {
        ...existingData,
        [key]: value,
      };

      localStorage.setItem(STORE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to write to store:", error);
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;

    try {
      const data = this.get();
      if (!data) return;

      const updatedData = { ...data };
      delete (updatedData as Record<string, unknown>)[key];
      localStorage.setItem(STORE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to remove from store:", error);
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STORE_KEY);
    } catch (error) {
      console.error("Failed to clear store:", error);
    }
  },

  getVersion(): string {
    return STORE_VERSION;
  },

  checkVersion(): boolean {
    const data = this.get();
    return data?.version === STORE_VERSION;
  },
};
