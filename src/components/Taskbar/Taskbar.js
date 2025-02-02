import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faVolumeUp,
  faBatteryFull,
  faBell,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faWindows } from "@fortawesome/free-brands-svg-icons";
import { faBluetoothB } from "@fortawesome/free-brands-svg-icons";

const TaskbarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: clamp(3.5rem, 6vh, 4rem);
  background-color: #1e1e2f;
  display: flex;
  align-items: center;
  padding: 0 1vw;
  gap: 0.5vw;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
  touch-action: manipulation;
`;

const StartButton = styled.button`
  background-color: #2a2a3d;
  border: none;
  padding: clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 2vw, 1.5rem);
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: clamp(1rem, 1.5vmin, 1.2rem);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  gap: 0.5vw;

  &:hover {
    background-color: #4a4a5e;
  }

  @media (orientation: portrait) {
    padding: 0.5rem 1rem;
  }
`;

const TaskbarItems = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  gap: 0.5vmin;
  scrollbar-width: none;
  -ms-overflow-style: none;

  @media (max-width: 768px) {
    display: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TaskbarItem = styled.div`
  position: relative;
  background-color: ${(props) => (props.isActive ? "#4a4a5e" : "#2a2a3d")};
  padding: clamp(0.3rem, 1vh, 0.5rem) clamp(0.6rem, 1vw, 1rem);
  border-radius: 0.4rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5vw;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: clamp(0.8rem, 1.5vmin, 1rem);
  min-width: max-content;

  &:hover {
    background-color: #5a5a6e;
  }
`;

const SystemTray = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: clamp(0.3rem, 1vw, 1rem);
`;

const TrayIcon = styled.div`
  color: white;
  cursor: pointer;
  transition: opacity 0.2s ease;
  font-size: clamp(1rem, 1.8vmin, 1.2rem);
  position: relative;
  padding: 0.3rem;
  min-width: 1.8em;
  text-align: center;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    font-size: clamp(0.7rem, 1.5vmin, 0.9rem);
    white-space: nowrap;
    pointer-events: none;
  }

  @media (pointer: coarse) {
    &:hover::after {
      display: none;
    }
  }
`;

const Clock = styled.div`
  font-size: clamp(0.8rem, 1.8vmin, 1rem);
  color: white;
  background-color: #2a2a3d;
  padding: clamp(0.3rem, 1vh, 0.5rem) clamp(0.6rem, 1vw, 1rem);
  border-radius: 0.4rem;
  min-width: max-content;
`;

const Taskbar = ({
  onStartClick,
  windows,
  activeWindowId,
  onWindowClick,
  minimizeWindow,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (windowId) => {
    activeWindowId === windowId
      ? minimizeWindow(windowId)
      : onWindowClick(windowId);
  };

  return (
    <TaskbarContainer>
      <StartButton onClick={onStartClick}>
        <FontAwesomeIcon icon={faWindows} />
        <span>Start</span>
      </StartButton>
      <TaskbarItems>
        {windows.map((window) => (
          <TaskbarItem
            key={window.id}
            isActive={window.id === activeWindowId}
            onClick={() => toggleWindow(window.id)}
          >
            {window.title}
          </TaskbarItem>
        ))}
      </TaskbarItems>
      <SystemTray>
        <TrayIcon data-tooltip="Wi-Fi Connected">
          <FontAwesomeIcon icon={faWifi} />
        </TrayIcon>
        <TrayIcon data-tooltip="Volume: Medium">
          <FontAwesomeIcon icon={faVolumeUp} />
        </TrayIcon>
        <TrayIcon data-tooltip="Battery Fully Charged">
          <FontAwesomeIcon icon={faBatteryFull} />
        </TrayIcon>
        <TrayIcon data-tooltip="Bluetooth Enabled">
          <FontAwesomeIcon icon={faBluetoothB} />
        </TrayIcon>
        <TrayIcon data-tooltip="Airplane Mode Off">
          <FontAwesomeIcon icon={faPlane} />
        </TrayIcon>
        <TrayIcon data-tooltip="2 Notifications">
          <FontAwesomeIcon icon={faBell} />
        </TrayIcon>
        <Clock>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Clock>
      </SystemTray>
    </TaskbarContainer>
  );
};

export default Taskbar;
