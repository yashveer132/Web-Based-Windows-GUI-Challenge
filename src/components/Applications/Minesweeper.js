import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  font-family: "Arial, sans-serif";
  @media (max-width: 768px) {
    padding: 18px;
  }
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #f0a500;
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.size}, 40px);
  gap: 5px;
  margin: 20px 0;
  @media (max-width: 768px) {
    grid-template-columns: repeat(${(props) => props.size}, 35px);
    gap: 4px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(${(props) => props.size}, 30px);
    gap: 3px;
  }
`;

const Cell = styled.button`
  width: 40px;
  height: 40px;
  background-color: #333;
  border: 2px solid #555;
  color: white;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #4a4a4a;
  }
  &:disabled {
    background-color: ${(props) => (props.isMine ? "#d9534f" : "#5cb85c")};
    color: white;
    font-weight: bold;
  }
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
`;

const ButtonBar = styled.div`
  margin-top: 20px;
  @media (max-width: 768px) {
    margin-top: 18px;
  }
  @media (max-width: 480px) {
    margin-top: 15px;
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #f0a500;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #d48900;
  }
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const createBoard = (size, numMines) => {
  let board = Array(size * size).fill({ isMine: false, revealed: false });
  let minePositions = new Set();
  while (minePositions.size < numMines) {
    minePositions.add(Math.floor(Math.random() * (size * size)));
  }
  board = board.map((cell, index) => ({
    ...cell,
    isMine: minePositions.has(index),
  }));
  return board;
};

const Minesweeper = ({ addNotification }) => {
  const size = 5;
  const numMines = 5;
  const [board, setBoard] = useState(createBoard(size, numMines));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver && addNotification) {
      addNotification("Game Over! You hit a mine.");
    }
  }, [gameOver, addNotification]);

  const handleCellClick = (index) => {
    if (gameOver || board[index].revealed) return;
    if (board[index].isMine) {
      setGameOver(true);
    } else {
      revealCell(index);
    }
  };

  const revealCell = (index) => {
    const updatedBoard = board.map((cell, i) =>
      i === index ? { ...cell, revealed: true } : cell
    );
    setBoard(updatedBoard);
  };

  const handleRestart = () => {
    setBoard(createBoard(size, numMines));
    setGameOver(false);
    if (addNotification) {
      addNotification("New game started!");
    }
  };

  return (
    <Container>
      <Title>Minesweeper</Title>
      <Grid size={size}>
        {board.map((cell, index) => (
          <Cell
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={cell.revealed || gameOver}
            isMine={cell.isMine}
          >
            {cell.revealed && (cell.isMine ? "💣" : "✔")}
          </Cell>
        ))}
      </Grid>
      <ButtonBar>
        <ActionButton onClick={handleRestart}>New Game</ActionButton>
      </ButtonBar>
    </Container>
  );
};

export default Minesweeper;
