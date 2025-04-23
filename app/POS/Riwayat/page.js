'use client';

import { useState } from 'react';
import { Eye, X } from "lucide-react";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import '@/globals.css';

export default function Riwayat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState('dinein');
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  const dineInData  = [
    {
        orderCode: '15032023',
        customerName: 'Alfaturriski',
        orderDate: '10 MARET 2023',
        orderStatus: 'Selesai',
        transactionStatus: 'Cash',
        orderType: 'DINE IN',
    },
    {
      orderCode: '16022023',
      customerName: 'Eka Fitri Anisa',
      orderDate: '18 JANUARI 2023',
      orderStatus: 'Selesai',
      transactionStatus: 'TF',
      orderType: 'DINE IN',
    },
    {
      orderCode: '18032023',
      customerName: 'Bustanul Ariffin',
      orderDate: '11 MARET 2023',
      orderStatus: 'Proses',
      transactionStatus: 'Qris',
      orderType: 'DINE IN',
    },
    ...Array.from({ length: 17 }, (_, i) => ({
      orderCode: `OC${i + 4}`,
      customerName: `Customer ${i + 4}`,
      orderDate: '11 MARET 2023',
      orderStatus: i % 2 === 0 ? 'Selesai' : 'Proses',
      transactionStatus: ['Cash', 'Qris', 'TF'][i % 3],
      orderType: ['DINE IN', 'ONLINE'][i % 2],
    })),
  ];

  const onlineData   = [
    {
        orderCode: '16022023',
        customerName: 'Eka Fitri Anisa',
        orderDate: '18 JANUARI 2023',
        orderStatus: 'Selesai',
        transactionStatus: 'TF',
        orderType: 'ONLINE',
    },
    ...Array.from({ length: 17 }, (_, i) => ({
      orderCode: `OC${i + 4}`,
      customerName: `Customer ${i + 4}`,
      orderDate: '11 MARET 2023',
      orderStatus: i % 2 === 0 ? 'Selesai' : 'Proses',
      transactionStatus: ['Cash', 'Qris', 'TF'][i % 3],
      orderType: ['DINE IN', 'ONLINE'][i % 2],
    })),
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getData = () => {
    return activeTab === 'dinein' ? dineInData : onlineData;
  };

  const currentData = getData().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(getData().length / itemsPerPage);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 relative h-full overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 p-4 sm:p-6 transition-all duration-300 w-full">
                <div className="flex justify-start gap-8 mb-4 relative">
                    {/* Tabs */}
                    <div className="flex border-b mb-4">
                        <button className={`px-4 py-2 font-medium ${ activeTab === 'dinein' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-600'}`}
                        onClick={() => handleTabClick('dinein')}
                        >
                        Pesan di Tempat
                        </button>
                        <button className={`px-4 py-2 font-medium ${activeTab === 'online' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-600'}`}
                        onClick={() => handleTabClick('online')}
                        >
                        Pesan Online
                        </button>
                    </div>


                    {/* Filter Kalender */}
                    <div className="relative">
                        <button className="border px-4 py-2 text-black rounded-lg text-sm flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V18a1 1 0 01-.553.894l-4 2A1 1 0 019 20v-6.586L3.293 6.707A1 1 0 013 6V4z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabel */}
                <div className="overflow-x-auto rounded-lg">
                    <table className="max-w-[800px] w-full shadow-lg">
                        <thead className="text-black text-xs md:text-[10px] lg:text-[15px] border-y border-gray-500">
                            <tr>
                            {['NO', 'KODE PESANAN', 'NAMA CUSTOMER', 'TANGGAL PESANAN', 'STATUS PESANAN', 'STATUS TRANSAKSI', 'DETAIL PESANAN', 'TIPE PESANAN'].map((header, index) => (
                                <th key={index} className="py-3 px-4 relative whitespace-nowrap">
                                {header}
                                {index !== 7 && (
                                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                )}
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                            <tr key={index} className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative">
                                <td className="py-3 px-4 relative">{index + 1 + (currentPage - 1) * itemsPerPage}
                                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                </td>
                                
                                <td className="py-3 px-4 relative">{item.orderCode}
                                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                </td>
                                <td className="py-3 px-4 relative">{item.customerName}
                                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                </td>
                                <td className="py-3 px-4 relative">{item.orderDate}
                                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                </td>
                                <td className="py-3 px-4 relative">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.orderStatus === 'Selesai' ? 'bg-green-100 text-green-600' :
                                        item.orderStatus === 'Proses' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-gray-200 text-gray-600'
                                    }`}>
                                        {item.orderStatus}
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                    </span>
                                </td>
                                <td className="py-3 px-4 relative">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        item.transactionStatus === 'Cash' ? 'bg-green-200 text-green-700' :
                                        item.transactionStatus === 'Qris' ? 'bg-blue-200 text-blue-700' :
                                        'bg-red-200 text-red-700'
                                    }`}>
                                        {item.transactionStatus}
                                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                </span>
                                </td>
                                <td className="py-3 px-4 relative">
                                    <Eye className="cursor-pointer w-30" onClick={handleOpenModal}/>
                                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                </td>
                                <td className="py-3 px-4 relative">{item.orderType}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                        <div className="bg-white text-black rounded-lg w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
                            {/* Header */}
                            <div className="flex justify-between items-cente pb-4">
                                <h2 className="text-xl font-bold text-center w-full">Detail Pesanan</h2>
                                <button className="absolute right-6" onClick={handleCloseModal}>
                                    <X className="w-5 h-5 cursor-pointer" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="mt-4 space-y-4 text-sm">
                                <div className="flex flex-row justify-between gap-2">
                                    <div className='border-2 border-gray-300 p-2 rounded-md'>
                                        <p className="text-xs text-gray-500">Nama Customer</p>
                                        <p className="font-medium">Alfatturrizki</p>
                                    </div>
                                    <div className='border-2 border-gray-300 p-2 rounded-md text-right'>
                                        <p className="text-xs text-gray-500">Tanggal Pemesanan</p>
                                        <p className="font-medium">10 Maret 2023</p>
                                    </div>
                                </div>


                                <div className="mt-4 pt-2">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-black">Detail Pesanan</p>
                                        <p className="font-semibold text-xs md:text-sm text-gray-500">Kode Pesanan : 15032023</p>
                                    </div>

                                    {/* Item 1 */}
                                    <div className="flex gap-3 mt-4">
                                        <img
                                            src="/sate-kambing.png"
                                            alt="Kopi Susu"
                                            className="w-20 h-16 rounded object-cover"
                                        />

                                        <div className="flex justify-between w-full">
                                            {/* Nama dan Kategori */}
                                            <div className="flex flex-col justify-start">
                                            <p className="font-semibold ">Sate kambing</p>
                                            <p className="text-gray-500 text-xs">Makanan</p>
                                            </div>

                                            {/* Harga di bawah kanan */}
                                            <div className="flex flex-row gap-2 justify-end items-end">
                                                <p className="font-bold text-sm">1x</p>
                                                <p className="font-bold text-sm">Rp 15.000,00</p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Item 2 */}
                                    <div className="flex gap-3 mt-4 pt-2 border-t">
                                        <img
                                            src="/kopi-susu.png"
                                            alt="Kopi Susu"
                                            className="w-20 h-16 rounded object-cover"
                                        />

                                        <div className="flex justify-between w-full">
                                            {/* Nama dan Kategori */}
                                            <div className="flex flex-col justify-start">
                                            <p className="font-semibold">Kopi Susu</p>
                                            <p className="text-gray-500 text-xs">Minuman</p>
                                            </div>

                                            {/* Harga di bawah kanan */}
                                            <div className="flex flex-row gap-2 justify-end items-end">
                                                <p className="font-bold text-sm">1x</p>
                                                <p className="font-bold text-sm">Rp 7.000,00</p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Total Section */}
                                    <div className="mt-5 border-t pt-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Item</span>
                                            <span className='font-semibold  text-black'>2 (items)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className='font-semibold  text-black'>Rp 22.000,00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Keterangan</span>
                                            <span className='font-semibold text-black'>Dine In</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-row justify-between border-t mt-5 py-3 text-right font-semibold">
                                <p>Total</p>
                                <p>Rp 22.0000,00</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600">
                    <span>Menampilkan {currentPage * itemsPerPage - itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, getData().length)} dari {getData().length} entri</span>
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
