// We'll add more as we go
export enum TokenTypeObject {
  // Math
  BinaryOperator,
  OpenParen,
  CloseParen,
  Equals,

  // Other Characters
  Comma,
  Colon,
  At,
  Tag,
  OpenBracket,
  CloseBracket,
  OpenBrace,
  CloseBrace,

  //Variables
  Local,
  Global,
  ConstantLocal,
  ConstantGlobal,

  // Lists
  LocalList,
  GlobalList,
  ConstantLocalList,
  ConstantGlobalList,

  // Data Types
  Number,
  String,
  Identifier,
  Bool,

  // Gum Keywords
  Chew,
  From,
  Pack,
  Add,

  // End Of File
  EOF,
}

const reserved: Record<string, TokenTypeObject> = {
  "local": TokenTypeObject.Local,
  "local!": TokenTypeObject.ConstantLocal,
  "global": TokenTypeObject.Global,
  "global!": TokenTypeObject.ConstantGlobal,
  "local[]": TokenTypeObject.LocalList,
  "global[]": TokenTypeObject.GlobalList,
  "local![]": TokenTypeObject.ConstantLocalList,
  "global![]": TokenTypeObject.ConstantGlobalList,
};

// defines tokens
export interface Token {
  value: string;
  type: TokenTypeObject;
}

// Make the tokens
function makeToken(value = "", type: TokenTypeObject): Token {
  return { value, type };
}

// function for checking if a value is a letter
function isAlpha(blob: string) {
  // check if its a letter by attempting to switch the casing
  let char = blob.toUpperCase() != blob.toLowerCase();
  // Add the ability to include ! in the keyword. We'll need it for constant vars
  if (char != true) {
    char = "!".charCodeAt(0) == blob.charCodeAt(0);

    // TODO: Support including "[" and "]" to recognise arrays. (This was not implemented correctly)
    // char = ('['.charCodeAt(0) == blob.charCodeAt(0))
    // char = (']'.charCodeAt(0) == blob.charCodeAt(0))
  }
  return char;
}

// function for checking if a value is a number
function isInt(blob: string) {
  const c = blob.charCodeAt(0); // Get the unicode of the charBox[0] value. We're only dealing with one character at a time.
  const boundary = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return (c >= boundary[0] && c <= boundary[1]);
}

// function for checking if a value is a newline character
function isEscape(blob: string) {
  return blob == " " || blob == "\n" || blob == "\t" || blob == "--" || blob == "\r";
}

// Handles Tokenization
export function tokenize(src: string): Token[] {
  // this is what we'll be returining
  const tokens = new Array<Token>();
  // Take the string apart so we can actually use it
  const charBox = src.split("");
  // Construct token for the whole file
  // TODO: Make this memory effient
  while (charBox.length > 0) {
    if (charBox[0] == "(") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.OpenParen));
    } else if (charBox[0] == ")") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.CloseParen));
    } else if (charBox[0] == "[") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.OpenBrace));
    } else if (charBox[0] == "]") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.CloseBrace));
    } else if (charBox[0] == "{") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.OpenBracket));
    } else if (charBox[0] == "}") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.CloseBracket));
    } else if (
      charBox[0] == "*" || charBox[0] == "+" || charBox[0] == "-" ||
      charBox[0] == "/" || charBox[0] == "%"
    ) {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.BinaryOperator));
    } else if (charBox[0] == "=") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.Equals));
    } else if (charBox[0] == "@") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.At));
    } else if (charBox[0] == ",") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.Comma));
    } else if (charBox[0] == ":") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.Colon));
    } else if (charBox[0] == "#") {
      tokens.push(makeToken(charBox.shift(), TokenTypeObject.Tag));
    } else { // It is not a one line character
      // build number token
      if (isInt(charBox[0])) {
        let num = "";
        while (charBox.length > 0 && isInt(charBox[0])) {
          num += charBox.shift();
        }
        tokens.push(makeToken(num, TokenTypeObject.Number));
      } // build identifer (string) token
      else if (isAlpha(charBox[0])) {
        let letters = "";
        while (charBox.length > 0 && isAlpha(charBox[0])) {
          letters += charBox.shift();
        }
        // Check for keyword
        const keyword = reserved[letters];
        // If its not a keyword, let it slide as is
        if (typeof keyword == "number") {
          tokens.push(makeToken(letters, keyword));
        } else {
          // If it is a keyword, use the keyword's identifier
          tokens.push(makeToken(letters, TokenTypeObject.Identifier));
        }
      } // skip escape chars
      else if (isEscape(charBox[0])) {
        charBox.shift();
      } else {
        // unknown
        console.error("Unknown character.");
      }
    }
  }
  // add eof character
  tokens.push(makeToken("EndOfFile", TokenTypeObject.EOF));
  return tokens;
}
