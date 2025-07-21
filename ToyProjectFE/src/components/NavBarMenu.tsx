import React from 'react';
import NavbarMenuItem from './NavBarMenuItem';

interface NavbarMenuProps {
  isOpen: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  href: string;
  isActive: boolean;
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({ isOpen }) => {
  const menuItems: MenuItem[] = [
    { id: 1, name: '홈', href: '#', isActive: true },
    { id: 2, name: '소개', href: '#', isActive: false },
    { id: 3, name: '서비스', href: '#', isActive: false },
    { id: 4, name: '가격', href: '#', isActive: false },
    { id: 5, name: '문의', href: '#', isActive: false },
  ];

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
        {menuItems.map((item) => (
          <NavbarMenuItem 
            key={item.id}
            href={item.href}
            isActive={item.isActive}
          >
            {item.name}
          </NavbarMenuItem>
        ))}
      </ul>
    </div>
  );
};

export default NavbarMenu;