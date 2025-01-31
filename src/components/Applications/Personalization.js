import React, { useEffect, useState } from "react";
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
`;

const Heading = styled.h2`
  margin-bottom: 15px;
  font-size: 1.8rem;
  text-align: center;
`;

const CurrentThemeDisplay = styled.p`
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: var(--text-color);
`;

const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
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
`;

const CustomThemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ColorInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ColorInput = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid var(--window-border);
  background-color: var(--button-bg);
  color: var(--text-color);
  border-radius: 4px;
`;

const CustomThemeButton = styled.button`
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  background-color: var(--button-bg);
  color: var(--text-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const themeList = ["Dark", "Light", "Classic", "Pastel", "Pink", "Custom"];

const Personalization = ({ currentUser, addNotification }) => {
  const { themeName, changeTheme, applyCustomTheme } = useThemeContext();
  const [customTheme, setCustomTheme] = useState({
    desktopBg: "#ffffff",
    textColor: "#000000",
    buttonBg: "#dddddd",
    windowBorder: "#cccccc",
  });
  const [showCustomOptions, setShowCustomOptions] = useState(false);

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

    if (newTheme === "Custom") {
      setShowCustomOptions(true);
    } else {
      setShowCustomOptions(false);
      changeTheme(newTheme.toLowerCase());
    }

    if (currentUser) {
      setThemeForUser(currentUser.name, newTheme.toLowerCase());
    }
    if (addNotification) {
      addNotification(`Theme changed to: ${newTheme}`);
    }
  };

  const handleCustomInputChange = (e) => {
    setCustomTheme({
      ...customTheme,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyCustomTheme = () => {
    applyCustomTheme(customTheme);
    if (addNotification) {
      addNotification(`Custom theme applied successfully!`);
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

      {showCustomOptions && (
        <CustomThemeContainer>
          <h3 style={{ textAlign: "center" }}>Create Your Custom Theme</h3>
          <ColorInputContainer>
            <label>
              Desktop Background:
              <ColorInput
                type="color"
                name="desktopBg"
                value={customTheme.desktopBg}
                onChange={handleCustomInputChange}
              />
            </label>
            <label>
              Text Color:
              <ColorInput
                type="color"
                name="textColor"
                value={customTheme.textColor}
                onChange={handleCustomInputChange}
              />
            </label>
            <label>
              Button Background:
              <ColorInput
                type="color"
                name="buttonBg"
                value={customTheme.buttonBg}
                onChange={handleCustomInputChange}
              />
            </label>
            <label>
              Window Border:
              <ColorInput
                type="color"
                name="windowBorder"
                value={customTheme.windowBorder}
                onChange={handleCustomInputChange}
              />
            </label>
          </ColorInputContainer>
          <CustomThemeButton>Apply Custom Theme</CustomThemeButton>
        </CustomThemeContainer>
      )}

      <p style={{ textAlign: "center" }}>
        Select a theme to instantly change the appearance of your environment.
      </p>
    </Container>
  );
};

export default Personalization;
