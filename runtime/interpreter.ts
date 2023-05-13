import {NumberVal, makeNull, runtimeValue} from "./values.ts"
import { BinaryExpr, Identifier, NumericLiteral, Program, statement} from "../ast.ts"
import Environment from "./env.ts"


function evalIndent (ident: Identifier, env: Environment): runtimeValue {
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
function evalBinop (binop: BinaryExpr, env: Environment): runtimeValue {
    const left = interpret(binop.left, env)
    const right = interpret(binop.right, env)
    if (left.type == "number" && right.type == "number") {
        return evalNumericExpression(left as NumberVal, right as NumberVal, binop.operator)
    } else {
        return makeNull()
    }
}

// return the last evaluted item in the code or null if theres no code to evaluate.
function evalProgram (program: Program, env: Environment): runtimeValue {
    let lastEval: runtimeValue = makeNull()

    for (const statement of program.body) {
        lastEval = interpret(statement, env)
    }

    return lastEval
}

// Evaluate the actual code
export function interpret (ast: statement, env: Environment): runtimeValue {
    switch (ast.kind) {
        case "NumericLiteral":
            return { 
                value: ((ast as NumericLiteral).value),
                type: "number"
            } as NumberVal

        case "BinaryExpr":
            return evalBinop(ast as BinaryExpr, env)

        case "Program":
            return evalProgram(ast as Program, env)
        
        case "Identifier":
            return evalIndent(ast as Identifier, env)
            
        default:
            console.error("ASTNode is missing. This is a Gum error.")
            Deno.exit(1)
    }
}