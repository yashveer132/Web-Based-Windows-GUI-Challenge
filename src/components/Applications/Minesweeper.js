import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--window-bg);
  color: var(--text-color);
  padding: 10px;
`;

const Minesweeper = ({ addNotification }) => {
  const handlePlaceholder = () => {
    if (addNotification) {
      addNotification("Minesweeper is not fully implemented yet!");
    }
  };

  return (
    <Container>
      <h2>Minesweeper (Demo)</h2>
      <p>
        A placeholder for Minesweeper. Click below to see a sample notification.
      </p>
      <button onClick={handlePlaceholder}>Click me!</button>
    </Container>
  );
};

export default Minesweeper;
