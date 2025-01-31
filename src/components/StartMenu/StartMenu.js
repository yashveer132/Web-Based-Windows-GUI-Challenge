import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const MenuContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 300px;
  background-color: var(--window-bg);
  border: outset 2px var(--window-border);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 1000;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: var(--taskbar-bg);
`;

const SearchInput = styled.input`
  flex: 1;
  margin-left: 10px;
  padding: 5px;
  border: inset 2px var(--window-border);
`;

const MenuItems = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: var(--taskbar-button-active);
  }
`;

const StartMenu = ({ isOpen, onClose, apps }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter((app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apps, searchTerm]);

  const handleItemClick = useCallback(
    (app) => {
      app.onClick();
      onClose();
    },
    [onClose]
  );

  return (
    <MenuContainer isOpen={isOpen}>
      <SearchBar>
        <FontAwesomeIcon icon={faSearch} />
        <SearchInput
          type="text"
          placeholder="Search apps..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchBar>
      <MenuItems>
        {filteredApps.map((app) => (
          <MenuItem key={app.id} onClick={() => handleItemClick(app)}>
            {app.title}
          </MenuItem>
        ))}
      </MenuItems>
    </MenuContainer>
  );
};

export default StartMenu;
