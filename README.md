# **Web-Based Windows GUI Operating System**

## **Index**
- [**Web-Based Windows GUI Operating System**](#web-based-windows-gui-operating-system)
  - [**Index**](#index)
  - [**Project Overview**](#project-overview)
  - [**Deployment**](#deployment)
  - [**Key Features**](#key-features)
    - [**1. Multiple User Profiles**](#1-multiple-user-profiles)
    - [**2. Taskbar**](#2-taskbar)
    - [**3. Desktop Environment**](#3-desktop-environment)
    - [**4. Virtual File System**](#4-virtual-file-system)
    - [**5. Applications**](#5-applications)
  - [**Bonus Features**](#bonus-features)
  - [**Solution Architecture**](#solution-architecture)
    - [**Frontend:**](#frontend)
    - [**State Management:**](#state-management)
    - [**File System Simulation:**](#file-system-simulation)
    - [**User Profiles:**](#user-profiles)
    - [**Additional Enhancements:**](#additional-enhancements)
  - [**Implementation Details**](#implementation-details)
  - [**Technologies Used**](#technologies-used)
  - [**Application Setup and Running Instructions**](#application-setup-and-running-instructions)
  - [**Evaluation Criteria Fulfillment**](#evaluation-criteria-fulfillment)
  - [**Conclusion**](#conclusion)

---

## **Project Overview**

The **Web-Based Windows GUI Operating System** reimagines the desktop experience within a browser, offering users a familiar Windows-like environment with modern web capabilities. Built as a Single Page Application (SPA), this project delivers interactive system utilities, a virtual file system, and core applications while maintaining fast, secure, and persistent functionality across user sessions.

This document outlines the project’s architecture, features, implementation details, and deployment instructions.

---

## **Deployment**

The project is hosted on **Netlify**, ensuring fast loading times, secure access, and compatibility across major browsers. The live demo is available at the following link:

[**Live Demo**](https://web-based-windows-gui.netlify.app/) <br>
[**GitHub Repository**](https://github.com/yashveer132/Web-Based-Windows-GUI-Challenge)

---

## **Key Features**

The project replicates key OS components to deliver a robust user experience. Below are the major features that make up the core system:

### **1. Multiple User Profiles**
- Users can create, delete, and manage profiles, each with personalized settings and data.
- Password protection (optional in our case) for enhanced security.
- Persistent user data stored locally within the browser.

---

### **2. Taskbar**
- **Start Menu:** Provides access to applications, search functionality, user display name, and system options like logout, restart, and shutdown.  
- **System Tray:** Displays network status, volume control, battery levels, Bluetooth status, airplane mode and a real-time clock.  
- **Running Applications:** Shows tabs for open applications, allowing easy switching between tasks.  

---

### **3. Desktop Environment**
- Interactive desktop with draggable icons.  
- Context menus for right-click actions.  
- Resizable and draggable windows for system applications.  
- Window management options, including minimize, maximize, and close.  

---

### **4. Virtual File System**
- Emulates a directory structure, allowing users to create, rename, and delete files or folders.  
- Supports file encryption using browser-based cryptographic libraries.  
- Persistent storage across user sessions.  

---

### **5. Applications**
The system includes a variety of core and bonus applications to replicate desktop functionality:

- **Text Editor:** Create and edit text files with options to save, download, and print documents. Includes word and character counters.  
- **Calculator:** Supports basic mathematical operations.  
- **File Explorer:** Allows users to browse, manage, and interact with files and folders.  
- **Command Prompt:** Simulates a terminal for executing basic commands and system interactions.  
- **Games:** Pre-installed games include Tic Tac Toe, Snake, and Minesweeper.  
- **System Notification Manager:** Manages and displays real-time notifications.  
- **Clipboard Manager:** Tracks clipboard history and allows users to access copied content.  
- **Screen Capture Tool:** Captures desktop screenshots and allows downloading locally.  

---

## **Bonus Features**

- **Encrypted Virtual File System:** Ensures secure storage with built-in encryption.  
- **Multiple User Support:** Allows personalized sessions for different users.  
- **System Notifications:** Real-time alerts for key system activities.  
- **Network Status Simulation:** Simulates network connectivity and displays corresponding indicators.  
- **Print Simulation:** Provides print previews and output simulation.  
- **Command Prompt:** Allows basic terminal commands and system-level interactions.  
- **Clipboard Manager:** Tracks clipboard history for user convenience.  
- **Screen Capture Tool:** Captures screenshots of the current desktop view.  

---

## **Solution Architecture**

The solution architecture is designed to ensure scalability, interactivity, and data persistence. The key components and their respective technologies are as follows:

### **Frontend:**
- Built using **React (v19.0.0)** and styled components for a modern, dynamic, and interactive user interface.  
- Utilizes libraries like **react-router-dom** for seamless navigation and **react-icons** for rich visual enhancements.

### **State Management:**
- Centralized and efficient state management using **@reduxjs/toolkit (v2.5.1)** for application logic and local storage for persistent user settings.  
- **localforage (v1.10.0)** ensures offline data storage and synchronization, enabling data persistence even when the user is offline.

### **File System Simulation:**
- Simulates a virtual file system within the browser, allowing users to create, delete, and rename files and folders.  
- Secure storage is achieved using **crypto-js (v4.2.0)** for encrypting file contents and ensuring data security.

### **User Profiles:**
- Supports multiple user profiles, each with personalized settings, preferences, and data storage.  
- Profile data is maintained persistently across sessions using local storage and in-memory mechanisms.

### **Additional Enhancements:**
- **Interactive Desktop Environment:** Powered by **react-dnd** and **react-rnd** for draggable icons and resizable application windows.  
- **Visual Enhancements:** Enriched using Font Awesome and **React Icons** to provide a sleek, modern interface.

These components work together to create a desktop environment that is highly interactive, secure, and user-friendly.

---

## **Implementation Details**

The project follows a modular structure to maintain code readability and scalability:

| **Directory**       | **Description**                                                                 |
|--------------------|---------------------------------------------------------------------------------|
| `/src`              | Core application code containing components, contexts, hooks, and utility files.|
| `/public`           | Static assets, images, and configuration files.                                |
| `/components`       | Reusable UI components including taskbars, windows, and system applications.   |
| `/store`            | Centralized Redux store for state management.                                  |
| `/styles`           | Global styles using styled-components.                                         |
| `/utils`            | Utility functions for file system operations, storage, and notifications.      |

---

## **Technologies Used**

The project leverages modern web technologies for optimal performance and functionality:

| **Technology**       | **Purpose**                                                               |
|---------------------|---------------------------------------------------------------------------|
| **React (v19.0.0)**  | Building the core Single Page Application (SPA) architecture.             |
| **Redux Toolkit**    | State management and persistent data handling.                           |
| **Styled Components**| Dynamic UI styling.                                                       |
| **LocalForage**      | Browser-based offline data storage and synchronization.                   |
| **Crypto-JS**        | File encryption for secure storage within the virtual file system.        |
| **React DND & RND**  | Enables draggable and resizable desktop icons and windows.                |
| **HTML2Canvas**      | Captures desktop screenshots.                                             |
| **React Icons**      | Enhances UI with modern icons and visual elements.                        |

---

## **Application Setup and Running Instructions**

To set up and run the project locally, follow these steps:

1. Clone the project repository:
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

## **Evaluation Criteria Fulfillment**

- **Innovation:** Features such as clipboard management, encrypted file systems, and network status simulations showcase creativity.  
- **Technical Complexity:** Combines file management, user profiles, and system notifications into a unified, browser-based desktop environment.  
- **Effective Technology Use:** Leverages React, Redux, local storage, and cryptography to deliver a secure, scalable solution.  
- **User Experience:** Intuitive, responsive, and familiar interface resembling a traditional OS.  
- **Documentation:** Detailed documentation covering architecture, setup, and deployment.  
- **Code Quality:** Clean, maintainable, and modular code following industry best practices.  

---

## **Conclusion**

This project successfully demonstrates the potential of web technologies to replicate desktop OS environments. By combining features like user profiles, a virtual file system, and system utilities, it offers an engaging and practical experience. Future enhancements could include real-time collaboration, cloud integration, and the addition of third-party applications.

