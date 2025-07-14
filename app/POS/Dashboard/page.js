'use client';

import { useState, useEffect, useRef  } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import ChartSection from '@/components/ChartSection';
import SummaryCards from '@/components/SummaryCards';
import AdvancedCharts from '@/components/AdvancedCharts';
import * as apiService from 'services/authService';
import { Calendar } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import '@/globals.css';
import withAuth from 'hoc/withAuth';

function Dashboard() {
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
        // Correctly extract year, month, and day from Date object
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // Month is 0-indexed
        const day = selectedDate.getDate();
        
        // Append them to the URL
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
        <div className="flex-1 flex flex-col gap-6 p-3 transition-all overflow-auto min-h-0 duration-300">
          {loading ? (
            // Loading Spinner
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent"></div>
            </div>
          ) : (
            <>
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
              <div className="flex flex-col lg:flex-row gap-8">
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