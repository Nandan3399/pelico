export const STORAGE = {
  set: (name: string, value: any, options: { parsed?: boolean } = { parsed: false }): boolean => {
    try {
      const { parsed } = options;
      if (parsed) sessionStorage.setItem(name, JSON.stringify(value));
      sessionStorage.setItem(name, value);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  get: (name: string, options: { parse?: boolean } = { parse: false }): any => {
    try {
      const { parse } = options;
      const value = sessionStorage.getItem(name);
      if (value === null) return null;
      return parse ? JSON.parse(value) : value;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
