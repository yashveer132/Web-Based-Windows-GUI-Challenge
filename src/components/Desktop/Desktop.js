import React from "react";
import styled from "styled-components";
import { useDrop } from "react-dnd";
import DesktopIcon from "./DesktopIcon";

const DesktopContainer = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  position: relative;
  overflow: auto;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  @media (max-width: 600px) {
    height: calc(100% - 32px);
    gap: 5px;
    padding: 5px;
  }
`;

const Desktop = ({ icons, moveIcon, openWindow }) => {
  const [, drop] = useDrop({
    accept: "icon",
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveIcon(item.id, left, top);
      return undefined;
    },
  });
  return (
    <DesktopContainer ref={drop}>
      {icons.map((icon) => (
        <div
          key={icon.id}
          style={{ position: "relative", left: icon.left, top: icon.top }}
        >
          <DesktopIcon {...icon} onDoubleClick={() => openWindow(icon.appId)} />
        </div>
      ))}
    </DesktopContainer>
  );
};

export default Desktop;
