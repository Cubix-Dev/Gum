import Parser from "./parser.ts";
import { interpret } from "./runtime/interpreter.ts";

gum();

function gum() {
  const parser = new Parser();
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

    const result = interpret(program)
    console.log(result)
  }
}