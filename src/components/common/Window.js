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

const StyledRnd = styled(Rnd)`
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) =>
    props.isActive ? "0 0 10px rgba(0,0,0,0.5)" : "none"};
  overflow: hidden;

  /* Responsive constraints */
  @media (max-width: 600px) {
    min-width: 200px !important;
    min-height: 150px !important;
  }
`;

const TitleBar = styled.div`
  background-color: ${(props) =>
    props.isActive
      ? "var(--window-title-active)"
      : "var(--window-title-inactive)"};
  color: #fff;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
`;

const Title = styled.span`
  font-weight: 600;
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
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  background-color: var(--window-bg);
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
  x,
  y,
  width,
  height,
}) => {
  const [maximized, setMaximized] = useState(isMaximized);

  const handleMaximize = () => {
    setMaximized(!maximized);
    onMaximize(id);
  };

  if (isMinimized) {
    return null;
  }

  return (
    <StyledRnd
  default={{
    x,
    y,
    width,
    height,
  }}
  minWidth={300}
  minHeight={200}
  bounds="window"  // Allow spanning the full viewport
  onMouseDown={onFocus}
  isActive={isActive}
  enableResizing={!maximized}
  disableDragging={maximized}
  size={
    maximized ? { width: "100vw", height: "100vh" } : undefined
  }
  position={maximized ? { x: 0, y: 0 } : undefined}
  style={{ zIndex: isActive ? 999 : 998 }}
>

      <TitleBar isActive={isActive}>
        <Title>{title}</Title>
        <ButtonGroup>
          <WindowButton onClick={() => onMinimize(id)}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </WindowButton>
          <WindowButton onClick={handleMaximize}>
            <FontAwesomeIcon
              icon={maximized ? faWindowRestore : faWindowMaximize}
            />
          </WindowButton>
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
