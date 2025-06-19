import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar2() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(window.location.hash || "#Home");

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: "HOME", href: "/" },
  ];


  return (
    <nav className="bg-red-600 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        {/* Logo (izquierda en móvil y desktop) */}
        <div className="md:flex-shrink-0">
            <img
            href= "/"
            src="/Logo.png"
            alt="Logo"
            className="md:mt-10 h-12 md:h-20 w-auto ml-auto md:ml-0"
            />
        </div>

        {/* Botón hamburguesa (derecha solo en móvil) */}
        <div className="flex items-center md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>

        {/* Navegación escritorio */}
        <div className="hidden md:flex space-x-6 ml-auto">
            {navItems.map((item) => (
            <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium text-white hover:text-gray-300 ${
                active === item.href ? "border-b-2 border-white pb-1" : ""
                }`}
            >
                {item.label}
            </a>
            ))}
        </div>
        </div>
    </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden bg-stone-400 shadow-md px-4 py-2 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block text-sm text-white hover:text-gray-300 font-medium ${
                active === item.href ? "border-b border-white pb-1" : ""
              }`}
              onClick={() => {
                setActive(item.href);
                setIsOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
