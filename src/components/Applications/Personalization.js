import React, { useEffect } from "react";
import styled from "styled-components";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getThemeForUser, setThemeForUser } from "../../utils/storage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--text-color);
  background-color: var(--window-bg);
  border-radius: 10px;
  border: 2px solid var(--window-border);
  width: 100%;
  max-width: 400px;
  min-width: 300px;
  max-height: 90vh;
  margin: 10px 0;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  @media (max-width: 768px) {
    padding: 18px;
    max-width: 90vw;
    min-width: 260px;
  }
  @media (max-width: 480px) {
    padding: 15px;
    min-width: 220px;
  }
`;

const CurrentThemeDisplay = styled.p`
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: var(--text-color);
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
  @media (max-width: 768px) {
    gap: 12px;
  }
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const ThemeButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--button-bg);
  color: var(--text-color);
  text-transform: capitalize;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.8rem;
  }
`;

const themeList = ["Dark", "Light", "Classic", "Pastel", "Pink"];

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
    if (newTheme.toLowerCase() === themeName) {
      if (addNotification) {
        addNotification(`The ${newTheme} theme is already selected.`);
      }
      return;
    }

    changeTheme(newTheme.toLowerCase());
    if (currentUser) {
      setThemeForUser(currentUser.name, newTheme.toLowerCase());
    }
    if (addNotification) {
      addNotification(`Theme changed to: ${newTheme}`);
    }
  };

  return (
    <Container>
      <CurrentThemeDisplay>
        Current Theme: <strong>{themeName}</strong>
      </CurrentThemeDisplay>
      <ThemeOptions>
        {themeList.map((theme) => (
          <ThemeButton key={theme} onClick={() => handleSelectTheme(theme)}>
            {theme}
          </ThemeButton>
        ))}
      </ThemeOptions>
    </Container>
  );
};

export default Personalization;
