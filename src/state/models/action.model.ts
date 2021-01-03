export interface ActionModel<T, U extends string = string> {
  type: string;
  payload?: T;
  meta?: U;
}
