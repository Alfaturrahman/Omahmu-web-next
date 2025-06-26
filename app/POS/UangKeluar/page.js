'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Filter, Search, FileDown, Eye, X} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import '@/globals.css';

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [search, setSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filterDate, setFilterDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const filterRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const data = [
        {
            date: "20/06/2024",
            amount: "3 Item",
            expenses: "Rp 140.000",
            category: "Bahan Baku",
            detail: null, // akan diganti oleh ikon
            items: [
            { name: "Ayam", qty: "1 ekor", unit: "kg", price: "Rp 14.500", total: "Rp 14.500", category: "Bahan Baku" },
            { name: "Tomat", qty: "2 kg", unit: "kg", price: "Rp 10.000", total: "Rp 20.000", category: "Bahan Baku" },
            { name: "Wajan", qty: "1 pcs", unit: "pcs", price: "Rp 50.000", total: "Rp 50.000", category: "Peralatan" },
            ],
        },
        {
            date: "21/06/2024",
            amount: "4 Item",
            expenses: "Rp 140.000",
            category: "Peralatan",
            detail: null,
            items: [
            { name: "Wajan", qty: "1 pcs", unit: "pcs", price: "Rp 35.000", total: "Rp 35.000", category: "Peralatan" },
            { name: "Panci", qty: "2 pcs", unit: "pcs", price: "Rp 10.000", total: "Rp 20.000", category: "Peralatan" },
            { name: "Kuali", qty: "1 pcs", unit: "pcs", price: "Rp 50.000", total: "Rp 50.000", category: "Peralatan" },
            ],
        }
    ];

    const filteredData = data.filter(item => {
        const matchCategory = selectedCategory === "All" || item.category === selectedCategory;

        const matchDate = filterDate
            ? item.date === format(filterDate, "dd/MM/yyyy")
            : true;

        return matchCategory && matchDate;
    });

    const handleResetFilter = () => {
        setSelectedCategory("All");
        setFilterDate(null);
        setCurrentPage(1);
    };

    const openModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

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
                        <StatCard title="Total Pengeluaran" value="RP 1.000.000" />
                        <StatCard title="Total Kategori" value="3" />
                        <StatCard title="Total Item" value="32" />
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
                                    <div className="absolute left-0 z-10 mt-2 w-64 text-black bg-white border border-gray-200 rounded-lg shadow-md">
                                        {/* Filter Kategori */}
                                        <div className="mb-3 mt-2 px-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full border rounded p-2 text-sm text-gray-500"
                                            >
                                                <option value="All">Semua Kategori</option>
                                                <option value="Bahan Baku">Bahan Baku</option>
                                                <option value="Peralatan">Peralatan</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                        </div>

                                        {/* Filter Tanggal dengan DatePicker */}
                                        <div className="mb-3 px-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengeluran</label>
                                            <DatePicker
                                                selected={filterDate}
                                                onChange={(date) => setFilterDate(date)}
                                                placeholderText="00/00/0000"
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full border rounded p-2 text-sm text-gray-500"
                                                wrapperClassName="w-full"
                                                popperClassName="z-50"
                                            />
                                        </div>

                                        <div className="mb-3 px-2">
                                            <button
                                            onClick={handleResetFilter}
                                            className="w-full bg-red-100 text-red-600 hover:bg-red-200 font-semibold py-2 px-4 rounded text-sm"
                                            >
                                            Reset Filter
                                            </button>
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
                                            {['NO', 'TANGGAL', 'JUMLAH ITEM', 'TOTAL PENGELUARAN', 'KATEGORI', 'DETAIL TRANSAKSI'].map((header, index) => (
                                                <th key={index} className="py-3 px-4 relative">
                                                    {header}
                                                    {index !== 5 && (
                                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedData.map((item, index) => (
                                            <tr key={index} className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative">
                                                {[index + 1 + (currentPage - 1) * itemsPerPage, item.date, item.amount, item.expenses, item.category].map((value, idx) => (
                                                    <td key={idx} className="py-3 px-4 relative">
                                                        {value}
                                                        {idx !== 7 && (
                                                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="cursor-pointer py-3 px-4 relative">
                                                    <button onClick={() => openModal(item)} className="text-black cursor-pointer">
                                                    <Eye/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Modal Detail Transaksi */}
                            {isModalOpen && selectedTransaction && (
                                <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto p-6 relative">
                                        {/* Tombol Close */}
                                        <button
                                            className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                            onClick={closeModal}
                                        >
                                            <X />
                                        </button>

                                        {/* Header */}
                                        <div className="mb-4 border-b pb-2">
                                            <h2 className="text-xl font-bold text-gray-800">Detail Transaksi</h2>
                                            <p className="text-sm text-gray-500">{selectedTransaction.date}</p>
                                        </div>

                                        {/* Info + Bukti Transaksi */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {/* Kiri: Info */}
                                            <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-500 text-sm">Tanggal</span>
                                                <p className="text-black font-medium">20 Juni 2024</p>
                                            </div>
                                            <div>
                                                <span className="text-blue-600 text-sm font-medium">Metode Pembayaran</span>
                                                <p className="text-black font-medium">Cash</p>
                                            </div>
                                            <div>
                                                <span className="text-blue-600 text-sm font-medium">Keterangan</span>
                                                <p className="text-black font-medium">Belanja Mingguan</p>
                                            </div>
                                            </div>

                                            {/* Kanan: Gambar Bukti */}
                                            <div className="flex flex-col justify-center items-start">
                                                <span className="text-sm text-gray-500 font-medium mb-2">Bukti Nota Belanja</span>
                                                <img
                                                    src='/transaksi.png'
                                                    alt="Bukti Transaksi"
                                                    className="w-32 h-32 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                                                    onClick={() => setIsImageModalOpen(true)}
                                                />
                                            </div>
                                        </div>

                                        {/* Table */}
                                        <table className="w-full text-sm text-left text-gray-700 border-t">
                                            <thead className="bg-gray-50 font-medium">
                                            <tr>
                                                <th className="px-4 py-2">Nama Item</th>
                                                <th className="px-4 py-2">Jumlah</th>
                                                <th className="px-4 py-2">Satuan</th>
                                                <th className="px-4 py-2">Harga/Item</th>
                                                <th className="px-4 py-2">Total</th>
                                                <th className="px-4 py-2">Kategori</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {selectedTransaction.items?.map((item, idx) => (
                                                <tr key={idx} className="border-t">
                                                <td className="px-4 py-2">{item.name}</td>
                                                <td className="px-4 py-2">{item.qty}</td>
                                                <td className="px-4 py-2">{item.unit}</td>
                                                <td className="px-4 py-2">{item.price}</td>
                                                <td className="px-4 py-2">{item.total}</td>
                                                <td className="px-4 py-2">{item.category}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                        {/* Total Transaksi */}
                                        <div className="mt-4 flex justify-end pr-4">
                                            <div className="text-sm font-semibold text-gray-700">
                                            <span className="mr-2">Total Transaksi :</span>
                                            <span className="text-black">
                                                Rp{" "}
                                                {selectedTransaction.items
                                                ?.reduce((sum, item) => sum + parseInt(item.total.replace(/\D/g, "")), 0)
                                                .toLocaleString("id-ID")}
                                            </span>
                                            </div>
                                        </div>

                                        {/* Tombol Tutup */}
                                        <div className="mt-4 flex justify-end">
                                            <button
                                            onClick={closeModal}
                                            className="cursor-pointer bg-red-500 text-white font-medium py-2 px-4 rounded"
                                            >
                                            Tutup
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isImageModalOpen && (
                                <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-70 z-50 flex justify-center items-center"
                                    onClick={() => setIsImageModalOpen(false)}>

                                    <div className="relative">
                                    <button
                                        onClick={() => setIsImageModalOpen(false)}
                                        className="cursor-pointer absolute top-2 right-2 text-white text-2xl"
                                    >
                                        <X />
                                    </button>
                                    <img
                                        src='/transaksi.png'
                                        alt="Preview Bukti"
                                        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                                    />
                                    </div>
                                </div>
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
                            Sebelumnya
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
                            Selanjutnya
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