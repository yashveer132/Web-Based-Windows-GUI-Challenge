import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faVolumeUp,
  faBatteryFull,
} from "@fortawesome/free-solid-svg-icons";
import { faWindows } from "@fortawesome/free-brands-svg-icons";

const TaskbarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: var(--taskbar-bg);
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 -1px 0 rgba(0, 0, 0, 0.5);
`;

const StartButton = styled.button`
  background-color: var(--taskbar-button-bg);
  border: outset 2px var(--button-border);
  padding: 2px 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:active {
    border-style: inset;
  }
`;

const TaskbarItems = styled.div`
  display: flex;
  margin-left: 10px;
  flex: 1;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TaskbarItem = styled.button`
  background-color: ${(props) =>
    props.isActive
      ? "var(--taskbar-button-active)"
      : "var(--taskbar-button-bg)"};
  border: ${(props) =>
    props.isActive
      ? "inset 2px var(--button-border)"
      : "outset 2px var(--button-border)"};
  padding: 2px 10px;
  margin-right: 5px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  flex-shrink: 0;
`;

const SystemTray = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const TrayIcon = styled.div`
  margin-left: 10px;
  font-size: 14px;
`;

const Clock = styled.div`
  margin-left: 10px;
  font-size: 12px;
`;

const Taskbar = ({ onStartClick, windows, activeWindowId, onWindowClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TaskbarContainer>
      <StartButton onClick={onStartClick}>
        <FontAwesomeIcon icon={faWindows} style={{ marginRight: "5px" }} />
        Start
      </StartButton>
      <TaskbarItems>
        {windows.map((window) => (
          <TaskbarItem
            key={window.id}
            isActive={window.id === activeWindowId}
            onClick={() => onWindowClick(window.id)}
          >
            {window.title}
          </TaskbarItem>
        ))}
      </TaskbarItems>
      <SystemTray>
        <TrayIcon>
          <FontAwesomeIcon icon={faWifi} />
        </TrayIcon>
        <TrayIcon>
          <FontAwesomeIcon icon={faVolumeUp} />
        </TrayIcon>
        <TrayIcon>
          <FontAwesomeIcon icon={faBatteryFull} />
        </TrayIcon>
        <Clock>{time.toLocaleTimeString()}</Clock>
      </SystemTray>
    </TaskbarContainer>
  );
};

export default Taskbar;
