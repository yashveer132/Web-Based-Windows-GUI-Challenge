import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GlobalStyles from "./styles/GlobalStyles";
import Desktop from "./components/Desktop/Desktop";
import Taskbar from "./components/Taskbar/Taskbar";
import StartMenu from "./components/StartMenu/StartMenu";
import Window from "./components/common/Window";
import ContextMenu from "./components/common/ContextMenu";
import { useWindows } from "./hooks/useWindows";
import { useIcons } from "./hooks/useIcons";
import { useFileSystem } from "./hooks/useFileSystem";
import { initialIcons, initialApps } from "./data/initialData";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--desktop-bg);
`;

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const { icons, moveIcon, addIcon } = useIcons(initialIcons);
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    activeWindowId,
  } = useWindows();
  const { fileSystem, createFile, createFolder, deleteItem, renameItem } =
    useFileSystem();

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
          { label: "View", onClick: () => console.log("View clicked") },
          { label: "Sort By", onClick: () => console.log("Sort By clicked") },
          { label: "Refresh", onClick: () => console.log("Refresh clicked") },
          { type: "separator" },
          {
            label: "New Folder",
            onClick: () => addIcon("New Folder", "folder"),
          },
        ],
      });
    },
    [addIcon]
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

  return (
    <>
      <GlobalStyles />
      <DndProvider backend={HTML5Backend}>
        <AppContainer
          onContextMenu={handleContextMenu}
          onClick={handleCloseContextMenu}
        >
          <Desktop icons={icons} moveIcon={moveIcon} openWindow={openWindow} />
          {windows.map((window) => (
            <Window
              key={window.id}
              {...window}
              isActive={window.id === activeWindowId}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
            >
              {React.cloneElement(initialApps[window.appId].component, {
                fileSystem,
                createFile,
                createFolder,
                deleteItem,
                renameItem,
              })}
            </Window>
          ))}
          <StartMenu
            isOpen={isStartMenuOpen}
            onClose={() => setIsStartMenuOpen(false)}
            apps={memoizedApps}
          />
          <Taskbar
            onStartClick={handleStartClick}
            windows={windows}
            activeWindowId={activeWindowId}
            onWindowClick={focusWindow}
          />
          {contextMenu && (
            <ContextMenu {...contextMenu} onClose={handleCloseContextMenu} />
          )}
        </AppContainer>
      </DndProvider>
    </>
  );
}

export default App;
