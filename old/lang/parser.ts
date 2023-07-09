// deno-lint-ignore-file no-explicit-any
import {
  AsssignmentExpr,
  BinaryExpr,
  CallExpr,
  Expr,
  Identifier,
  MemberExpr,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
  statement,
} from "./ast.ts";
import { Token, tokenize, TokenTypeObject } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];
  // Checks if we're at the of the file or not
  private EoF(): boolean {
    return this.tokens[0].type != TokenTypeObject.EOF;
  }

  // Get current position
  private current() {
    return this.tokens[0] as Token;
  }

  // Return the current value then slide to the next one
  private next() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private depend(type: TokenTypeObject, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error(
        "Parser error: \n",
        err,
        " - Expected ",
        type,
        " recieved ",
        prev,
        "instead.",
      );
      Deno.exit(1);
    }

    return prev;
  }

  // Actually use the AST
  public newAST(src: string): Program {
    // Tokenize the code using the lexer and store it in the private Tokens value
    this.tokens = tokenize(src);
    // Create a program
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Loop through the file until we get to the EOF char.
    while (this.EoF()) {
      program.body.push(this.parse_statement());
    }

    return program;
  }

  private parse_statement(): statement {
    // Look! The secret tool is being used!
    switch (this.current().type) {
      case TokenTypeObject.ConstantLocal:
      case TokenTypeObject.Local:
        return this.parse_variabledecl();
      default:
        return this.parse_expr();
    }
  }

  private parse_variabledecl(): statement {
    const isImmutable = this.next().type != TokenTypeObject.ConstantLocal;
    const name = this.depend(
      TokenTypeObject.Identifier,
      "Expected Identifer after variable declaration.",
    ).value;
    // Variables must provide a value
    /* basically this is doable
            local v = 1
            but not this
            local v
        */
    this.depend(
      TokenTypeObject.Equals,
      "Variables can not be undefined. They must be initialized. You can defined an undefined variable with an empty string.",
    );
    const definition = {
      kind: "VariableDecl",
      id: name,
      value: this.parse_expr(),
      mutable: isImmutable,
    };
    return definition as statement;
  }

  // Parse expressions
  private parse_expr(): Expr {
    return this.parse_assignment();
  } 

  private parse_assignment(): Expr {
    const left = this.parse_obj();
    if (this.current().type == TokenTypeObject.Equals) {
      //Advance
      this.next();
      const value = this.parse_assignment();
      return {
        value,
        assignee: left,
        kind: "AssignmentExpr",
      } as AsssignmentExpr;
    }

    return left;
  }

  private parse_obj(): Expr {
      if (this.current().type !== TokenTypeObject.OpenBracket) {
        return this.parse_addit()
      }

      this.next() //Advance past the open bracket
      const properies = new Array<Property>();
      while (this.EoF() && this.current().type != TokenTypeObject.CloseBracket) {
        const key = this.depend(TokenTypeObject.Identifier, "Literal Key expected").value

        //Undefined keys {key,}
        if (this.current().type == TokenTypeObject.Comma) {
          this.next() //Skip the comma
          properies.push({key, kind: "Property"} as Property)
          continue
        } 
        // Undefined keys with no commas {key}
        else if (this.current().type == TokenTypeObject.CloseBracket) {
          properies.push({key, kind: "Property"} as Property)
          continue
        }

        // Defined keys
        this.depend(TokenTypeObject.Colon, "No Defintion Found.")
        const value = this.parse_expr();
        properies.push({ kind: "Property", value, key });
        if (this.current().type !== TokenTypeObject.CloseBracket) {
          // Expect a comma
          this.depend(TokenTypeObject.Comma,"Expected either a comma or a closing bracket.")
        }
      }

      this.depend(TokenTypeObject.CloseBracket, "Object Definetion is incomplete.")
      return {kind: "ObjectLiteral", properies } as ObjectLiteral
  }

  // Addition and Subtraction
  // If we do smth like this: (10 + 5) - 5, the left is its own additive expression
  private parse_addit(): Expr {
    let left = this.parse_multiplicative();
    while (this.current().value == "+" || this.current().value == "-") {
      const operator = this.next().value;
      const right = this.parse_multiplicative();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // Mulitiplication and Division
  // Higher priority so its handled lower
  private parse_multiplicative(): Expr {
    let left = this.parse_callmember();
    while (
      this.current().value == "*" || this.current().value == "/" ||
      this.current().value == "%"
    ) {
      const operator = this.next().value;
      const right = this.parse_callmember();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_callmember(): Expr {
    const member = this.parse_members()

    if (this.current().type == TokenTypeObject.OpenParen) {
      return this.parse_calls(member)
    }

    return member
  }

  private parse_calls(caller: Expr): Expr {
    let callExpr: Expr = {kind: "CallExpr", args: this.parse_args(), caller} as CallExpr

    if ( this.current().type == TokenTypeObject.OpenParen) {
      callExpr = this.parse_calls(callExpr)
    }

    return callExpr
  }

  private parse_args(): Expr[] {
    this.depend(TokenTypeObject.OpenParen,"If you see this, something is wrong.")
    const args = this.current().type == TokenTypeObject.CloseParen ? [] : this.parse_args_list()
    this.depend(TokenTypeObject.CloseParen, "Closing Parenthesis is missing.")
    return args
  }

  private parse_args_list(): Expr[] {
    const args = [this.parse_expr()]

    while (this.EoF() && this.current().type == TokenTypeObject.Comma && this.next()) {
      args.push(this.parse_assignment())
    }

    return args
  }

  private parse_members(): Expr {
    let object = this.parse_prim()

    while (this.current().type == TokenTypeObject.Dot || this.current().type == TokenTypeObject.OpenBrace) {
      const operand = this.next()
      let property : Expr
      let computed: boolean

      // Non computed
      if (operand.type == TokenTypeObject.Dot) {
        computed = false
        property = this.parse_prim()
        if (property.kind != "Identifier") {
          throw 'Attempted to use a dot operator without a succeeding indentifier'
        }
      } 
      // Computed
      else {
        computed = true
        property = this.parse_expr()
        this.depend(TokenTypeObject.CloseBrace, "Missing Closing Brace.")
      }
      object = {kind: "MemberExpr",object,property,computed} as MemberExpr
    }

    return object
  }

  private parse_prim(): Expr {
    const Tk = this.current().type;
    switch (Tk) {
      case TokenTypeObject.Identifier:
        return {
          kind: "Identifier",
          symbol: this.next().value,
        } as Identifier;
      case TokenTypeObject.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.next().value),
        } as NumericLiteral;
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
        console.log("Unknown token");
        Deno.exit(1);
    }
  }
}
