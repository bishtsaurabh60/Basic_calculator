class Calc {
  constructor(previousOutputText, currentOutputText) {
    this.previousOutput = previousOutputText;
    this.currentOutput = currentOutputText;
    this.clear();
  }

  clear() {
    this.operation = undefined;
    this.previousOperand = "";
    this.currentOperand = "";
    currentOutput.focus();
  }

  del() {
    // Delete current Operand
    this.currentOperand = this.currentOperand.toString().slice(0, -1);

    // Delete previous Operand
    if (
      this.operation === "" &&
      this.previousOperand !== "" &&
      this.currentOperand === ""
    ) {
      this.previousOperand = this.previousOperand.toString().slice(0, -1);
    }

    // Delete Operators
    if (this.previousOperand !== "" && this.currentOperand === null) {
      this.operation = this.operation.toString().slice(0, -1);
    }
    currentOutput.focus();
  }

  inputNum(num) {
    if (num === "." && this.currentOperand.includes(".")) return;

    console.log(this.currentOperand);
    this.currentOperand += num.toString();

    //modification
    if (this.operation === "" && this.previousOperand !== "") {
      this.previousOperand =
        this.previousOperand.toString() + this.currentOperand.toString();
      this.currentOperand = "";
    }

    if (this.previousOperand === 0 || this.previousOperand === null) {
      return;
    }
    currentOutput.focus();
  }

  chooseOp(operation) {
    if (this.currentOperand === "" && this.previousOperand === "") return;

    if (this.previousOutput !== "") {
      this.compute();
    }

    this.operation = operation;

    this.previousOperand += this.currentOperand;

    this.currentOperand = "";
    currentOutput.focus();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const curr = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (this.operation) {
      case "+":
        computation = prev + curr;
        break;
      case "-":
        computation = prev - curr;
        break;
      case "*":
        computation = prev * curr;
        break;
      case "/":
        computation = prev / curr;
        break;
      case "%":
        computation = (prev / 100) * curr;
        break;
      default:
        return;
    }

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
    currentOutput.focus();
  }

  formatNum(num) {
    console.log(num);
    const strNumber = num.toString();
    const integerDigit = parseFloat(strNumber.split(".")[0]);
    const decimalDigit = strNumber.split(".")[1];

    let integerDisplay;

    if (isNaN(integerDigit)) integerDisplay = "";
    else {
      integerDisplay = integerDigit.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigit != null) {
      return `${integerDisplay}.${decimalDigit}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOutput.innerText = this.formatNum(this.currentOperand);

    if (this.operation != null) {
      this.previousOutput.innerText = `${this.formatNum(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOutput.innerText = "";
    }
    currentOutput.focus();
  }
}

const dataNumbers = document.querySelectorAll("[data-operand]");

const dataOperations = document.querySelectorAll("[data-operation]");

const previousOutput = document.querySelector("[data-previous-output]");

const currentOutput = document.querySelector("[data-current-output]");

const allClear = document.querySelector("[data-allClear]");

const del = document.querySelector("[data-del]");

const dataEquals = document.querySelector("[data-equals]");

const cal = new Calc(previousOutput, currentOutput);

const addEvent = function (obj, events, eventHandler) {
  obj.addEventListener(events, eventHandler);
};

const equalEvent = function (e) {
  if (
    e.key === dataEquals.innerText ||
    e.key === "Enter" ||
    e.target.innerText === dataEquals.innerText
  ) {
    cal.compute();
    cal.updateDisplay();
  }
};

// numpad using keyboard
const numEvent = (e) => {
  dataNumbers.forEach((button) => {
    if (e.key === button.innerText) {
      e.preventDefault();
      button.click();
    }
  });
};

// numpad using click
dataNumbers.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (e.target.innerText === button.innerText) {
      e.preventDefault();
      cal.inputNum(button.innerText);
      cal.updateDisplay();
    }
  });
});

const operationEvent = (e) => {
  dataOperations.forEach((button) => {
    if (e.key === button.innerText || e.target.innerText === button.innerText) {
      cal.chooseOp(button.innerText);
      cal.updateDisplay();
      cal.compute();
    }
  });
};

const deletes = (e) => {
  if (
    (e.key === "Backspace" && del.innerText === "✂") ||
    e.target.innerText === del.innerText
  ) {
    cal.del();
    cal.updateDisplay();
  }
};

const clear = (e) => {
  if (
    (e.key === "Delete" && allClear.innerText === "AC") ||
    e.target.innerText === allClear.innerText
  ) {
    cal.clear();
    cal.updateDisplay();
  }
};

// for numbers
addEvent(document, "keydown", numEvent);
// for operations
addEvent(document, "keydown", operationEvent);
addEvent(document, "click", operationEvent);

// for equal
addEvent(document, "keydown", equalEvent);
addEvent(document, "click", equalEvent);

// for Delete
addEvent(document, "keydown", deletes);
addEvent(document, "click", deletes);

// for All Clear
addEvent(document, "keydown", clear);
addEvent(document, "click", clear);
