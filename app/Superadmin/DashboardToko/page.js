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
import { useSearchParams } from 'next/navigation';
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';
import { useMemo } from 'react';

function DashboardToko() {
    const searchParams = useSearchParams();
    const storeId = searchParams.get('store_id'); // Ambil dari URL
    const router = useRouter();

    const [dashboardData, setDashboardData] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    });

    const filterRef = useRef(null);

    // Format tanggal ke objek Date (untuk fetch dashboard)
    const selectedDateObj = useMemo(() => {
        return new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
      }, [selectedDate]);
      
    // Fetch dashboard data
    const fetchDashboardData = async () => {
        if (!storeId) return;
        setLoading(true);
        try {
        let url = `/storeowner/dashboard/?store_id=${storeId}`;
        if (selectedDateObj) {
            const year = selectedDateObj.getFullYear();
            const month = selectedDateObj.getMonth() + 1;
            const day = selectedDateObj.getDate();
            url += `&year=${year}&month=${month}&day=${day}`;
        }

        const result = await apiService.getData(url);
        setDashboardData(result.data);
        } catch (err) {
        console.error(err.message);
        } finally {
        setLoading(false);
        }
    };

    // Fetch menu items
    const fetchMenuItems = async () => {
        if (!storeId) return;
        try {
        const result = await apiService.getData(`/storeowner/daftar_menu/?store_id=${storeId}`);
        const transformedData = result.data.map((item) => ({
            id: item.product_id,
            name: item.product_name,
            price: Number(item.selling_price), // Konversi ke number
            image: item.product_picture,
            category: item.product_type,
            favorite: item.favorite_status,
          }));
      
          setMenuItems(transformedData);
        } catch (err) {
        console.error(err.message);
        }
    };

    // Combined effect
    useEffect(() => {
        fetchDashboardData();
    }, [storeId, selectedDate]);

    useEffect(() => {
        fetchMenuItems();
    }, [storeId]);

    // Others (UI handlers)
    const handleTabClick = (tab) => {
        setActiveTab(tab);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsFilterOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                    <SummaryCards data={dashboardData?.dashboard_monthly} />
                    <ChartSection data={dashboardData?.dashboard_yearly} />
                    </div>
                    <div className="lg:w-1/3 w-full">
                    <AdvancedCharts data={{ dashboard_daily: dashboardData?.dashboard_daily, dashboard_presentase: dashboardData?.dashboard_presentase }} />
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
                                <img
                                src={item.image ? `http://localhost:8000${item.image}` : '/default-image.png'}
                                alt={item.product_name}
                                className="rounded-lg w-full h-40 object-cover w-full"
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <h3 className="font-semibold text-sm text-black flex items-center">
                                        {item.favorite && <span className="text-yellow-400 mr-1">⭐</span>}
                                        {item.name}
                                    </h3>
                                    <p className="text-[#ECA641] font-bold text-sm whitespace-nowrap">
                                    Rp {typeof item.price === 'number' ? item.price.toLocaleString("id-ID") + ',00' : 'N/A'}
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

export default withAuth(DashboardToko,['1'])