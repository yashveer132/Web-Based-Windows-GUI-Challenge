import React from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  cursor: pointer;
  color: var(--text-color);
  background-color: ${({ isDragging }) =>
    isDragging ? "var(--icon-bg)" : "transparent"};
  border-radius: 5px;
  transition: background-color 0.2s;
  user-select: none;

  &:hover {
    background-color: var(--icon-bg);
  }
`;

const IconLabel = styled.span`
  margin-top: 5px;
  font-size: 12px;
  text-align: center;
  word-wrap: break-word;
  max-width: 100%;
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
      isDragging={isDragging}
      onDoubleClick={onDoubleClick}
    >
      <FontAwesomeIcon icon={icon} size="2x" />
      <IconLabel>{label}</IconLabel>
    </IconWrapper>
  );
};

export default DesktopIcon;
