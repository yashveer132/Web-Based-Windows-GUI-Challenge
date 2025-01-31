import { useState, useCallback } from "react";

const initialFileSystem = {
  "C:": {
    type: "folder",
    children: {
      Documents: {
        type: "folder",
        children: {},
      },
      Pictures: {
        type: "folder",
        children: {},
      },
      Music: {
        type: "folder",
        children: {},
      },
    },
  },
};

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState(initialFileSystem);

  const createFile = useCallback((path, name, content = "") => {
    setFileSystem((prevFS) => {
      const newFS = JSON.parse(JSON.stringify(prevFS));
      let current = newFS;
      const parts = path.split("/");
      for (const part of parts) {
        if (current[part] && current[part].type === "folder") {
          current = current[part].children;
        } else {
          return prevFS;
        }
      }
      if (current[name]) return prevFS;
      current[name] = { type: "file", content };
      return newFS;
    });
  }, []);

  const createFolder = useCallback((path, name) => {
    setFileSystem((prevFS) => {
      const newFS = JSON.parse(JSON.stringify(prevFS));
      let current = newFS;
      const parts = path.split("/");
      for (const part of parts) {
        if (current[part] && current[part].type === "folder") {
          current = current[part].children;
        } else {
          return prevFS;
        }
      }
      if (current[name]) return prevFS;
      current[name] = { type: "folder", children: {} };
      return newFS;
    });
  }, []);

  const deleteItem = useCallback((path) => {
    setFileSystem((prevFS) => {
      const newFS = JSON.parse(JSON.stringify(prevFS));
      let current = newFS;
      const parts = path.split("/");
      const itemName = parts.pop();
      for (const part of parts) {
        if (current[part] && current[part].type === "folder") {
          current = current[part].children;
        } else {
          return prevFS;
        }
      }
      if (!current[itemName]) return prevFS;
      delete current[itemName];
      return newFS;
    });
  }, []);

  const renameItem = useCallback((oldPath, newName) => {
    setFileSystem((prevFS) => {
      const newFS = JSON.parse(JSON.stringify(prevFS));
      let current = newFS;
      const parts = oldPath.split("/");
      const oldName = parts.pop();
      for (const part of parts) {
        if (current[part] && current[part].type === "folder") {
          current = current[part].children;
        } else {
          return prevFS;
        }
      }
      if (!current[oldName] || current[newName]) return prevFS;
      current[newName] = current[oldName];
      delete current[oldName];
      return newFS;
    });
  }, []);

  return { fileSystem, createFile, createFolder, deleteItem, renameItem };
};
