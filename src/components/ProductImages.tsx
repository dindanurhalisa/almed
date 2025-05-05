"use client";
import { Image } from "@/types/type";
import { useState } from "react";

type ProductImagesProps = {
  images: Image[];
};

const ProductImages = ({ images }: ProductImagesProps) => {
  const [index, setIndex] = useState<number>(0);
  return (
    <div>
      <div className="relative h-[500px]">
        <img
          src={images[index].url}
          alt="product"
          className="h-full w-full rounded-md object-cover"
        />
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="relative h-32 w-[calc(25%-0.75rem)] cursor-pointer"
            onClick={() => setIndex(idx)}
          >
            <img
              src={image.url}
              alt="product"
              className="h-full w-full rounded-md object-cover transition-all hover:brightness-90"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
