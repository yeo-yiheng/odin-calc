function add(a, b) {
    return a + b;
}

function subtract(a ,b) {
    return a - b;
}

function divide(a, b) {
    return a / b;
}

function multiply(a, b) {
    return a * b;
}

function operate(a, b, operator) {
    a = parseFloat(a);
    b = parseFloat(b);
    if (operator == "+") {
        return add(a, b);
    } else if (operator == "-") {
        return subtract(a, b);
    } else if (operator == "*") {
        return multiply(a, b);
    } else if (operator == "/") {
        const result = divide(a, b);
        return result;
    }
}

const numberPad = document.querySelector('.numberpad');
const operatorPad = document.querySelector('.operatorpad');

const numberPadHeight = numberPad.offsetHeight;
const numberPadWidth = numberPad.offsetWidth;
const operatorPadHeight = operatorPad.offsetHeight;
const operatorPadWidth = operatorPad.offsetWidth;

const numberPadRows = 4;
const numberPadColumns = 3;
const numberButtonHeight = numberPadHeight / numberPadRows;
const numberButtonWidth = numberPadWidth / numberPadColumns;

const operatorPadRows = 4;
const operatorPadColumns = 2;
const operatorButtonHeight = operatorPadHeight / operatorPadRows;
const operatorButtonWidth = operatorPadWidth / operatorPadColumns;

const result = document.querySelector(".result-value");

let numberArr = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "(-)"];
let numberCounter = 0;
let operatorArr = ["Del", "AC", "+", "-", "*", "/", "="];
let operatorCounter = 0;

let firstOperator = 0;
let secondOperator = 0;
let operator = "";
let hasFirstOperatorDecimal = false;
let hasSecondOperatorDecimal = false;
let isSecondOperator = false;

for (let row = 0; row < numberPadRows; row++) {
    let newRow = document.createElement("div");
    newRow.setAttribute("style", "display:flex;");
    for (let column = 0; column < numberPadColumns; column++) {
        let newColumn = document.createElement("div");
        newColumn.setAttribute("style", `width:${numberButtonWidth}px; height:${numberButtonHeight}px;`);
        newColumn.classList.add("numberPadButton");
        newColumn.addEventListener("click", e => {
            let currentText = result.textContent;
            let button = newColumn.firstChild.textContent;
            let substituteText;
            if (button == "(-)") {
                substituteText = "-" + currentText;  
            } else if (currentText == "0") {
                substituteText = button;
            } else if (button == ".") {
                if (!isSecondOperator) {
                    if (!hasFirstOperatorDecimal) {
                        substituteText = currentText + button;
                        hasFirstOperatorDecimal = true;
                    } else {
                        substituteText = currentText;
                    }
                } else {
                    if (!hasSecondOperatorDecimal) {
                        substituteText = currentText + button;
                        hasSecondOperatorDecimal = true;
                    } else {
                        substituteText = currentText;
                    }
                }
            } else {
                substituteText = currentText + button;
            }
            result.textContent = substituteText;
        });
        let textNode = document.createTextNode(`${numberArr[numberCounter]}`);
        newColumn.appendChild(textNode);
        newRow.append(newColumn);
        numberCounter++;
    }
    numberPad.append(newRow);
}

for (let row = 0; row < operatorPadRows; row++) {
    let newRow = document.createElement("div");
    newRow.setAttribute("style", "display:flex;");
    for (let column = 0; column < operatorPadColumns; column++) {
        let newColumn = document.createElement("div");
        newColumn.setAttribute("style", `width:${operatorButtonWidth}px; height:${operatorButtonHeight}px;`);
        newColumn.classList.add("operatorPadButton");
        newColumn.addEventListener("click", e => {
            let currentText = result.textContent;
            let button = newColumn.firstChild.textContent;
            let substituteText;
            const lastChar = currentText.charAt(currentText.length - 1);
            if (button == "Del") {
                if (!operatorArr.some(op => op == lastChar)) {
                    const len = currentText.length;
                    substituteText = currentText.slice(0, len - 1);
                    if (substituteText.length == 0) {
                        substituteText = "0";
                    }
                    result.textContent = substituteText;
                }
            } else if (button == "AC") {
                reset();
            } else if (button == "=") {
                callEqual(currentText);
                operator = "";
                console.log(firstOperator, secondOperator, hasFirstOperatorDecimal, hasSecondOperatorDecimal, isSecondOperator, operator);
            } else {
                if (!operatorArr.some(op => op == lastChar)) {
                    if (operator != "") {
                        callEqual(currentText);
                        result.textContent += button;
                        operator = button;
                    } else {
                        firstOperator = parseFloat(currentText);
                        operator = button;
                        isSecondOperator = true;
                        substituteText = currentText + button;
                        result.textContent = substituteText;
                    }
                }
            }
        });
        let textNode = document.createTextNode(`${operatorArr[operatorCounter]}`);
        newColumn.appendChild(textNode);
        newRow.append(newColumn);
        operatorCounter++;
        if (row == operatorPadRows - 1) {
            newColumn.setAttribute("style", `width:${operatorPadWidth}px; height:${operatorButtonHeight}px;`);
            break;
        }
    }
    operatorPad.append(newRow);
}

document.addEventListener("keydown", e => {
    const keyPressed = e.key; 
    let numberButtonArr = Array.from(document.querySelectorAll(".numberPadButton"));
    let operatorButtonArr = Array.from(document.querySelectorAll(".operatorPadButton"));
    let totalArr = numberButtonArr.concat(operatorButtonArr);
    let index = totalArr.findIndex(button => button.textContent == keyPressed);
    totalArr[index].click();
});

function reset() {
    result.textContent = "0";
    firstOperator = 0;
    secondOperator = 0;
    hasFirstOperatorDecimal = false;
    hasSecondOperatorDecimal = false; 
    isSecondOperator = false;
}

function callEqual(currentText) {
    if (operator != "") {
        console.log("operator: " + operator + " ctext: " + currentText);
        operands = currentText.split(`${operator}`);
        console.table("operands: " + operands);
        if (operands.length == 3) {
            secondOperator = operands[2];
        } else {
            secondOperator = operands[1];
        } 
        console.log(firstOperator, secondOperator, operator);
        let resultant = operate(firstOperator, secondOperator, operator);
        console.log("result: " + resultant);
        reset();
        if (countDecimals(resultant) > 10) {
            resultant = resultant.toFixed(10);
        }
        if (resultant == Infinity) {
            alert("I too do not know what we get when we divide by 0.")
        } else {
            result.textContent = resultant;
            firstOperator = resultant;
            if (resultant % 1 !== 0) {
                hasFirstOperatorDecimal = true;
            }   
        }
    }
}

let countDecimals = value => {
    let text = value.toString()
    // verify if number 0.000005 is represented as "5e-6"
    if (text.indexOf('e-') > -1) {
      let [base, trail] = text.split('e-');
      let deg = parseInt(trail, 10);
      return deg;
    }
    // count decimals for number in representation like "0.123456"
    if (Math.floor(value) !== value) {
      return value.toString().split(".")[1].length || 0;
    }
    return 0;
}

console.log(`height: ${numberPadHeight}, width: ${numberPadWidth}`);