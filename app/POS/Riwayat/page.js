'use client';

import { useState, useRef, useEffect  } from 'react';
import { Eye, X, Calendar  } from "lucide-react";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";

export default function Riwayat() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [activeTab, setActiveTab] = useState('dinein');
    const [showModal, setShowModal] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [filterDate, setFilterDate] = useState(null);
    const [filterOrderStatus, setFilterOrderStatus] = useState('');
    const [filterTransactionStatus, setFilterTransactionStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null)
    const filterRef = useRef(null);
    const modalRef = useRef(null);

    const toggleSidebar = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsSidebarOpen(!isSidebarOpen);
        } else {
        setIsCollapsed(!isCollapsed);
        }
    };

    const dineInData = [
        {
        orderCode: '15032023',
        customerName: 'Alfaturriski',
        orderDate: '05/05/2025',
        orderStatus: 'Selesai',
        transactionStatus: 'Cash',
        orderType: 'DINE IN',
        },
        {
        orderCode: '16022023',
        customerName: 'Eka Fitri Anisa',
        orderDate: '18/05/2025',
        orderStatus: 'Selesai',
        transactionStatus: 'TF',
        orderType: 'ONLINE',
        },
        {
        orderCode: '18032023',
        customerName: 'Bustanul Ariffin',
        orderDate: '18/05/2025',
        orderStatus: 'Proses',
        transactionStatus: 'Qris',
        orderType: 'DINE IN',
        },
        {
        orderCode: '18032023',
        customerName: 'Hadian Nelvi',
        orderDate: '18/05/2025',
        orderStatus: 'Proses',
        transactionStatus: 'Qris',
        orderType: 'ONLINE',
        },
    ];

    const onlineData = [
        {
        orderCode: '16022023',
        customerName: 'Eka Fitri Anisa',
        orderDate: '18/05/2025',
        orderStatus: 'Selesai',
        transactionStatus: 'TF',
        orderType: 'ONLINE',
        },
        {
        orderCode: '14020032',
        customerName: 'Bustanul Ariffin',
        orderDate: '18/05/2025',
        orderStatus: 'Selesai',
        transactionStatus: 'TF',
        orderType: 'ONLINE',
        },
        {
        orderCode: '13947821',
        customerName: 'Alfaturrahman',
        orderDate: '18/05/2025',
        orderStatus: 'Selesai',
        transactionStatus: 'Cash',
        orderType: 'ONLINE',
        },
        {
        orderCode: '20309472',
        customerName: 'Hadian Nelvi',
        orderDate: '18/05/2025',
        orderStatus: 'Pending',
        transactionStatus: 'Cash',
        orderType: 'ONLINE',
        },
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const getData = () => {
        return activeTab === 'dinein' ? dineInData : onlineData;
    };

    const handleTerimaOrder = () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Pesanan akan diproses!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Terima!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
            setSelectedOrder((prev) => ({
                ...prev,
                orderStatus: 'Proses'
            }));

            Swal.fire(
                'Diterima!',
                'Pesanan sedang diproses.',
                'success'
            );
            }
        });
    };

    const handleTolakOrder = () => {
        Swal.fire({
            title: 'Tolak Pesanan',
            input: 'textarea',
            inputLabel: 'Alasan Penolakan',
            inputPlaceholder: 'Tuliskan alasan penolakan di sini...',
            inputAttributes: {
            'aria-label': 'Alasan penolakan'
            },
            showCancelButton: true,
            confirmButtonText: 'Tolak',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            preConfirm: (alasan) => {
            if (!alasan) {
                Swal.showValidationMessage('Alasan tidak boleh kosong');
                return false;
            }
            return alasan;
            }
        }).then((result) => {
            if (result.isConfirmed) {
            const alasanPenolakan = result.value;

            // Update orderStatus ke Ditolak dan simpan alasan jika dibutuhkan
            setSelectedOrder((prev) => ({
                ...prev,
                orderStatus: 'Ditolak',
                alasan: alasanPenolakan,
            }));

            Swal.fire(
                'Pesanan Ditolak!',
                'Pesanan telah ditolak dengan alasan: ' + alasanPenolakan,
                'success'
            );
            }
        });
    };

    const applyFilters = (data) => {
        return data.filter(item => {
        const matchDate = filterDate ? item.orderDate.includes(filterDate) : true;
        const matchOrderStatus = filterOrderStatus ? item.orderStatus === filterOrderStatus : true;
        const matchTransactionStatus = filterTransactionStatus ? item.transactionStatus === filterTransactionStatus : true;
        return matchDate && matchOrderStatus && matchTransactionStatus;
        });
    };
    
    const handleResetFilter = () => {
        setFilterDate('');
        setFilterOrderStatus('');
        setFilterTransactionStatus('');
    };

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
            setShowFilterDropdown(false);
            }

            if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
            }
            console.log("Current Filter Date: ", filterDate);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal], [filterDate]);

    const currentData = applyFilters(getData()).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(getData().length / itemsPerPage);

    return (
    <div className="h-screen flex flex-col bg-white">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 relative overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col p-4 sm:p-3 overflow-auto">
                <div className="flex flex-wrap gap-2 mb-4 cursorp">
                    {/* Tombol Pesan di Tempat */}
                    <button
                        className={`px-4 py-2 font-medium ${
                        activeTab === 'dinein'
                            ? 'border-b-2 border-yellow-500 text-yellow-600 cursor-pointer'
                            : 'text-gray-600'
                        }`}
                        onClick={() => handleTabClick('dinein')}
                    >
                        Pesan di Tempat
                    </button>

                    {/* Tombol Pesan Online */}
                    <button
                        className={`px-4 py-2 font-medium ${
                        activeTab === 'online'
                            ? 'border-b-2 border-yellow-500 text-yellow-600 cursor-pointer'
                            : 'text-gray-600'
                        }`}
                        onClick={() => handleTabClick('online')}
                    >
                        Pesan Online
                    </button>

                    {/* Tombol Filter */}
                    <div className="relative inline-block">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="cursor-pointer border px-4 py-2 text-black rounded-lg text-sm flex items-center gap-1"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V18a1 1 0 01-.553.894l-4 2A1 1 0 019 20v-6.586L3.293 6.707A1 1 0 013 6V4z"
                        />
                        </svg>
                        <span>Filter</span>
                    </button>

                    {/* Dropdown */}
                    {showFilterDropdown && (
                        <div ref={filterRef} className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pesanan</label>
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


                            <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Pesanan</label>
                            <select
                                value={filterOrderStatus}
                                onChange={(e) => setFilterOrderStatus(e.target.value)}
                                className="w-full border rounded p-2 text-sm text-gray-500"
                            >
                                <option value="">Semua</option>
                                <option value="Proses">Proses</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                            </div>

                            <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Transaksi</label>
                            <select
                                value={filterTransactionStatus}
                                onChange={(e) => setFilterTransactionStatus(e.target.value)}
                                className="w-full border rounded p-2 text-sm text-gray-500"
                            >
                                <option value="">Semua</option>
                                <option value="Cash">Cash</option>
                                <option value="Qris">Qris</option>
                                <option value="TF">Transfer</option>
                            </select>
                            </div>

                            <button
                            onClick={handleResetFilter}
                            className="w-full bg-red-100 text-red-600 hover:bg-red-200 font-semibold py-2 px-4 rounded text-sm"
                            >
                            Reset Filter
                            </button>
                        </div>
                    )}

                    </div>

                </div>
                
                <div className="flex flex-col flex-1 overflow-x-auto rounded-lg min-h-[300px]">
                    <div className="overflow-x-auto rounded-lg">
                        <table className="min-w-[700px] w-full shadow-lg">
                        <thead className="text-black text-xs md:text-[10px] lg:text-[15px] border-y border-gray-500">
                            <tr>
                            {['NO', 'KODE PESANAN', 'NAMA CUSTOMER', 'TANGGAL PESANAN', 'STATUS PESANAN', 'STATUS TRANSAKSI', 'DETAIL PESANAN', 'TIPE PESANAN'].map((header, index) => (
                                <th key={index} className="py-3 px-4 whitespace-nowrap relative">
                                {header}
                                {index !== 7 && <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>}
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((item, index) => (
                                <tr key={index} className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative">
                                    <td className="py-3 px-4 relative">{index + 1 + (currentPage - 1) * itemsPerPage}<span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span></td>
                                    <td className="py-3 px-4 relative">{item.orderCode}<span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span></td>
                                    <td className="py-3 px-4 relative">{item.customerName}<span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span></td>
                                    <td className="py-3 px-4 relative">{item.orderDate}<span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span></td>
                                    <td className="py-3 px-4 relative">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.orderStatus === 'Selesai' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{item.orderStatus}</span>
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                    </td>
                                    <td className="py-3 px-4 relative">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.transactionStatus === 'Cash' ? 'bg-green-200 text-green-700' : item.transactionStatus === 'Qris' ? 'bg-blue-200 text-blue-700' : 'bg-red-200 text-red-700'}`}>{item.transactionStatus}</span>
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                    </td>
                                    <td className="py-3 px-4 relative flex items-center justify-center">
                                        <Eye className="cursor-pointer" onClick={() => handleOpenModal(item)} />
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                    </td>
                                    <td className="py-3 px-4 relative">{item.orderType}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td colSpan="8" className="py-6 text-center text-gray-400 text-sm">
                                    Tidak Ada Data
                                </td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>

                    {showModal && selectedOrder && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50"
                            onClick={(e) => {
                            if (modalRef.current && !modalRef.current.contains(e.target)) {
                                handleCloseModal();
                            }
                            }}
                        >
                            <div
                            ref={modalRef}
                            className="bg-white text-black rounded-lg w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative"
                            onClick={(e) => e.stopPropagation()}
                            >
                            {/* Header */}
                            <div className="flex justify-between items-center pb-4">
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
                                    <p className="font-medium">{selectedOrder.customerName}</p>
                                </div>
                                <div className='border-2 border-gray-300 p-2 rounded-md text-right'>
                                    <p className="text-xs text-gray-500">Tanggal Pemesanan</p>
                                    <p className="font-medium">{selectedOrder.orderDate}</p>
                                </div>
                                </div>

                                <div className="mt-4 pt-2">
                                <div className="flex justify-between">
                                    <p className="font-semibold text-black">Detail Pesanan</p>
                                    <p className="font-semibold text-xs md:text-sm text-gray-500">Kode Pesanan : {selectedOrder.orderCode}</p>
                                </div>

                                {/* Simulasi daftar item pesanan (sementara hardcoded) */}
                                <div className="flex gap-3 mt-4">
                                    <img src="/sate-kambing.png" alt="Sate Kambing" className="w-20 h-16 rounded object-cover" />
                                    <div className="flex justify-between w-full">
                                    <div className="flex flex-col justify-start">
                                        <p className="font-semibold">Sate kambing</p>
                                        <p className="text-gray-500 text-xs">Makanan</p>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-end items-end">
                                        <p className="font-bold text-sm">1x</p>
                                        <p className="font-bold text-sm">Rp 15.000,00</p>
                                    </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4 pt-2 border-t">
                                    <img src="/kopi-susu.png" alt="Kopi Susu" className="w-20 h-16 rounded object-cover" />
                                    <div className="flex justify-between w-full">
                                    <div className="flex flex-col justify-start">
                                        <p className="font-semibold">Kopi Susu</p>
                                        <p className="text-gray-500 text-xs">Minuman</p>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-end items-end">
                                        <p className="font-bold text-sm">1x</p>
                                        <p className="font-bold text-sm">Rp 7.000,00</p>
                                    </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="mt-5 border-t pt-2 text-sm">
                                    <div className="flex justify-between">
                                    <span>Item</span>
                                    <span className='font-semibold text-black'>2 (items)</span>
                                    </div>
                                    <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className='font-semibold text-black'>Rp 22.000,00</span>
                                    </div>
                                    <div className="flex justify-between">
                                    <span>Keterangan</span>
                                    <span className='font-semibold text-black'>Dine In</span>
                                    </div>
                                </div>
                                </div>
                            </div>

                            {/* Footer Total */}
                            <div className="flex flex-row justify-between border-t mt-5 py-3 text-right font-semibold">
                                <p>Total</p>
                                <p>Rp 22.000,00</p>
                            </div>

                            {/* Tombol Aksi */}
                            {selectedOrder && selectedOrder.orderStatus === "Pending" && onlineData.some(item => item.orderCode === selectedOrder.orderCode) && (
                                <div className="flex flex-row justify-end gap-2 border-t py-3 font-semibold">
                                    <button onClick={handleTolakOrder} className="text-red-500 border border-red-500 rounded px-2 py-2 hover:bg-red-100 cursor-pointer">
                                        Tolak
                                    </button>
                                    <button onClick={handleTerimaOrder} className="text-green-500 border border-green-500 rounded px-2 py-2 hover:bg-green-100 cursor-pointer">
                                        Terima
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-gray-600">
                        <span>Menampilkan {currentPage * itemsPerPage - itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, getData().length)} dari {getData().length} entri</span>
                        <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'cursor-not-allowed bg-gray-300' : 'bg-[#ECA641] text-white'}`} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Sebelumnya</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-[#ECA641] text-white' : 'bg-gray-300'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-300' : 'bg-[#ECA641] text-white'}`} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Selanjutnya</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
