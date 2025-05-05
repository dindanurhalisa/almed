"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoReorderThreeOutline, IoCloseOutline, IoHomeOutline, IoCartOutline, IoInformationCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import NavIcons from "./NavIcons";
import Searchbar from "./Searchbar";

const Menu = () => {
  const [open, setOpen] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    if (open) {
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
      
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".mobile-menu-container") && !target.closest(".menu-trigger")) {
          setOpen(false);
        }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "";
      };
    }
  }, [open]);
  
  return (
    <div>
      <motion.div 
        className="menu-trigger"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {open ? (
          <IoCloseOutline
            className="h-6 w-6 cursor-pointer text-rose-500"
            onClick={() => setOpen(false)}
          />
        ) : (
          <IoReorderThreeOutline
            className="h-6 w-6 cursor-pointer hover:text-rose-500 transition-colors duration-300"
            onClick={() => setOpen(true)}
          />
        )}
      </motion.div>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            className="fixed bg-white inset-0 z-50 mobile-menu-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute left-0 top-0 z-10 flex h-full w-full flex-col bg-white shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b p-5">
                <div className="text-xl font-semibold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">AlMed</div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                >
                  <IoCloseOutline className="h-6 w-6 cursor-pointer text-rose-500" />
                </motion.div>
              </div>
              
              <div className="p-5 bg-white">
                <Searchbar />
              </div>
              
              <div className="flex flex-col p-5 gap-5 bg-white">
                <motion.div
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-sm font-semibold text-gray-500">MENU</div>
                  <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <IoHomeOutline className="h-5 w-5 text-rose-500" />
                    <span className="text-lg">Home</span>
                  </Link>
                  <Link href="/list" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <IoCartOutline className="h-5 w-5 text-rose-500" />
                    <span className="text-lg">Shop</span>
                  </Link>
                  <Link href="/transactions" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <IoCartOutline className="h-5 w-5 text-rose-500" />
                    <span className="text-lg">Transactions</span>
                  </Link>
                </motion.div>
                
                <motion.div
                  className="mt-auto border-t pt-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-center">
                    <NavIcons />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
