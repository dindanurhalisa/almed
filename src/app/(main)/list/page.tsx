import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import { Category, Product, Sort } from "@/types/type";

const fetchProduct = async (): Promise<Product[] | undefined> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`, {
      next: {
        revalidate: 60,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("🚀 ~ fetchProduct ~ err:", err);
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

const ProductListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { name: search, category, sort, min, max } = searchParams;
  const allProduct = await fetchProduct();
  const allCategory = await fetchCategory();

  if (!allProduct) {
    return <div>Loading...</div>;
  }

  if (!allCategory) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {/* Campaign */}
      <div className="hidden h-64  justify-between bg-pink-50 p-4 md:!flex">
        <div className="flex w-full flex-col items-center justify-center gap-8 xl:w-2/3">
          <h1 className="text-4xl font-semibold leading-[48px] text-neutral-700">
            Promo Spesial Bulan Ini <br /> Diskon Hingga 50%
          </h1>
          <a href="#product">
            <button className="w-max rounded-3xl bg-rose-500 px-5 py-3 text-sm text-white">
              Beli Sekarang
            </button>
          </a>
        </div>
        <div className="hidden rounded-lg xl:!flex">
          <img
            src="https://picsum.photos/800/400"
            alt="photo"
            className="h-full rounded-lg object-cover"
          />
        </div>
      </div>
      {/* FILTER */}
      <div id="filter">
        {allCategory && <Filter category={allCategory} />}
      </div>
      {/* PRODUCT */}
      <h1 className="mt-12 text-xl font-semibold" id="product">
        Produk untuk Kamu
      </h1>

      <ProductList
        product={allProduct}
        category={category}
        sort={(sort as Sort) || "newest"}
        search={search}
        min={min}
        max={max}
      />
    </div>
  );
};

export default ProductListPage;
