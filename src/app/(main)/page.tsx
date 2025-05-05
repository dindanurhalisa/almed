import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slider";
import { Category, Product } from "@/types/type";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlMed | Jual Beli Alat Kesehatan",
  description:
    "AlMed adalah platform jual beli alat kesehatan, obat-obatan, dan perlengkapan medis",
};

const fetchProduct = async (): Promise<Product[] | undefined> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`, {
      next: {
        revalidate: 60,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("🚀 ~ fetchProduct ~ error:", error);
  }
};

const fetchCategory = async (): Promise<Category[] | undefined> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`, {
      next: {
        revalidate: 60,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("🚀 ~ fetchCategory ~ error:", error);
  }
};

const Home = async () => {
  const allProduct = await fetchProduct();
  const allCategory = await fetchCategory();

  if (!allProduct) {
    return <div>Loading...</div>;
  }

  if (!allCategory) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Slider />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Produk Unggulan</h1>
        <ProductList product={allProduct} featured />
      </div>
      <div className="mt-24">
        <h1 className="mb-12 px-4 text-2xl md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          Kategori
        </h1>
        <CategoryList category={allCategory} />
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Produk Baru</h1>
        <ProductList product={allProduct} newest />
      </div>
    </div>
  );
};

export default Home;
