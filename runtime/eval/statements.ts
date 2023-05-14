import { Program, VariableDecl } from "../../ast.ts";
import Environment from "../env.ts";
import { interpret } from "../interpreter.ts";
import { runtimeValue,makeNull } from "../values.ts";

// return the last evaluted item in the code or null if theres no code to evaluate.
export function evalProgram (program: Program, env: Environment): runtimeValue {
    let lastEval: runtimeValue = makeNull()

    for (const statement of program.body) {
        lastEval = interpret(statement, env)
    }

    return lastEval
}

export function evalVarDeclare(varD: VariableDecl, env: Environment): runtimeValue {
    return env.declareVar(varD.id, interpret(varD.value, env),varD.mutable)
}