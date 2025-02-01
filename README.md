# Web-Based Windows GUI Operating System

## Project Overview

This project presents a web-based Windows-like desktop environment built entirely in the browser, offering users a familiar desktop computing experience. The application is designed as a Single Page Application (SPA) with a highly interactive and responsive user interface, featuring multiple applications and system components similar to a traditional desktop operating system.

---

## Key Features

### 1. Multiple User Profiles

- Users can create, rename, and delete profiles.
- Each profile is password-protected (optional in our case) and includes personalized data.
- Upon login, users enter the virtual desktop environment.

---

### 2. Taskbar

- **Start Menu:**
  - Expandable menu triggered by the Start button.
  - Integrated search functionality to search applications.
  - Options for logout, sleep, restart, and shut down.
  - Displays the active user’s profile name.
- **System Tray:**
  - Includes network status simulation, volume control, Bluetooth status, and battery indicators.
  - Real-time clock.
- **Running Applications:**
  - Displays tabs for currently running applications.

---

### 3. Desktop Environment

- Fully interactive desktop workspace.
- Support for desktop icons (draggable).
- Right-click context menu.
- Resizable and draggable application windows.
- Window management features including minimize, maximize, and close.

---

### 4. Virtual File System

- Emulates a standard directory structure.
- Users can create, delete, and rename files and folders.
- Built-in encryption for secure file management.

---

### 5. Applications

- **Text Editor:**
  - Notepad-like application with features for creating and editing text files.
  - Save, print (with print preview and print simulation), and download functionality.
  - Word and character counters for document statistics.

- **Calculator:**
  - Basic arithmetic operations and advanced calculations.

- **File Explorer:**
  - Browsing and managing files and directories within the virtual file system.

- **Command Prompt:**
  - Supports multiple commands for basic system interactions.

- **Games:**
  - Three games: Tic Tac Toe, Snake, and Minesweeper.

- **System Notification Manager:**
  - Displays system-level notifications for user actions.

- **Clipboard Manager:**
  - Manages copied content, allowing users to access clipboard history.

- **Screen Capture Tool:**
  - Enables users to capture screenshots and download the images locally.

---

## Solution Architecture

- **Frontend:**
  - Built using React (v19.0.0) and styled components for a modern, dynamic, and interactive user interface.
  - Utilizes libraries such as `react-router-dom` for seamless navigation and `react-icons` for rich visual elements.

- **State Management:**
  - Centralized and efficient state management using `@reduxjs/toolkit` (v2.5.1) for application logic and local storage for persistent user settings.
  - `localforage` (v1.10.0) ensures offline data storage and synchronization.

- **File System Simulation:**
  - Simulates a virtual file system within the browser, allowing users to create, delete, and rename files and folders.
  - Secure storage is achieved using `crypto-js` (v4.2.0) for encryption capabilities.

- **User Profiles:**
  - Supports multiple user profiles, each with personalized settings, preferences, and data storage.
  - Profile data is maintained persistently across sessions using local storage and in-memory mechanisms.

- **Additional Enhancements:**
  - Interactive desktop environment powered by `react-dnd` and `react-rnd`.
  - Visual enhancements using Font Awesome and React Icons.

---

## Implementation Details

### Project Structure

- **/src:** Contains the core application code organized into components, contexts, hooks, and utility files.
- **/public:** Static files and assets such as images and configuration files.
- **/components:** Reusable UI components including applications (TextEditor, Calculator, Games), the taskbar, desktop, and common features like context menus and notifications.
  - **Applications:** Implements core applications like the clipboard manager, command prompt, file explorer, text editor, games, and more.
  - **Common:** Contains shared components like context menus, notifications, and window management.
  - **Desktop:** Manages desktop icons and the main interactive desktop environment.
  - **Login:** Handles user authentication and profile selection.
  - **Taskbar & StartMenu:** Manages the taskbar, start menu, and running applications.
- **/contexts:** Context providers such as the theme context for managing global themes.
- **/data:** Initial data and configuration files.
- **/hooks:** Custom React hooks for managing the file system, icons, windows, and notifications.
- **/store:** Centralized state management using Redux.
- **/styles:** Global styling using styled components.
- **/utils:** Utility functions for storage and other operations.

