"use client";

import { ProductCart } from "@/types/type";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { IoCartOutline, IoCartSharp } from "react-icons/io5";
import CartModal from "./CartModal";
import { AnimatePresence, motion } from "framer-motion";

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<ProductCart[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
    // Listen for 'cart-updated' event
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem("cart");
      console.log('Updated cart:', updatedCart);
      
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart));
      } else {
        // If cart is empty or removed, set cartItems to empty array
        setCartItems([]);
      }
      
      // Only open cart modal if there are items
      if (updatedCart && JSON.parse(updatedCart).length > 0) {
        setIsCartOpen(true);
      } else {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("cart-updated", handleCartUpdate);

    // Add click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    // Only add the event listener when the cart is open
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]); // Add isCartOpen as a dependency

  const removeProductFromCart = (id: string) => {
    if (!cartItems) return;
    const newCart = cartItems.filter((item: ProductCart) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    if(cartItems.length === 1){
      setIsCartOpen(false);
    }
  };

  return (
    <div className="relative flex gap-4 xl:gap-6">
      <div className="relative" ref={cartRef}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen((prev) => !prev)}
          className="relative cursor-pointer"
        >
          {isCartOpen ? (
            <IoCartSharp className="h-6 w-6 text-rose-500 transition-colors duration-300" />
          ) : (
            <IoCartOutline className="h-6 w-6 transition-colors duration-300 hover:text-rose-500" />
          )}
        </motion.div>
        
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white"
            >
              {cartItems.length}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isCartOpen && (
            <CartModal cartItems={cartItems} remove={removeProductFromCart} closeModal={() => setIsCartOpen(false)} />
          )}
        </AnimatePresence>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <UserButton />
      </motion.div>
    </div>
  );
};

export default NavIcons;