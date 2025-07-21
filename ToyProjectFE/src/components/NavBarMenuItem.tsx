import React from 'react';

interface NavbarMenuItemProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavbarMenuItem: React.FC<NavbarMenuItemProps> = ({ href, isActive, children }) => {
  const baseClasses = "block py-2 pl-3 pr-4 rounded md:border-0 md:p-0";
  const activeClasses = "text-white bg-blue-700 md:bg-transparent md:text-blue-700";
  const inactiveClasses = "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700";
  
  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  
  return (
    <li>
      <a 
        href={href} 
        className={classes}
        aria-current={isActive ? "page" : undefined}
      >
        {children}
      </a>
    </li>
  );
};

export default NavbarMenuItem;