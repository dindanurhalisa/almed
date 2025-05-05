'use client';

import { Category } from '@/types/type';
import Link from 'next/link';

type CategoryListProps = {
  category: Category[];
};

const CategoryList = ({ category }: CategoryListProps) => {
  return (
    <div className="scrollbar-hidden overflow-x-scroll px-4">
      <div className="flex gap-4 md:gap-8">
        {category.map((item: Category) => (
          <Link
            key={item.id}
            href={`/list?category=${item.name}`}
            className="xl:-1/6 w-full flex-shrink-0 sm:w-1/2 lg:w-1/4"
          >
            <div className="relative h-96 w-full bg-slate-100">
              <img
                src="https://picsum.photos/800/1200"
                alt="photo"
                className="h-full w-full rounded-md object-cover brightness-50 duration-500 ease-in-out"
              />
              <h1 className="absolute  left-1/2 top-1/2 z-10 m-auto -translate-x-1/2 -translate-y-1/2 text-clip text-center text-2xl tracking-wide text-white">
                {item.name}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
