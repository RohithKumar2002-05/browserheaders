'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdBanner() {
  return (
    <section className="py-16 bg-royal-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-royal-cream mb-4">
                <span className="text-royal-gold">Exclusive</span> Collection
              </h2>
              <p className="text-royal-cream/80 max-w-md mb-6">
                Discover our limited edition pieces crafted with the finest materials. 
                Elegance redefined for the modern connoisseur.
              </p>
              <div className="flex gap-4">
                <Link href="/products" className="btn-primary cursor-pointer">
                  Shop Now
                </Link>
                <div className="flex items-center">
                  <span className="text-royal-gold font-display text-xl">30% OFF</span>
                  <span className="ml-2 text-royal-cream/70 text-sm">Limited Time</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 border border-royal-gold/30 rounded-lg"></div>
              <div className="absolute -inset-2 border border-royal-gold/50 rounded-lg"></div>
              <div className="bg-royal-gold/10 backdrop-blur-sm p-6 rounded-lg border border-royal-gold">
                <div className="text-royal-cream font-display text-3xl mb-2">Royal Attire</div>
                <div className="text-royal-cream/80 mb-4">Luxury Redefined</div>
                <div className="text-royal-gold font-bold text-xl mb-1">Summer Collection 2023</div>
                <div className="text-royal-cream/70 text-sm">Elegance for every occasion</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}