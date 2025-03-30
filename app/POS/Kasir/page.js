'use client';

import { useState, useEffect } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import Image from 'next/image';
import { ShoppingCart, X, Minus, Plus, ScanQrCode, Banknote  } from 'lucide-react';
import Swal from "sweetalert2";

export default function Kasir() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showQrisModal, setShowQrisModal] = useState(false);

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
            return prevCart.map((item) =>
                item.id === id
                    ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            );
        });
    };

    useEffect(() => {
        if (cart.length === 0) {
            setIsCartOpen(false);
        }
    }, [cart]);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Wrapper untuk Sidebar & Konten */}
        <div className="flex flex-1 relative">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

            {/* Konten Kasir */}
            <div className="p-4 md:p-6 transition-all duration-300">
                {/* Antrian */}
                <div className="mb-6">
                    <h2 className="text-lg md:text-xl font-semibold text-black mb-3">
                        Antrian Pesanan
                    </h2>

                    {/* Tambahkan div pembungkus untuk scroll */}
                    <div className="relative overflow-x-auto py-3 max-w-[90vw] md:max-w-[95vw] lg:max-w-[80vw] no-scrollbar">
                        <div className="flex space-x-3 md:space-x-4 w-max flex-nowrap">
                            {Array(8).fill(null).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-300 p-3 md:p-4 rounded-lg shadow-md text-center min-w-[140px] md:min-w-[180px] flex-shrink-0"
                                >
                                    <p className="font-semibold text-black text-sm md:text-base">
                                        No Antrian #A00{index + 1}
                                    </p>
                                    <p className="text-xs md:text-sm text-black">
                                        Total Item 8x
                                    </p>
                                    <button  onClick={showModal} className="bg-[#ECA641] text-white px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm">
                                        Selesai
                                    </button>
                                    <p className="text-xs text-black mt-2">{index + 1} menit lalu</p>
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
                            <h3 className="text-xl font-bold text-black">Rp {subtotal.toLocaleString("id-ID")}</h3>
                            <button
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                                onClick={() => setShowQrisModal(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* Daftar Menu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {menuItems
                    .filter((item) => activeCategory === "Semua" || item.category === activeCategory || (activeCategory === "Favorit" && item.favorite))
                    .map((item) => (
                        <div key={item.id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                        <Image src={item.image} width={300} height={200} alt={item.name} className="rounded-lg w-full h-40 object-cover" />
                        <h3 className="font-semibold text-sm mt-2 text-black flex items-center">
                            {item.favorite && <span className="text-yellow-400 mr-1">⭐</span>}
                            {item.name}
                        </h3>
                        <p className="text-[#ECA641] font-bold text-sm">Rp {item.price.toLocaleString("id-ID")},00</p>
                        <button onClick={() => addToCart(item)} className="mt-2 bg-[#ECA641] text-white px-4 py-2 w-full rounded-lg flex items-center justify-center gap-2">
                            Tambah Ke Keranjang <ShoppingCart size={16} />
                        </button>
                        </div>
                    ))}
                </div>

                {/* Modal Keranjang */}
                <div
                    className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto transition-transform transform ${
                        isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    {/* Header Modal */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-black">Detail Pesanan</h2>
                        <button onClick={() => setIsCartOpen(false)} className="text-gray-600 hover:text-gray-800">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Informasi Customer */}
                    <div className="flex justify-between mb-4">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                            <p className="text-gray-500">Nama Customer</p>
                            <p className="font-semibold text-black">Alfaturriski</p>
                        </div>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                            <p className="text-gray-500">Tanggal Pemesanan</p>
                            <p className="font-semibold text-black">10/03/2025</p>
                        </div>
                    </div>

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
                        <div className="flex justify-between text-gray-600 mt-2">
                            <span>Tax (12%)</span>
                            <span>Rp {tax.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between font-bold text-black mt-3 text-lg">
                            <span>Total</span>
                            <span>Rp {total.toLocaleString("id-ID")}</span>
                        </div>
                    </div>

                    {/* Metode Pembayaran */}
                    <h3 className="text-black font-semibold mt-6 mb-2">Metode Pembayaran</h3>
                    <div className="flex gap-4">
                    <button
                        className={`w-[80px] border border-[#ECA641] py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all
                        ${selected === "cash" ? "bg-[#F6B85D]/50 text-[#F9870B]" : "text-[#ECA641]"}`}
                        onClick={() => setSelected("cash")}
                    >
                        <Banknote size={24} />
                        <span>Cash</span>
                    </button>

                    {/* Button QRIS */}
                    <button
                        className={`w-[80px] border border-[#ECA641] py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all
                        ${selected === "qris" ? "bg-[#F6B85D]/50 text-[#F9870B]" : "text-[#ECA641]"}`}
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
