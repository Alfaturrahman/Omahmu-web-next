'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import Image from 'next/image';
import Swal from "sweetalert2";
import { ShoppingCart, X, Minus, Plus, ScanQrCode, Banknote  } from 'lucide-react';
import '@/globals.css';
import withAuth from 'hoc/withAuth';

function Kasir() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showQrisModal, setShowQrisModal] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [amountPaid, setAmountPaid] = useState(0);
    
    const orders = [
        { queueNumber: 'A001', totalItem: 8, minutesAgo: 12 },
        { queueNumber: 'A002', totalItem: 4, minutesAgo: 10 },
        { queueNumber: 'A003', totalItem: 6, minutesAgo: 8 },
        { queueNumber: 'A004', totalItem: 5, minutesAgo: 6 },
        { queueNumber: 'A005', totalItem: 7, minutesAgo: 4 },
        { queueNumber: 'A006', totalItem: 3, minutesAgo: 3 },
        { queueNumber: 'A007', totalItem: 2, minutesAgo: 2 },
        { queueNumber: 'A008', totalItem: 9, minutesAgo: 1 },
    ];
    
    // Urutkan dari menit yang terlama ke terbaru
    const sortedOrders = orders.sort((a, b) => b.minutesAgo - a.minutesAgo);
    
    const showModal = () => {
        Swal.fire({
            icon: "warning",
            title: "Apakah Kamu Yakin?",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Selesai",
            confirmButtonColor: "#ECA641",
            cancelButtonColor: "#DC3545",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Selesai ditekan!");
            }
        });
    };

    const handlePayment = () => {
        if (selected === "qris") {
            setShowQrisModal(true);
        } else if (selected === "cash") {
            setIsCashModalOpen(true);
        } else {
            Swal.fire({
                icon: "info",
                title: "Metode pembayaran belum tersedia",
                confirmButtonText: "OK",
                confirmButtonColor: "#ECA641",
            });
        }
    };

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const menuItems = [
        { id: 1, name: "Sate Kambing", price: 15000, image: "/sate-kambing.png", category: "Makanan", favorite: true },
        { id: 2, name: "Kopi Susu", price: 7000, image: "/kopi-susu.png", category: "Minuman", favorite: true },
        { id: 3, name: "Nasi Goreng", price: 12000, image: "/sate-kambing.png", category: "Makanan", favorite: false },
        { id: 4, name: "Teh Manis", price: 5000, image: "/kopi-susu.png", category: "Minuman", favorite: false },
        { id: 5, name: "Teh Manis", price: 5000, image: "/kopi-susu.png", category: "Minuman", favorite: false },
    ];

    const categories = ["Semua", "Makanan", "Minuman", "Favorit"];

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });

        setIsCartOpen(true);
    };

    const updateQuantity = (id, type) => {
        setCart((prevCart) => {
            return prevCart
                .map((item) => {
                    if (item.id === id) {
                        if (type === "decrease") {
                            if (item.quantity === 1) {
                                return null; // akan dihapus
                            }
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            return { ...item, quantity: item.quantity + 1 };
                        }
                    }
                    return item;
                })
                .filter((item) => item !== null); // hapus item yang bernilai null
        });
    };

    // Menutup keranjang
    const closeCart = () => {
        setIsCartOpen(false);
        setCart([]);
    };

    useEffect(() => {
        if (!isCashModalOpen) {
            // Reset inputan saat modal ditutup
            setAmountPaid(0);
        }
    }, [isCashModalOpen]);
    

    // Menghitung subtotal, pajak, dan total
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const updateAmount = (digit) => {
        setAmountPaid(prevAmount => prevAmount * 10 + digit);
    };

    const clearAmount = () => {
        setAmountPaid(0);
    };
    // Menambahkan penjumlahan pada kalkulator kasir
    const handlePayCash = () => {
        // Logic for cash payment
        Swal.fire({
            icon: "success",
            title: "Pembayaran Berhasil",
            confirmButtonText: "OK",
            confirmButtonColor: "#ECA641",
        });
        setIsCashModalOpen(false); // Close modal after payment
    };

    const deleteLastDigit = () => {
        setAmountPaid((prev) => {
            const updated = prev.toString().slice(0, -1);
            return updated === "" ? 0 : parseInt(updated, 10);
        });
    };
    
    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <Header toggleSidebar={toggleSidebar} />

            {/* Wrapper untuk Sidebar & Konten */}
            <div className="flex flex-1 relative h-full overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

                {/* Konten Kasir */}
                <div className="p-4 md:p-6 transition-all overflow-y-auto min-h-0 duration-300">
                    {/* Antrian */}
                    <div className="mb-6">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-3">
                            Antrian Pesanan
                        </h2>

                        {/* Tambahkan div pembungkus untuk scroll */}
                        <div
                            className={`relative overflow-x-auto py-3 no-scrollbar transition-all duration-300 
                                ${isCollapsed ? "max-w-[90vw]" : "max-w-[90vw] md:max-w-[95vw] lg:max-w-[80vw]"}
                            `}
                        >
                            <div className="flex space-x-3 md:space-x-4 w-max flex-nowrap">
                                {sortedOrders.map((order, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray-300 p-3 md:p-4 rounded-lg shadow-md text-center min-w-[140px] md:min-w-[180px] flex-shrink-0"
                                    >
                                        <p className="font-semibold text-black text-sm md:text-base">
                                            No Antrian #{order.queueNumber}
                                        </p>
                                        <p className="text-xs md:text-sm text-black">
                                            Total Item {order.totalItem}x
                                        </p>
                                        <button onClick={showModal} className="bg-[#ECA641] text-white px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm">
                                            Selesai
                                        </button>
                                        <p className="text-xs text-black mt-2">{order.minutesAgo} menit lalu</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Kategori Menu */}
                    <div className="mb-6">
                        <h2 className="text-lg md:text-xl text-black font-semibold mb-3">Menu Pesanan</h2>
                        <div className="overflow-x-auto max-w-full">
                            <div className="flex space-x-2 md:space-x-4 w-full flex-wrap">
                                {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-3 py-1 md:px-4 md:py-2 mb-3 rounded-lg text-sm md:text-lg font-medium whitespace-nowrap ${
                                    activeCategory === category ? "bg-[#ECA641] text-white" : "bg-white text-[#ECA641] border border-[#ECA641]"
                                    }`}
                                >
                                    {category}
                                </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {showQrisModal && (
                        <div className="fixed inset-0 backdrop-brightness-50 z-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-90">
                                <h2 className="text-lg text-black font-semibold">Pembayaran</h2>
                                <img src="/qr.png" alt="QRIS Code" className="mx-auto my-4 w-30 h-30" />
                                <p className="text-gray-600">Batas Pembayaran: 00.30</p>
                                <hr className="my-2" />
                                <p className="text-gray-600">Total Transaksi</p>
                                <h3 className="text-xl font-bold text-black">Rp {total.toLocaleString("id-ID")}</h3>
                                <button
                                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                                    onClick={() => setShowQrisModal(false)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cash Payment Modal */}
                    {isCashModalOpen && (
                        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
                            <div className="bg-white text-black p-6 rounded-2xl shadow-lg w-96">
                            {/* Header */}
                            <div className="flex justify-end">
                                <button
                                onClick={() => setIsCashModalOpen(false)}
                                className="text-black hover:text-red-600 transition"
                                >
                                <X size={24} />
                                </button>
                            </div>

                            {/* Info Pembayaran */}
                            <div className="mt-2 mb-6 space-y-3 text-base">
                                <div className="flex justify-between border-b pb-2 text-sm">
                                <span className="font-semibold text-gray-700">Total Pembayaran</span>
                                <span className="font-semibold text-gray-800">Rp {total.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 text-sm">
                                <span className="font-semibold text-gray-700">Jumlah Dibayar</span>
                                <span className="text-gray-800">Rp {amountPaid.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 text-sm">
                                <span className="font-semibold text-gray-700">Kembalian</span>
                                <span className="text-gray-800">Rp {(amountPaid - total).toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            {/* Kalkulator */}
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                                <button
                                    key={digit}
                                    onClick={() => updateAmount(digit)}
                                    className="py-3 bg-[#ECA641] hover:bg-[#f4b84a] text-white rounded-lg text-lg font-semibold transition"
                                >
                                    {digit}
                                </button>
                                ))}

                                <button
                                onClick={deleteLastDigit}
                                className="py-3 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg text-lg font-semibold transition"
                                >
                                Delete
                                </button>

                                <button
                                onClick={clearAmount}
                                className="py-3 bg-red-500 hover:bg-red-400 text-white rounded-lg text-lg font-semibold transition"
                                >
                                Clear
                                </button>

                                <button
                                onClick={handlePayCash}
                                className="col-span-3 py-3 bg-green-500 hover:bg-green-400 text-white rounded-lg text-lg font-semibold transition mt-1"
                                >
                                Bayar Sekarang
                                </button>
                            </div>
                            </div>
                        </div>
                    )}

                    {/* Daftar Menu */}
                    <div className={`grid gap-4 transition-all duration-300 ${
                        isCartOpen
                            ? "grid-cols-2 pr-[370px]"  // Cart terbuka, hanya 2 kolom dan beri ruang untuk cart
                            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pr-0"  // Normal grid dengan ukuran kolom responsif
                    }`}>
                        {menuItems
                            .filter((item) => activeCategory === "Semua" || item.category === activeCategory || (activeCategory === "Favorit" && item.favorite))
                            .map((item) => (
                                <div key={item.id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                                    <Image src={item.image} width={300} height={200} alt={item.name} className="rounded-lg w-full h-40 object-cover" />
                                    <div className="mt-2">
                                        <h3 className="font-semibold text-sm text-black flex items-center">
                                            {item.favorite && <span className="text-yellow-400 mr-1">⭐</span>}
                                            {item.name}
                                        </h3>
                                        <div className="flex justify-between items-end mt-2">
                                            {/* Mengatur harga di bawah nama dan di ujung kanan */}
                                            <p className="text-[#ECA641] font-bold text-sm ml-auto">Rp {item.price.toLocaleString("id-ID")},00</p>
                                        </div>
                                    </div>
                                    <button onClick={() => addToCart(item)} className="mt-2 bg-[#ECA641] text-white px-4 py-2 w-full rounded-lg flex items-center justify-center gap-2">
                                        Tambah Ke Keranjang <ShoppingCart size={16} />
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                    {/* Modal Keranjang */}
                    <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto transition-transform transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                                            <div className="flex justify-end mb-4">
                                                <button onClick={closeCart} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                                                    <X size={20} />
                                                </button>
                                            </div>
                    
                                            <div className="flex justify-between mb-4">
                                                {/* Nama Customer */}
                                                <div className="flex flex-col border border-gray-300 px-4 py-2 rounded-lg text-sm w-35">
                                                    <label className="text-gray-500 mb-1">Nama Customer</label>
                                                    <input
                                                        type="text"
                                                        name="customerName"
                                                        placeholder="Masukkan Nama Customer"
                                                        className="bg-transparent border-none text-black font-semibold text-sm focus:outline-none"
                                                    />
                                                </div>
                    
                                                {/* Tanggal Pemesanan */}
                                                <div className="flex flex-col border border-gray-300 px-4 py-2 rounded-lg text-sm w-fit text-right">
                                                    <label className="text-gray-500 mb-1 text-right">Tanggal Pemesanan</label>
                                                    <input
                                                        type="date"
                                                        name="orderDate"
                                                        className="bg-transparent border-none text-black font-semibold text-sm focus:outline-none text-right"
                                                    />
                                                </div>
                                            </div>
                    
                                            <h2 className="text-lg font-semibold text-black pb-4">Detail Pesanan</h2>
                    
                                            {/* Daftar Item di Keranjang */}
                                            {cart.length === 0 ? (
                                                <p className="text-sm text-gray-500">Keranjang masih kosong</p>
                                            ) : (
                                                cart.map((item) => (
                                                    <div key={item.id} className="flex items-center border-b pb-3 mb-3">
                                                        <Image src={item.image} width={60} height={60} alt={item.name} className="rounded-lg" />
                                                        <div className="flex-1 ml-3">
                                                            <p className="text-black text-sm font-medium">{item.name}</p>
                                                            <p className="text-gray-500 text-xs">{item.category}</p>
                                                            <p className="text-[#ECA641] font-bold text-sm">Rp {item.price.toLocaleString("id-ID")}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <button onClick={() => updateQuantity(item.id, "decrease")} className="p-2 bg-white text-[#ECA641] border border-[CAC4D0] rounded-lg">
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="mx-2 text-sm font-semibold text-black">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, "increase")} className="p-2 bg-[#ECA641] text-white rounded-lg">
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                    
                                            {/* Ringkasan Pesanan */}
                                            <div className="mt-4 text-sm">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Item</span>
                                                    <span>{cart.length} {cart.length > 1 ? "Items" : "Item"}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-600 mt-2">
                                                    <span>Subtotal</span>
                                                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-black mt-3 text-lg">
                                                    <span>Total</span>
                                                    <span>Rp {total.toLocaleString("id-ID")}</span>
                                                </div>
                                            </div>
                    
                                            {/* Metode Pembayaran */}
                                            <h3 className="text-black font-semibold mt-6 mb-2">Metode Pembayaran</h3>
                                            <div className="flex gap-4">
                                                {/* Button QRIS */}
                                                <button
                                                    className={`w-[80px] border border-[#ECA641] py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${selected === "cash" ? "bg-[#F6B85D]/50 text-[#F9870B]" : "text-[#ECA641]"}`}
                                                    onClick={() => setSelected("cash")}
                                                >
                                                    <Banknote size={24} />
                                                    <span>Cash</span>
                                                </button>
                                                {/* Button QRIS */}
                                                <button
                                                    className={`w-[80px] border border-[#ECA641] py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${selected === "qris" ? "bg-[#F6B85D]/50 text-[#F9870B]" : "text-[#ECA641]"}`}
                                                    onClick={() => setSelected("qris")}
                                                >
                                                    <ScanQrCode size={24} />
                                                    <span>Qris</span>
                                                </button>
                                            </div>
                    
                                            {/* Tombol Bayar */}
                                            <button onClick={handlePayment} className="mt-6 w-full bg-[#ECA641] text-white py-3 rounded-lg font-semibold">
                                                Bayar Sekarang
                                            </button>
                                        </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(Kasir, ['2']); 