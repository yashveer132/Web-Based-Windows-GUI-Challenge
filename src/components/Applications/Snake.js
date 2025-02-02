import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  font-family: "Arial, sans-serif";
  justify-content: center;
  margin-bottom: 10px;
  margin-top: -60px;
  @media (max-width: 1024px) {
    padding: 18px;
    margin-top: -40px;
  }
  @media (max-width: 768px) {
    padding: 15px;
    margin-top: -20px;
  }
  @media (max-width: 480px) {
    padding: 10px;
    margin-top: -10px;
  }
`;

const Canvas = styled.canvas`
  background-color: #333;
  border: 2px solid #555;
  margin-top: 20px;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: 400px;
  height: 400px;
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
  @media (max-width: 480px) {
    width: 250px;
    height: 250px;
  }
`;

const Info = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 18px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const HighScore = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #f0a500;
  @media (max-width: 768px) {
    font-size: 14px;
  }
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #222;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
  animation: ${fadeIn} 0.5s ease;
  text-align: center;
  width: 300px;
  max-width: 80%;
  @media (max-width: 768px) {
    width: 90%;
    padding: 20px;
  }
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const ModalTitle = styled.h2`
  color: white;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ModalContent = styled.div`
  margin-bottom: 20px;
  font-size: 18px;
  color: white;
  @media (max-width: 768px) {
    font-size: 16px;
  }
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #f0a500;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #d48900;
  }
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const Snake = ({ addNotification }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("highScore")) || 0
  );
  const [showModal, setShowModal] = useState(false);
  const [gameOverTriggered, setGameOverTriggered] = useState(false);
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState({ x: 15, y: 10 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    let gameInterval = setInterval(gameLoop, 150);
    return () => clearInterval(gameInterval);
  });

  function gameLoop() {
    if (!context || gameOverTriggered) return;
    context.fillStyle = "#333";
    context.fillRect(0, 0, 400, 400);
    context.fillStyle = "red";
    context.fillRect(food.x * 20, food.y * 20, 20, 20);

    let head = { ...snake[0] };
    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }

    if (
      head.x < 0 ||
      head.x >= 20 ||
      head.y < 0 ||
      head.y >= 20 ||
      snake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      handleGameOver();
      return;
    }

    let newSnake = [{ ...head }, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood({
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    context.fillStyle = "lime";
    newSnake.forEach((seg) => {
      context.fillRect(seg.x * 20, seg.y * 20, 20, 20);
    });
  }

  function handleGameOver() {
    if (gameOverTriggered) return;
    setGameOverTriggered(true);
    if (addNotification) addNotification("Game Over. Final Score: " + score);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
    setShowModal(true);
  }

  function restartGame() {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setDirection("RIGHT");
    setScore(0);
    setFood({ x: 15, y: 10 });
    setShowModal(false);
    setGameOverTriggered(false);
  }

  return (
    <GameContainer>
      <Info>Score: {score}</Info>
      <HighScore>High Score: {highScore}</HighScore>
      <Canvas ref={canvasRef} width="400" height="400" />
      <Info>Use Arrow Keys to move the snake</Info>
      {showModal && (
        <Modal>
          <ModalTitle>Game Over</ModalTitle>
          <ModalContent>
            <p>Final Score: {score}</p>
            <p>High Score: {highScore}</p>
          </ModalContent>
          <ModalButton onClick={restartGame}>Restart</ModalButton>
        </Modal>
      )}
    </GameContainer>
  );
};

export default Snake;
