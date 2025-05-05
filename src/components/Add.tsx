'use client';
import { Product } from '@/types/type';
import { useState } from 'react';

type AddProps = {
  stock: number;
  product: Product;
  price: number;
};

const Add = ({ stock, product, price }: AddProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleSubtractQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCartLocalStorage = () => {
    const cart = localStorage.getItem('cart');
    const cartData = cart ? JSON.parse(cart) : [];

    const isExist = cartData.find((item: Product) => item.id === product.id);

    if (isExist) {
      cartData.map((item: Product) => {
        if (item.id === product.id) {
          item.stock = quantity.toString();
        }
      });
    } else {
      cartData.push({ ...product, quantity, price: price.toString() });
    }

    localStorage.setItem('cart', JSON.stringify(cartData));
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Pilih Jumlah</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex w-28 items-center justify-between rounded-3xl bg-neutral-100 px-1 py-1">
            <button
              onClick={handleSubtractQuantity}
              disabled={quantity === 1}
              style={{
                cursor: quantity === 1 ? 'not-allowed' : '',
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full pb-0.5 text-xl transition-all hover:enabled:bg-neutral-200"
            >
              -
            </button>
            <span className="font-bold">{quantity}</span>
            <button
              onClick={handleAddQuantity}
              disabled={quantity === stock}
              style={{
                cursor: quantity === stock ? 'not-allowed' : '',
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full pb-0.5 pr-0.5 text-xl transition-all hover:enabled:bg-neutral-200"
            >
              +
            </button>
          </div>
          <div className="text-base">
            Stok: <span className="font-bold text-rose-500">{stock} pcs</span>
          </div>
        </div>
        <button
          onClick={addToCartLocalStorage}
          className="w-max rounded-3xl bg-rose-500 px-4 py-2 text-sm text-white ring-1 ring-rose-500 transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-rose-200 disabled:text-white disabled:ring-0"
        >
          Tambah Ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default Add;
