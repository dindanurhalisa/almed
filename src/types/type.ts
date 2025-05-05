export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  stock: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  category: Category;
}

export interface Banner {
  id: string;
  storeId: string;
  label: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCart extends Product {
  quantity: number;
}

export interface Image {
  id: string;
  productId: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  storeId: string;
  bannerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Sort = "newest" | "price_asc" | "price_desc" | "oldest";

export interface OrderItem {
  id: string;
  transactionId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = "COD" | "WHATSAPP";

export interface Transaction {
  id: string;
  storeId: string;
  orderItems: OrderItem[];
  userId: string;
  name: string;
  phone: string;
  address: string;
  postCode: string;
  paymentMethod: PaymentMethod;
  paymentProofUrl: string;
  isPaid: boolean;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
