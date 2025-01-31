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

  /* Responsive adjustment */
  @media (max-width: 600px) {
    height: 32px;
  }
`;

const StartButton = styled.button`
  background-color: var(--taskbar-button-bg);
  border: none;
  padding: 8px 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-color);

  &:hover {
    background-color: var(--taskbar-button-active);
  }

  &:active {
    opacity: 0.7;
  }

  @media (max-width: 600px) {
    padding: 5px 8px;
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
  background-color: ${(props) => {
    if (props.isMinimized) return "#555";
    return props.isActive
      ? "var(--window-title-active)"
      : "var(--taskbar-button-bg)";
  }};
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  flex-shrink: 0;
  color: #fff;

  &:hover {
    background-color: var(--taskbar-button-active);
  }

  @media (max-width: 600px) {
    padding: 3px 6px;
    max-width: 100px;
  }
`;

const SystemTray = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const TrayIcon = styled.div`
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-color);

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    margin-left: 5px;
  }
`;

const Clock = styled.div`
  margin-left: 10px;
  font-size: 12px;
  color: var(--text-color);

  @media (max-width: 600px) {
    margin-left: 5px;
    font-size: 10px;
  }
`;

const Taskbar = ({ onStartClick, windows, activeWindowId, onWindowClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TaskbarContainer className="taskbar-container">
      <StartButton onClick={onStartClick}>
        <FontAwesomeIcon icon={faWindows} style={{ marginRight: "5px" }} />
        Start
      </StartButton>

      <TaskbarItems>
        {windows.map((window) => (
          <TaskbarItem
            key={window.id}
            isActive={window.id === activeWindowId}
            isMinimized={window.isMinimized}
            onClick={() => onWindowClick(window.id)}
          >
            {window.title}
          </TaskbarItem>
        ))}
      </TaskbarItems>

      <SystemTray>
        <TrayIcon title="Network Status">
          <FontAwesomeIcon icon={faWifi} />
        </TrayIcon>

        <TrayIcon title="Volume">
          <FontAwesomeIcon icon={faVolumeUp} />
        </TrayIcon>

        <TrayIcon title="Battery">
          <FontAwesomeIcon icon={faBatteryFull} />
        </TrayIcon>
        <Clock>{time.toLocaleTimeString()}</Clock>
      </SystemTray>
    </TaskbarContainer>
  );
};

export default Taskbar;
