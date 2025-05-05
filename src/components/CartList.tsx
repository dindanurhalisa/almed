'use client';

import { ProductCart } from '@/types/type';
import { formatToRupiah } from '@/utils/helper/formatCurrency';
import Image from 'next/image';
import React from 'react';

type CartListProps = {
  cartItems: ProductCart[];
  removeProductFromCart: (id: string) => void;
  changeQuantity: (id: string, quantity: number) => void;
};

const CartList = ({
  cartItems,
  removeProductFromCart,
  changeQuantity,
}: CartListProps) => {
  return (
    <div className="flex flex-1 flex-col gap-8">
      {cartItems.map((item: ProductCart) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 border-b-[1px] border-neutral-300 pb-2 sm:flex-row"
        >
          <Image
            src={item.images[0].url}
            width={600}
            height={600}
            alt="logo"
            className="h-40 w-40 rounded-md object-cover"
          />
          <div className="flex w-full flex-col justify-between">
            {/* TOP */}
            <div>
              {/* TITLE */}
              <div className="flex items-center justify-between gap-8">
                {/* make elipsis */}
                <h3 className="font-semibold">{item.name}</h3>
                <div className="rounded-sm bg-neutral-100 p-1">
                  {formatToRupiah(Number(item.price))}
                </div>
              </div>
              {/* DESC */}
              <div className="max-h-10 overflow-hidden text-sm text-neutral-500">
                {item.description}
              </div>
            </div>
            {/* BOTTOM */}
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-neutral-900">
                Stok. {item.stock}
              </span>
              <span
                className="cursor-pointer text-rose-500"
                onClick={() => removeProductFromCart(item.id)}
              >
                Remove
              </span>
            </div>
          </div>
          {/* QUANTITY */}
          <div className="flex h-fit w-28 items-center justify-between rounded-3xl bg-neutral-100 px-1 py-1">
            <button
              onClick={() => changeQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity === 1}
              style={{
                cursor: item.quantity === 1 ? 'not-allowed' : '',
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full pb-0.5 text-xl transition-all hover:enabled:bg-neutral-200"
            >
              -
            </button>
            <span className="font-bold">{item.quantity}</span>
            <button
              onClick={() => changeQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity === Number(item.stock)}
              style={{
                cursor:
                  item.quantity === Number(item.stock) ? 'not-allowed' : '',
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full pb-0.5 pr-0.5 text-xl transition-all hover:enabled:bg-neutral-200"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;
