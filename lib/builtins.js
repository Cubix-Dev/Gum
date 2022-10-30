import log from "./log.js";

class BuiltinArg {
  constructor(name, description, type) {
    this.name = name;
    this.description = description;
    this.type = type;
  }
}

class Builtin {
  constructor(exec, args) {
    this.exec = exec;
    this.args = args;
  }

  checkArgs(inputArgs) {
    let nomatch = false;
    for (let i = 0; i < inputArgs.length; i++) {
      if (typeof inputArgs[i] === this.args[i].type) {
      } else {
        nomatch = true;
      }
    }
    if (nomatch) {
      log("err", "some arg types do not match expected pattern");
    }

    return nomatch;
  }

  run(inputArgs) {
    if (this.checkArgs(inputArgs) === false) {
      this.exec(inputArgs);
    }
  }
}

const builtins = {
  println: new Builtin(
    (e) => {
      console.log(e[0]);
    },
    [new BuiltinArg("content", "The string to print.", "string")]
  ),
};

export default builtins;
