import React, { useState } from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  color: var(--text-color);
  background-color: var(--window-bg);
`;

const Status = styled.div`
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 80px);
  grid-template-rows: repeat(3, 80px);
  gap: 5px;
  margin: auto;

  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: repeat(3, 60px);
  }
`;

const Cell = styled.button`
  width: 80px;
  height: 80px;
  font-size: 2rem;
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

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: var(--button-bg);
  color: var(--text-color);
  border: 1px solid var(--button-border);
  cursor: pointer;
  margin: 0 5px;
  border-radius: 3px;

  &:hover {
    background-color: #4a4a4a;
  }
`;

function calculateWinner(cells) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

const TicTacToe = ({ addNotification }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    if (addNotification) {
      addNotification(
        `Player ${isXNext ? "X" : "O"} played at cell ${index + 1}`
      );
    }
  };

  const status = winner
    ? `Winner: ${winner}`
    : board.every((cell) => cell !== null)
    ? "It's a draw!"
    : `Next player: ${isXNext ? "X" : "O"}`;

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    if (addNotification) {
      addNotification("New game started!");
    }
  };

  return (
    <GameContainer>
      <Status>{status}</Status>
      <Board>
        {board.map((cell, index) => (
          <Cell key={index} onClick={() => handleClick(index)}>
            {cell}
          </Cell>
        ))}
      </Board>
      <ButtonBar>
        <ActionButton onClick={handleRestart}>New Game</ActionButton>
      </ButtonBar>
    </GameContainer>
  );
};

export default TicTacToe;
