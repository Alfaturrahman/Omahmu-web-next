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
    
    const dataToko = [
        {
        nama: "AngkringanOmahmu – Batam Center",
        jam: "06.00pm - 1.00am",
        status: "buka",
        },
        {
        nama: "Warung Sate Madura – Nagoya",
        jam: "10.00am - 10.00pm",
        status: "tutup",
        },
        {
        nama: "Bakso Mercon – Batu Aji",
        jam: "11.00am - 9.00pm",
        status: "buka",
        },
        {
        nama: "Warung Sate Madura – Nagoya",
        jam: "10.00am - 10.00pm",
        status: "tutup",
        },
        {
        nama: "Bakso Mercon – Batu Aji",
        jam: "11.00am - 9.00pm",
        status: "buka",
        },
    ];

    const filteredToko = dataToko.filter((toko) =>
        toko.nama.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="h-screen flex flex-col bg-white ">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Wrapper untuk Sidebar & Konten */}
      <div className="flex flex-1 relative h-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Konten Dashboard */}
        <div className={`flex-1 flex flex-col gap-6 p-3 overflow-y-auto min-h-0 transition-all duration-300`}>
            {/* Judul dan Search Bar */}
            <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-5">
                <h1 className="text-base md:text-md lg:text-lg font-semibold text-black">
                    Daftar Toko Kami
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

            {/* List Toko */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredToko.length > 0 ? (
                    filteredToko.map((toko, i) => {
                    const isOpen = toko.status === "buka";
                    const color = isOpen ? "green" : "red";

                    return (
                        <div
                            key={i}
                            className="bg-white border border-gray-400 rounded-xl p-4 text-left mb-4"
                        >
                            {/* Gambar Logo */}
                            <img
                                src="/Logo-Toko.png"
                                alt="Logo Toko"
                                className="w-full p-3 h-auto mx-auto"
                            />

                            {/* Nama Toko */}
                            <h3 className="mt-4 font-semibold text-black">{toko.nama}</h3>

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
                                {toko.jam}
                            </div>

                            {/* Status */}
                            <div className="flex items-center mt-2">
                                <span className={`w-3 h-3 rounded-full bg-${color}-500 mr-2`}></span>
                                <span className={`text-sm text-${color}-600 font-medium`}>
                                {isOpen ? "Toko Buka" : "Toko Tutup"}
                                </span>
                            </div>

                            {/* Tombol */}
                            <div className="flex justify-end mt-4">
                                <button className="bg-[#F6B543] hover:bg-[#eca641] text-white font-semibold px-4 py-2 cursor-pointer rounded">
                                Kunjungi Toko
                                </button>
                            </div>
                        </div>
                    );
                    })
                ) : (
                    <div className="w-full text-center py-20 text-gray-500 font-medium">
                        Tidak ada data yang sesuai dengan pencarian.
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}
