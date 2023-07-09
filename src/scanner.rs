pub struct Scanner {}

impl Scanner {
    pub fn new(_src: &str) -> Self {
        Self {}
    }

    pub fn scan_tokens(self: &Self) -> Result< Vec<Token>, String> {
        todo!()
    }
}

#[derive(Debug)]
pub enum LiteralValue {
    IntValue(i64),
    FValue(f64),
    StringValue(String),
    IdentifierVal(String)
}

#[derive(Debug)]
pub enum TokenType {
    // CORE
    OpenParen,
    CloseParen,
    OpenBracket, // {
    CloseBracket, // }
    OpenBrace, // [
    CloseBrace, // ]
    COMMA,
    DOT,
    MINUS,
    PLUS,
    STAR,
    SLASH,
    SEMICOLON,
    COLON,
    START,
    AT,

    TILDE,
    TildeEquals,
    EQUALS,
    EqualsEquals,
    GREATER,
    GreaterEqual,
    LESS,
    LessEqual,

    // LITERALS
    IDENTIFIER,
    STRING,
    NUMBER,

    // GUM KEYWORDS
    CHEW,
    FROM,
    PACK,
    ADD,
    LOCAL,
    GLOBAL,
    ELSE,
    IF,
    FOR,
    IN,
    PAIRS,
    WHILE,
    RETURN,
    TRUE,
    FALSE,
    NOT,
    KICK,
    SELF,
    EXTENSION,
    FUNCTION,
    BROADCAST,

    // END

    EOF

}

#[derive(Debug)]
pub struct Token {
    token_type: TokenType,
    lexeme: String,
    literal: Option<LiteralValue>,
    line_number: u64,
}


impl Token {
    pub fn new(token_type: TokenType, lexeme: String, literal: Option<LiteralValue>, line_number: u64) -> Self {
        Self {
            token_type,
            lexeme,
            literal,
            line_number
        }

    }
}