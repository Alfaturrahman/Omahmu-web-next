'use client';

import { useState, useEffect } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import * as apiService from 'services/authService';
import withAuth from 'hoc/withAuth';
import Image from 'next/image';

function Menu() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [menuItems, setMenuItems] = useState([]);


    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };
    async function fetchData() {
        try {
            const storeId = localStorage.getItem('store_id');
            const result = await apiService.getData(`/storeowner/daftar_menu/?store_id=${storeId}`);

            console.log("result", result);
            
            setMenuItems(result.data);  
        } catch (err) {
            console.error(err.message);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    const categories = ["Semua", "Makanan", "Minuman", "Favorit"];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Wrapper untuk Sidebar & Konten */}
        <div className="flex flex-1 relative h-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

            {/* Konten Utama */}
            <div className={`flex-1 flex flex-col gap-2 p-3 overflow-y-auto min-h-0 transition-all duration-300`}>
                {/* Kategori Menu */}
                <div className="mb-2">
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
                        .filter((item) => 
                        activeCategory === "Semua" || 
                        item.product_type === activeCategory || 
                        (activeCategory === "Favorit" && item.is_favorit)
                        )
                        .map((item) => (
                        <div key={item.product_id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                           <img
                            src={item.product_picture ? `https://posvanapi-production.up.railway.app${item.product_picture}` : '/default-image.png'}
                            alt={item.product_name}
                            className="rounded-lg w-full h-40 object-cover w-full"
                            />
                            <div className="flex items-center justify-between mt-2">
                            <h3 className="font-semibold text-sm text-black flex items-center">
                                {item.favorite_status && <span className="text-yellow-400 mr-1">⭐</span>}
                                {item.product_name}
                            </h3>
                            <p className="text-[#ECA641] font-bold text-sm whitespace-nowrap">
                                Rp {item.selling_price ? Number(item.selling_price).toLocaleString("id-ID") : "0"},00
                            </p>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  );
}


export default withAuth(Menu, ['2']);