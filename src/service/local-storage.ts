export const localStorageService = {
  setItem: function(key: string, val: any) {
    const encoded = JSON.stringify(val);
    try {
      localStorage.setItem(key, encoded);
    } catch (e) {
      console.error("failed to write to local storage: ", e);
    }
  },
  getItem: function(key): any {
    try {
      const val = localStorage.getItem(key);
      const decoded = JSON.parse(val);
      return decoded;
    } catch (e) {
      console.error("failed to read from local storage: ", e);
      return null;
    }
  },
};
