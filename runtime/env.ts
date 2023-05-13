import { runtimeValue } from "./values.ts"



export default class Environment {
    private parent?: Environment
    private variables: Map<string, runtimeValue>

    constructor (parentENV?: Environment) {
        this.parent = parentENV
        this.variables =  new Map()
    }


    public declareVar (varName: string, value: runtimeValue): runtimeValue {
        if (this.variables.has(varName)) {
            throw 'Gum is unable to declare variable ${varName} as it already exists.';
        }

        this.variables.set(varName, value)
        return value
    }

    public resolve (varName: string): Environment {
        if (this.variables.has(varName)) {
            return this
        }

        if (this.parent == undefined) {
            throw 'Gum can\'t resolve variable ${varName}. Does it exist?'
        }

        return this.parent.resolve(varName)
    }

    public assignVar (varName: string, newVal: runtimeValue): runtimeValue {
        const env = this.resolve(varName)
        if (env) {
            env.variables.set(varName, newVal)
            return newVal
        } else {
            throw 'Gum is unable to assign a value to variable ${varName} as it is undefined.';
        }
    }

    public lookup (varName: string): runtimeValue {
        const env = this.resolve(varName)
        return env.variables.get(varName) as runtimeValue
    }
}