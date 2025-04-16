'use client';

import { useState, useEffect } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Filter, Eye } from "lucide-react";

export default function DaftarPaket() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const itemsPerPage = 10;
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    const data = [
        { no: 1, kode: '121314', email: 'ALFATURRISKI@GMAIL.COM', paket: 'PAKET 1', tanggal: '2025-03-03', status: 'Selesai', statuspembayaran: 'Lunas' },
        { no: 2, kode: '132412', email: 'BUSTANULARIFFIN@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Diproses', statuspembayaran: 'Belum Lunas' },
        { no: 3, kode: '132343', email: 'EKAFITRIANISA@GMAIL.COM', paket: 'PAKET 1', tanggal: '2025-03-03', status: 'Ditolak', statuspembayaran: 'Belum Lunas' },
        { no: 4, kode: '142421', email: 'HADIANNELVI@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Selesai', statuspembayaran: 'Lunas' },
        { no: 5, kode: '908976', email: 'EKAFITRIANISA@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Diproses', statuspembayaran: 'Belum Lunas' },
        { no: 6, kode: '675478', email: 'BUSTANULARIFFIN@GMAIL.COM', paket: 'PAKET 1', tanggal: '2025-03-03', status: 'Selesai', statuspembayaran: 'Lunas' },
        { no: 7, kode: '0293875', email: 'EKAFITRIANISA@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Diproses', statuspembayaran: 'Belum Lunas' },
        { no: 8, kode: '0932211', email: 'BUSTANULARIFFIN@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Ditolak', statuspembayaran: 'Belum Lunas' },
        { no: 9, kode: '0293875', email: 'EKAFITRIANISA@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Diproses', statuspembayaran: 'Lunas' },
        { no: 10, kode: '0932211', email: 'ALFATURRISKI@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Ditolak', statuspembayaran: 'Belum Lunas' },
        { no: 11, kode: '0293875', email: 'EKAFITRIANISA@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Diproses', statuspembayaran: 'Lunas' },
        { no: 12, kode: '0932211', email: 'ALFATURRISKI@GMAIL.COM', paket: 'PAKET 2', tanggal: '2025-03-03', status: 'Ditolak', statuspembayaran: 'Belum Lunas' },
    ];

    const [filteredData, setFilteredData] = useState(data);

    const statuses = ['', 'Selesai', 'Diproses', 'Ditolak'];
    
    const totalPengajuan = data.length;
    const totalDiproses = data.filter(item => item.status === 'Diproses').length;
    const totalSelesai = data.filter(item => item.status === 'Selesai').length;
    const totalDitolak = data.filter(item => item.status === 'Ditolak').length;
    
    useEffect(() => {
        console.log("Filtering:", { selectedStatus, selectedDate });
        let filtered = data;
      
        if (selectedStatus) {
          filtered = filtered.filter((item) => item.status === selectedStatus);
        }
      
        if (selectedDate) {
          filtered = filtered.filter((item) => {
            const itemDate = new Date(item.tanggal).toISOString().slice(0, 10);
            return itemDate === selectedDate;
          });
        }
      
        setFilteredData(filtered);
    }, [selectedStatus, selectedDate]);         

    const handleSelectStatus = (status) => {
        setSelectedStatus(status);
      };
    
    const handleClearFilter = () => {
        setSelectedStatus("");
        setSelectedDate("");
    };

    const handleCardClick = (status) => {
        setSelectedStatus((prev) => (prev === status ? "" : status));
    };

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
        setIsSidebarOpen(!isSidebarOpen);
        } else {
        setIsCollapsed(!isCollapsed);
        }
    };

    const statusColor = {
        'Selesai': 'bg-[#CFF0E7] text-[#57AD94]',
        'Lunas': 'bg-[#ABF291] text-[#04A20F]',
        'Diproses': 'bg-[#FFF4D8] text-[#F1D779]',
        'Ditolak': 'bg-[#EF9DAD] text-[#EF4946]',
        'Belum Lunas': 'bg-[#FFC1AF] text-[#FE4C4C]',
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const displayedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen flex flex-col bg-white">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 relative">
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-x-auto gap-6 p-3 transition-all duration-300">
                {/* Judul dan Filter */}
                <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-5">
                    <h1 className="text-base md:text-md lg:text-lg font-semibold text-black">
                    Daftar Pengajuan Toko
                    </h1>

                    <button
                        onClick={() => setShowFilter((prev) => !prev)}
                        className="flex items-center px-4 py-2 bg-white border border-gray-500 rounded-lg text-black shadow-md"
                        >
                        Filter
                        <Filter className="w-5 h-5 ml-2 text-black" />
                        </button>

                        {/* Filter Dropdown */}
                        {showFilter && (
                            <div className="absolute right-5 top-[90px] bg-white border rounded-md shadow-md w-60 p-4 z-50">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    {statuses.map((status, i) => (
                                        <button
                                        key={i}
                                        onClick={() => handleSelectStatus(status)}
                                        className={`w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-sm text-black ${
                                            selectedStatus === status ? "bg-gray-200 font-semibold" : ""
                                        }`}
                                        >
                                        {status === "" ? "Semua Status" : status}
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full border border-gray-300 text-black rounded px-2 py-1 text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleClearFilter}
                                    className="mt-2 w-full text-sm bg-red-100 text-red-600 py-1 rounded hover:bg-red-200"
                                    >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                </div>
                
                {/* Stat Card */}
                <div className="w-full flex flex-wrap justify-between">
                    {/* Total Pengajuan */}
                    <div
                    onClick={() => handleCardClick("")}
                    className={`cursor-pointer w-full md:w-[200px] rounded-xl p-6 text-center shadow-sm mb-4 transition-all duration-200 bg-[#FFF4E8]`}
                    >
                    <h2 className="text-[#F39117] font-semibold mb-2">Total Pengajuan</h2>
                    <p className="text-2xl font-bold text-black">{totalPengajuan}</p>
                    </div>

                    {/* Total Diproses */}
                    <div
                        onClick={() => handleCardClick("Diproses")}
                        className={`cursor-pointer w-full md:w-[200px] rounded-xl p-6 text-center shadow-sm mb-4 transition-all duration-200 bg-[#FFF4E8]`}
                    >
                    <h2 className="text-[#F39117] font-semibold mb-2">Total Diproses</h2>
                    <p className="text-2xl font-bold text-black">{totalDiproses}</p>
                    </div>

                    {/* Total Diterima */}
                    <div
                        onClick={() => handleCardClick("Selesai")}
                        className={`cursor-pointer w-full md:w-[200px] rounded-xl p-6 text-center shadow-sm mb-4 transition-all duration-200 bg-[#FFF4E8]`}
                    >
                    <h2 className="text-[#F39117] font-semibold mb-2">Total Diterima</h2>
                    <p className="text-2xl font-bold text-black">{totalSelesai}</p>
                    </div>

                    {/* Total Ditolak */}
                    <div
                        onClick={() => handleCardClick("Ditolak")}
                        className={`cursor-pointer w-full md:w-[200px] rounded-xl p-6 text-center shadow-sm mb-4 transition-all duration-200 bg-[#FFF4E8]`}
                    >
                        <h2 className="text-[#F39117] font-semibold mb-2">Total Ditolak</h2>
                        <p className="text-2xl font-bold text-black">{totalDitolak}</p>
                    </div>
                </div>

                {/* Tabel */}
                <div className="w-full overflow-x-auto rounded-lg">
                    <table className="min-w-[800px] w-full shadow-lg">
                        <thead className="text-black text-xs md:text-[10px] lg:text-[15px]">
                            <tr>
                            {['NO', 'KODE PENGAJUAN', 'EMAIL PENGAJUAN', 'PAKET', 'TANGGAL PENGAJUAN', 'STATUS', 'STATUS PEMBAYARAN', 'DETAIL'].map((header, index) => (
                                <th key={index} className="py-3 px-4 relative">
                                {header}
                                {index !== 6 && (
                                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                )}
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedData.map((item, index) => (
                            <tr key={index} className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative">
                                <td className="py-3 px-4">{item.no}</td>
                                <td className="py-3 px-4">{item.kode}</td>
                                <td className="py-3 px-4 uppercase">{item.email}</td>
                                <td className="py-3 px-4">{item.paket}</td>
                                <td className="py-3 px-4">{item.tanggal}</td>
                                <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[item.status]}`}>
                                    {item.status}
                                </span>
                                </td>
                                <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[item.statuspembayaran]}`}>
                                    {item.statuspembayaran}
                                </span>
                                </td>
                                <td className="py-3 px-4">
                                <Eye
                                    className="w-5 h-5 text-gray-600 hover:text-gray-800 mx-auto cursor-pointer"
                                    onClick={() => setSelectedItem(item)}
                                />
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedItem && (
                    <>
                        {/* Overlay */}
                        <div
                        className="fixed inset-0 backdrop-brightness-50 z-60 transition-opacity duration-300"
                        onClick={() => setSelectedItem(null)}
                        ></div>

                        {/* Drawer Panel */}
                        <div className="fixed top-0 right-0 w-full md:w-[480px] h-full bg-white z-70 shadow-lg overflow-y-auto text-black transition-transform duration-300 transform translate-x-0">
                        
                        {/* Header */}
                        <div className="bg-[#FFF6ED] p-4 flex justify-between items-center">
                            <h2 className="text-center font-bold text-lg flex-1">DETAIL PENGAJUAN</h2>
                            <button
                            onClick={() => setSelectedItem(null)}
                            className="text-gray-600 hover:text-red-500 text-xl font-bold"
                            >
                            ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 text-sm space-y-5">

                            {/* Nomor & Tanggal */}
                            <div className="flex justify-between text-xs mb-2 px-1">
                            <span><strong>NOMOR PENGAJUAN</strong> : 0293875</span>
                            <span><strong>TANGGAL</strong> : 2025-03-03</span>
                            </div>

                            {/* Detail Pengajuan */}
                            <div>
                            <h3 className="text-center font-bold mb-3">DETAIL PENGAJUAN</h3>
                            <div className="space-y-2">
                                {[
                                ['NAMA', 'ALFATURRISKI'],
                                ['NIK', '004897865678644'],
                                ['NOMOR WHATSAPP', '082098980756'],
                                ['EMAIL PENGAJUAN', 'ALFATURRISKI@GMAIL.COM'],
                                ['ALAMAT TOKO', 'PERUMAHAN BATU AJI BLOK Z NO 20'],
                                ['PAKET PILIHAN', 'PAKET 2'],
                                ].map(([label, value]) => (
                                <div key={label} className="flex text-sm">
                                    <div className="w-[45%] font-medium">{label}</div>
                                    <div className="w-[5%]">:</div>
                                    <div className="w-[50%]">{value}</div>
                                </div>
                                ))}

                                {/* Deskripsi */}
                                <div className="mt-3">
                                <div className="flex">
                                    <div className="w-[45%] font-medium">DESKRIPSI TOKO</div>
                                    <div className="w-[5%]">:</div>
                                    <div className="w-[50%]">
                                    <p className="text-justify">
                                        TOKO SAYA ADALAH TOKO ANGKRINGAN YANG BERADA DI PERUMAHAN BATU AJI PALING POJOK YAITU DI BLOK Z NO 20
                                    </p>
                                    </div>
                                </div>
                                </div>

                                {/* Foto Toko */}
                                <div className="mt-3">
                                <div className="flex items-start">
                                    <div className="w-[45%] font-medium">FOTO TOKO</div>
                                    <div className="w-[5%]">:</div>
                                    <div className="w-[50%]">
                                    <img
                                        src="/Toko1.png"
                                        alt="Foto Toko"
                                        className="w-[120px] h-auto object-cover rounded border shadow"
                                    />
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>

                            {/* Dokumen Pendukung */}
                            <div>
                            <h3 className="text-center font-bold mb-4">DOKUMEN PENDUKUNG</h3>
                            {[
                                'KTP PEMILIK TOKO',
                                'SURAT PERNYATAAN KEABSAHAN DATA',
                                'SURAT IZIN USAHA (OPSIONAL)',
                            ].map((label, idx) => (
                                <div key={idx} className="mb-3">
                                <p className="text-xs font-semibold mb-1">{label}</p>
                                <div className="flex items-center border rounded px-3 py-2 bg-gray-50 text-sm">
                                    <span className="mr-2">📄</span> pdf document.pdf
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-5 p-5">
                            <button
                            onClick={() => setSelectedItem(null)}
                            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                            >
                            Tolak
                            </button>
                            <button
                            className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white"
                            >
                            Terima
                            </button>
                        </div>
                        </div>
                    </>
                    )}
                </div>

                {/* Pagenation */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600">
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
