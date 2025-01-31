import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--window-bg);
  color: var(--text-color);
  padding: 10px;
`;

const Canvas = styled.canvas`
  background-color: #222;
  margin: 0 auto;
  display: block;
`;

const Info = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const Snake = ({ addNotification }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [score, setScore] = useState(0);

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
    if (!context) return;

    context.fillStyle = "#222";
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
      if (addNotification) addNotification("Game Over. Final Score: " + score);
      setSnake([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ]);
      setDirection("RIGHT");
      setScore(0);
      setFood({ x: 15, y: 10 });
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

  return (
    <GameContainer>
      <Info>Score: {score}</Info>
      <Canvas ref={canvasRef} width="400" height="400" />
      <Info>Use Arrow Keys to move the snake</Info>
    </GameContainer>
  );
};

export default Snake;
