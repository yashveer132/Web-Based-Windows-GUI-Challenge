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
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: "Sort By" },
          { label: "Name", onClick: () => addNotification("Sorted by Name") },
          { label: "Size", onClick: () => addNotification("Sorted by Size") },
          { label: "Type", onClick: () => addNotification("Sorted by Type") },
          {
            label: "Date Modified",
            onClick: () => addNotification("Sorted by Date"),
          },
          { type: "separator" },
          {
            label: "Refresh",
            onClick: () => {
              loadIconsFromLocalStorage();
              addNotification("Desktop refreshed.");
            },
          },
          { type: "separator" },
          {
            label: "Personalize",
            onClick: () => openWindow("Personalization"),
          },
        ],
      });
    },
    [addNotification, loadIconsFromLocalStorage, openWindow]
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
