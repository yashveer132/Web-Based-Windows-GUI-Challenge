import { useState, useCallback, useEffect } from "react";
import CryptoJS from "crypto-js";

function encryptData(data, password) {
  const dataString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(dataString, password).toString();
}

function decryptData(encrypted, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
}

const initialFS = {
  "C:": {
    type: "folder",
    children: {
      Documents: { type: "folder", children: {} },
      Pictures: { type: "folder", children: {} },
      Music: { type: "folder", children: {} },
    },
  },
};

export const useFileSystem = () => {
  const storageKey = "webos_fileSystem";
  const passwordKey = "webos_fsPassword";
  const encryptionFlagKey = "webos_fsEncrypted";
  const lockedFlagKey = "webos_fsLocked";

  const [fileSystem, setFileSystem] = useState(initialFS);
  const [isEncrypted, setIsEncrypted] = useState(
    () => localStorage.getItem(encryptionFlagKey) === "true"
  );
  const [locked, setLocked] = useState(
    () => localStorage.getItem(lockedFlagKey) === "true"
  );

  const loadFileSystemFromLocalStorage = useCallback(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const encryptionEnabled =
      localStorage.getItem(encryptionFlagKey) === "true";
    if (!encryptionEnabled) {
      try {
        const parsed = JSON.parse(raw);
        setFileSystem(parsed);
      } catch (error) {
        console.error("Failed to parse file system JSON", error);
      }
      return;
    }
    setLocked(true);
  }, []);

  const saveFileSystemToLocalStorage = useCallback((fs) => {
    if (!fs) return;
    const encryptionEnabled =
      localStorage.getItem(encryptionFlagKey) === "true";
    if (!encryptionEnabled) {
      localStorage.setItem(storageKey, JSON.stringify(fs));
    } else {
      const savedPw = localStorage.getItem(passwordKey) || "";
      if (!savedPw) {
        alert("No password set but encryption is enabled.");
        return;
      }
      const enc = encryptData(fs, savedPw);
      localStorage.setItem(storageKey, enc);
    }
  }, []);

  useEffect(() => {
    saveFileSystemToLocalStorage(fileSystem);
  }, [fileSystem, saveFileSystemToLocalStorage]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isEncrypted) {
        setLocked(true);
        localStorage.setItem(lockedFlagKey, "true");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEncrypted]);

  const createFile = useCallback((path, name, content = "") => {
    setFileSystem((prev) => {
      const newFS = structuredClone(prev);
      let current = newFS;
      const parts = path.split("/").filter(Boolean);
      for (const part of parts) {
        if (current[part]?.type === "folder") {
          current = current[part].children;
        } else {
          return prev;
        }
      }
      if (current[name]) return prev;
      current[name] = { type: "file", content };
      return newFS;
    });
  }, []);

  const createFolder = useCallback((path, name) => {
    setFileSystem((prev) => {
      const newFS = structuredClone(prev);
      let current = newFS;
      const parts = path.split("/").filter(Boolean);
      for (const part of parts) {
        if (current[part]?.type === "folder") {
          current = current[part].children;
        } else {
          return prev;
        }
      }
      if (current[name]) return prev;
      current[name] = { type: "folder", children: {} };
      return newFS;
    });
  }, []);

  const deleteItem = useCallback((path) => {
    setFileSystem((prev) => {
      const newFS = structuredClone(prev);
      let current = newFS;
      const parts = path.split("/").filter(Boolean);
      const itemName = parts.pop();
      for (const part of parts) {
        if (current[part]?.type === "folder") {
          current = current[part].children;
        } else {
          return prev;
        }
      }
      if (!current[itemName]) return prev;
      delete current[itemName];
      return newFS;
    });
  }, []);

  const renameItem = useCallback((oldPath, newName) => {
    setFileSystem((prev) => {
      const newFS = structuredClone(prev);
      let current = newFS;
      const parts = oldPath.split("/").filter(Boolean);
      const oldName = parts.pop();
      for (const part of parts) {
        if (current[part]?.type === "folder") {
          current = current[part].children;
        } else {
          return prev;
        }
      }
      if (!current[oldName] || current[newName]) return prev;
      current[newName] = current[oldName];
      delete current[oldName];
      return newFS;
    });
  }, []);

  const enableEncryption = useCallback(
    (pw) => {
      if (!pw) {
        alert("Password cannot be empty.");
        return;
      }
      localStorage.setItem(passwordKey, pw);
      localStorage.setItem(encryptionFlagKey, "true");
      setIsEncrypted(true);
      saveFileSystemToLocalStorage(fileSystem);
    },
    [fileSystem, saveFileSystemToLocalStorage]
  );

  const disableEncryption = useCallback(() => {
    localStorage.removeItem(passwordKey);
    localStorage.setItem(encryptionFlagKey, "false");
    setIsEncrypted(false);
    setLocked(false);
    localStorage.removeItem(lockedFlagKey);
    saveFileSystemToLocalStorage(fileSystem);
  }, [fileSystem, saveFileSystemToLocalStorage]);

  const unlockFileSystem = useCallback((enteredPw) => {
    const savedPw = localStorage.getItem(passwordKey) || "";
    if (!enteredPw || enteredPw !== savedPw) {
      alert("Wrong password.");
      return false;
    }
    const raw = localStorage.getItem(storageKey);
    const decrypted = decryptData(raw, enteredPw);
    if (decrypted) {
      setFileSystem(decrypted);
      setLocked(false);
      localStorage.setItem(lockedFlagKey, "false");
      return true;
    } else {
      alert("Decrypt failed: wrong password or corrupted data.");
      return false;
    }
  }, []);

  return {
    fileSystem,
    isEncrypted,
    locked,
    loadFileSystemFromLocalStorage,
    unlockFileSystem,
    enableEncryption,
    disableEncryption,
    createFile,
    createFolder,
    deleteItem,
    renameItem,
  };
};
