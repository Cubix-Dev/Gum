import Parser from "./parser.ts";
import Environment from "./runtime/env.ts";
import { interpret } from "./runtime/interpreter.ts";
import { makeNull, makeNumber } from "./runtime/values.ts";

gum();

async function gum() {
  const parser = new Parser();
  const env = new Environment()
  env.declareVar("x", makeNumber(100))
  env.declareVar("nil", makeNull())
  console.log("\nGum v0.1");

  // Continue Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    // Check for no user input or exit keyword.
    if (!input || input.toLowerCase() == "exit")) {
      Deno.exit(1);
    }

    if(input?.split(" ")[0] == "run") {
        const filePath = input?.split(" ")[1];

        const decoder = new TextDecoder("utf8");
        const readBytes = await Deno.readFile(filePath)

        const file = decoder.decode(readBytes).split("\n");
        for(const line in file) {
            runLine(line, parser, env);
        }
    } else {
        runLine(input, parser, env);
    }

    
  }
}

function runLine(input: string, parser: Parser, env: Environment) {
    // Produce AST From sourc-code
    const program = parser.newAST(input);
    console.log(program);

    const result = interpret(program, env)
    console.log(result)
}
