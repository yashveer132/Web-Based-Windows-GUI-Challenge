import React from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: clamp(70px, 10vmax, 100px);
  height: clamp(70px, 10vmax, 100px);
  cursor: pointer;
  color: var(--text-color);
  background-color: ${({ $isDragging }) =>
    $isDragging ? "var(--icon-bg)" : "transparent"};
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  user-select: none;
  touch-action: manipulation;

  &:hover {
    background-color: var(--icon-bg);
  }

  @media (orientation: portrait) and (max-width: 768px) {
    width: clamp(60px, 12vmin, 80px);
    height: clamp(60px, 12vmin, 80px);
  }

  @media (pointer: coarse) {
    min-width: 68px;
    min-height: 68px;
  }
`;

const IconLabel = styled.span`
  margin-top: 0.5rem;
  font-size: clamp(0.75rem, 1.5vmin, 1rem);
  text-align: center;
  word-wrap: break-word;
  max-width: 95%;
  line-height: 1.2;
  padding: 0 0.2rem;

  @media (orientation: portrait) and (max-width: 768px) {
    font-size: clamp(0.65rem, 2vmin, 0.85rem);
    margin-top: 0.3rem;
  }
`;

const DesktopIcon = ({ id, icon, label, left, top, onDoubleClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "icon",
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <IconWrapper
      ref={drag}
      $isDragging={isDragging}
      onDoubleClick={onDoubleClick}
      role="button"
      aria-label={`${label} application icon`}
    >
      <FontAwesomeIcon
        icon={icon}
        size={window.innerWidth <= 480 ? "2x" : "3x"}
      />
      <IconLabel>{label}</IconLabel>
    </IconWrapper>
  );
};

export default DesktopIcon;
