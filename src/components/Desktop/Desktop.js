import React from "react";
import styled from "styled-components";
import { useDrop } from "react-dnd";
import DesktopIcon from "./DesktopIcon";

const DesktopContainer = styled.div`
  width: 100%;
  height: calc(100vh - 4rem);
  position: relative;
  overflow: auto;
  padding: 1vw;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  gap: 1.5vmin;
  touch-action: manipulation;

  @media (max-width: 1200px) {
    gap: 1.2vmin;
    padding: 0.8vw;
  }

  @media (max-width: 768px) {
    height: calc(100vh - 3.5rem);
    gap: 1vmin;
    padding: 0.5vw;
  }

  @media (max-width: 480px) {
    height: calc(100vh - 3rem);
    gap: 0.8vmin;
    padding: 0.3vw;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
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
          style={{
            position: "relative",
            left: icon.left,
            top: icon.top,
            touchAction: "none",
          }}
        >
          <DesktopIcon {...icon} onDoubleClick={() => openWindow(icon.appId)} />
        </div>
      ))}
    </DesktopContainer>
  );
};

export default Desktop;
