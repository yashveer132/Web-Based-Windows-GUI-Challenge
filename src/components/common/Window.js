/**
 * Implements a draggable and resizable window component using `react-rnd` with support for window operations
 * like minimize, maximize, restore, and close. The component adjusts dynamically for small screens and provides
 * customizable initial dimensions and positioning. The window actively handles user interactions and maintains
 * an active/inactive state with visual cues.
 */

import React, { useState } from "react";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faWindowMinimize,
  faWindowMaximize,
  faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";

const isSmallScreen = () => window.innerWidth <= 600;

const StyledRnd = styled(Rnd)`
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) =>
    props.$isActive ? "0 0 10px rgba(0,0,0,0.5)" : "none"};
  overflow: hidden;
  width: 100%;
  height: 100%;

  ${({ $isMaximized }) =>
    $isMaximized &&
    `
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
  `}
`;

const TitleBar = styled.div`
  background-color: ${(props) =>
    props.$isActive
      ? "var(--window-title-active)"
      : "var(--window-title-inactive)"};
  color: #fff;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  @media (max-width: 600px) {
    padding: 3px;
  }
`;

const Title = styled.span`
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const WindowButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  padding: 0 6px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:active {
    opacity: 0.7;
  }
  @media (max-width: 768px) {
    padding: 0 4px;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  background-color: var(--window-bg);
  padding: 10px;
  @media (max-width: 768px) {
    padding: 8px;
  }
  @media (max-width: 480px) {
    padding: 5px;
  }
`;

const Window = ({
  id,
  title,
  children,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  isMaximized,
  isMinimized,
  initialX,
  initialY,
  width,
  height,
}) => {
  const [position, setPosition] = useState({
    x: initialX || (window.innerWidth > 768 ? 40 : 0),
    y: initialY || (window.innerWidth > 768 ? 30 : 0),
  });

  const handleMaximizeToggle = () => {
    onMaximize(id);
  };

  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  if (isMinimized) {
    return null;
  }

  return (
    <StyledRnd
      default={{
        x: position.x,
        y: position.y,
        width: width || (window.innerWidth > 768 ? 600 : "95%"),
        height: height || (window.innerWidth > 768 ? 400 : "80%"),
      }}
      minWidth={300}
      minHeight={200}
      bounds="window"
      onMouseDown={onFocus}
      $isActive={isActive}
      $isMaximized={isMaximized}
      enableResizing={!isMaximized}
      disableDragging={isMaximized}
      size={
        isMaximized ? { width: "100vw", height: "100vh" } : { width, height }
      }
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDragStop={handleDragStop}
      style={{ zIndex: isActive ? 999 : 998 }}
    >
      <TitleBar $isActive={isActive}>
        <Title>{title}</Title>
        <ButtonGroup>
          <WindowButton onClick={() => onMinimize(id)}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </WindowButton>

          {!isSmallScreen() && (
            <WindowButton onClick={handleMaximizeToggle}>
              <FontAwesomeIcon
                icon={isMaximized ? faWindowRestore : faWindowMaximize}
              />
            </WindowButton>
          )}

          <WindowButton onClick={() => onClose(id)}>
            <FontAwesomeIcon icon={faTimes} />
          </WindowButton>
        </ButtonGroup>
      </TitleBar>
      <Content>{children}</Content>
    </StyledRnd>
  );
};

export default Window;
