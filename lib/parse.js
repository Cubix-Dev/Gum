import builtins from "./builtins.js";

class Command {
  constructor(execname, arglist, builtIn) {
    this.target = execname;
    this.arglist = arglist;
    this.builtIn = builtIn;
  }

  execute() {
    if (this.builtIn) {
      builtins[this.target].run(this.arglist);
    }
  }
}

const strip = (parsed) => {
  strip.split("\n");
};

let c = new Command("println", [1], true);
c.execute();
