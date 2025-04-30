'use client';

import { useEffect, useState } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import ChartSection from '@/components/ChartSection';
import SummaryCards from '@/components/SummaryCards';
import AdvancedCharts from '@/components/AdvancedCharts';
import * as apiService from 'services/authService';
import { Calendar } from 'lucide-react'; // Icon Kalender
import withAuth from 'hoc/withAuth';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter calendar
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true); // default true

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  async function fetchData() {
    setLoading(true); // Mulai loading
    const storeId = localStorage.getItem('store_id');
    try {
      let url = `/storeowner/dashboard/?store_id=${storeId}`;
      if (selectedDate) {
        const { year, month, day } = selectedDate;
        url += `&year=${year}&month=${month}&day=${day}`;
      }
  
      const result = await apiService.getData(url);

      setDashboardData(result.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false); // Selesai loading
    }
  }

  console.log('dashboardData', dashboardData);
  
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

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
          {loading ? (
            // Loading Spinner
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent"></div>
            </div>
          ) : (
            <>
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
                <SummaryCards data={dashboardData?.dashboard_monthly} />
                <ChartSection data={dashboardData?.dashboard_yearly} />
                </div>

                {/* Kolom 2: Grafik Tambahan */}
                <div className="lg:w-1/3 w-full">
                <AdvancedCharts data={{ dashboard_daily: dashboardData?.dashboard_daily, dashboard_presentase: dashboardData?.dashboard_presentase }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard,['2'])