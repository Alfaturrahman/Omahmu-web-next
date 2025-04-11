'use client';

import { useState } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import ChartSection from '@/components/ChartSection';
import SummaryCards from '@/components/SummaryCards';
import AdvancedCharts from '@/components/AdvancedCharts';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Untuk desktop

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
        <div className={`flex-1 flex flex-col lg:flex-row gap-6 p-3 transition-all duration-300`}>
          {/* Kolom 1: Ringkasan & Grafik Penjualan */}
          <div className="flex-1 space-y-6">
            <SummaryCards />
            <ChartSection />
          </div>

          {/* Kolom 2: Grafik Lainnya (Desktop) */}
          <div className="lg:w-1/3 w-full">
            <AdvancedCharts />
          </div>
        </div>
      </div>
    </div>
  );
}
