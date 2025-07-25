export type Product = {
  _id?: string;
  id?: number;
  name: string;
  price: number;
  image: string;
  imageUrl?: string;
  category: string | { name: string; slug?: string };
  isNew: boolean;
  colors: string[];
  sizes: string[];
  description: string;
  material: string;
  care: string;
  features: string[];
  stock: number;
};