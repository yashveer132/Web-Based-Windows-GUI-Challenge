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
  classic: {
    name: "classic",
    desktopBg: "#008080",
    windowBg: "#c0c0c0",
    windowBorder: "#808080",
    windowTitleActive: "#000080",
    windowTitleInactive: "#808080",
    textColor: "#000000",
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
  pink: {
    name: "pink",
    desktopBg: "#ffc0cb",
    windowBg: "#ffe6ee",
    windowBorder: "#ff95c5",
    windowTitleActive: "#ff69b4",
    windowTitleInactive: "#ffb6c1",
    textColor: "#5e004f",
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

  const applyRandomTheme = () => {
    const themeNames = Object.keys(THEMES);
    const randomTheme =
      themeNames[Math.floor(Math.random() * themeNames.length)];
    setThemeName(randomTheme);
    setTheme(THEMES[randomTheme]);
  };

  return (
    <ThemeContext.Provider
      value={{ themeName, theme, changeTheme, applyRandomTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
