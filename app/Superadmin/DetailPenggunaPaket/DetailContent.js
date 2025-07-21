
"use client";

export const dynamic = 'force-dynamic'; // <-- ini harus paling atas
import { useState, useEffect, useRef } from "react";
import { Search, Filter, ArrowLeftIcon } from "lucide-react";
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import * as apiService from 'services/authService';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';


export default function DetailPenggunaPaket() {
    const searchParams = useSearchParams();
    const package_id = searchParams.get('package_id'); // Ambil dari URL
    const router = useRouter();
    const statusOptions = ["Semua", "AKTIF", "NONAKTIF"];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;
    const filterRef = useRef(null);
    const [listPengguna, setListPengguna] = useState([]);
    
    const fetchListPengguna = async () => {
        try {
          const result = await apiService.getData(`/superadmin/detail_pengguna_paket/?package_id=${package_id}`);
          
          setListPengguna(result.data);
        } catch (err) {
          console.error('Gagal ambil data paket:', err.message);
        }
      };

      useEffect(() => {
        fetchListPengguna();
    }, [package_id]);


    const filteredData = listPengguna.filter((item) => {
        const matchSearch = (item.nama_toko || "")
        .toLowerCase()
        .includes(search.toLowerCase());

        const matchStatus =
        filterStatus === "Semua" ? true : item.status === filterStatus;

        return matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Close dropdown saat klik di luar filter
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setShowFilter(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

                <div className="w-full min-h-screen bg-white text-black p-4 md:p-6">
                    {/* Filter & Search Row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 relative">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                            <button onClick={() => router.back()}>
                                <ArrowLeftIcon className="w-6 h-6 text-gray-700 cursor-pointer" />
                            </button>
                            <h1 className="text-lg md:text-xl font-semibold text-black">
                                Daftar Pengguna Paket
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                            {/* Filter Button */}
                            <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="cursor-pointer flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-100 text-black w-full sm:w-auto"
                            >
                                <Filter size={16} /> Filter
                            </button>

                            {showFilter && (
                                <div className="absolute mt-2 right-0 z-10 bg-white border border-gray-300 rounded shadow w-40 text-sm text-black">
                                {statusOptions.map((status) => (
                                    <button
                                    key={status}
                                    onClick={() => {
                                        setFilterStatus(status);
                                        setShowFilter(false);
                                        setCurrentPage(1);
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                                        filterStatus === status ? "bg-gray-100 font-semibold" : ""
                                    }`}
                                    >
                                    {status}
                                    </button>
                                ))}
                                </div>
                            )}
                            </div>

                            {/* Search Input */}
                            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64">
                                <Search size={16} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Cari nama toko"
                                    className="w-full text-sm focus:outline-none text-black"
                                    value={search}
                                    onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col min-h-[70vh]">
                        {/* Table */}
                        <div className="overflow-x-auto rounded-lg">
                            <table className="min-w-[700px] w-full shadow-lg">
                                <thead className="text-black text-xs md:text-[10px] lg:text-[15px] border-y border-gray-500">
                                <tr>
                                    {[
                                    "NO",
                                    "NAMA TOKO",
                                    "PEMILIK TOKO",
                                    "EMAIL PEMILIK TOKO",
                                    "STATUS",
                                    ].map((header, index) => (
                                    <th
                                        key={index}
                                        className={`py-3 px-4 whitespace-nowrap relative text-center ${index === 1 ? 'w-[275px]' : ''}`}
                                    >
                                        {header}
                                        {index !== 4 && (
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                        )}
                                    </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative"
                                    >
                                        <td className="py-3 px-4 relative">
                                        {index + 1 + (currentPage - 1) * entriesPerPage}
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                        </td>

                                        <td className="py-3 px-4 relative text-center">
                                            <div className="flex w-full items-center justify-start gap-4">
                                                <img
                                                src="/Toko1.png"
                                                alt="Logo"
                                                className="w-6 h-6 rounded-full"
                                                />
                                                <span className="text-left">{item.nama_toko}</span>
                                            </div>
                                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                        </td>


                                        <td className="py-3 px-4 relative">
                                        {item.pemilik_toko}
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                        </td>

                                        <td className="py-3 px-4 relative">
                                            {item.email_pemilik_toko}
                                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                        </td>

                                        <td className="py-3 px-4 relative">{item.status}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td
                                        colSpan="5"
                                        className="py-6 text-center text-gray-400 text-sm"
                                    >
                                        Tidak Ada Data
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-black">
                            <span>
                                Menampilkan {filteredData.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} hingga{" "}
                                {Math.min(currentPage * entriesPerPage, filteredData.length)} dari{" "}
                                {filteredData.length} entri
                            </span>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === 1 ? "cursor-not-allowed bg-gray-300" : "bg-[#ECA641] text-white"
                                }`}
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                >
                                &lt;
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`px-4 py-2 rounded-md ${
                                    currentPage === i + 1 ? "bg-[#ECA641] text-white" : "bg-gray-300"
                                    }`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                                ))}

                                <button
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === totalPages ? "cursor-not-allowed bg-gray-300" : "bg-[#ECA641] text-white"
                                }`}
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                >
                                &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
