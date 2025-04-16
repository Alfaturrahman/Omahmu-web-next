'use client';

import { useState } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Filter, Search } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Untuk desktop
  const [search, setSearch] = useState("");


  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      // Jika layar kecil (mobile/tablet), buka/tutup sidebar overlay
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      // Jika layar besar (desktop), collapse/expand sidebar
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Wrapper untuk Sidebar & Konten */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Konten Dashboard */}
        <div className={`flex-1 flex flex-col gap-6 p-3 transition-all duration-300`}>
            {/* Judul dan Search Bar */}
            <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-5">
                <h1 className="text-base md:text-md lg:text-lg font-semibold text-black">
                    Daftar Toko
                </h1>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2 transform text-gray-500" />
                    <input
                    type="text"
                    className="pl-10 text-gray-500 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-lg"
                    placeholder="Cari berdasarkan nama"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>


            {/* Stat Cards */}
            <div className="w-full flex flex-wrap justify-between px-4">
                {/* Total Toko Terdaftar */}
                <div className="w-full md:w-[200px] bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm mb-4">
                    <h2 className="text-[#F28C20] font-semibold mb-2">Total Toko Terdaftar</h2>
                    <p className="text-2xl font-bold text-black">100</p>
                </div>

                {/* Toko Aktif */}
                <div className="w-full md:w-[200px] bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm mb-4">
                    <h2 className="text-[#F28C20] font-semibold mb-2">Toko Aktif</h2>
                    <p className="text-2xl font-bold text-black">80</p>
                </div>

                {/* Toko Nonaktif */}
                <div className="w-full md:w-[200px] bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm mb-4">
                    <h2 className="text-[#F28C20] font-semibold mb-2">Toko Nonaktif</h2>
                    <p className="text-2xl font-bold text-black">10</p>
                </div>
            </div>

            {/* List Toko */}
            <div className="w-full flex flex-wrap justify-between px-4">
                {/* Card Toko */}
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="w-full md:w-[350px] bg-white border border-gray-400 rounded-xl p-4 text-left mb-4">
                        {/* Gambar Logo */}
                        <img
                            src="/Logo-Toko.png"
                            alt="Logo Toko"
                            className="w-full p-3 h-auto mx-auto"
                        />

                        {/* Nama Toko */}
                        <h3 className="mt-4 font-semibold text-black">
                            AngkringanOmahmu – Batam Center
                        </h3>

                        {/* Jam Operasional */}
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-4">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            </svg>
                            06.00pm - 1.00am
                        </div>

                        {/* Tombol */}
                        <div className="flex justify-end">
                            <button className="bg-[#F6B543] hover:bg-[#eca641] text-white font-semibold px-4 py-2 rounded">
                                Pantau Toko
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </div>
  );
}
