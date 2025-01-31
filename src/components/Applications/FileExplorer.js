import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFile,
  faArrowUp,
  faFileImage,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1e2f;
  color: white;
  padding: 10px;
  font-family: "Arial, sans-serif";
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #2a2a40;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4a90e2;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ab7;
  }
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 10px;
  flex: 1;
  border: 1px solid #444;
  background-color: #333;
  color: white;
  border-radius: 5px;
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

const Breadcrumb = styled.span`
  color: #4a90e2;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #29293d;
  border-radius: 8px;
`;

const FileItemRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #3a3a52;
  }
`;

const FileName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  background-color: #ff4f4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #d9534f;
  }
`;
const ActionButtonRename = styled(ActionButton)`
  background-color: #4caf50;

  &:hover {
    background-color: #388e3c;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1e1e2f;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  color: white;
  overflow: auto;
  max-height: 80vh;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 5px;
`;

export default function FileExplorer({
  fileSystem,
  createFile,
  createFolder,
  deleteItem,
  renameItem,
  addNotification,
  loadFileSystemFromLocalStorage,
}) {
  const [currentPath, setCurrentPath] = useState(["C:"]);
  const [newItemName, setNewItemName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleCreateFolder = useCallback(() => {
    if (newItemName) {
      createFolder(currentPath.join("/"), newItemName);
      addNotification(`Folder created: ${newItemName}`);
      setNewItemName("");
    }
  }, [newItemName, createFolder, currentPath, addNotification]);

  const handleCreateFile = useCallback(() => {
    if (newItemName) {
      const content = newItemName.endsWith(".txt")
        ? "This is a new text file."
        : newItemName.endsWith(".jpg") || newItemName.endsWith(".png")
        ? "Image Placeholder"
        : "";
      createFile(currentPath.join("/"), newItemName, content);
      addNotification(`File created: ${newItemName}`);
      setNewItemName("");
    }
  }, [newItemName, createFile, currentPath, addNotification]);

  const handleItemClick = useCallback((name, item) => {
    if (item.type === "folder") {
      setCurrentPath((prev) => [...prev, name]);
    } else if (item.type === "text") {
      setModalContent({ type: "text", content: item.content, title: name });
    } else if (item.type === "image") {
      setModalContent({ type: "image", content: item.content, title: name });
    }
  }, []);

  const handleDelete = useCallback(
    (name) => {
      deleteItem([...currentPath, name].join("/"));
      addNotification(`Deleted: ${name}`);
    },
    [currentPath, deleteItem, addNotification]
  );

  const handleRename = useCallback(
    (oldName) => {
      const newName = prompt(`Rename ${oldName} to:`, oldName);
      if (newName && newName.trim() !== "") {
        renameItem([...currentPath, oldName].join("/"), newName);
        addNotification(`Renamed ${oldName} to ${newName}`);
      }
    },
    [currentPath, renameItem, addNotification]
  );

  const closeModal = () => setModalContent(null);

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
          placeholder="New file or folder name..."
        />
        <Button onClick={handleCreateFolder}>Create Folder</Button>
        <Button onClick={handleCreateFile}>Create File</Button>
      </Toolbar>

      <BreadcrumbContainer>
        {currentPath.map((folder, index) => (
          <Breadcrumb key={index} onClick={() => handleBreadcrumbClick(index)}>
            {folder}
            {index < currentPath.length - 1 && " / "}
          </Breadcrumb>
        ))}
      </BreadcrumbContainer>

      <FileList>
        {items.map(([name, item]) => (
          <FileItemRow key={name} onClick={() => handleItemClick(name, item)}>
            <FontAwesomeIcon
              icon={
                item.type === "folder"
                  ? faFolder
                  : item.type === "image"
                  ? faFileImage
                  : faFileAlt
              }
            />
            <FileName>{name}</FileName>
            <Actions>
              <ActionButtonRename
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(name);
                }}
              >
                Rename
              </ActionButtonRename>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(name);
                }}
              >
                Delete
              </ActionButton>
            </Actions>
          </FileItemRow>
        ))}
      </FileList>

      {modalContent && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{modalContent.title}</h2>
            {modalContent.type === "text" && <pre>{modalContent.content}</pre>}
            {modalContent.type === "image" && (
              <ImagePreview
                src={modalContent.content}
                alt={modalContent.title}
              />
            )}
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </ExplorerContainer>
  );
}
