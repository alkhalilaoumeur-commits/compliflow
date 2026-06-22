// Globales Test-Setup.
// jsdom liefert in dieser Umgebung kein voll funktionsfähiges localStorage,
// das zustands `persist`-Middleware aber braucht. Wir installieren in der
// Browser-Umgebung (window vorhanden) einen schlanken, funktionierenden Mock.
// In der node-Umgebung (API-/lib-Tests) passiert hier nichts.
if (typeof window !== "undefined") {
  class LocalStorageMock implements Storage {
    private store: Record<string, string> = {};
    get length() {
      return Object.keys(this.store).length;
    }
    clear() {
      this.store = {};
    }
    getItem(key: string) {
      return key in this.store ? this.store[key] : null;
    }
    setItem(key: string, value: string) {
      this.store[key] = String(value);
    }
    removeItem(key: string) {
      delete this.store[key];
    }
    key(index: number) {
      return Object.keys(this.store)[index] ?? null;
    }
  }
  Object.defineProperty(window, "localStorage", {
    value: new LocalStorageMock(),
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: window.localStorage,
    configurable: true,
    writable: true,
  });
}
