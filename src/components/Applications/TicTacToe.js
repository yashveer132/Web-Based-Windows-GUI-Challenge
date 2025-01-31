import React, { useState } from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 20px;
  color: white;
  background-color: #1e1e1e;
  font-family: "Arial, sans-serif";
  justify-content: center;
`;

const Status = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #f0a500;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 8px;
  margin: auto;

  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 70px);
    grid-template-rows: repeat(3, 70px);
  }
`;

const Cell = styled.button`
  width: 100px;
  height: 100px;
  font-size: 2.5rem;
  background-color: #333;
  border: 2px solid #555;
  color: #f0f0f0;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4a4a4a;
  }

  &:active {
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #f0a500;
  color: white;
  border: none;
  cursor: pointer;
   margin: 0 10px 30px;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d48900;
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
