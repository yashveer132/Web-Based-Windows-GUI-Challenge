import React, { useState, useCallback } from "react";
import styled from "styled-components";

const CalculatorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 10px;
  background-color: var(--window-bg);
  color: var(--text-color);
  height: 100%;
  box-sizing: border-box;
`;

const Display = styled.div`
  grid-column: 1 / -1;
  background-color: #111;
  padding: 10px;
  text-align: right;
  font-size: 24px;
  border: 1px solid var(--window-border);
  margin-bottom: 10px;
  color: #0f0;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 15px;
  font-size: 18px;
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--text-color);
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    background-color: #4a4a4a;
  }

  &:active {
    opacity: 0.8;
  }
`;

const Calculator = ({ addNotification }) => {
  const [display, setDisplay] = useState("0");
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [previousValue, setPreviousValue] = useState(null);

  const inputDigit = useCallback(
    (digit) => {
      if (waitingForOperand) {
        setDisplay(String(digit));
        setWaitingForOperand(false);
      } else {
        setDisplay(display === "0" ? String(digit) : display + digit);
      }
    },
    [display, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setOperator(null);
    setWaitingForOperand(false);
    setPreviousValue(null);
  }, []);

  const performOperation = useCallback(
    (nextOperator) => {
      const inputValue = Number.parseFloat(display);

      if (previousValue == null) {
        setPreviousValue(inputValue);
      } else if (operator) {
        const currentValue = previousValue || 0;
        let newValue = currentValue;

        switch (operator) {
          case "+":
            newValue = currentValue + inputValue;
            break;
          case "-":
            newValue = currentValue - inputValue;
            break;
          case "*":
            newValue = currentValue * inputValue;
            break;
          case "/":
            newValue = currentValue / inputValue;
            break;
          default:
            break;
        }
        setPreviousValue(newValue);
        setDisplay(String(newValue));
        if (addNotification && nextOperator === "=") {
          addNotification(`Result: ${newValue}`);
        }
      }

      setWaitingForOperand(true);
      setOperator(nextOperator === "=" ? null : nextOperator);
    },
    [display, operator, previousValue, addNotification]
  );

  return (
    <CalculatorContainer>
      <Display>{display}</Display>
      <Button onClick={() => inputDigit(7)}>7</Button>
      <Button onClick={() => inputDigit(8)}>8</Button>
      <Button onClick={() => inputDigit(9)}>9</Button>
      <Button onClick={() => performOperation("/")}>/</Button>
      <Button onClick={() => inputDigit(4)}>4</Button>
      <Button onClick={() => inputDigit(5)}>5</Button>
      <Button onClick={() => inputDigit(6)}>6</Button>
      <Button onClick={() => performOperation("*")}>*</Button>
      <Button onClick={() => inputDigit(1)}>1</Button>
      <Button onClick={() => inputDigit(2)}>2</Button>
      <Button onClick={() => inputDigit(3)}>3</Button>
      <Button onClick={() => performOperation("-")}>-</Button>
      <Button onClick={() => inputDigit(0)}>0</Button>
      <Button onClick={inputDecimal}>.</Button>
      <Button onClick={() => performOperation("=")}>=</Button>
      <Button onClick={() => performOperation("+")}>+</Button>
      <Button
        onClick={clear}
        style={{ gridColumn: "1 / -1", backgroundColor: "#ff4747" }}
      >
        Clear
      </Button>
    </CalculatorContainer>
  );
};

export default Calculator;
