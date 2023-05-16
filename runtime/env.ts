import { makeBool, makeNull, makeNumber, runtimeValue } from "./values.ts";

export function initGlobalScope(env: Environment) {
  env.declareVar("x", makeNumber(100), false);
  env.declareVar("nil", makeNull(), true);
  env.declareVar("true", makeBool(), true);
  env.declareVar("false", makeBool(false), true);
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, runtimeValue>;
  private constants: Set<string>;

  constructor(parentENV?: Environment) {
    const global = parentENV ? true : false; // TODO: Allow variables to define their scope.
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varName: string,
    value: runtimeValue,
    mutable: boolean,
  ): runtimeValue {
    if (this.variables.has(varName)) {
      throw "Gum is unable to declare variable ${varName} as it already exists.";
    }

    this.variables.set(varName, value);

    if (!mutable) {
      this.constants.add(varName);
    }
    return value;
  }

  public resolve(varName: string): Environment {
    if (this.variables.has(varName)) {
      return this;
    }

    if (this.parent == undefined) {
      throw "Gum can't resolve variable ${varName}. Does it exist?";
    }

    return this.parent.resolve(varName);
  }

  public assignVar(varName: string, newVal: runtimeValue): runtimeValue {
    const env = this.resolve(varName);
    if (env && !env.constants.has(varName)) {
      env.variables.set(varName, newVal);
      return newVal;
    }
    if (env.constants.has(varName)) {
      throw "Gum is unabled to assign a value to an immutable variable";
    } else {
      throw "Gum is unable to assign a value to variable ${varName} as it is undefined.";
    }
  }

  public lookup(varName: string): runtimeValue {
    const env = this.resolve(varName);
    return env.variables.get(varName) as runtimeValue;
  }
}
