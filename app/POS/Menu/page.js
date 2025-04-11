'use client';

import { useState, useEffect } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import Image from 'next/image';

export default function Kasir() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const menuItems = [
        { id: 1, name: "Sate Kambing", price: 15000, image: "/sate-kambing.png", category: "Makanan", favorite: true },
        { id: 2, name: "Kopi Susu", price: 7000, image: "/kopi-susu.png", category: "Minuman", favorite: true },
        { id: 3, name: "Nasi Goreng", price: 12000, image: "/sate-kambing.png", category: "Makanan", favorite: false },
        { id: 4, name: "Teh Manis", price: 5000, image: "/kopi-susu.png", category: "Minuman", favorite: false },
    ];

    const categories = ["Semua", "Makanan", "Minuman", "Favorit"];

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Wrapper untuk Sidebar & Konten */}
        <div className="flex flex-1 relative">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

            {/* Konten Kasir */}
            <div className="p-4 md:p-6 transition-all duration-300">
                {/* Kategori Menu */}
                <div className="mb-6">
                    <h2 className="text-lg md:text-xl text-black font-semibold mb-3">Menu Pesanan</h2>
                    <div className="overflow-x-auto max-w-full">
                        <div className="flex space-x-2 md:space-x-4 w-full flex-wrap">
                            {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1 md:px-4 md:py-2 mb-3 rounded-lg text-sm md:text-lg font-medium whitespace-nowrap ${
                                activeCategory === category ? "bg-[#ECA641] text-white" : "bg-white text-[#ECA641] border border-[#ECA641]"
                                }`}
                            >
                                {category}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daftar Menu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {menuItems
                    .filter((item) => activeCategory === "Semua" || item.category === activeCategory || (activeCategory === "Favorit" && item.favorite))
                    .map((item) => (
                        <div key={item.id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                            <Image src={item.image} width={300} height={200} alt={item.name} className="rounded-lg w-full h-40 object-cover" />
                            <div className="flex items-center justify-between mt-2">
                                <h3 className="font-semibold text-sm text-black flex items-center">
                                    {item.favorite && <span className="text-yellow-400 mr-1">⭐</span>}
                                    {item.name}
                                </h3>
                                <p className="text-[#ECA641] font-bold text-sm whitespace-nowrap">
                                    Rp {item.price.toLocaleString("id-ID")},00
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
