/*
Comparison    = Expression ("is" | ">" | ">=" | "<" | "<=") Expression
Concatenation = Expression ".." Expression
Addition      = Expression "+" Expression
Subtraction   = Expression "-" Expression
Multiplication = Expression "*" Expression
Division      = Expression "/" Expression
Modulo        = Expression "%" Expression
Unary         = ("not" | "+" | "-") Expression
Primary       = Identifier | Literal | "(" Expression ")"


*/


//Add import content

function evalCoparison(
  l: NumberVal,
  r: NumberVal,
  comparison: string,
): NumberVal {
  let result = false;
  switch (comparison) {
    case ">":
      result = l.value > r.value;
      break;
     case "<":
      result = l.value < r.value;
      break; 
    case ">=":
      result = l.value >= r.value;
      break;
    case "<=":
      result = l.value <= r.value;
      break;
  }
  return { value: result, type: "boolean" };
}
