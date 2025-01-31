import { useState, useCallback } from "react";
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
  padding: 5px;
  background-color: var(--window-bg);
  border-bottom: 1px solid var(--window-border);
`;

const Button = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  background-color: var(--button-bg);
  border: outset 2px var(--button-border);
  cursor: pointer;

  &:active {
    border-style: inset;
  }
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background-color: var(--taskbar-button-active);
  }
`;

const FileName = styled.span`
  margin-left: 5px;
`;

const FileExplorer = ({ fileSystem, createFolder, deleteItem, renameItem }) => {
  const [currentPath, setCurrentPath] = useState(["C:"]);
  const [newItemName, setNewItemName] = useState("");

  const getCurrentFolder = useCallback(() => {
    return currentPath.reduce(
      (acc, folder) => acc[folder].children || acc[folder],
      fileSystem
    );
  }, [currentPath, fileSystem]);

  const handleItemClick = useCallback((item) => {
    if (item.type === "folder") {
      setCurrentPath((prev) => [...prev, item.name]);
    } else {
      console.log(`Opening file: ${item.name}`);
    }
  }, []);

  const handleBackClick = useCallback(() => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
    }
  }, [currentPath]);

  const handleCreateFolder = useCallback(() => {
    if (newItemName) {
      createFolder(currentPath.join("/"), newItemName);
      setNewItemName("");
    }
  }, [createFolder, currentPath, newItemName]);

  const handleDeleteItem = useCallback(
    (itemName) => {
      deleteItem([...currentPath, itemName].join("/"));
    },
    [deleteItem, currentPath]
  );

  const handleRenameItem = useCallback(
    (oldName, newName) => {
      if (newName) {
        renameItem([...currentPath, oldName].join("/"), newName);
      }
    },
    [renameItem, currentPath]
  );

  const currentFolder = getCurrentFolder();

  return (
    <ExplorerContainer>
      <Toolbar>
        <Button onClick={handleBackClick} disabled={currentPath.length === 1}>
          <FontAwesomeIcon icon={faArrowUp} /> Back
        </Button>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New folder name"
        />
        <Button onClick={handleCreateFolder}>Create Folder</Button>
      </Toolbar>
      <FileList>
        {Object.entries(currentFolder).map(([name, item]) => (
          <FileItem
            key={name}
            onClick={() => handleItemClick({ ...item, name })}
          >
            <FontAwesomeIcon
              icon={item.type === "folder" ? faFolder : faFile}
            />
            <FileName>{name}</FileName>
            <Button onClick={() => handleDeleteItem(name)}>Delete</Button>
            <Button
              onClick={() => {
                const newName = prompt(`Rename ${name} to:`, name);
                handleRenameItem(name, newName);
              }}
            >
              Rename
            </Button>
          </FileItem>
        ))}
      </FileList>
    </ExplorerContainer>
  );
};

export default FileExplorer;
