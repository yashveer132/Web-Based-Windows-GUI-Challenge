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

  @media (max-width: 768px) {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    padding: 2vw;
    gap: 4vmin;
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