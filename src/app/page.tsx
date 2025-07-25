'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

// Components for home page sections
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CollectionGrid from "@/components/home/CollectionGrid";
import Testimonials from "@/components/home/Testimonials";
import AdBanner from "@/components/home/AdBanner";

// Background images for slideshow
const heroImages = [
  "/images/cb1.jpg",
  "/images/cb2.jpg",
  "/images/cb3.jpg",

];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Image slideshow */}
        <div className="absolute inset-0 z-0 bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroImages[currentImage]}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Image
                src={heroImages[currentImage]}
                alt="Hero Background"
                fill
                style={{ objectFit: "cover" }}
                priority
                className="brightness-50"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="text-primary">ROYAL</span> ATTIRE
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Luxury clothing for the modern elite. Crafted with precision and passion.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              href="/products"
              className="btn-primary flex items-center justify-center gap-2 group text-white"
            >
              Explore Collection
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/about" className="btn-secondary text-white">
              Our Story
            </Link>
          </motion.div>
        </motion.div>


      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured <span className="text-primary">Collections</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our latest arrivals and bestselling pieces, crafted with the finest materials and attention to detail.
            </p>
          </motion.div>

          <FeaturedProducts />

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2 group"
            >
              View All Products
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />
      
      {/* Collection Grid Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our <span className="text-primary">Categories</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From casual elegance to formal sophistication, find the perfect style for every occasion.
            </p>
          </motion.div>

          <CollectionGrid />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our <span className="text-primary">Clients Say</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from our satisfied customers about their experience with Royal Attire.
            </p>
          </motion.div>

          <Testimonials />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our <span className="text-primary">Newsletter</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Subscribe to receive updates on new collections, exclusive offers, and styling tips.
            </p>

            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
