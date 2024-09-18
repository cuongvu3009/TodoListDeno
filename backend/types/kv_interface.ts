export interface KvInterface {
  set(key: string[], value: any): Promise<void>;
  get(key: string[]): Promise<{ value: any }>;
  delete(key: string[]): Promise<void>;
  list(): AsyncIterableIterator<{ key: string[]; value: any }>;
}
