import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFileImage,
  faFileAlt,
  faArrowUp,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 90vw;
  background-color: #282c34;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    padding: 15px;
    border-radius: 0;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #3b3f58;
  border-radius: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #61dafb;
  border: none;
  border-radius: 5px;
  color: #282c34;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  &:hover {
    background-color: #52b7e0;
  }
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  padding: 10px;
  flex: 1;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  border-radius: 5px;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const BreadcrumbContainer = styled.div`
  margin: 10px 0;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

const Breadcrumb = styled.span`
  color: #61dafb;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #1f232e;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
  }
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
    background-color: #32374d;
  }

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
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
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #d9534f;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 0.8rem;
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
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: #282c34;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  margin-top: 60px;
  margin-left: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    width: 100%;
    margin-top: 40px;
    margin-left: 10px;
  }
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
  isEncrypted,
  locked,
  unlockFileSystem,
  enableEncryption,
  disableEncryption,
}) {
  const [currentPath, setCurrentPath] = useState(["C:"]);
  const [newItemName, setNewItemName] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");

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
    } else if (item.type === "file" || item.type === "text") {
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

  const handleToggleEncryption = () => {
    if (isEncrypted) {
      if (
        window.confirm(
          "Disable encryption? Your data will be stored unencrypted."
        )
      ) {
        disableEncryption();
        addNotification("Encryption disabled.");
      }
    } else {
      const password = prompt("Enter a password to enable encryption:");
      if (password && password.trim() !== "") {
        enableEncryption(password);
        addNotification("Encryption enabled.");
      }
    }
  };

  if (locked) {
    return (
      <ModalOverlay>
        <ModalContent>
          <h3>Enter Encryption Password</h3>
          <Input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
          />
          <Button
            onClick={() => {
              const success = unlockFileSystem(passwordInput);
              if (success) {
                setPasswordInput("");
              }
            }}
          >
            Unlock
          </Button>
        </ModalContent>
      </ModalOverlay>
    );
  }

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
        <Button onClick={handleToggleEncryption}>
          {isEncrypted ? (
            <>
              <FontAwesomeIcon icon={faUnlock} /> Disable Encryption
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faLock} /> Enable Encryption
            </>
          )}
        </Button>
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
