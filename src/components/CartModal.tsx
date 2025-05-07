"use client";

import { ProductCart } from "@/types/type";
import { formatToRupiah } from "@/utils/helper/formatCurrency";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoTrashOutline } from "react-icons/io5";
import { RiShoppingBasketLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

type CartModalProps = {
  cartItems: ProductCart[];
  remove: (id: string) => void;
  closeModal: () => void;
};

const CartModal = ({ cartItems, remove, closeModal }: CartModalProps) => {
  const router = useRouter();
  const subtotal = cartItems.reduce(
    (acc: number, item: ProductCart) =>
      acc + Number(item.price) * item.quantity,
    0,
  );

  const goToLink = (link: string) => {
    router.push(link);
    closeModal();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-16 z-20 flex w-max flex-col gap-6 rounded-md bg-white p-6 shadow-lg ring-1 ring-neutral-200">
      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-3 py-6 px-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="rounded-full bg-rose-100 p-4"
          >
            <RiShoppingBasketLine className="h-12 w-12 text-rose-500" />
          </motion.div>
          <h3 className="text-lg font-semibold text-neutral-800">Keranjang anda masih kosong</h3>
          <p className="text-center text-sm text-neutral-500">Tambahkan produk ke keranjang untuk mulai berbelanja</p>
            <motion.button 
              onClick={() => goToLink('/list')}
              className="mt-2 rounded-md bg-rose-500 hover:bg-rose-600 px-4 py-2 text-white transition-colors duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Belanja Sekarang
            </motion.button>
        </motion.div>
      ) : (
        <>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent"
          >
            Keranjang
          </motion.h2>
          {/* LIST - Now with max-height and scrolling */}
          <div className="flex flex-col gap-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {/* ITEM */}
            {cartItems.map((item: ProductCart, index) => (
              <motion.div 
                key={item.id} 
                className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Image
                  src={item.images[0].url}
                  width={72}
                  height={96}
                  alt="logo"
                  className="rounded-md object-cover"
                />
                <div className="flex w-full flex-col justify-between">
                  {/* TOP */}
                  <div>
                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-8">
                      {/* make elipsis */}
                      <h3 className="max-w-56 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                        {item.name}
                      </h3>
                      <div className="rounded-sm bg-neutral-100 p-1">
                        {formatToRupiah(Number(item.price))}
                      </div>
                    </div>
                    {/* DESC */}
                    <div className="max-h-10 max-w-56 overflow-hidden text-sm text-neutral-500">
                      {item.description}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-neutral-900">
                      Qty. {item.quantity}
                    </span>
                    <motion.button
                      className="flex items-center gap-1 cursor-pointer text-rose-500 hover:text-rose-600 transition-colors duration-300"
                      onClick={() => remove(item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IoTrashOutline className="h-3 w-3" /> Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* BOTTOM */}
          <div>
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatToRupiah(subtotal)}</span>
            </div>
            <p className="mb-4 mt-2 text-sm text-neutral-500">
              Ongkir dan Pajak dihitung saat Checkout
            </p>
            <div className="flex justify-between text-sm">
              <motion.button 
                onClick={() => goToLink('/cart')}
                className="rounded-md px-4 py-3 ring-1 ring-neutral-300 hover:bg-gray-50 transition-colors duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                  Lihat Keranjang
                </motion.button>
              <motion.button 
                onClick={() => goToLink('/cart?action=checkout')}
                className="rounded-md bg-rose-500 hover:bg-rose-600 px-4 py-3 text-white transition-colors duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                  Checkout
                </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CartModal;