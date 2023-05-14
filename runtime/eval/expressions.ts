import { AsssignmentExpr, BinaryExpr, Identifier } from "../../lang/ast.ts";
import Environment from "../env.ts";
import { interpret } from "../interpreter.ts";
import { runtimeValue,NumberVal,makeNull } from "../values.ts";

export function evalIndent (ident: Identifier, env: Environment): runtimeValue {
    const val = env.lookup(ident.symbol)
    return val
}

// Actually does the math
function evalNumericExpression (l: NumberVal, r:NumberVal, operand: string): NumberVal {
    let result = 0
    switch (operand) {
        case "+":
            result = l.value + r.value
            break
        case "-":
            result = l.value - r.value
            break
        case "*":
            result = l.value * r.value
            break
        case "/":
            // TODO: Check for division by 0
            result = l.value / r.value
            break
        case "%":
            result = l.value % r.value
    }
    return {value: result, type: "number"}
}


// Takes a BinaryExpression and verifies that it is indeed a binaryExpression
export function evalBinop (binop: BinaryExpr, env: Environment): runtimeValue {
    const left = interpret(binop.left, env)
    const right = interpret(binop.right, env)
    if (left.type == "number" && right.type == "number") {
        return evalNumericExpression(left as NumberVal, right as NumberVal, binop.operator)
    } else {
        return makeNull()
    }
}

export function evalAssignment(node: AsssignmentExpr, env: Environment): runtimeValue {
    if (node.assignee.kind !== "Identifier") {
        throw 'Gum can not assign a value that is not an Indentifier'
    }
    const varName = (node.assignee as Identifier).symbol
    return env.assignVar(varName, interpret(node.value, env))
}