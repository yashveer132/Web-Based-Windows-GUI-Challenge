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

const WindowContainer = styled(Rnd)`
  background-color: var(--window-bg);
  border: outset 2px var(--window-border);
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) =>
    props.isActive ? "0 0 10px rgba(0,0,0,0.3)" : "none"};
`;

const TitleBar = styled.div`
  background-color: ${(props) =>
    props.isActive
      ? "var(--window-title-active)"
      : "var(--window-title-inactive)"};
  color: var(--text-color-light);
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
`;

const Title = styled.span`
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const WindowButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color-light);
  margin-left: 5px;
  cursor: pointer;
  font-size: 14px;
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
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
  zIndex,
  x,
  y,
  width,
  height,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize();
  };

  return (
    <WindowContainer
      default={{
        x,
        y,
        width,
        height,
      }}
      minWidth={200}
      minHeight={150}
      bounds="parent"
      onMouseDown={onFocus}
      isActive={isActive}
      style={{ zIndex }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      size={isMaximized ? { width: "100%", height: "100%" } : undefined}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
    >
      <TitleBar isActive={isActive}>
        <Title>{title}</Title>
        <ButtonGroup>
          <WindowButton onClick={onMinimize}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </WindowButton>
          <WindowButton onClick={handleMaximize}>
            <FontAwesomeIcon
              icon={isMaximized ? faWindowRestore : faWindowMaximize}
            />
          </WindowButton>
          <WindowButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </WindowButton>
        </ButtonGroup>
      </TitleBar>
      <Content>{children}</Content>
    </WindowContainer>
  );
};

export default Window;
