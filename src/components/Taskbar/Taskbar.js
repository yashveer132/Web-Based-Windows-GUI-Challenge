import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faVolumeUp,
  faBatteryFull,
  faBell,
  faLock,
  faPlane,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { faWindows } from "@fortawesome/free-brands-svg-icons";
import { faBluetoothB } from "@fortawesome/free-brands-svg-icons";

const TaskbarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55px;
  background-color: #1e1e2f;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
`;

const StartButton = styled.button`
  background-color: #2a2a3d;
  border: none;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4a4a5e;
  }

  @media (max-width: 600px) {
    padding: 10px 15px;
  }
`;

const TaskbarItems = styled.div`
  display: flex;
  margin-left: 10px;
  flex: 1;
  overflow-x: auto;
  gap: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TaskbarItem = styled.div`
  position: relative;
  background-color: ${(props) => (props.isActive ? "#4a4a5e" : "#2a2a3d")};
  padding: 8px 12px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #5a5a6e;
  }
`;

const SystemTray = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const TrayIcon = styled.div`
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
  color: white;
  transition: opacity 0.3s ease;
  position: relative;

  &:hover {
    opacity: 0.8;
  }

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 30px;
    left: -10px;
    background-color: #333;
    color: white;
    padding: 5px 8px;
    border-radius: 5px;
    font-size: 0.85rem;
    display: none;
    white-space: nowrap;
  }

  &:hover::after {
    display: block;
  }

  @media (max-width: 600px) {
    margin-left: 5px;
  }
`;

const Clock = styled.div`
  margin-left: 10px;
  font-size: 14px;
  color: white;
  background-color: #2a2a3d;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const Taskbar = ({
  onStartClick,
  windows,
  activeWindowId,
  onWindowClick,
  closeWindow,
}) => {
  const [time, setTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const networkSimulation = setInterval(() => {
      setIsConnected((prevState) => !prevState);
    }, 5000);

    return () => clearInterval(networkSimulation);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (windowId) => {
    if (activeWindowId === windowId) {
      closeWindow(windowId);
    } else {
      onWindowClick(windowId);
    }
  };

  return (
    <TaskbarContainer>
      <StartButton onClick={onStartClick}>
        <FontAwesomeIcon icon={faWindows} style={{ marginRight: "10px" }} />
        Start
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
