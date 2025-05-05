import Add from "@/components/Add";
import ProductImages from "@/components/ProductImages";
import { Product } from "@/types/type";
import { formatToRupiah } from "@/utils/helper/formatCurrency";
import { createSlugFromName } from "@/utils/helper/slug";

const fetchProduct = async (slug: string): Promise<Product | undefined> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`, {
      next: {
        revalidate: 60,
      },
    });
    const data: Product[] = await res.json();
    const selectedProduct = data.find(
      (product: Product) => createSlugFromName(product.name) === slug
    );

    return selectedProduct;
  } catch (error) {
    console.log("🚀 ~ fetchProduct ~ error:", error);
  }
};

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const product = await fetchProduct(slug);

  if (!product) {
    return <div>Loading...</div>;
  }

  const randomDiscount = Math.floor(Math.random() * 50) + 1;
  const discountMultiplier = 1 - randomDiscount / 100;

  return (
    <div className="relative flex flex-col gap-16 px-4 md:px-8 lg:flex-row lg:px-16 xl:px-32 2xl:px-64">
      {/* IMG */}
      <div className="top-20 h-max w-full lg:sticky lg:w-1/2">
        <ProductImages images={product.images} />
      </div>
      {/* Text */}
      <div className="flex w-full flex-col gap-6 lg:w-1/2">
        <p className="mt-8 text-xs text-neutral-500">
          Produk {">"} Alat Kesehatan {">"} {product.category.name}
        </p>
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="max-h-12 overflow-hidden text-neutral-500">
          {product.description}
        </p>
        <div className="h-[2px] bg-neutral-100"></div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base text-rose-500 line-through">
              {formatToRupiah(Number(product.price))}
            </h3>
            <div
              className="rounded-md bg-rose-500 px-2 py-1 text-sm font-medium text-white
            "
            >
              {randomDiscount}%
            </div>
          </div>
          <h2 className="text-3xl font-semibold">
            {formatToRupiah(Number(product.price) * discountMultiplier)}
          </h2>
        </div>
        <div className="h-[2px] bg-neutral-100"></div>
        {/* <CustomizeProduct /> */}
        <Add
          stock={Number(product.stock)}
          product={product}
          price={Number(product.price) * discountMultiplier}
        />
        <div className="h-[2px] bg-neutral-100"></div>
        <div className="text-sm">
          <h4 className="mb-4 text-lg font-medium">Informasi Produk</h4>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
