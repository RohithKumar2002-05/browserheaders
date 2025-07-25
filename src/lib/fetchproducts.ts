// import { client } from './sanity';
// import { Product } from '@/types/product';

// export async function fetchProducts(selectedCategory: string): Promise<Product[]> {
//   try {
//     const isAll = selectedCategory === 'All';

//     const query = isAll
//       ? `*[_type == "product"]{
//           _id,
//           name,
//           "slug": slug.current,
//           "imageUrl": image.asset->url,
//           price,
//           'category': category->name,
//           description,
//           material,
//           care,
//           features,
//           colors,
//           sizes,
//           stock,
//           isNew
//         }`
//       : `*[_type == "product" && category->name match $category]{
//           _id,
//           name,
//           "slug": slug.current,
//           "imageUrl": image.asset->url,
//           price,
//           'category': category->name,
//           description,
//           material,
//           care,
//           features,
//           colors,
//           sizes,
//           stock,
//           isNew
//         }`;

//     const params = isAll ? {} : { category: `${selectedCategory}*` };

//     const products = await client.fetch(query, params);

//     return products.map((product: any) => ({
//       ...product,
//       category: product.category || 'Uncategorized',
//       colors: product.colors || [],
//       sizes: product.sizes || [],
//       features: product.features || [],
//       isNew: product.isNew || false,
//       stock: product.stock || 0
//     }));
//   } catch (error) {
//     console.error('Error fetching products from Sanity:', error);
//     return [];
//   }
// }

import { client } from './sanity';
import { Product } from '@/types/product';

export async function fetchProducts(selectedCategory: string): Promise<Product[]> {
  try {
    console.log('Fetching products for category:', selectedCategory);
    
    const isAll = selectedCategory === 'All';

    // Use exact matching for category name instead of match operator
    const query = isAll
      ? `*[_type == "product"]{
          _id,
          name,
          "slug": slug.current,
          "imageUrl": image.asset->url,
          price,
          'category': category->name,
          description,
          material,
          care,
          features,
          colors,
          sizes,
          stock,
          isNew
        }`
      : `*[_type == "product" && category->name == $category]{
          _id,
          name,
          "slug": slug.current,
          "imageUrl": image.asset->url,
          price,
          'category': category->name,
          description,
          material,
          care,
          features,
          colors,
          sizes,
          stock,
          isNew
        }`;

    // Use exact category name instead of wildcard
    const params = isAll ? {} : { category: selectedCategory };
    
    console.log('Executing query:', query);
    console.log('With params:', params);

    const products = await client.fetch(query, params);
    console.log(`Found ${products.length} products for category: ${selectedCategory}`);

    return products.map((product: { _id: string; name: string; price: number; imageUrl: string; category: string; colors: string[]; sizes: string[]; features: string[]; isNew: boolean; stock: number; description?: string; material?: string; care?: string }) => ({
      ...product,
      category: product.category || 'Uncategorized',
      colors: product.colors || [],
      sizes: product.sizes || [],
      features: product.features || [],
      isNew: product.isNew || false,
      stock: product.stock || 0
    }));
  } catch (error) {
    console.error('Error fetching products from Sanity:', error);
    return [];
  }
}
