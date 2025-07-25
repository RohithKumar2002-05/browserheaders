'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Mock data for collections
const collections = [
  {
    id: 1,
    name: 'Men\'s Collection',
    image: '/images/cb4.jpg',
    slug: 'mens',
    size: 'large',
  },
  {
    id: 2,
    name: 'Women\'s Collection',
    image: '/images/wc.jpg',
    slug: 'womens',
    size: 'medium',
  },
  {
    id: 3,
    name: 'Accessories',
    image: '/images/ac.jpg',
    slug: 'accessories',
    size: 'small',
  },
  {
    id: 4,
    name: 'Limited Edition',
    image: '/images/le.jpg',
    slug: 'limited-edition',
    size: 'medium',
  },
  {
    id: 5,
    name: 'Footwear',
    image: '/images/fw.jpg',
    slug: 'footwear',
    size: 'small',
  },
];

const CollectionGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {collections.map((collection, index) => {
        // Determine grid span based on size
        let gridClass = '';
        if (collection.size === 'large') {
          gridClass = 'md:col-span-2 md:row-span-2';
        } else if (collection.size === 'medium') {
          gridClass = 'md:col-span-1 md:row-span-1';
        } else {
          gridClass = 'md:col-span-1';
        }

        return (
          <motion.div
            key={collection.id}
            className={`relative overflow-hidden rounded-lg ${gridClass}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="relative aspect-square w-full">
              <div className="w-full h-full bg-gray-800">
               <Image
  src={collection.image}
  alt={collection.name}
  fill
  style={{ objectFit: "cover" }}
  className="absolute inset-0 z-0 "
/>

              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{collection.name}</h3>
                <Link 
                  href={`/products`}
                  className="inline-block text-primary hover:underline font-medium"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CollectionGrid;