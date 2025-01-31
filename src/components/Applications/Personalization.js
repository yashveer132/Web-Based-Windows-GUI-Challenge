import React, { useEffect } from "react";
import styled from "styled-components";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getThemeForUser, setThemeForUser } from "../../utils/storage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: var(--text-color);
  background-color: var(--window-bg);
  height: 100%;
`;

const Heading = styled.h2`
  margin-bottom: 15px;
`;

const ThemeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const ThemeButton = styled.button`
  padding: 10px 15px;
  border: 1px solid var(--window-border);
  background-color: var(--button-bg);
  color: var(--text-color);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const themeList = [
  "dark",
  "light",
  "blue",
  "classic",
  "purple",
  "green",
  "pastel",
  "highContrast",
  "pink",
  "matrix",
];

const Personalization = ({ currentUser, addNotification }) => {
  const { themeName, changeTheme } = useThemeContext();

  useEffect(() => {
    if (currentUser) {
      const userTheme = getThemeForUser(currentUser.name);
      if (userTheme) {
        changeTheme(userTheme);
      }
    }
  }, [currentUser, changeTheme]);

  const handleSelectTheme = (newTheme) => {
    changeTheme(newTheme);
    if (currentUser) {
      setThemeForUser(currentUser.name, newTheme);
    }
    if (addNotification) {
      addNotification(`Theme changed to: ${newTheme}`);
    }
  };

  return (
    <Container>
      <Heading>Personalization</Heading>
      <p>
        Current theme: <strong>{themeName}</strong>
      </p>
      <ThemeOptions>
        {themeList.map((th) => (
          <ThemeButton key={th} onClick={() => handleSelectTheme(th)}>
            {th}
          </ThemeButton>
        ))}
      </ThemeOptions>
      <p>Select a theme to instantly change the appearance.</p>
    </Container>
  );
};

export default Personalization;
