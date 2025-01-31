import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFile, faArrowUp } from "@fortawesome/free-solid-svg-icons";

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 5px;
  padding: 5px;
  background-color: var(--window-title-inactive);
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--text-color);
  cursor: pointer;

  &:hover {
    background-color: #4a4a4a;
  }
  &:active {
    opacity: 0.8;
  }
`;

const Input = styled.input`
  padding: 5px;
  background-color: #1e1e1e;
  border: 1px solid var(--window-border);
  color: var(--text-color);
  flex: 1;
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: var(--window-bg);
`;

const FileItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  cursor: pointer;
  color: var(--text-color);

  &:hover {
    background-color: var(--taskbar-button-active);
  }
`;

const ButtonInline = styled.button`
  margin-left: auto;
  background-color: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;

  &:hover {
    color: #ff4f4f;
  }
`;

export default function FileExplorer({
  fileSystem,
  createFile,
  createFolder,
  deleteItem,
  renameItem,
  addNotification,
  loadFileSystemFromLocalStorage,
  isEncrypted,
}) {
  const [currentPath, setCurrentPath] = useState(["C:"]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    if (loadFileSystemFromLocalStorage) {
      loadFileSystemFromLocalStorage();
    }
  }, [loadFileSystemFromLocalStorage]);

  const getCurrentFolder = useCallback(() => {
    return currentPath.reduce((acc, folder) => {
      if (acc && acc[folder]) {
        return acc[folder].children || acc[folder];
      }
      return {};
    }, fileSystem);
  }, [currentPath, fileSystem]);

  const handleBackClick = useCallback(() => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
    }
  }, [currentPath]);

  const handleCreateFolder = useCallback(() => {
    if (newItemName) {
      createFolder(currentPath.join("/"), newItemName);
      if (addNotification) {
        addNotification(`Folder created: ${newItemName}`);
      }
      setNewItemName("");
    }
  }, [newItemName, createFolder, currentPath, addNotification]);

  const handleItemClick = useCallback(
    (name, item) => {
      if (item.type === "folder") {
        setCurrentPath((prev) => [...prev, name]);
      } else {
        if (addNotification) addNotification(`Opening file: ${name}`);
      }
    },
    [addNotification]
  );

  const handleDelete = useCallback(
    (name) => {
      deleteItem([...currentPath, name].join("/"));
      if (addNotification) {
        addNotification(`Deleted: ${name}`);
      }
    },
    [currentPath, deleteItem, addNotification]
  );

  const handleRename = useCallback(
    (oldName) => {
      const newName = prompt(`Rename ${oldName} to:`, oldName);
      if (newName && newName.trim() !== "") {
        renameItem([...currentPath, oldName].join("/"), newName);
        if (addNotification) {
          addNotification(`Renamed ${oldName} to ${newName}`);
        }
      }
    },
    [currentPath, renameItem, addNotification]
  );

  const currentFolder = getCurrentFolder();
  const items = Object.entries(currentFolder);

  return (
    <ExplorerContainer>
      <Toolbar>
        <Button onClick={handleBackClick} disabled={currentPath.length === 1}>
          <FontAwesomeIcon icon={faArrowUp} /> Back
        </Button>
        <Input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New folder name..."
        />
        <Button onClick={handleCreateFolder}>Create Folder</Button>
      </Toolbar>

      {isEncrypted && (
        <div
          style={{ backgroundColor: "#333", color: "#ff8080", padding: "5px" }}
        >
          <strong>Encrypted FS:</strong> You must enter correct password each
          open.
        </div>
      )}

      <FileList>
        {items.map(([name, item]) => (
          <FileItemRow key={name} onClick={() => handleItemClick(name, item)}>
            <FontAwesomeIcon
              icon={item.type === "folder" ? faFolder : faFile}
            />
            <span>{name}</span>
            <ButtonInline
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(name);
              }}
            >
              Delete
            </ButtonInline>
            <ButtonInline
              onClick={(e) => {
                e.stopPropagation();
                handleRename(name);
              }}
            >
              Rename
            </ButtonInline>
          </FileItemRow>
        ))}
      </FileList>
    </ExplorerContainer>
  );
}
