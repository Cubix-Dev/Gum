import Parser from "./parser.ts";
import Environment from "./runtime/env.ts";
import { interpret } from "./runtime/interpreter.ts";
import { makeNull, makeNumber } from "./runtime/values.ts";

gum();

function gum() {
  const parser = new Parser();
  const env = new Environment()
  env.declareVar("x", makeNumber(100))
  env.declareVar("nil", makeNull())
  console.log("\nGum v0.1");

  // Continue Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    // Produce AST From sourc-code
    const program = parser.newAST(input);
    console.log(program);

    const result = interpret(program, env)
    console.log(result)
  }
}