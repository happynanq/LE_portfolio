const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let firstValue = "";
let secondValue = "";
let operator = "";
let resultShown = false;

function calculate(a, b, op) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  switch (op) {
    case "+":
      return (x + y).toString();
    case "-":
      return (x - y).toString();
    case "*":
      return (x * y).toString();
    case "/":
      return y === 0 ? "Ошибка" : (x / y).toString();
    default:
      return "";
  }
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (btn.classList.contains("clear")) {
      firstValue = "";
      secondValue = "";
      operator = "";
      display.value = "";
      return;
    }

    if (value === "←") {
      if (operator === "") {
        firstValue = firstValue.slice(0, -1);
        display.value = firstValue;
      } else {
        secondValue = secondValue.slice(0, -1);
        display.value = firstValue + operator + secondValue;
      }
      return;
    }

    if (btn.classList.contains("operator") && value !== "←") {
      if (firstValue === "") return;
      if (operator !== "" && secondValue !== "") {
        firstValue = calculate(firstValue, secondValue, operator);
        secondValue = "";
      }
      operator = value;
      display.value = firstValue + operator;
      return;
    }

    if (value === "=") {
      if (firstValue && secondValue && operator) {
        firstValue = calculate(firstValue, secondValue, operator);
        operator = "";
        secondValue = "";
        display.value = firstValue;
        resultShown = true;
      }
      return;
    }

    if (!isNaN(value) || value === ".") {
      console.log(firstValue, " ", secondValue, " ", value);
      if (operator === "") {
        firstValue += value;
      } else {
        secondValue += value;
      }
      display.value = firstValue + operator + secondValue;
    }
  });
});
