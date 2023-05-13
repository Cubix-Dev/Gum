import {NullVal, NumberVal, runtimeValue} from "./values.ts"
import { BinaryExpr, NumericLiteral, Program, statement} from "../ast.ts"

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
function evalBinop (binop: BinaryExpr): runtimeValue {
    const left = interpret(binop.left)
    const right = interpret(binop.right)
    if (left.type == "number" && right.type == "number") {
        return evalNumericExpression(left as NumberVal, right as NumberVal, binop.operator)
    } else {
        return {
            value: "null",
            type: "null"
        } as NullVal
    }
}

// return the last evaluted item in the code or null if theres no code to evaluate.
function evalProgram (program: Program): runtimeValue {
    let lastEval: runtimeValue = {
        value: "null",
        type: "null"
    } as NullVal

    for (const statement of program.body) {
        lastEval = interpret(statement)
    }

    return lastEval
}

// Evaluate the actual code
export function interpret (ast: statement): runtimeValue {
    switch (ast.kind) {
        case "NumericLiteral":
            return { 
                value: ((ast as NumericLiteral).value),
                type: "number"
            } as NumberVal

        case "BinaryExpr":
            return evalBinop(ast as BinaryExpr)

        case "Program":
            return evalProgram(ast as Program)

        case "NullLiteral":
            return {
                value: "null",
                type: "null"
            } as NullVal
        default:
            console.error("ASTNode is missing. This is a Gum error.")
            Deno.exit(1)
    }
}