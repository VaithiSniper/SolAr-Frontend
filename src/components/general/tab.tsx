import React, { ReactNode, useState } from "react";

interface TabProps {
  index: number;
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}

const Tab: React.FC<TabProps> = ({ index, isActive, onClick, children }) => {
  return (
    <button
      role="tab"
      type="button"
      className={`tab ${isActive ? "tab-active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Tab;
