import { useState, useCallback, useEffect } from "react";

function encryptData(data, password) {
  const str = JSON.stringify(data);
  const reversed = str.split("").reverse().join("");
  const b64 = btoa(password + reversed);
  return b64;
}

function decryptData(encrypted, password) {
  try {
    const decoded = atob(encrypted);
    if (!decoded.startsWith(password)) {
      return null;
    }
    const reversed = decoded.slice(password.length);
    const normal = reversed.split("").reverse().join("");
    return JSON.parse(normal);
  } catch {
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
  const [fileSystem, setFileSystem] = useState(initialFS);
  const [isEncrypted, setIsEncrypted] = useState(false);

  const storageKey = "webos_fileSystem";
  const passwordKey = "webos_fsPassword";

  const loadFileSystemFromLocalStorage = useCallback(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    if (!isEncrypted) {
      try {
        const parsed = JSON.parse(raw);
        setFileSystem(parsed);
      } catch {}
      return;
    }

    const savedPw = localStorage.getItem(passwordKey) || "";
    if (!savedPw) {
      alert("Encrypted FS but no password found. Cannot load.");
      return;
    }

    const enteredPw = prompt("Enter the encryption password:");
    if (!enteredPw) {
      return;
    }
    if (enteredPw !== savedPw) {
      alert("Wrong password. FileSystem locked.");
      return;
    }

    const decrypted = decryptData(raw, enteredPw);
    if (decrypted) {
      setFileSystem(decrypted);
    } else {
      alert("Decrypt failed: wrong password or corrupted data.");
    }
  }, [isEncrypted]);

  const saveFileSystemToLocalStorage = useCallback(
    (fs) => {
      if (!fs) return;
      if (!isEncrypted) {
        localStorage.setItem(storageKey, JSON.stringify(fs));
      } else {
        const savedPw = localStorage.getItem(passwordKey) || "";
        if (!savedPw) {
          alert("No password set but isEncrypted = true. Something's off.");
          return;
        }
        const enc = encryptData(fs, savedPw);
        localStorage.setItem(storageKey, enc);
      }
    },
    [isEncrypted]
  );

  useEffect(() => {
    saveFileSystemToLocalStorage(fileSystem);
  }, [fileSystem, saveFileSystemToLocalStorage]);

  const createFile = useCallback((path, name, content = "") => {
    setFileSystem((prev) => {
      const newFS = structuredClone(prev);
      let current = newFS;
      const parts = path.split("/");
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
      const parts = path.split("/");
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
      const parts = path.split("/");
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
      const parts = oldPath.split("/");
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
      localStorage.setItem(passwordKey, pw);
      setIsEncrypted(true);

      saveFileSystemToLocalStorage(fileSystem);
    },
    [fileSystem, saveFileSystemToLocalStorage]
  );

  const disableEncryption = useCallback(() => {
    localStorage.removeItem(passwordKey);
    setIsEncrypted(false);
    saveFileSystemToLocalStorage(fileSystem);
  }, [fileSystem, saveFileSystemToLocalStorage]);

  return {
    fileSystem,
    isEncrypted,
    loadFileSystemFromLocalStorage,
    enableEncryption,
    disableEncryption,
    createFile,
    createFolder,
    deleteItem,
    renameItem,
  };
};
