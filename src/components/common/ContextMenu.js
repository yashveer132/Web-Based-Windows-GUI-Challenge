import React from "react";
import styled from "styled-components";

const MenuContainer = styled.div`
  position: fixed;
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  padding: 5px 0;
  z-index: 1000;
  color: var(--text-color);
`;

const MenuItem = styled.div`
  padding: 5px 20px;
  cursor: pointer;

  &:hover {
    background-color: var(--taskbar-button-active);
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: var(--window-border);
  margin: 5px 0;
`;

const ContextMenu = ({ x, y, items, onClose }) => {
  return (
    <MenuContainer style={{ left: x, top: y }}>
      {items.map((item, index) =>
        item.type === "separator" ? (
          <Separator key={index} />
        ) : (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.label}
          </MenuItem>
        )
      )}
    </MenuContainer>
  );
};

export default ContextMenu;
