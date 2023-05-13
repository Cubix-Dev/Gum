// deno-lint-ignore-file no-explicit-any
import {statement, Program, Expr, BinaryExpr, NumericLiteral, Indentifier, NullLiteral} from "./ast.ts"
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
        // this is a surprise tool that will help us later
        // skip to parse expression
        return this.parse_expr()
    }

    // Parse expressions
    private parse_expr(): Expr {
        return this.parse_addit()
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
            case TokenTypeObject.Nil:
                this.next() //Skip
                return {kind: "NullLiteral", value: "null"} as NullLiteral
            case TokenTypeObject.Identifier:
                return {
                    kind: "Indentifier", 
                    symbol: this.next().value
                } as Indentifier
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