"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Diskon Hingga 50%!",
    description:
      "Dapatkan produk alat kesehatan terbaik dengan harga spesial. Penawaran terbatas!",
    url: "/list",
  },
  {
    id: 2,
    title: "Produk Kesehatan Terbaru",
    description:
      "Selalu up-to-date dengan alat kesehatan terbaru untuk kebutuhan rumah sakit dan pribadi.",
    url: "/list",
  },
  {
    id: 3,
    title: "Gratis Ongkir ke Seluruh Indonesia!",
    description:
      "Nikmati pengiriman gratis untuk semua pembelian alat kesehatan tanpa minimal order.",
    url: "/list",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  });
  return (
    <div className="h-[calc(100vh-80px)] w-full overflow-hidden relative">
      <div
        className="flex h-full transition-all duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
          width: `${slides.length * 100}%`
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`flex h-full flex-col gap-16 lg:flex-row`}
            style={{ width: `${100 / slides.length}%` }}
          >
            {/* Text Container */}
            <div className="flex h-1/2 flex-col items-center justify-center gap-8 p-12 text-center lg:h-full lg:w-1/2 2xl:gap-12">
              <h1 className="text-5xl font-semibold lg:text-6xl 2xl:text-8xl">
                {slide.title}
              </h1>{" "}
              <h2 className="text-sm lg:text-base 2xl:text-lg">
                {slide.description}
              </h2>
              <Link href={"/list"}>
                <button className="rounded-md bg-black px-4 py-3 text-white">
                  Beli
                </button>
              </Link>
            </div>
            {/* Image Container */}
            <div className="relative h-1/2 w-full lg:h-full lg:w-1/2">
              <Image
                src={`/banners/${slide.id}.jpg`}
                alt={slide.title}
                fill
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 m-auto flex gap-4 rounded-lg bg-white/30 p-4 backdrop-blur-sm">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={`flex h-3 w-3 cursor-pointer items-center justify-center rounded-full ring-1 ring-neutral-900 transition-all ${
              currentSlide === index ? "scale-150" : ""
            }`}
          >
            {currentSlide === index && (
              <div className="h-1.5 w-1.5 rounded-full bg-neutral-900"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
