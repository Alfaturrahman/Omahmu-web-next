'use client';

import { useState, useEffect, useRef  } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import ChartSection from '@/components/ChartSection';
import SummaryCards from '@/components/SummaryCards';
import AdvancedCharts from '@/components/AdvancedCharts';
import { Calendar } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import '@/globals.css';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter calendar
  const [selectedDate, setSelectedDate] = useState(new Date());

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
          <div className="relative">
            <button
              onClick={handleFilterToggle}
              className="cursor-pointer flex items-center gap-2 text-black py-2 border border-gray-500 px-4 rounded-lg shadow-md transition"
            >
              Filter
              <Calendar size={20} />
            </button>

            {/* Calendar Dropdown */}
            {isFilterOpen && (
              <div ref={filterRef} className="absolute top-full left-0 mt-2">
                <div className="bg-white p-4 rounded-lg shadow-lg border w-64">
                  <p className="font-semibold mb-2 text-gray-700">Pilih Tanggal</p>
                  <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pesanan</label>
                      <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          placeholderText="00/00/0000"
                          dateFormat="dd/MM/yyyy"
                          className="w-full border rounded p-2 text-sm text-gray-500"
                          wrapperClassName="w-full"
                          popperClassName="z-50"
                      />
                  </div>
                </div>
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