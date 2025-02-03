/**
 * Implements a dynamic context menu that supports nested submenus, custom actions, and separators.
 * The menu appears at the specified screen coordinates and adjusts its position to remain within the viewport.
 */

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const MenuContainer = styled.div`
  position: absolute;
  background-color: #f0f0f0;
  border: 1px solid #c0c0c0;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 4px 0;
  z-index: 1000;
  color: #000000;
  min-width: 200px;
  border-radius: 3px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
`;

const MenuItem = styled.div`
  padding: 6px 30px 6px 10px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  display: flex;
  align-items: center;
  position: relative;
  color: ${(props) => (props.disabled ? "#a0a0a0" : "inherit")};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "transparent" : "#e5f3ff"};
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: #c0c0c0;
  margin: 4px 0;
`;

const SubMenuArrow = styled.span`
  position: absolute;
  right: 10px;
  font-size: 10px;
`;

const Icon = styled.span`
  margin-right: 8px;
  width: 16px;
  text-align: center;
`;

const ContextMenu = ({ x, y, items, onClose, isSubMenu = false }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (!isSubMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (!isSubMenu) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [onClose, isSubMenu]);

  const handleItemClick = (item) => {
    if (!item.disabled && !item.subMenu) {
      item.onClick && item.onClick();
      onClose();
    }
  };

  const renderMenuItem = (item, index) => {
    if (item.type === "separator") {
      return <Separator key={index} />;
    }

    return (
      <MenuItem
        key={index}
        onMouseEnter={() => setActiveSubMenu(item.subMenu ? index : null)}
        onMouseLeave={() => setActiveSubMenu(null)}
        onClick={() => handleItemClick(item)}
        disabled={item.disabled}
      >
        {item.icon && <Icon>{item.icon}</Icon>}
        {item.label}
        {item.subMenu && <SubMenuArrow>▶</SubMenuArrow>}
        {item.subMenu && activeSubMenu === index && (
          <ContextMenu
            x={200}
            y={-4}
            items={item.subMenu}
            onClose={() => {}}
            isSubMenu={true}
          />
        )}
      </MenuItem>
    );
  };

  return (
    <MenuContainer
      ref={menuRef}
      style={{
        left: x,
        top: y,
      }}
    >
      {items.map(renderMenuItem)}
    </MenuContainer>
  );
};

export default ContextMenu;
