'use client';

import { useState } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import ChartSection from '@/components/ChartSection';
import SummaryCards from '@/components/SummaryCards';
import AdvancedCharts from '@/components/AdvancedCharts';
import { Calendar } from 'lucide-react'; // Icon Kalender

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter calendar
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

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
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Konten Dashboard */}
        <div className="flex-1 flex flex-col gap-6 p-4 transition-all overflow-y-auto min-h-0 duration-300">
          
          {/* Baris Filter */}
          <div className="flex justify-end relative">
            <button
              onClick={handleFilterToggle}
              className="flex items-center gap-2 text-black py-2 border border-gray-500 px-4 rounded-lg shadow-md transition"
            >
              Filter
              <Calendar size={20} />
            </button>

            {/* Calendar Dropdown */}
            {isFilterOpen && (
              <div className="absolute mt-2 top-full right-0 bg-white p-4 rounded-lg shadow-lg border z-50 w-64">
                <p className="font-semibold mb-2 text-gray-700">Pilih Tanggal</p>
                <input
                  type="date"
                  value={`${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split('-');
                    setSelectedDate({ year: parseInt(year), month: parseInt(month), day: parseInt(day) });
                  }}
                  className="border text-gray-400 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}
          </div>

          {/* Konten Utama */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Kolom 1: Ringkasan & Grafik Penjualan */}
            <div className="flex-1 space-y-6">
              <SummaryCards />
              <ChartSection />
            </div>

            {/* Kolom 2: Grafik Tambahan */}
            <div className="lg:w-1/3 w-full">
              <AdvancedCharts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}