/**
 * Implements a dynamic taskbar that includes a start button, open windows list, system tray icons, and a real-time clock.
 * The taskbar provides functionality for toggling windows, and dynamically updating the current time.
 * It supports responsive design, interactive tooltips, and smooth user interactions.
 */

import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faVolumeUp,
  faVolumeMute,
  faBatteryFull,
  faBatteryThreeQuarters,
  faBatteryHalf,
  faBatteryQuarter,
  faBell,
  faPlane,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faWindows, faBluetoothB } from "@fortawesome/free-brands-svg-icons";

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

const PopupMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2a2a3d;
  border-radius: 0.4rem;
  padding: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 200px;
`;

const PopupMenuItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #4a4a5e;
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  padding: 2px 5px;
  font-size: 0.7rem;
`;

const Taskbar = ({
  onStartClick,
  windows,
  activeWindowId,
  onWindowClick,
  minimizeWindow,
}) => {
  const [time, setTime] = useState(new Date());
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [volume, setVolume] = useState(50);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [connectedBluetoothDevice, setConnectedBluetoothDevice] =
    useState(null);
  const [isAirplaneModeOn, setIsAirplaneModeOn] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [notificationCount, setNotificationCount] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel((prevLevel) => Math.max(0, prevLevel - 1));
    }, 60000);
    return () => clearInterval(batteryTimer);
  }, []);

  const toggleWindow = (windowId) => {
    activeWindowId === windowId
      ? minimizeWindow(windowId)
      : onWindowClick(windowId);
  };

  const handlePopupToggle = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return faBatteryFull;
    if (batteryLevel > 50) return faBatteryThreeQuarters;
    if (batteryLevel > 25) return faBatteryHalf;
    return faBatteryQuarter;
  };

  const connectBluetoothDevice = (deviceName) => {
    setConnectedBluetoothDevice(deviceName);
    setActivePopup(null);
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
        <TrayIcon
          data-tooltip={isWifiOn ? "Wi-Fi Connected" : "Wi-Fi Off"}
          onClick={() => handlePopupToggle("wifi")}
        >
          <FontAwesomeIcon
            icon={faWifi}
            style={{ opacity: isWifiOn ? 1 : 0.5 }}
          />
          {activePopup === "wifi" && (
            <PopupMenu>
              <PopupMenuItem onClick={() => setIsWifiOn(!isWifiOn)}>
                {isWifiOn ? "Turn Off Wi-Fi" : "Turn On Wi-Fi"}
              </PopupMenuItem>
              {isWifiOn && (
                <>
                  <PopupMenuItem>Network 1</PopupMenuItem>
                  <PopupMenuItem>Network 2</PopupMenuItem>
                  <PopupMenuItem>Network 3</PopupMenuItem>
                </>
              )}
            </PopupMenu>
          )}
        </TrayIcon>
        <TrayIcon
          data-tooltip={`Volume: ${volume}%`}
          onClick={() => handlePopupToggle("volume")}
        >
          <FontAwesomeIcon icon={volume === 0 ? faVolumeMute : faVolumeUp} />
          {activePopup === "volume" && (
            <PopupMenu>
              <Slider
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </PopupMenu>
          )}
        </TrayIcon>
        <TrayIcon data-tooltip={`Battery: ${batteryLevel}%`}>
          <FontAwesomeIcon icon={getBatteryIcon()} />
        </TrayIcon>
        <TrayIcon
          data-tooltip={
            isBluetoothOn
              ? connectedBluetoothDevice
                ? `Connected to ${connectedBluetoothDevice}`
                : "Bluetooth On"
              : "Bluetooth Off"
          }
          onClick={() => handlePopupToggle("bluetooth")}
        >
          <FontAwesomeIcon
            icon={faBluetoothB}
            style={{ opacity: isBluetoothOn ? 1 : 0.5 }}
          />
          {activePopup === "bluetooth" && (
            <PopupMenu>
              <PopupMenuItem onClick={() => setIsBluetoothOn(!isBluetoothOn)}>
                {isBluetoothOn ? "Turn Off Bluetooth" : "Turn On Bluetooth"}
              </PopupMenuItem>
              {isBluetoothOn && (
                <>
                  <PopupMenuItem
                    onClick={() => connectBluetoothDevice("Device 1")}
                  >
                    Device 1
                    {connectedBluetoothDevice === "Device 1" && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </PopupMenuItem>
                  <PopupMenuItem
                    onClick={() => connectBluetoothDevice("Device 2")}
                  >
                    Device 2
                    {connectedBluetoothDevice === "Device 2" && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </PopupMenuItem>
                  <PopupMenuItem
                    onClick={() => connectBluetoothDevice("Device 3")}
                  >
                    Device 3
                    {connectedBluetoothDevice === "Device 3" && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </PopupMenuItem>
                </>
              )}
            </PopupMenu>
          )}
        </TrayIcon>
        <TrayIcon
          data-tooltip={
            isAirplaneModeOn ? "Airplane Mode On" : "Airplane Mode Off"
          }
          onClick={() => {
            setIsAirplaneModeOn(!isAirplaneModeOn);
            if (!isAirplaneModeOn) {
              setIsWifiOn(false);
              setIsBluetoothOn(false);
              setConnectedBluetoothDevice(null);
            }
          }}
        >
          <FontAwesomeIcon
            icon={faPlane}
            style={{ opacity: isAirplaneModeOn ? 1 : 0.5 }}
          />
        </TrayIcon>
        <TrayIcon
          data-tooltip={`${notificationCount} Notifications`}
          onClick={() => handlePopupToggle("notifications")}
        >
          <FontAwesomeIcon icon={faBell} />
          {notificationCount > 0 && (
            <NotificationBadge>{notificationCount}</NotificationBadge>
          )}
          {activePopup === "notifications" && (
            <PopupMenu>
              <PopupMenuItem>New email from John</PopupMenuItem>
              <PopupMenuItem>System update available</PopupMenuItem>
              <PopupMenuItem onClick={() => setNotificationCount(0)}>
                Clear all notifications
              </PopupMenuItem>
            </PopupMenu>
          )}
        </TrayIcon>
        <Clock>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Clock>
      </SystemTray>
    </TaskbarContainer>
  );
};

export default Taskbar;
