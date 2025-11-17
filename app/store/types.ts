// Custom PayloadAction type definition for Redux Toolkit compatibility
export interface PayloadAction<T = any> {
  type: string;
  payload: T;
}