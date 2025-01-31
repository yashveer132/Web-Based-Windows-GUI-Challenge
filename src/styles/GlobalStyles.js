import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
  }

  :root {
    --desktop-bg: #008080;
    --window-bg: #c0c0c0;
    --window-border: #ffffff;
    --window-title-active: #000080;
    --window-title-inactive: #808080;
    --text-color: #000000;
    --text-color-light: #ffffff;
    --button-bg: #c0c0c0;
    --button-text: #000000;
    --button-border: #ffffff;
    --taskbar-bg: #c0c0c0;
    --taskbar-button-bg: #c0c0c0;
    --taskbar-button-active: #ffffff;
    --icon-bg: rgba(255, 255, 255, 0.1);
  }
`;

export default GlobalStyles;
