export type ValueType = "null" | "number";

export interface runtimeValue {
    type: ValueType
}

export interface NullVal extends runtimeValue {
    type: "null"
    value: "null"
}

export interface NumberVal extends runtimeValue {
    type: "number"
    value: number
}