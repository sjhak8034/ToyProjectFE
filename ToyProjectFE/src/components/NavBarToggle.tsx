import React from 'react';

interface NavbarToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavbarToggle: React.FC<NavbarToggleProps> = ({ isOpen, setIsOpen }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      aria-controls="navbar-default"
      aria-expanded={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="sr-only">메뉴 열기</span>
      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
      </svg>
    </button>
  );
};

export default NavbarToggle;