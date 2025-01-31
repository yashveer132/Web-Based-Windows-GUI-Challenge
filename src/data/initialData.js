import {
  faFolder,
  faFileAlt,
  faCalculator,
} from "@fortawesome/free-solid-svg-icons";
import TextEditor from "../components/Applications/TextEditor";
import Calculator from "../components/Applications/Calculator";
import FileExplorer from "../components/Applications/FileExplorer";

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
    left: 20,
    top: 120,
    appId: "TextEditor",
  },
  {
    id: 3,
    icon: faCalculator,
    label: "Calculator",
    left: 20,
    top: 220,
    appId: "Calculator",
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
};
