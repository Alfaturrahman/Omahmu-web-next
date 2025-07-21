'use client';

import { useState, useEffect, React } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';
import { Search } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SuperadminDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [toko, setToko] = useState([]);
  const [jumlahToko, setJumlahToko] = useState({
    total: 0,
    aktif: 0,
    tidakAktif: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiService.getData('/superadmin/dashboard_data_store/');
        console.log("result",result);
        
        setToko(result.data.List_toko_terdaftar);
        setJumlahToko({
          total: result.data.jumlah_toko_terdaftar,
          aktif: result.data.jumlah_toko_terdaftar_aktif,
          tidakAktif: result.data.jumlah_toko_terdaftar_tidak_aktif,
        });
      } catch (err) {
        console.error(err.message);
      }
    }

    fetchData();
  }, []);  const [filter, setFilter] = useState("semua");

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
      setIsSidebarOpen(!isSidebarOpen);
    } else {
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
                <p className="text-2xl font-bold text-black">{jumlahToko.total}</p>
              </div>

              {/* Toko Aktif */}
              <div
                onClick={() => handleFilterClick("buka")}
                className="flex-1 bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm cursor-pointer"
              >
                <h2 className="text-[#F28C20] font-semibold mb-2">Toko Aktif</h2>
                <p className="text-2xl font-bold text-black">{jumlahToko.aktif}</p>
              </div>

              {/* Toko Nonaktif */}
              <div
                onClick={() => handleFilterClick("tutup")}
                className="flex-1 bg-[#FFF4E8] rounded-xl p-6 text-center shadow-sm cursor-pointer"
              >
                <h2 className="text-[#F28C20] font-semibold mb-2">Toko Nonaktif</h2>
                <p className="text-2xl font-bold text-black">{jumlahToko.tidakAktif}</p>
              </div>
            </div>


            {/* List Toko */}
            <div className="w-full flex flex-wrap justify-start gap-8 md:gap-4 lg:gap-8 px-4">
            {toko
              .filter((item) => {
                const matchSearch = item.store_name.toLowerCase().includes(search.toLowerCase());
                const matchFilter =
                  filter === "semua"
                    ? true
                    : filter === "buka"
                    ? item.is_active === true
                    : filter === "tutup"
                    ? item.is_active === false
                    : true;

                return matchSearch && matchFilter;
              })
              .map((store, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[48%] lg:w-[30%] xl:w-[22%] bg-white border border-gray-300 rounded-xl p-4 text-left"
                >
                      <img
                    src={`https://posvanapi-production.up.railway.app/media/${store.store_picture}`}
                    alt={store.store_name}
                    className="w-full p-3 h-60 mx-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/Logo-Toko.png";
                    }}
                  />
                  <h3 className="mt-4 font-semibold text-black text-base md:text-lg">
                    {store.store_name}
                  </h3>

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
                    {store.start_date?.split('T')[0]} – {store.end_date?.split('T')[0]}
                  </div>

                  <div className="flex items-center text-sm mb-4 mt-1">
                    <span
                      className={`h-3 w-3 rounded-full mr-2 ${
                        store.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    <span className={store.is_active ? 'text-green-600' : 'text-red-600'}>
                      {store.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => router.push(`/Superadmin/DashboardToko?store_id=${store.store_id}`)}
                      className="bg-[#F6B543] hover:bg-[#eca641] text-white font-semibold px-4 py-2 cursor-pointer rounded"
                    >
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

export default withAuth(SuperadminDashboard,['1']);

