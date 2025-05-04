'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Filter, Search, FileDown} from "lucide-react";
import * as apiService from 'services/authService';
import withAuth from 'hoc/withAuth';
import '@/globals.css';

function Laporan() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [search, setSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [laporanItems, setLaporan] = useState([]);
    const [dashboardItems, setDashboardLaporan] = useState([]);
    const itemsPerPage = 10;
    const filterRef = useRef(null);
    
        async function fetchDashboardLaporan() {
            try {
                const storeId = localStorage.getItem('store_id');
                const result = await apiService.getData(`/storeowner/laporan_keutungan_dashboard/?store_id=${storeId}`);
                setDashboardLaporan(result.data[0]); // Karena hanya 1 object
            } catch (err) {
                console.error(err.message);
            }
        }
        
        async function fetchDataLaporan() {
            try {
                const storeId = localStorage.getItem('store_id');
                const result = await apiService.getData(`/storeowner/laporan_keutungan/?store_id=${storeId}`);
                setLaporan(result.data.map(item => ({
                    name: item.product_name,
                    category: item.product_type,
                    price: `RP ${parseInt(item.capital_price).toLocaleString('id-ID')},00`,
                    sellingPrice: `RP ${parseInt(item.selling_price).toLocaleString('id-ID')},00`,
                    quantity: item.total_terjual.toString(),
                    totalSales: `RP ${parseInt(item.total_pemasukan).toLocaleString('id-ID')},00`,
                    profit: `RP ${parseInt(item.net_profit).toLocaleString('id-ID')},00`
                })));
            } catch (err) {
                console.error(err.message);
            }
        }
        
        useEffect(() => {
            fetchDataLaporan();
            fetchDashboardLaporan();
        }, []);

    const parseRupiah = (value) => {
        if (!value) return 0;
        return parseInt(value.replace(/[^\d]/g, ""));
    };

    // Proses filter dan sort
    const filteredData = laporanItems
        .filter((item) => {
            const matchName = item.name.toLowerCase().includes(search.toLowerCase());
            const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
            return matchName && matchCategory;
        })
        .sort((a, b) => {
            const aSales = parseRupiah(a.totalSales);
            const bSales = parseRupiah(b.totalSales);

            if (sortOrder === "asc") {
                return aSales - bSales;
            } else if (sortOrder === "desc") {
                return bSales - aSales;
            }
        return 0;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const displayedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="h-screen flex flex-col bg-white">
            <Header toggleSidebar={toggleSidebar} />
            
            {/* Wrapper Sidebar dan Konten Utama */}
            <div className="flex flex-1 relative h-full overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                
                {/* Konten Utama */}
                <div className={`flex-1 flex flex-col gap-6 p-3 overflow-y-auto max-h-screen transition-all duration-300`}>
                    {/* Stat Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard 
                            title="Total Pemasukan" 
                            value={`RP ${dashboardItems?.total_pemasukan?.toLocaleString('id-ID') || 0},00`} 
                        />
                        <StatCard 
                            title="Total Produk Terjual" 
                            value={dashboardItems?.total_produk_terjual?.toString() || "0"} 
                        />
                        <StatCard 
                            title="NET Profit" 
                            value={`RP ${dashboardItems?.net_profit?.toLocaleString('id-ID') || 0},00`} 
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <h2 className="text-xl sm:text-2xl text-black font-bold">Laporan Keuntungan Produk</h2>
                        <div className="flex items-center gap-2">
                            {/* Button Export */}
                            <button
                            // onClick={""}
                            className="cursor-pointer flex items-center px-4 py-2 bg-white border border-gray-500 rounded-lg text-black shadow-md"
                            >
                                <FileDown className="w-5 h-5 mr-2 text-black" />
                                Export
                            </button>
                            <div ref={filterRef} className="relative inline-block"> {/* Tambahkan div relative disini */}
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="cursor-pointer flex items-center px-4 py-2 bg-white border border-gray-500 rounded-lg text-black shadow-md"
                                >
                                    <Filter className="w-5 h-5 mr-2 text-black" />
                                    Filter
                                </button>

                                {isFilterOpen && (
                                    <div className="absolute left-0 z-10 mt-2 w-50 text-black bg-white border border-gray-200 rounded-lg shadow-md">
                                        {/* Filter Kategori */}
                                        <div className="mb-3 mt-2 px-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full border rounded p-2 text-sm text-gray-500"
                                            >
                                                <option value="All">Semua Kategori</option>
                                                <option value="Makanan">Makanan</option>
                                                <option value="Minuman">Minuman</option>
                                            </select>
                                            </div>

                                            {/* Urutkan Berdasarkan Harga */}
                                            <div className="mb-3 px-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan Harga</label>
                                            <select
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value)}
                                                className="w-full border rounded p-2 text-sm text-gray-500"
                                            >
                                                <option value="">Default</option>
                                                <option value="asc">Harga Terendah</option>
                                                <option value="desc">Harga Tertinggi</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                                <input
                                    type="text"
                                    className="pl-10 text-gray-500 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-lg"
                                    placeholder="Cari berdasarkan nama"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabel */}
                    <div className="w-full flex flex-col h-[600px] overflow-hidden">
                        {/* Table Area */}
                        <div className="flex-1 overflow-x-auto overflow-y-auto">
                            {filteredData.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    Tidak ada data yang sesuai
                                </div>
                            ) : (
                                <table className="min-w-[900px] w-full shadow-lg">
                                    <thead className="text-black text-xs md:text-[10px] lg:text-[15px] border-y border-gray-500">
                                        <tr>
                                            {['NO', 'MENU PESANAN', 'TIPE MENU', 'HARGA MODAL', 'HARGA JUAL', 'JUMLAH TERJUAL', 'TOTAL PENJUALAN', 'NET PROFIT'].map((header, index) => (
                                                <th key={index} className="py-3 px-4 relative">
                                                    {header}
                                                    {index !== 7 && (
                                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedData.map((item, index) => (
                                            <tr key={index} className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative">
                                                {[index + 1 + (currentPage - 1) * itemsPerPage, item.name, item.category, item.price, item.sellingPrice, item.quantity, item.totalSales, item.profit].map((value, idx) => (
                                                    <td key={idx} className="py-3 px-4 relative">
                                                        {value}
                                                        {idx !== 7 && (
                                                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Pagenation */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600 p-2">
                        <span>Menampilkan {currentPage * itemsPerPage - itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} entri</span>
                        <div className="flex gap-2">
                        <button 
                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'cursor-not-allowed' : 'bg-[#ECA641] text-white'}`} 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                        &lt;
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                            key={i} 
                            className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-[#ECA641] text-white' : 'bg-gray-300'}`} 
                            onClick={() => setCurrentPage(i + 1)}
                            >
                            {i + 1}
                            </button>
                        ))}
                        <button 
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'cursor-not-allowed' : 'bg-[#ECA641] text-white'}`} 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                        &gt;
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-[#FFF4E8] text-black p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center w-full h-[120px]">
            <h3 className="text-lg sm:[19px] font-semibold">{title}</h3>
            <p className="text-lg sm:[18px] font-bold">{value}</p>
        </div>
    );
}

export default withAuth(Laporan,['2'])