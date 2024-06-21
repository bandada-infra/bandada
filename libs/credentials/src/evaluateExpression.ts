/**
 * Tokenization function to split the expression into meaningful tokens.
 * @param expression The expression to tokenize.
 * @returns A list with the tokens of the expression.
 */
export function tokenize(expression: string): string[] {
    const tokenPattern = /\s*(\(|\)|and|or|not|xor|true|false)\s*/g
    // Split the expression based on the token pattern and filter out empty tokens
    return expression.split(tokenPattern).filter((token) => token.trim() !== "")
}

/**
 * Function to determine the precedence of operators.
 * Unary operators have higher precedence.
 * Binary operators have the same precedence.
 * @param op Operator to check the precedence.
 * @returns The precedence of the operator.
 */
function precedence(op: string): number {
    if (op === "not") return 2 // Highest precedence
    if (op === "and") return 1
    if (op === "xor") return 1
    if (op === "or") return 1 // Lowest precedence
    return 0
}

/**
 * Function to apply the operator to one or two boolean values.
 * @param op Operator to apply.
 * @param a First boolean value.
 * @param b Second boolean value.
 * @returns The boolean value after applying the operator.
 */
function applyOp(op: string, a: boolean, b?: boolean): boolean {
    switch (op) {
        case "and":
            return a && b!
        case "or":
            return a || b!
        case "not":
            return !a
        case "xor":
            return a !== b! // XOR returns true if only one of the operands is true
        default:
            throw new Error(`Unknown operator: ${op}`)
    }
}

/**
 * Function to evaluate the tokenized expression.
 * This algorithm is an adaptation of the
 * {@link https://en.wikipedia.org/wiki/Shunting_yard_algorithm | Shunting Yard}
 * algorithm to evaluate expressions with logical operators.
 * @param tokens Tokens of the expression.
 * The tokens can be boolean values, operators or parenthesis.
 * They represent a valid expression.
 * @returns The boolean value after evaluating the expression.
 */
export function evaluate(tokens: string[]): boolean {
    const values: boolean[] = [] // Stack to store boolean values
    const ops: string[] = [] // Stack to store operators

    for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i]

        if (token === "true") {
            values.push(true)
        } else if (token === "false") {
            values.push(false)
        } else if (token === "(") {
            ops.push(token)
        } else if (token === ")") {
            // Evaluate the expression inside the parentheses
            while (ops.length > 0 && ops[ops.length - 1] !== "(") {
                const op = ops.pop()!
                if (op === "not") {
                    const val = values.pop()!
                    values.push(applyOp(op, val))
                } else {
                    const b = values.pop()!
                    const a = values.pop()!
                    values.push(applyOp(op, a, b))
                }
            }
            ops.pop() // Remove '(' from stack
        } else if (["and", "or", "not", "xor"].includes(token)) {
            // Handle operators and ensure the correct precedence
            while (
                ops.length > 0 &&
                precedence(ops[ops.length - 1]) >= precedence(token)
            ) {
                const op = ops.pop()!
                if (op === "not") {
                    const val = values.pop()!
                    values.push(applyOp(op, val))
                } else {
                    const b = values.pop()!
                    const a = values.pop()!
                    values.push(applyOp(op, a, b))
                }
            }
            ops.push(token)
        }
    }

    // Apply remaining operators to remaining values
    while (ops.length > 0) {
        const op = ops.pop()!
        if (op === "not") {
            const val = values.pop()!
            values.push(applyOp(op, val))
        } else {
            const b = values.pop()!
            const a = values.pop()!
            values.push(applyOp(op, a, b))
        }
    }

    return values.pop()!
}
