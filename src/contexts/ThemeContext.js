import React, { createContext, useContext, useState, useEffect } from "react";

const THEMES = {
  dark: {
    name: "dark",
    desktopBg: "#252526",
    windowBg: "#2d2d30",
    windowBorder: "#3c3c3c",
    windowTitleActive: "#0078d7",
    windowTitleInactive: "#444444",
    textColor: "#ffffff",
  },
  light: {
    name: "light",
    desktopBg: "#ffffff",
    windowBg: "#f3f3f3",
    windowBorder: "#cccccc",
    windowTitleActive: "#0078d7",
    windowTitleInactive: "#aaaaaa",
    textColor: "#333333",
  },
  blue: {
    name: "blue",
    desktopBg: "#336699",
    windowBg: "#e6f2ff",
    windowBorder: "#336699",
    windowTitleActive: "#0055cc",
    windowTitleInactive: "#99bbdd",
    textColor: "#ffffff",
  },
  classic: {
    name: "classic",
    desktopBg: "#008080",
    windowBg: "#c0c0c0",
    windowBorder: "#808080",
    windowTitleActive: "#000080",
    windowTitleInactive: "#808080",
    textColor: "#000000",
  },
  purple: {
    name: "purple",
    desktopBg: "#4b0082",
    windowBg: "#eae4f2",
    windowBorder: "#8a2be2",
    windowTitleActive: "#7b68ee",
    windowTitleInactive: "#b19cd9",
    textColor: "#ffffff",
  },
  green: {
    name: "green",
    desktopBg: "#006400",
    windowBg: "#e0f2e9",
    windowBorder: "#008000",
    windowTitleActive: "#228B22",
    windowTitleInactive: "#90ee90",
    textColor: "#ffffff",
  },
  pastel: {
    name: "pastel",
    desktopBg: "#fef1e6",
    windowBg: "#ffffff",
    windowBorder: "#ffe2d0",
    windowTitleActive: "#f5c6aa",
    windowTitleInactive: "#fcd2c2",
    textColor: "#444444",
  },
  highContrast: {
    name: "highContrast",
    desktopBg: "#000000",
    windowBg: "#ffffff",
    windowBorder: "#ffff00",
    windowTitleActive: "#ff00ff",
    windowTitleInactive: "#aaaaaa",
    textColor: "#00ff00",
  },
  pink: {
    name: "pink",
    desktopBg: "#ffc0cb",
    windowBg: "#ffe6ee",
    windowBorder: "#ff95c5",
    windowTitleActive: "#ff69b4",
    windowTitleInactive: "#ffb6c1",
    textColor: "#5e004f",
  },
  matrix: {
    name: "matrix",
    desktopBg: "#000000",
    windowBg: "#0a0a0a",
    windowBorder: "#00ff00",
    windowTitleActive: "#00ff00",
    windowTitleInactive: "#005500",
    textColor: "#00ff00",
  },
};

const ThemeContext = createContext();

export function ThemeContextProvider({ initialTheme = "dark", children }) {
  const [themeName, setThemeName] = useState(initialTheme);
  const [theme, setTheme] = useState(THEMES[themeName]);

  useEffect(() => {
    setTheme(THEMES[themeName] || THEMES.dark);
  }, [themeName]);

  const changeTheme = (newTheme) => {
    setThemeName(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ themeName, theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
