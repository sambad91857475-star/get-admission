"use client";
import React, { useState } from 'react';
import { Menu, X, GraduationCap, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0A2540] border-b border-slate-800 sticky top-0 z-50 text-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer">
          <GraduationCap className="h-7 w-7 text-[#D4AF37]" />
          <span className="font-bold text-lg tracking-wider">GET ADMISSION</span>
        </div>

        {/* LIENS SUR ORDINATEUR */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="hover:text-[#D4AF37] transition">Accueil</a>
          <a href="#" className="hover:text-[#D4AF37] transition">À propos</a>
          <a href="#" className="hover:text-[#D4AF37] transition">Nos services</a>
          <a href="#" className="hover:text-[#D4AF37] transition">Actualités</a>
          <a href="#" className="hover:text-[#D4AF37] transition">Contact</a>
        </div>

        {/* BOUTON ESPACE ÉTUDIANT */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center gap-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A2540] font-semibold px-4 py-2 rounded transition text-sm">
            <User className="h-4 w-4" />
            Espace Étudiant
          </button>
        </div>

        {/* BOUTON MENU MOBILE */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MENU DÉROULANT SUR MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-[#0A2540] border-t border-slate-800 px-6 py-4 space-y-4 flex flex-col text-sm">
          <a href="#" className="hover:text-[#D4AF37] transition" onClick={() => setIsOpen(false)}>Accueil</a>
          <a href="#" className="hover:text-[#D4AF37] transition" onClick={() => setIsOpen(false)}>À propos</a>
          <a href="#" className="hover:text-[#D4AF37] transition" onClick={() => setIsOpen(false)}>Nos services</a>
          <a href="#" className="hover:text-[#D4AF37] transition" onClick={() => setIsOpen(false)}>Actualités</a>
          <a href="#" className="hover:text-[#D4AF37] transition" onClick={() => setIsOpen(false)}>Contact</a>
          <button className="flex items-center justify-center gap-2 w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] py-2 rounded font-semibold">
            <User className="h-4 w-4" />
            Espace Étudiant
          </button>
        </div>
      )}
    </nav>
  );
}