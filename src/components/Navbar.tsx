"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Searchbar from "./Searchbar";
import NavIcons from "./NavIcons";
import Image from "next/image";
import { IoMedkitOutline } from "react-icons/io5";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 h-20 px-4 transition-all duration-300 md:px-8 lg:px-16 xl:px-32 2xl:px-64 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      {/* MOBILE */}
      <div className="flex h-full items-center justify-between sm:hidden">
        <Link href="/" className="tracking-wid font-medium">
          AlMed
        </Link>
        <Menu />
      </div>
      {/* DESKTOP */}
      <div className="hidden h-full items-center justify-between gap-8 sm:!flex">
        {/* LEFT */}
        <div className="flex w-1/3 items-center gap-12 xl:w-1/2">
          <Link href="/" className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white transition-all duration-300 hover:bg-rose-600">
              <IoMedkitOutline className="h-5 w-5" />
            </div>
            <div className="text-xl font-medium tracking-wide bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">AlMed</div>
          </Link>
          <div className="hidden gap-6 xl:!flex">
            <Link href="/" className="relative group">
              <span className="transition-colors duration-300 hover:text-rose-500">Home</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/list" className="relative group">
              <span className="transition-colors duration-300 hover:text-rose-500">Shop</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/transactions" className="relative group">
              <span className="transition-colors duration-300 hover:text-rose-500">Transactions</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex w-2/3 items-center justify-between gap-8 xl:w-1/2">
          <Searchbar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
