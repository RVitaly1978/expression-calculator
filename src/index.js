function eval() {
    // Do not use eval!!!
    return;
}

const OPERATORS = ['+', '-', '*', '/'];

function calc(a, b, operator) {
    if ((b === 0) && (operator === '/')) {
        throw TypeError('TypeError: Division by zero.');
    }

    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        default:
            throw new Error(`Operator is not '+', '-', '*', '/'`);
    }
}

function getPriority(operator) {
    switch (operator) {
        case '*':
            return 2;
        case '/':
            return 2;
        case '+':
            return 1;
        case '-':
            return 1;
        case '(':
            return 0;
        default:
            throw Error(`Operator is not '+', '-', '*', '/', '('`);
    }
}

function parseToRPN(array) {
    const stackNumber = [];
    const stackOperator = [];

    array.forEach(item => {
        if (typeof item === 'number') {
            stackNumber.push(Number(item));
        }

        if (item === '(') {
            stackOperator.push(item);
        }

        if (item === ')') {
            while (stackOperator.length) {
                let operator = stackOperator.pop();
                if (operator === '(') return;
                stackNumber.push(operator);
            }

            throw Error('ExpressionError: Brackets must be paired');
        }

        if (OPERATORS.includes(item)) {
            if (stackOperator.length) {
                const itemPriority = getPriority(item);
                let topStackItem = stackOperator[stackOperator.length - 1];
                let topStackItemPriority = getPriority(topStackItem);
                
                while ((stackOperator.length) && (topStackItemPriority >= itemPriority)) {
                    const top = stackOperator.pop();
                    stackNumber.push(top);
                    
                    if (stackOperator.length) {
                        topStackItem = stackOperator[stackOperator.length - 1];
                        topStackItemPriority = getPriority(topStackItem);
                    }
                }
            }

            stackOperator.push(item);
        }
    });

    while (stackOperator.length) {
        const top = stackOperator.pop();

        if (top === '(') {
            throw Error('ExpressionError: Brackets must be paired');
        }

        stackNumber.push(top);
    }

    return stackNumber;
}

function calculationRPN(arrayInRPN) {
    const stack = [];

    while (arrayInRPN.length) {
        const item = arrayInRPN.shift();

        if (typeof item === 'number') {
            stack.push(item);
        } else {
            const b = stack.pop();
            const a = stack.pop();
            const calculation = calc(a, b, item);
            stack.push(calculation);
        }
    }

    return stack;
}

function parseExpression(expr) {
    const array = [];
    let item = '';

    for (let char of expr) {
        if (char === ' ') {
            if (item.length) {
                array.push(Number(item));
                item = '';
            }
        }

        if ((char === '(')
            || (char === ')')
            || (OPERATORS.includes(char))) {
            if (item.length) {
                array.push(Number(item));
                item = '';
            }

            array.push(char);
        }

        if ((Number(char) || char === '0')) {
            item += char; 
        }
    }

    if (item.length) {
        array.push(Number(item));
    } 

    return array;
}

function expressionCalculator(expr) {
    const parsedExpr = parseExpression(expr);
    
    const arrayInRPN = parseToRPN(parsedExpr);

    const calcRPN = calculationRPN(arrayInRPN);

    return calcRPN[0];
}

module.exports = {
    expressionCalculator
}