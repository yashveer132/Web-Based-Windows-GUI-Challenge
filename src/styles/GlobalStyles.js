import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --desktop-bg: ${({ theme }) => theme.desktopBg};
    --window-bg: ${({ theme }) => theme.windowBg};
    --window-border: ${({ theme }) => theme.windowBorder};
    --window-title-active: ${({ theme }) => theme.windowTitleActive};
    --window-title-inactive: ${({ theme }) => theme.windowTitleInactive};
    --text-color: ${({ theme }) => theme.textColor};
    --button-bg: ${({ theme }) => theme.buttonBg}; 
    --button-border: ${({ theme }) => theme.windowBorder};
    --taskbar-bg: ${({ theme }) => theme.desktopBg};
    --taskbar-button-bg: ${({ theme }) => theme.windowBg};
    --taskbar-button-active: rgba(255, 255, 255, 0.2);
    --icon-bg: rgba(255, 255, 255, 0.2);
    --notification-bg: ${({ theme }) => theme.windowBg};
    --notification-text: ${({ theme }) => theme.textColor};
    

    --dark-hover: #333;
    --dark-text-hover: #fff;

    --light-hover: #ddd;
    --light-text-hover: #000;

    --classic-hover: #c4a484;
    --classic-text-hover: #fff;

    --pastel-hover: #f3d3e7;
    --pastel-text-hover: #5c2a5d;

    --pink-hover: #ffb6c1;
    --pink-text-hover: #6a1b4d;
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
    
  @media (pointer: coarse) {
  body {
    -webkit-tap-highlight-color: transparent;
  }
}
`;

export default GlobalStyles;
