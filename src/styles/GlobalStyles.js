import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --desktop-bg: ${({ theme }) => theme.desktopBg};
    --window-bg: ${({ theme }) => theme.windowBg};
    --window-border: ${({ theme }) => theme.windowBorder};
    --window-title-active: ${({ theme }) => theme.windowTitleActive};
    --window-title-inactive: ${({ theme }) => theme.windowTitleInactive};
    --text-color: ${({ theme }) => theme.textColor};
    --button-bg: ${({ theme }) => theme.windowBorder}; 
    --button-border: ${({ theme }) => theme.windowBorder};
    --taskbar-bg: ${({ theme }) => theme.desktopBg};
    --taskbar-button-bg: ${({ theme }) => theme.windowBg};
    --taskbar-button-active: rgba(255,255,255,0.2);
    --icon-bg: rgba(255, 255, 255, 0.2);
    --notification-bg: ${({ theme }) => theme.windowBg};
    --notification-text: ${({ theme }) => theme.textColor};
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
    background-color: var(--desktop-bg);
    color: var(--text-color);
  }

  @media (max-width: 600px) {
    body {
      font-size: 14px;
    }
  }
`;

export default GlobalStyles;
