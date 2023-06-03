export type ValueType = "null" | "number" | "boolean" | "object";

export interface runtimeValue {
  type: ValueType;
}

export interface NullVal extends runtimeValue {
  type: "null";
  value: null;
}

export interface BoolVal extends runtimeValue {
  type: "boolean";
  value: boolean;
}

export interface NumberVal extends runtimeValue {
  type: "number";
  value: number;
}

export interface ObjectVal extends runtimeValue {
  type: "object";
  properties: Map<string,runtimeValue>;
}


export function makeNumber(n = 0) {
  return { type: "number", value: n } as NumberVal;
}

export function makeNull() {
  return { type: "null", value: null } as NullVal;
}

export function makeBool(b = true) {
  return { type: "boolean", value: b } as BoolVal;
}
