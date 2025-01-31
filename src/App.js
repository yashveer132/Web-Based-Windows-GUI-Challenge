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
          { label: "View" },
          {
            label: "Large Icons",
            // onClick: () => changeIconSize("large"),
          },
          {
            label: "Small Icons",
            // onClick: () => changeIconSize("small"),
          },
          {
            label: "Grid Layout",
            // onClick: () => arrangeIconsInGrid(),
          },
          { type: "separator" },
          { label: "Sort By" },
          {
            label: "Name",
            // onClick: () => sortIcons("name"),
          },
          {
            label: "Size",
            // onClick: () => sortIcons("size"),
          },
          {
            label: "Type",
            // onClick: () => sortIcons("type"),
          },
          {
            label: "Date Modified",
            // onClick: () => sortIcons("date"),
          },
          { type: "separator" },
          {
            label: "New",
            subMenu: [
              {
                label: "Folder",
                onClick: () => {
                  const folderName = prompt("Enter folder name:", "New Folder");
                  if (folderName) {
                    addIcon(folderName, "folder");
                    addNotification(`Folder '${folderName}' created.`);
                  }
                },
              },
              {
                label: "Text Document",
                onClick: () => {
                  const fileName = prompt(
                    "Enter file name:",
                    "New Text Document.txt"
                  );
                  if (fileName) {
                    createFile("/", fileName, "");
                    addNotification(`Text document '${fileName}' created.`);
                  }
                },
              },
            ],
          },
          { type: "separator" },
          {
            label: "Refresh",
            // onClick: handleRefresh,
          },
          { type: "separator" },
          {
            label: "Personalize",
            onClick: () => openWindow("Personalization"),
          },
        ],
      });
    },
    [addIcon, addNotification, createFile, openWindow]
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
