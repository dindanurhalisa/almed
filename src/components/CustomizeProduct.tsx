"use client";

const CustomizeProduct = () => {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-medium">Choose a Color</h4>
      <ul className="flex items-center gap-3">
        <li className="relative h-8 w-8 cursor-pointer rounded-full bg-rose-500 ring-1 ring-neutral-300">
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full ring-2"></div>
        </li>
        <li className="relative h-8 w-8 cursor-pointer rounded-full bg-blue-500 ring-1 ring-neutral-300"></li>
        <li className="relative h-8 w-8 cursor-not-allowed rounded-full bg-green-500 ring-1 ring-neutral-300">
          <div className="absolute left-1/2 top-1/2 h-[2px] w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 transform rounded-full bg-rose-400"></div>
        </li>
      </ul>
      <h4 className="font-medium">Choose a Size</h4>
      <ul className="flex items-center gap-3">
        <li className="cursor-pointer rounded-md px-4 py-1 text-sm text-rose-500 ring-1 ring-rose-500">
          Small
        </li>
        <li className="cursor-pointer rounded-md bg-rose-500 px-4 py-1 text-sm text-white ring-1 ring-rose-500">
          Medium
        </li>
        <li className="cursor-not-allowed rounded-md bg-rose-200 px-4 py-1 text-sm text-white ring-1 ring-rose-200">
          Large
        </li>
      </ul>
    </div>
  );
};

export default CustomizeProduct;