### Technologies Used

- **Frontend:** Built using React with core dependencies to create a highly interactive and modular Single Page Application (SPA) architecture. Styled components are used for dynamic and customizable UI design.
  - **Key Dependencies:**
    - `react` (v19.0.0)
    - `react-dom` (v19.0.0)
    - `react-router-dom` (v7.1.4)
    - `styled-components` (v6.1.14)

- **State Management:** Centralized application state management through `@reduxjs/toolkit` and local storage to maintain persistent user data and settings across sessions.
  - **Key Dependencies:**
    - `@reduxjs/toolkit` (v2.5.1)
    - `react-redux` (v9.2.0)
    - `localforage` (v1.10.0) for efficient offline data storage.

- **Cross-Browser Support:** Ensures compatibility across major browsers, leveraging tools and configurations defined in the project’s `browserslist`.

- **Encryption:** Secure file storage and virtual file system implemented using browser-based encryption techniques via `crypto-js`.
  - **Key Dependency:**
    - `crypto-js` (v4.2.0)

- **Interactive Desktop Environment:** Utilizes `react-dnd` and `react-rnd` for implementing draggable and resizable application windows, creating an interactive desktop experience.
  - **Key Dependencies:**
    - `react-dnd` (v16.0.1)
    - `react-dnd-html5-backend` (v16.0.1)
    - `react-rnd` (v10.4.14)

- **System Utilities:**
  - **Screen Capture:** Implemented using `html2canvas` for capturing and exporting screenshots.
    - **Key Dependency:** `html2canvas` (v1.4.1)
  
- **Icons and Visual Elements:** Integrated using Font Awesome icons and React Icons for a modern UI.
  - **Key Dependencies:**
    - `@fortawesome/fontawesome-svg-core` (v6.7.2)
    - `@fortawesome/free-brands-svg-icons` (v6.7.2)
    - `@fortawesome/free-solid-svg-icons` (v6.7.2)
    - `@fortawesome/react-fontawesome` (v0.2.2)
    - `react-icons` (v5.4.0)


### Application Setup and Running Instructions

1. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/yashveer132/Web-Based-Windows-GUI-Challenge
   cd Web-Based-Windows-GUI-Challenge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Bonus Features

- **Virtual File System Encryption:**
  - Secure storage of user files with encryption.

- **Multiple User Support:**
  - Profiles store individualized user settings, applications, and preferences.

- **System Notifications:**
  - Alerts and updates from various system applications.

- **Network Status Simulation:**
  - Simulates internet connectivity and related network indicators.

- **Print Simulation:**
  - Simulates printing via print preview and file output.

- **Command Prompt or Terminal Emulator:**
  - Basic command execution and system interactions.

- **Simple Game Applications:**
  - Includes Tic Tac Toe, Snake, and Minesweeper.

- **Clipboard Manager:**
  - Manages copied content and provides clipboard history.

- **Screen Capture Tool:**
  - Captures and downloads images of the current desktop.

---

## Evaluation Criteria Fulfillment

- **Innovation and Creativity:** Implemented multiple bonus features including clipboard management, screen capture, system notifications, and a command prompt.
- **Technical Complexity:** Built a fully functional Windows-like GUI environment with encryption, multiple user profiles, and persistent state management.
- **Effective Use of Technologies:** Used browser-based storage and encryption techniques to create a secure, efficient environment.
- **User Experience:** Delivered a familiar, responsive, and intuitive desktop experience.
- **Documentation Quality:** Comprehensive documentation detailing the solution architecture and implementation.
- **Code Quality:** Organized and well-commented code following best practices.

---

## Conclusion

This project successfully replicates a Windows-like desktop environment within the browser, providing core functionalities such as file management, multi-user support, system applications, and a responsive taskbar. With innovative features and secure data management, it showcases an advanced, web-based operating system interface.

---

For more details, please visit the project repository on [GitHub](https://github.com/yashveer132/Web-Based-Windows-GUI-Challenge).

