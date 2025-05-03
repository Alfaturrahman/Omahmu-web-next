'use client';

import { useState, React } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Search } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Untuk desktop
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");

  const tokoList = [
    { id: 1, name: "AngkringanOmahmu - Batam Center", statusToko: true },
    { id: 2, name: "AngkringanOmahmu - Batam Utara", statusToko: false },
    { id: 3, name: "AngkringanOmahmu - Batu Aji", statusToko: true },
    { id: 4, name: "AngkringanOmahmu - Tiban", statusToko: false },
    { id: 5, name: "AngkringanOmahmu - Nagoya", statusToko: true },
    { id: 6, name: "AngkringanOmahmu - Bengkong", statusToko: true },
    { id: 7, name: "AngkringanOmahmu - Sekupang", statusToko: false },
    { id: 8, name: "AngkringanOmahmu - Baloi", statusToko: true },
  ];

  // Filter data berdasarkan status toko
  const filteredTokoList = tokoList.filter((item) => {
    if (filter === "semua") return true; // Semua toko
    if (filter === "buka") return item.statusToko === true; // Toko buka
    if (filter === "tutup") return item.statusToko === false; // Toko tutup
    return true;
  });

  // Fungsi untuk handle klik filter card
  const handleFilterClick = (filterType) => {
    setFilter(filterType);
  };
  
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
    <div className="h-screen flex flex-col bg-white">
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
            <div className="w-full flex flex-col md:flex-row lg:flex-row justify-between gap-4">
              {/* Total Toko Terdaftar */}
              <div
                onClick={() => handleFilterClick("semua")}
                className="flex-1 bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm cursor-pointer"
              >
                <h2 className="text-[#F28C20] font-semibold mb-2">Total Toko Terdaftar</h2>
                <p className="text-2xl font-bold text-black">{tokoList.length}</p>
              </div>

              {/* Toko Aktif */}
              <div
                onClick={() => handleFilterClick("buka")}
                className="flex-1 bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm cursor-pointer"
              >
                <h2 className="text-[#F28C20] font-semibold mb-2">Toko Aktif</h2>
                <p className="text-2xl font-bold text-black">
                  {tokoList.filter((item) => item.statusToko === true).length}
                </p>
              </div>

              {/* Toko Nonaktif */}
              <div
                onClick={() => handleFilterClick("tutup")}
                className="flex-1 bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm cursor-pointer"
              >
                <h2 className="text-[#F28C20] font-semibold mb-2">Toko Nonaktif</h2>
                <p className="text-2xl font-bold text-black">
                  {tokoList.filter((item) => item.statusToko === false).length}
                </p>
              </div>
            </div>

            {/* Tampil Toko Berdasarkan Filter */}
            <div className="w-full flex flex-wrap justify-start gap-8 md:gap-4 lg:gap-8 px-4 mt-4">
              {filteredTokoList.map((item) => (
                <div
                  key={item.id}
                  className="w-full sm:w-[48%] lg:w-[30%] xl:w-[22%] bg-white border border-gray-300 rounded-xl p-4 text-left"
                >
                  {/* Gambar Logo */}
                  <img
                    src="/Logo-Toko.png"
                    alt="Logo Toko"
                    className="w-full p-3 h-auto mx-auto"
                  />

                  {/* Nama Toko */}
                  <h3 className="mt-4 font-semibold text-black text-base md:text-lg">
                    {item.name}
                  </h3>

                  {/* Jam Operasional */}
                  <div className="flex items-center text-gray-500 text-sm mt-1">
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

                  {/* Status Toko */}
                  <div className="flex items-center text-sm mb-4 mt-1">
                    <span
                      className={`h-3 w-3 rounded-full mr-2 ${
                        item.statusToko ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    <span className={item.statusToko ? 'text-green-600' : 'text-red-600'}>
                      {item.statusToko ? 'Buka' : 'Tutup'}
                    </span>
                  </div>

                  {/* Tombol */}
                  <div className="flex justify-end">
                    <Link
                      href="/Superadmin/DashboardToko"
                      className="bg-[#F6B543] hover:bg-[#eca641] text-white font-semibold px-4 py-2 cursor-pointer rounded"
                    >
                      Pantau Toko
                    </Link>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}

