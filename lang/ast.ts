// deno-lint-ignore-file no-empty-interface
export type NodeType = 
    // Statments
    | "Program" 
    | "VariableDecl"
    // Expressions
    | "AssignmentExpr"
    | "NumericLiteral"
    | "Identifier" 
    | "BinaryExpr";

// This will not return a value, thats what our expressions are for
export interface statement {
    kind: NodeType;
}

// Finally! AP Computer Science A coming in clutch!
export interface Program extends statement {
    kind: "Program"
    body: statement[]
}

// Variables
export interface VariableDecl extends statement {
    kind: "VariableDecl",
    id: string,
    value: Expr // value can't be undefined
    mutable: boolean,
}

// This is for stuff that will return values. If it doesn't return a value its a statment
// local mii = 1 is a statement
// mii = 1 is an expression
export interface Expr extends statement {}

// math basically
// 10 - 5, foo + bar, etc
export interface BinaryExpr extends Expr {
    kind: "BinaryExpr"
    left: Expr
    right: Expr
    operator: string
}

export interface Identifier extends Expr {
    kind: "Identifier"
    symbol: string,
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral"
    value: number,
}

export interface AsssignmentExpr extends Expr {
    kind: "AssignmentExpr",
    assignee: Expr, // Support arrays later on
    value: Expr
}