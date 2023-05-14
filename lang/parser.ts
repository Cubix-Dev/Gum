// deno-lint-ignore-file no-explicit-any
import {statement, Program, Expr, BinaryExpr, NumericLiteral, Identifier, AsssignmentExpr} from "./ast.ts"
import {tokenize, Token, TokenTypeObject} from "./lexer.ts"

export default class Parser {
    private tokens: Token[] = []
    // Checks if we're at the of the file or not
    private EoF(): boolean {
        return this.tokens[0].type != TokenTypeObject.EOF;
    }

    // Get current position
    private current() {
        return this.tokens[0] as Token
    }

    // Return the current value then slide to the next one
    private next() {
        const prev = this.tokens.shift() as Token
        return prev
    }

    private depend (type: TokenTypeObject, err: any) {
        const prev = this.tokens.shift() as Token
        if (!prev || prev.type != type) {
            console.error("Parser error: \n",err," - Expected ",type," recieved ", prev, "instead.")
            Deno.exit(1)
        }

        return prev
    }

    // Actually use the AST
    public newAST (src: string): Program {
        // Tokenize the code using the lexer and store it in the private Tokens value
        this.tokens = tokenize(src)
        // Create a program
        const program: Program = {
            kind: "Program",
            body: [],
        }

        // Loop through the file until we get to the EOF char.
        while (this.EoF()) {
            program.body.push(this.parse_statement())
        }

        return program
    }

    private parse_statement(): statement {
        // Look! The secret tool is being used!
        switch (this.current().type) {
            case TokenTypeObject.ConstantLocal:
            case TokenTypeObject.Local:
                return this.parse_variabledecl()    
            default:
                return this.parse_expr()
        }
    }

    private parse_variabledecl(): statement {
        const isImmutable = (this.next().type != TokenTypeObject.ConstantLocal)
        const name = this.depend(TokenTypeObject.Identifier, "Expected Identifer after variable declaration.").value
        // Variables must provide a value
        /* basically this is doable
            local v = 1
            but not this
            local v
        */
        this.depend(TokenTypeObject.Equals, 'Variables can not be undefined. They must be initialized. You can defined an undefined variable with an empty string.')
        const definition = {kind: "VariableDecl",id: name, value: this.parse_expr(), mutable: isImmutable}
        return definition as statement
    }

    // Parse expressions
    private parse_expr(): Expr {
        return this.parse_assignment()
    }

    private parse_assignment(): Expr {
        const left = this.parse_addit()
        if(this.current().type == TokenTypeObject.Equals) {
            //Advance
            this.next()
            const value = this.parse_assignment()
            return {value, assignee: left, kind: "AssignmentExpr"} as AsssignmentExpr
        }

        return left
    }

    // Addition and Subtraction
    // If we do smth like this: (10 + 5) - 5, the left is its own additive expression
    private parse_addit(): Expr {
        let left = this.parse_multiplicative()
        while (this.current().value == "+" || this.current().value == "-") {
            const operator = this.next().value;
            const right = this.parse_multiplicative()
            left = {
                kind: "BinaryExpr",
                left, right, operator
            } as BinaryExpr
        }

        return left
    }

    // Mulitiplication and Division
    // Higher priority so its handled lower
    private parse_multiplicative(): Expr {
        let left = this.parse_prim()
        while (this.current().value == "*" || this.current().value == "/" || this.current().value == "%") {
            const operator = this.next().value;
            const right = this.parse_prim()
            left = {
                kind: "BinaryExpr",
                left, right, operator
            } as BinaryExpr
        }

        return left
    }

    private parse_prim(): Expr {
        const Tk = this.current().type 
        switch (Tk) {
            case TokenTypeObject.Identifier:
                return {
                    kind: "Identifier", 
                    symbol: this.next().value
                } as Identifier
            case TokenTypeObject.Number:
                return {
                    kind: "NumericLiteral", 
                    value: parseFloat(this.next().value)
                } as NumericLiteral
            // Grouping Expressions
            case TokenTypeObject.OpenParen: {
                this.next(); // eat the opening paren
                const value = this.parse_expr();
                this.depend(
                TokenTypeObject.CloseParen,
                "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
                ); // closing paren
                return value;
            }
            default:
                console.log("Unknown token")
                Deno.exit(1)
        }
    }
}