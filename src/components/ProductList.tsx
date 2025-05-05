'use client';

import { Product, Sort } from '@/types/type';
import { formatToRupiah } from '@/utils/helper/formatCurrency';
import { createSlugFromName } from '@/utils/helper/slug';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdRefresh } from 'react-icons/io';
import { RiShoppingBasketLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

type ProductListProps = {
  product: Product[];
  newest?: boolean;
  featured?: boolean;
  category?: string;
  sort?: Sort;
  search?: string;
  min?: string;
  max?: string;
};

const ProductList = ({
  product,
  newest,
  featured,
  category,
  sort,
  search,
  min,
  max,
}: ProductListProps) => {
  const router = useRouter();
  
  let filteredProducts = [...product];
  
  if (newest) {
    filteredProducts = filteredProducts.slice(0, 4);
  }
  if (featured) {
    filteredProducts = filteredProducts.filter((item: Product) => item.isFeatured === true);
  }
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(
      (product: Product) => product.category.name === category
    );
  }
  if (sort) {
    if (sort === 'price_asc') {
      filteredProducts.sort(
        (a: Product, b: Product) => Number(a.price) - Number(b.price)
      );
    }
    if (sort === 'price_desc') {
      filteredProducts.sort(
        (a: Product, b: Product) => Number(b.price) - Number(a.price)
      );
    }
    if (sort === 'newest') {
      filteredProducts.sort(
        (a: Product, b: Product) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    if (sort === 'oldest') {
      filteredProducts.sort(
        (a: Product, b: Product) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
  }
  if (search) {
    filteredProducts = filteredProducts.filter((item: Product) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply price range filter
  if (min || max) {
    filteredProducts = filteredProducts.filter((item: Product) => {
      const price = Number(item.price);
      const minPrice = min ? Number(min) : 0;
      const maxPrice = max ? Number(max) : Infinity;
      
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Function to reset all filters and show all products
  const handleShowAllProducts = () => {
    router.push('/list');
  };
  
  return (
    <div className="mt-12 flex flex-wrap items-stretch justify-start gap-x-8 gap-y-16">
      {filteredProducts.length === 0 ? (
        <div className="mx-auto w-full py-16 flex flex-col items-center justify-center">
          <div className="rounded-full bg-rose-100 p-8 mb-6">
            <RiShoppingBasketLine className="h-16 w-16 text-rose-500" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Tidak ada produk ditemukan</h2>
          <p className="text-center text-neutral-500 max-w-md mb-8">
            {search 
              ? `Tidak ada produk yang cocok dengan pencarian "${search}"`
              : category && category !== 'all'
                ? `Tidak ada produk dalam kategori "${category}"`
                : min || max
                  ? `Tidak ada produk dalam rentang harga yang dipilih`
                  : `Tidak ada produk yang tersedia saat ini`
            }
          </p>
          <button 
            onClick={handleShowAllProducts}
            className="flex items-center gap-2 rounded-md bg-rose-500 hover:bg-rose-600 px-6 py-3 text-white font-medium transition-colors duration-300"
          >
            <IoMdRefresh className="h-5 w-5" />
            Tampilkan Semua Produk
          </button>
        </div>
      ) : (
        filteredProducts.map((item: Product) => (
          <Link
            key={item.id}
            href={`/${createSlugFromName(item.name)}`}
            className="flex w-full flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          >
            <div className="relative h-80 w-full">
              <Image
                src={item.images[0].url}
                alt="photo"
                fill
                className="absolute z-1 h-80 w-full rounded-md object-cover duration-500 ease-in-out hover:opacity-0"
              />
              <Image
                src={item.images[1] ? item.images[1].url : item.images[0].url}
                alt="photo"
                fill
                className="absolute z-0 h-80 w-full rounded-md object-cover duration-500 ease-in-out"
              />
            </div>
            <div className="flex flex-col justify-between">
              <h1 className="text-sm font-medium">{item.name}</h1>
              <p className="text-lg font-bold">
                {formatToRupiah(Number(item.price))}
              </p>
            </div>
            <p className="mt-auto max-h-16 overflow-hidden text-sm text-neutral-500">
              {item.description}
            </p>
            <button className="w-max rounded-2xl px-4 py-2 text-xs ring-1 ring-rose-500 transition-all duration-300 ease-in-out hover:bg-rose-500 hover:text-white">
              Tambah ke Keranjang
            </button>
          </Link>
        ))
      )}
    </div>
  );
};

export default ProductList;