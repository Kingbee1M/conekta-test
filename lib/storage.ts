import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { WebStorage } from "redux-persist/lib/types";

// Explicitly defining the return types to match the WebStorage interface
const createNoopStorage = (): WebStorage => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    // Changed return type from Promise<string> to Promise<void>
    setItem(_key: string, value: string): Promise<void> {
      console.log(`SSR Storage: setting ${_key} (noop)`);
      return Promise.resolve(); 
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage: WebStorage = typeof window !== "undefined" 
  ? createWebStorage("local") 
  : createNoopStorage();

export default storage;