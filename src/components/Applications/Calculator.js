import React, { useState, useCallback } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #121212;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const CalculatorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
  background-color: #1e1e1e;
  color: white;
  width: 320px;
  max-width: 90vw;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  @media (max-width: 768px) {
    padding: 15px;
    gap: 8px;
  }
  @media (max-width: 480px) {
    padding: 10px;
    gap: 6px;
  }
`;

const Display = styled.div`
  grid-column: 1 / -1;
  background-color: #111;
  padding: 15px;
  text-align: right;
  font-size: 32px;
  font-weight: bold;
  color: #0f0;
  border: 2px solid #333;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 28px;
  }
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 24px;
  }
`;

const DisplayOperator = styled.span`
  color: #f0a500;
  font-size: 24px;
  padding-left: 10px;
  @media (max-width: 768px) {
    font-size: 20px;
  }
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Button = styled.button`
  padding: 15px;
  font-size: 20px;
  background-color: #333;
  border: 2px solid #555;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #4a4a4a;
  }
  &:active {
    opacity: 0.8;
  }
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 18px;
  }
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 16px;
  }
`;

const OperatorButton = styled(Button)`
  background-color: #f0a500;
  color: black;
  &:hover {
    background-color: #d48900;
  }
`;

const ClearButton = styled(Button)`
  background-color: #ff4747;
  color: white;
  grid-column: 1 / -1;
  &:hover {
    background-color: #d43c3c;
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
    <Wrapper>
      <CalculatorContainer>
        <Display>
          {operator && <DisplayOperator>{operator}</DisplayOperator>}
          {display}
        </Display>
        <Button onClick={() => inputDigit(7)}>7</Button>
        <Button onClick={() => inputDigit(8)}>8</Button>
        <Button onClick={() => inputDigit(9)}>9</Button>
        <OperatorButton onClick={() => performOperation("/")}>/</OperatorButton>
        <Button onClick={() => inputDigit(4)}>4</Button>
        <Button onClick={() => inputDigit(5)}>5</Button>
        <Button onClick={() => inputDigit(6)}>6</Button>
        <OperatorButton onClick={() => performOperation("*")}>*</OperatorButton>
        <Button onClick={() => inputDigit(1)}>1</Button>
        <Button onClick={() => inputDigit(2)}>2</Button>
        <Button onClick={() => inputDigit(3)}>3</Button>
        <OperatorButton onClick={() => performOperation("-")}>-</OperatorButton>
        <Button onClick={() => inputDigit(0)}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <OperatorButton onClick={() => performOperation("=")}>=</OperatorButton>
        <OperatorButton onClick={() => performOperation("+")}>+</OperatorButton>
        <ClearButton onClick={clear}>Clear</ClearButton>
      </CalculatorContainer>
    </Wrapper>
  );
};

export default Calculator;
