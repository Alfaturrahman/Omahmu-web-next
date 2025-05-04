'use client';

import { useState, useEffect, useRef  } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import ChartSection from '@/components/ChartSection';
import SummaryCards from '@/components/SummaryCards';
import AdvancedCharts from '@/components/AdvancedCharts';
import { Calendar, ArrowLeftIcon } from 'lucide-react';
import Header from '@/components/Navbar';
import '@/globals.css';

export default function Home() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter calendar
    const [activeTab, setActiveTab] = useState("dashboard");
    // const [activeCategory, setActiveCategory] = useState("Semua");

    const menuItems = [
        { id: 1, name: "Sate Kambing", price: 15000, image: "/sate-kambing.png", category: "Makanan", favorite: true },
        { id: 2, name: "Kopi Susu", price: 7000, image: "/kopi-susu.png", category: "Minuman", favorite: true },
        { id: 3, name: "Nasi Goreng", price: 12000, image: "/sate-kambing.png", category: "Makanan", favorite: false },
        { id: 4, name: "Teh Manis", price: 5000, image: "/kopi-susu.png", category: "Minuman", favorite: false },
        { id: 5, name: "Sate Kambing", price: 15000, image: "/sate-kambing.png", category: "Makanan", favorite: true },
        { id: 6, name: "Kopi Susu", price: 7000, image: "/kopi-susu.png", category: "Minuman", favorite: true },
        { id: 7, name: "Nasi Goreng", price: 12000, image: "/sate-kambing.png", category: "Makanan", favorite: false },
        { id: 8, name: "Teh Manis", price: 5000, image: "/kopi-susu.png", category: "Minuman", favorite: false },
        { id: 9, name: "Sate Kambing", price: 15000, image: "/sate-kambing.png", category: "Makanan", favorite: true },
        { id: 10, name: "Kopi Susu", price: 7000, image: "/kopi-susu.png", category: "Minuman", favorite: true },
        { id: 11, name: "Nasi Goreng", price: 12000, image: "/sate-kambing.png", category: "Makanan", favorite: false },
        { id: 12, name: "Teh Manis", price: 5000, image: "/kopi-susu.png", category: "Minuman", favorite: false },
    ];

    // const categories = ["Semua", "Makanan", "Minuman", "Favorit"];

    const [selectedDate, setSelectedDate] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    });

    const filterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsFilterOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
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

      {/* Wrapper Sidebar & Konten */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* Konten Dashboard */}
        <div className="flex-1 flex flex-col gap-6 p-4 transition-all overflow-y-auto min-h-0 duration-300">
          
            {/* Baris Filter & Tabs */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center relative gap-4 sm:gap-0">
                {/* Tabs: Dashboard & Menu */}
                <div className="flex gap-4 flex-wrap">
                    <button onClick={() => router.back()}>
                            <ArrowLeftIcon className="w-6 h-6 text-gray-700 cursor-pointer" />
                    </button>

                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`px-4 py-2 cursor-pointer rounded-t font-semibold ${
                        activeTab === 'dashboard'
                            ? 'border-b-2 [#F6B543] text-[#F6B543]'
                            : 'text-black'
                        }`}
                    >
                        Dashboard Toko
                    </button>

                    <button
                        onClick={() => setActiveTab("menu")}
                        className={`px-4 py-2 cursor-pointer rounded-t font-semibold ${
                        activeTab === "menu"
                            ? 'border-b-2 [#F6B543] text-[#F6B543]'
                            : 'text-black'
                        }`}
                    >
                        Daftar Menu
                    </button>
                </div>

                {/* Tombol Filter */}
                <div className="sm:mt-0 mt-2 relative">
                    <button
                        onClick={handleFilterToggle}
                        className="flex items-center gap-2 text-black py-2 border border-gray-500 px-4 rounded-lg shadow-md transition w-full sm:w-auto"
                    >
                        Filter
                        <Calendar size={20} />
                    </button>

                    {/* Calendar Dropdown */}
                    {isFilterOpen && (
                        <div ref={filterRef} className="absolute z-50 right-0">
                        <div className="mt-2 bg-white p-4 rounded-lg shadow-lg border w-64">
                            <p className="font-semibold mb-2 text-gray-700">Pilih Tanggal</p>
                            <input
                            type="date"
                            value={`${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`}
                            onChange={(e) => {
                                const [year, month, day] = e.target.value.split('-');
                                setSelectedDate({
                                year: parseInt(year),
                                month: parseInt(month),
                                day: parseInt(day),
                                });
                            }}
                            className="border text-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        </div>
                    )}
                </div>
            </div>

            {activeTab === "dashboard" && (
                <>
                {/* Konten Utama Dashboard */}
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                    <SummaryCards />
                    <ChartSection />
                    </div>
                    <div className="lg:w-1/3 w-full">
                    <AdvancedCharts />
                    </div>
                </div>
                </>
            )}

            {activeTab === "menu" && (
                <div className={`flex-1 flex flex-col gap-2 p-3 overflow-y-auto min-h-0 transition-all duration-300`}>
                    {/* Daftar Menu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {menuItems
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
            )}
        </div>
      </div>
    </div>
  );
}