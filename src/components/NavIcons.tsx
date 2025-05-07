"use client";

import { ProductCart } from "@/types/type";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoCartOutline, IoCartSharp } from "react-icons/io5";
import { FiUser, FiLogOut } from "react-icons/fi";
import CartModal from "./CartModal";
import { useRouter } from "next/navigation";

// Add User interface
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<ProductCart[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const cartRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const fetchUserDetail = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/${userId}`);
      if (res.status !== 200) {
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        router.push('/register');
        throw new Error('User not found');
      }
      const data: User = await res.json();
      return data;
    } catch (error) {
      console.log("🚀 ~ fetchUserDetail ~ error:", error);
    }
  }

  useEffect(() => {
    // Get user from cookie
    const userCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("user="));

    if (!userCookie) {
      router.push('/login');
      return;
    }

    const userData = userCookie.split("=")[1];
    try {
      const userObject = JSON.parse(decodeURIComponent(userData));
      console.log('userObject', userObject);
      (async () => {
        const user = await fetchUserDetail(userObject.id)
        console.log('user', user)
        setUser(user || null)
      })()
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      router.push('/login');
    }
  }, [])

  useEffect(() => {
    // Get cart from localStorage
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

    // Add click outside listener for cart
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    // Only add the event listener when the cart or user menu is open
    if (isCartOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, isUserMenuOpen]);

  const removeProductFromCart = (id: string) => {
    if (!cartItems) return;
    const newCart = cartItems.filter((item: ProductCart) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
    if (cartItems.length === 1) {
      setIsCartOpen(false);
    }
  };

  const handleLogout = () => {
    // delete cookie
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    setUser(null);
    setIsUserMenuOpen(false);
    router.push("/login"); // Redirect to login page
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

      <div className="relative" ref={userRef}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          className="relative cursor-pointer"
        >
          {user ? (
            <div className="h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <FiUser className="h-6 w-6 transition-colors duration-300 hover:text-rose-500" />
          )}
        </motion.div>

        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            >
              <div className="py-1">
                {user ? (
                  <>
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2 h-4 w-4 text-rose-500" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </a>
                    <a
                      href="/register"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Register
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NavIcons;