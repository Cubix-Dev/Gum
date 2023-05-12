
// We'll add more as we go
export enum TokenTypeObject {
    BinaryOperator,
    OpenParen,
    CloseParen,
    Equals,
    Number,
    VariableDecl,
    Identifier,
    Bool,
    Chew,
    From,
    Pack,
    Add,
}

const reserved: Record<string, TokenTypeObject> = {
    "local": TokenTypeObject.VariableDecl,
    "chew": TokenTypeObject.Chew,
    "from": TokenTypeObject.From 
}

// defines tokens
export interface Token {
    value: string,
    type: TokenTypeObject,
}

// Make the tokens
function makeToken(value = "", type: TokenTypeObject): Token {
    return { value, type}
}

// function for checking if a value is a letter
function isAlpha(blob: string) {
    // check if its a letter by attempting to switch the casing
    return blob.toUpperCase() != blob.toLowerCase()
}

// function for checking if a value is a number
function isInt(blob: string) {
    const c = blob.charCodeAt(0) // Get the unicode of the current value. We're only dealing with one character at a time.
    const boundary = ['0'.charCodeAt(0),'9'.charCodeAt(0)]
    return (c >= boundary[0] && c <= boundary[1])
}

// function for checking if a value is a newline character
function isEscape(blob: string) {
    return blob == ' ' || blob == '\n' || blob == '\t'
}

// Handles Tokenization
export function tokenize (src: string): Token[] {
    // this is what we'll be returining
    const tokens = new Array<Token>()
    // Take the string apart so we can actually use it
    const charBox = src.split("")
    // Construct token for the whole file
    // TODO: Make this memory effient
    while (charBox.length > 0) {
        let current = charBox[0]
        if (current == '(') {
            tokens.push(makeToken(charBox.shift(), TokenTypeObject.OpenParen))
        } else if (current == ')') {
            tokens.push(makeToken(charBox.shift(), TokenTypeObject.CloseParen))
        } else if (current == '*' || current == '+' || current == '-' || current == '/') {
            tokens.push(makeToken(charBox.shift(), TokenTypeObject.BinaryOperator))
        } else if (current == '=') {
            tokens.push(makeToken(charBox.shift(), TokenTypeObject.Equals))
        } else { // It is not a one line character
            // build number token
            if (isInt(current)) {
                let num = ""
                while (charBox.length > 0 && isInt(current)) {
                    num += charBox.shift()
                }
                tokens.push(makeToken(num, TokenTypeObject.Number))
            }

            // build identifer (string) token
            else if (isAlpha(current)) {
                let letters = ""
                while (charBox.length > 0 && isAlpha(current)) {
                    letters += charBox.shift()
                }
                // Check for keyword
                const keyword = reserved[letters]
                // If its not a keyword, let it slide as is
                if (keyword == undefined) {
                    tokens.push(makeToken(letters, TokenTypeObject.Identifier))
                } else {
                    // If it is a keyword, use the keyword's identifier
                    tokens.push(makeToken(letters, keyword))
                }
            }

            // skip escape chars
            else if (isEscape(current)) {
                charBox.shift()
            }

            else {
                // unknown
                console.error("Unknown character.")
            }
        }
    }
    return tokens
}