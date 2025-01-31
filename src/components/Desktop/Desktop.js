import React from "react";
import styled from "styled-components";
import { useDrop } from "react-dnd";
import DesktopIcon from "./DesktopIcon";

const DesktopContainer = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  grid-auto-rows: 100px;
  gap: 10px;
  padding: 10px;
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
        <DesktopIcon
          key={icon.id}
          {...icon}
          onDoubleClick={() => openWindow(icon.appId)}
        />
      ))}
    </DesktopContainer>
  );
};

export default Desktop;
