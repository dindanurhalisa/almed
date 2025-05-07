'use client';

import CartList from '@/components/CartList';
import CheckoutModal from '@/components/CheckoutModal';
import { ProductCart } from '@/types/type';
import { formatToRupiah } from '@/utils/helper/formatCurrency';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<ProductCart[]>([]);
  const [total, setTotal] = useState<number>(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const checkoutAction = searchParams.get('action') == 'checkout' || false;

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
    // Listen for 'cart-updated' event
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart));
      }
    };
    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const subtotal = cartItems.reduce(
    (acc: number, item: ProductCart) =>
      acc + Number(item.price) * item.quantity,
    0
  );

  useEffect(()=>{
    const calculateTotal = subtotal + 3000 + 10000;
    setTotal(calculateTotal);
  },[cartItems])

  const removeProductFromCart = (id: string) => {
    if (!cartItems) return;
    const newCart = cartItems.filter((item: ProductCart) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const changeQuantity = (id: string, quantity: number) => {
    const newCart = cartItems.map((item: ProductCart) => {
      if (item.id === id) {
        item.quantity = quantity;
      }
      return item;
    });
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="text-lg text-neutral-700">Keranjang masih kosong. </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col gap-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <CheckoutModal show={checkoutAction} total={total} />
      <h1 className="mt-8 text-3xl">Keranjang Anda</h1>
      <div className="flex flex-col gap-8 xl:flex-row">
        <CartList
          cartItems={cartItems}
          removeProductFromCart={removeProductFromCart}
          changeQuantity={changeQuantity}
        />
        <div className="top-32 flex h-64 flex-col rounded-lg bg-slate-50 p-4 shadow-md xl:sticky xl:w-64">
          <CheckoutPriceList label="Subtotal" price={subtotal} />
          <CheckoutPriceList label="Admin" price={3000} />
          <CheckoutPriceList label="Ongkir" price={10000} />
          <div className="mb-4 mt-auto flex items-center justify-between text-lg font-bold text-neutral-900">
            <span className="font-normal">Total</span>
            <span>{formatToRupiah(total)}</span>
          </div>
          <button
            onClick={() => router.push(`/cart?action=checkout`)}
            className="flex w-full justify-end text-lg "
          >
            <button className="w-full rounded-md bg-black px-4 py-3 text-white hover:bg-slate-800">
              Checkout
            </button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

const CheckoutPriceList = ({
  label,
  price,
}: {
  label: string;
  price: number;
}) => {
  return (
    <div className="flex items-center justify-between text-sm font-semibold text-neutral-700">
      <span className="font-normal">{label}</span>
      <span>{formatToRupiah(price)}</span>
    </div>
  );
};
