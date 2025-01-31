import {
  faFolder,
  faFileAlt,
  faCalculator,
  faTerminal,
  faGamepad,
  faChessBoard,
  faClipboard,
  faCameraRetro,
} from "@fortawesome/free-solid-svg-icons";

import TextEditor from "../components/Applications/TextEditor";
import Calculator from "../components/Applications/Calculator";
import FileExplorer from "../components/Applications/FileExplorer";
import CommandPrompt from "../components/Applications/CommandPrompt";
import TicTacToe from "../components/Applications/TicTacToe";
import Personalization from "../components/Applications/Personalization";
import Snake from "../components/Applications/Snake";
import Minesweeper from "../components/Applications/Minesweeper";
import ClipboardManager from "../components/Applications/ClipboardManager";
import ScreenCaptureTool from "../components/Applications/ScreenCaptureTool";

export const initialIcons = [
  {
    id: 1,
    icon: faFolder,
    label: "My Documents",
    left: 20,
    top: 20,
    appId: "FileExplorer",
  },
  {
    id: 2,
    icon: faFileAlt,
    label: "Notepad",
    left: 30,
    top: 20,
    appId: "TextEditor",
  },
  {
    id: 3,
    icon: faCalculator,
    label: "Calculator",
    left: 40,
    top: 20,
    appId: "Calculator",
  },
  {
    id: 4,
    icon: faTerminal,
    label: "Command Prompt",
    left: 50,
    top: 20,
    appId: "CommandPrompt",
  },
  {
    id: 5,
    icon: faGamepad,
    label: "TicTacToe",
    left: 60,
    top: 20,
    appId: "TicTacToe",
  },
  {
    id: 6,
    icon: faChessBoard,
    label: "Minesweeper",
    left: 70,
    top: 20,
    appId: "Minesweeper",
  },
  {
    id: 7,
    icon: faGamepad,
    label: "Snake",
    left: 80,
    top: 20,
    appId: "Snake",
  },
  {
    id: 8,
    icon: faClipboard,
    label: "Clipboard",
    left: 90,
    top: 20,
    appId: "ClipboardManager",
  },
  {
    id: 9,
    icon: faCameraRetro,
    label: "ScreenCapture",
    left: 100,
    top: 20,
    appId: "ScreenCaptureTool",
  },
  {
    id: 10,
    icon: faFileAlt,
    label: "Personalize",
    left: 110,
    top: 20,
    appId: "Personalization",
  },
];

export const initialApps = {
  FileExplorer: {
    title: "File Explorer",
    component: <FileExplorer />,
  },
  TextEditor: {
    title: "Notepad",
    component: <TextEditor />,
  },
  Calculator: {
    title: "Calculator",
    component: <Calculator />,
  },
  CommandPrompt: {
    title: "Command Prompt",
    component: <CommandPrompt />,
  },
  TicTacToe: {
    title: "TicTacToe",
    component: <TicTacToe />,
  },
  Minesweeper: {
    title: "Minesweeper",
    component: <Minesweeper />,
  },
  Snake: {
    title: "Snake",
    component: <Snake />,
  },
  ClipboardManager: {
    title: "Clipboard Manager",
    component: <ClipboardManager />,
  },
  ScreenCaptureTool: {
    title: "Screen Capture Tool",
    component: <ScreenCaptureTool />,
  },
  Personalization: {
    title: "Personalization",
    component: <Personalization />,
  },
};
