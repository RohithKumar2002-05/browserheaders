'use client';
import { CartProvider } from "@/context/CartContext";
import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

export default function ClientLayout({children}:Readonly<{children: React.ReactNode}>){

   const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Register service worker with proper error handling and update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js', {
          scope: '/'
        })
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
          console.log('SW scope:', registration.scope);
          console.log('SW state:', registration.installing ? 'installing' : 
                                    registration.waiting ? 'waiting' : 
                                    registration.active ? 'active' : 'unknown');

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('New service worker installing...');
              newWorker.addEventListener('statechange', () => {
                console.log('New service worker state:', newWorker.state);
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is installed, but old one is still controlling
                  // You can notify user about update here
                  console.log('New content is available; please refresh.');
                }
              });
            }
          });

          // Check for existing service worker
          if (registration.active) {
            console.log('Service worker is active and ready!');
          }

          // Listen for controlling service worker change
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker controller changed - reloading page');
            window.location.reload();
          });

        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', event => {
        console.log('Received message from service worker:', event.data);
      });
    } else {
      console.log('Service Worker is not supported in this browser');
    }
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return(
    <div>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </div>
  )
}
