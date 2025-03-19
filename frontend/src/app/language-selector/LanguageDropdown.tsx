import React from "react";
import { DesktopDropdown } from "./DesktopDropdown";
import { MobileDropdown } from "./MobileDropdown";

const LanguageDropdown: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <DesktopDropdown />
    </div>
  );
}

export default LanguageDropdown;