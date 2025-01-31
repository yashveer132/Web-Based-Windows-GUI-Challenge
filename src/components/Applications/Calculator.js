import { useState, useCallback } from "react";
import styled from "styled-components";

const CalculatorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 10px;
  background-color: var(--window-bg);
`;

const Display = styled.div`
  grid-column: 1 / -1;
  background-color: #fff;
  padding: 10px;
  text-align: right;
  font-size: 24px;
  margin-bottom: 10px;
  border: inset 2px var(--window-border);
`;

const Button = styled.button`
  padding: 10px;
  font-size: 18px;
  background-color: var(--button-bg);
  border: outset 2px var(--button-border);
  cursor: pointer;

  &:active {
    border-style: inset;
  }
`;

const Calculator = () => {
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
    } else if (display.indexOf(".") === -1) {
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
        const newValue = (() => {
          switch (operator) {
            case "+":
              return currentValue + inputValue;
            case "-":
              return currentValue - inputValue;
            case "*":
              return currentValue * inputValue;
            case "/":
              return currentValue / inputValue;
            default:
              return inputValue;
          }
        })();

        setPreviousValue(newValue);
        setDisplay(String(newValue));
      }

      setWaitingForOperand(true);
      setOperator(nextOperator);
    },
    [display, operator, previousValue]
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
      <Button onClick={clear} style={{ gridColumn: "1 / -1" }}>
        Clear
      </Button>
    </CalculatorContainer>
  );
};

export default Calculator;
