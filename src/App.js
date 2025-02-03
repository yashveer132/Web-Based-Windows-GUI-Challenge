/**
 * Main React application component for a WebOS-like desktop environment.
 * Combines key features like dynamic window management, desktop icons, taskbar,
 * start menu, and user login functionality into an interactive desktop interface.
 *
 * Key Features:
 * - User authentication with persistent session storage.
 * - Dynamic window management with features like open, close, minimize, maximize, and focus.
 * - Drag-and-drop functionality for desktop icons using react-dnd.
 * - File system management with encrypted storage options.
 * - Notification system for contextual feedback.
 * - Customizable themes using styled-components and context-based theming.
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GlobalStyles from "./styles/GlobalStyles";
import Desktop from "./components/Desktop/Desktop";
import Taskbar from "./components/Taskbar/Taskbar";
import StartMenu from "./components/StartMenu/StartMenu";
import Window from "./components/common/Window";
import ContextMenu from "./components/common/ContextMenu";
import NotificationCenter from "./components/common/NotificationCenter";
import { useWindows } from "./hooks/useWindows";
import { useIcons } from "./hooks/useIcons";
import { useFileSystem } from "./hooks/useFileSystem";
import { useNotifications } from "./hooks/useNotifications";
import { ThemeContextProvider, useThemeContext } from "./contexts/ThemeContext";
import { initialIcons, initialApps } from "./data/initialData";
import Login from "./components/Login/Login";
import { getStoredUser, setStoredUser } from "./utils/storage";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  @media (max-width: 600px) {
    height: 100vh;
  }
`;

export default function App() {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const handleLogin = (user) => {
    setCurrentUser(user);
    setStoredUser(user);
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setStoredUser(null);
  };
  return (
    <ThemeContextProvider>
      <InnerApp
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </ThemeContextProvider>
  );
}

function InnerApp({ currentUser, onLogin, onLogout }) {
  const { theme } = useThemeContext();
  const {
    icons,
    moveIcon,
    addIcon,
    loadIconsFromLocalStorage,
    saveIconsToLocalStorage,
  } = useIcons(initialIcons);
  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    setUser,
  } = useWindows();
  const {
    fileSystem,
    createFile,
    createFolder,
    deleteItem,
    renameItem,
    loadFileSystemFromLocalStorage,
    isEncrypted,
    locked,
    unlockFileSystem,
    enableEncryption,
    disableEncryption,
  } = useFileSystem();
  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    loadIconsFromLocalStorage();
    loadFileSystemFromLocalStorage();
  }, [loadIconsFromLocalStorage, loadFileSystemFromLocalStorage]);

  useEffect(() => {
    saveIconsToLocalStorage(icons);
  }, [icons, saveIconsToLocalStorage]);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser.name);
    } else {
      setUser(null);
    }
  }, [currentUser, setUser]);

  const handleStartClick = useCallback(() => {
    setIsStartMenuOpen((prev) => !prev);
  }, []);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      const sortBySubMenu = [
        {
          label: "Name",
          icon: "🔤",
          onClick: () => addNotification("Sorted by Name"),
        },
        {
          label: "Size",
          icon: "📏",
          onClick: () => addNotification("Sorted by Size"),
        },
        {
          label: "Item type",
          icon: "📁",
          onClick: () => addNotification("Sorted by Type"),
        },
        {
          label: "Date modified",
          icon: "📅",
          onClick: () => addNotification("Sorted by Date"),
        },
      ];

      const menuItems = [
        {
          label: "View",
          icon: "👁️",
          subMenu: [
            {
              label: "Large icons",
              onClick: () => addNotification("View: Large icons"),
            },
            {
              label: "Medium icons",
              onClick: () => addNotification("View: Medium icons"),
            },
            {
              label: "Small icons",
              onClick: () => addNotification("View: Small icons"),
            },
            { type: "separator" },
            {
              label: "Auto arrange icons",
              onClick: () => addNotification("Auto arrange icons"),
            },
            {
              label: "Align icons to grid",
              onClick: () => addNotification("Align icons to grid"),
            },
          ],
        },
        { label: "Sort by", icon: "🔃", subMenu: sortBySubMenu },
        {
          label: "Refresh",
          icon: "🔄",
          onClick: () => {
            loadIconsFromLocalStorage();
            addNotification("Desktop refreshed.");
          },
        },
        { type: "separator" },
        { label: "Display settings", icon: "🖥️" },
        {
          label: "Personalize",
          icon: "🎨",
          onClick: () => openWindow("Personalization"),
        },
      ];

      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: menuItems,
      });
    },
    [
      addNotification,
      loadIconsFromLocalStorage,
      openWindow,
      createFolder,
      createFile,
    ]
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const memoizedApps = useMemo(() => {
    return Object.entries(initialApps).map(([id, app]) => ({
      ...app,
      id,
      onClick: () => openWindow(id),
    }));
  }, [openWindow]);

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Login onLogin={onLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DndProvider backend={HTML5Backend}>
        <AppContainer
          onContextMenu={handleContextMenu}
          onClick={handleCloseContextMenu}
        >
          <Desktop icons={icons} moveIcon={moveIcon} openWindow={openWindow} />
          {windows.map((win) => (
            <Window
              key={win.id}
              {...win}
              isActive={win.id === activeWindowId}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => maximizeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
            >
              {React.cloneElement(initialApps[win.appId].component, {
                fileSystem,
                createFile,
                createFolder,
                deleteItem,
                renameItem,
                addNotification,
                isEncrypted,
                locked,
                unlockFileSystem,
                enableEncryption,
                disableEncryption,
                currentUser,
              })}
            </Window>
          ))}
          <StartMenu
            isOpen={isStartMenuOpen}
            onClose={() => setIsStartMenuOpen(false)}
            apps={memoizedApps}
            onLogout={onLogout}
            currentUser={currentUser}
          />
          <Taskbar
            onStartClick={handleStartClick}
            windows={windows}
            activeWindowId={activeWindowId}
            onWindowClick={focusWindow}
            closeWindow={closeWindow}
            minimizeWindow={minimizeWindow}
          />
          <NotificationCenter
            notifications={notifications}
            removeNotification={removeNotification}
          />
          {contextMenu && (
            <ContextMenu {...contextMenu} onClose={handleCloseContextMenu} />
          )}
        </AppContainer>
      </DndProvider>
    </ThemeProvider>
  );
}
