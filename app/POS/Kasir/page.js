'use client';

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import Image from 'next/image';
import Swal from "sweetalert2";
import { ShoppingCart, X, Minus, Plus, ScanQrCode, Banknote, Search  } from 'lucide-react';
import '@/globals.css';

export default function Kasir() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [cart, setCart] = useState([]);
    const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showQrisModal, setShowQrisModal] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [amountPaid, setAmountPaid] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [orders, setOrders] = useState([
        {
            queueNumber: 1,
            customerName: "Rina",
            paymentMethod: "Bayar Nanti",
            orderDate: "2025-06-19",
            totalItem: 3,
            minutesAgo: 5,
            items: [
            { name: "Kopi Susu", qty: 2, price: 15, image: '/kopi-susu.png', },
            { name: "Teh Tarik", qty: 1, price: 5, image: '/teh-tarik.png', },
            ],
        },
        {
            queueNumber: 2,
            customerName: "Andi",
            orderDate: "2025-06-19",
            paymentMethod: "Cash",
            totalItem: 2,
            minutesAgo: 12,
            items: [
            { name: "Ayam Geprek", qty: 1, price: 18 },
            { name: "Es Jeruk", qty: 1, price: 7 },
            ],
        },
        {
            queueNumber: 3,
            customerName: "Andi",
            orderDate: "2025-06-19",
            paymentMethod: "Qrish",
            totalItem: 2,
            minutesAgo: 12,
            items: [
            { name: "Ayam Geprek", qty: 1, price: 18 },
            { name: "Es Jeruk", qty: 1, price: 7 },
            ],
        },
    ]);

    const [formData, setFormData] = useState({
        customerName: '',
        orderDate: getTodayDate(),
    });

    const addOrderToState = (paymentType) => {
        const newOrder = {
            queueNumber: orders.length + 1,
            customerName: isEditing ? selectedOrderForEdit.customerName : formData.customerName,
            paymentMethod: paymentType,
            orderDate: isEditing ? selectedOrderForEdit.orderDate : formData.orderDate,
            totalItem: cart.reduce((total, item) => total + item.quantity, 0),
            minutesAgo: 0,
            items: cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                price: item.price,
                image: item.image,
            })),
        };

        if (isEditing && selectedOrderForEdit) {
            // Update pesanan yang sedang diedit
            const updatedOrders = orders.map(order =>
                order === selectedOrderForEdit ? { ...newOrder, queueNumber: order.queueNumber } : order
            );
            setOrders(updatedOrders);
        } else {
            // Tambah pesanan baru
            setOrders([...orders, newOrder]);
        }

        // Reset form dan keranjang
        setFormData({ customerName: '', orderDate: '' });
        closeCart();
        setSelected('');
        setIsEditing(false);
        setSelectedOrderForEdit(null);
    };

    const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.minutesAgo - a.minutesAgo);
    }, [orders]);

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
        } else if (selected === "bayarNanti") {
            Swal.fire({
                icon: "info",
                title: "Perhatian",
                text: "Transaksi ini akan dicatat sebagai 'Bayar Nanti'. Mohon pastikan untuk menagihnya di waktu yang sesuai.",
                confirmButtonText: "Oke, Mengerti",
                confirmButtonColor: "#ECA641",
            }).then((result) => {
                if (result.isConfirmed) {
                    addOrderToState("Bayar Nanti");
                }
            });
        }
        else {
            Swal.fire({
            icon: "info",
            title: "Metode pembayaran belum tersedia",
            confirmButtonText: "OK",
            confirmButtonColor: "#ECA641",
            });
        }
    };

    const handleDetail = (order) => {
        setSelectedOrderForEdit(order);
        setCart(
            order.items.map((item, index) => ({
                id: index,
                name: item.name,
                price: item.price,
                quantity: item.qty,
                image: item.image || "/placeholder.png",
                category: item.category || "",
            }))
        );
        setSelected(order.paymentMethod.toLowerCase().replace(" ", "")),
        setIsCartOpen(true);
        setIsEditing(true);
    };

    const handleSaveEditOnly = () => {
        if (!selectedOrderForEdit) return;

        const updatedOrder = {
            ...selectedOrderForEdit,
            items: cart.map((item) => ({
            name: item.name,
            qty: item.quantity,
            price: item.price,
            image: item.image,
            })),
            totalItem: cart.reduce((acc, item) => acc + item.quantity, 0),
        };

        const updatedOrders = orders.map(order =>
            order === selectedOrderForEdit ? updatedOrder : order
        );

        setOrders(updatedOrders);
        Swal.fire({
            icon: "success",
            title: "Perubahan Disimpan",
            confirmButtonColor: "#ECA641",
        });

        // Reset
        closeCart();
    };

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const menuItems = [
        { id: 1, name: "Sate Kambing", price: 15, image: "/sate-kambing.png", category: "Makanan", favorite: true },
        { id: 2, name: "Kopi Susu", price: 7, image: "/kopi-susu.png", category: "Minuman", favorite: true },
        { id: 3, name: "Nasi Goreng", price: 12, image: "/sate-kambing.png", category: "Makanan", favorite: false },
        { id: 4, name: "Teh Manis", price: 5, image: "/kopi-susu.png", category: "Minuman", favorite: false },
        { id: 5, name: "Teh Manis", price: 5, image: "/kopi-susu.png", category: "Minuman", favorite: false },
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
                                return null;
                            }
                            return { ...item, quantity: item.quantity - 1 };
                        } else {
                            return { ...item, quantity: item.quantity + 1 };
                        }
                    }
                    return item;
                })
                .filter((item) => item !== null);
        });
    };

    // Menutup keranjang
    const closeCart = () => {
        setIsCartOpen(false);
        setCart([]);
    };

    useEffect(() => {
        if (!isCashModalOpen) {
            setAmountPaid(0);
        }
    }, [isCashModalOpen]);
    
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;

    const updateAmount = (digit) => {
        setAmountPaid(prevAmount => prevAmount * 10 + digit);
    };

    const clearAmount = () => {
        setAmountPaid(0);
    };

    // Menambahkan penjumlahan pada kalkulator kasir
    const handlePayCash = () => {
        Swal.fire({
            icon: "success",
            title: "Pembayaran Berhasil",
            confirmButtonText: "OK",
            confirmButtonColor: "#ECA641",
        });
        addOrderToState("Cash");
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
                        <div className={`relative overflow-x-auto py-3 no-scrollbar transition-all duration-300 
                        ${isCollapsed ? "max-w-[90vw]" : "max-w-[90vw] md:max-w-[95vw] lg:max-w-[80vw]"}`}>
                            <div className="flex space-x-3 md:space-x-4 w-max flex-nowrap">
                                {sortedOrders.map((order, index) => {
                                    const isBayarNanti = order.paymentMethod === "Bayar Nanti";

                                    return (
                                        <div
                                        key={index}
                                        style={isBayarNanti ? { backgroundColor: "rgba(246, 181, 67, 0.3)" } : {}}
                                        className={`${
                                            isBayarNanti
                                            ? "border-2 border-[#ECA641]"
                                            : "border border-gray-300"
                                        } p-3 md:p-4 rounded-lg shadow-md text-center min-w-[140px] md:min-w-[180px] flex-shrink-0 bg-white`}
                                        >
                                        <p className="font-semibold text-black text-sm md:text-base">
                                            No Antrian #{order.queueNumber}
                                        </p>
                                        <p className="text-xs md:text-sm text-black">
                                            Total Item {order.totalItem}x
                                        </p>
                                        {order.paymentMethod === "Bayar Nanti" ? (
                                            <button
                                                onClick={() => handleDetail(order)}
                                                className="border border-[#ECA641] text-white bg-[#ECA641] px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm cursor-pointer"
                                            >
                                                Detail
                                            </button>
                                            ) : (
                                            <button
                                                onClick={showModal}
                                                className="bg-[#ECA641] text-white px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm cursor-pointer"
                                            >
                                                Selesai
                                            </button>
                                        )}
                                        <p className="text-xs text-black mt-2">{order.minutesAgo} menit lalu</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Antrian Pesan Online*/}
                    <div className="mb-6">
                        <h2 className="text-lg md:text-xl font-semibold text-black mb-3">
                            Antrian Pesanan Online
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
                                        className="border border-gray-300 bg-white p-3 md:p-4 rounded-lg shadow-md text-center min-w-[140px] md:min-w-[180px] flex-shrink-0"
                                    >
                                        <p className="font-semibold text-black text-sm md:text-base">
                                            No Antrian #{order.queueNumber}
                                        </p>
                                        <p className="text-xs md:text-sm text-black">
                                            Total Item {order.totalItem}x
                                        </p>
                                        <button onClick={showModal} className="bg-[#ECA641] text-white px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm cursor-pointer">
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
                        <div className="flex flex-wrap items-center justify-between mb-4">
                            {/* Kategori Buttons */}
                            <div className="overflow-x-auto max-w-full">
                                <div className="flex space-x-2 md:space-x-4 w-full flex-wrap">
                                {categories.map((category) => (
                                    <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-3 py-1 md:px-4 md:py-2 mb-3 rounded-lg text-sm md:text-lg font-medium whitespace-nowrap cursor-pointer ${
                                        activeCategory === category
                                        ? "bg-[#ECA641] text-white"
                                        : "bg-white text-[#ECA641] border border-[#ECA641]"
                                    }`}
                                    >
                                    {category}
                                    </button>
                                ))}
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari nama produk"
                                // value={searchQuery}
                                // onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-gray-300 text-gray-500 rounded-lg text-sm md:text-base w-full"
                            />
                            </div>
                        </div>

                    </div>

                    {/* Daftar Menu */}
                    <div className={`grid gap-4 transition-all duration-300 ${
                        isCartOpen
                            ? "grid-cols-3 pr-[370px]"  // Cart terbuka, hanya 2 kolom dan beri ruang untuk cart
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
                                            <p className="text-[#ECA641] font-bold text-sm ml-auto">{item.price.toLocaleString("id-ID")}K</p>
                                        </div>
                                    </div>
                                    <button onClick={() => addToCart(item)} className="mt-2 cursor-pointer bg-[#ECA641] text-white px-4 py-2 w-full rounded-lg flex items-center justify-center gap-2">
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
                                <div className="flex flex-col border border-gray-300 px-4 py-2 rounded-lg text-sm w-40">
                                    <label className="text-gray-500 mb-1">Nama Customer</label>
                                    <input
                                    type="text"
                                    name="customerName"
                                    placeholder='Masukkan nama'
                                    value={isEditing ? selectedOrderForEdit?.customerName || '' : formData.customerName}
                                    onChange={(e) =>
                                        !isEditing &&
                                        setFormData({ ...formData, customerName: e.target.value })
                                    }
                                    readOnly={isEditing}
                                    className="bg-transparent border-none text-black font-semibold text-sm focus:outline-none"
                                    />
                                </div>

                                {/* Tanggal Pemesanan */}
                                <div className="flex flex-col border border-gray-300 px-4 py-2 rounded-lg text-sm w-fit text-right">
                                    <label className="text-gray-500 mb-1">Tanggal Pemesanan</label>
                                    <input
                                        type="date"
                                        name="orderDate"
                                        value={(isEditing ? selectedOrderForEdit?.orderDate : formData.orderDate) || ''}
                                        onChange={(e) =>
                                            !isEditing &&
                                            setFormData({ ...formData, orderDate: e.target.value })
                                        }
                                        readOnly={isEditing}
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
                                        <Image src={item.image || "/placeholder.png"} width={70} height={70} alt={item.name} className="rounded-lg"/>
                                        <div className="flex-1 ml-3">
                                            <p className="text-black text-sm font-medium">{item.name}</p>
                                            <p className="text-gray-500 text-xs">{item.category}</p>
                                            <p className="text-[#ECA641] font-bold text-sm">{item.price.toLocaleString("id-ID")}K</p>
                                        </div>
                                        <div className="flex items-center">
                                            <button onClick={() => updateQuantity(item.id, "decrease")} className="cursor-pointer p-2 bg-white text-[#ECA641] border border-[CAC4D0] rounded-lg">
                                                <Minus size={14} />
                                            </button>
                                            <span className="mx-2 text-sm font-semibold text-black">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, "increase")} className="cursor-pointer p-2 bg-[#ECA641] text-white rounded-lg">
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
                                    <span>{subtotal.toLocaleString("id-ID")} K</span>
                                </div>
                                <div className="flex justify-between font-bold text-black mt-3 text-lg">
                                    <span>Total</span>
                                    <span>{total.toLocaleString("id-ID")} K</span>
                                </div>
                            </div>

                            {/* Metode Pembayaran */}
                            <h3 className="text-black font-semibold mt-6 mb-2">Metode Pembayaran</h3>
                            <div className="flex gap-4">
                                {/* Button Cash */}
                                <button
                                    className={`cursor-pointer w-[80px] border border-[#ECA641] py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${selected === "cash" ? "bg-[#F6B85D]/50 text-[#F9870B]" : "text-[#ECA641]"}`}
                                    onClick={() => setSelected("cash")}
                                >
                                    <Banknote size={24} />
                                    <span>Cash</span>
                                </button>
                                {/* Button QRIS */}
                                <button
                                    className={`cursor-pointer w-[80px] border border-[#ECA641] rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${selected === "qris" ? "bg-[#F6B85D]/50 text-[#F9870B]" : "text-[#ECA641]"}`}
                                    onClick={() => setSelected("qris")}
                                >
                                    <ScanQrCode size={24} />
                                    <span>Qris</span>
                                </button>
                                {/* Button Bayar Nanti */}
                                <button
                                    className={`cursor-pointer min-w-max px-3 py-2 border border-[#ECA641] rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${selected === "bayarNanti" ? "bg-[#F6B85D]/50 text-[#F9870B]" : "text-[#ECA641]"}`}
                                    onClick={() => setSelected("bayarNanti")}
                                >
                                    <ScanQrCode size={24} />
                                    <span className="whitespace-nowrap">Bayar Nanti</span>
                                </button>
                            </div>

                            {/* Tombol Bayar */}
                            {selectedOrderForEdit ? (
                                <div className="flex gap-3 mt-6">
                                    <button
                                    onClick={handleSaveEditOnly}
                                    className="w-1/2 bg-gray-300 text-black py-3 rounded-lg font-semibold"
                                    >
                                    Simpan
                                    </button>
                                    <button
                                    onClick={handlePayment}
                                    className="w-1/2 bg-[#ECA641] text-white py-3 rounded-lg font-semibold"
                                    >
                                    Bayar Sekarang
                                    </button>
                                </div>
                                ) : (
                                <button
                                    onClick={handlePayment}
                                    className="cursor-pointer mt-6 w-full bg-[#ECA641] text-white py-3 rounded-lg font-semibold"
                                >
                                    Bayar Sekarang
                                </button>
                            )}

                    </div>

                    {/* Qrish Payment Modal */}
                    {showQrisModal && (
                        <div className="fixed inset-0 backdrop-brightness-50 z-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-90">
                                <h2 className="text-lg text-black font-semibold">Pembayaran</h2>
                                <img src="/qr.png" alt="QRIS Code" className="mx-auto my-4 w-30 h-30" />
                                <p className="text-gray-600">Batas Pembayaran: 00.30</p>
                                <hr className="my-2" />
                                <p className="text-gray-600">Total Transaksi</p>
                                <h3 className="text-xl font-bold text-black">{total.toLocaleString("id-ID")}K</h3>
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
                                <span className="font-semibold text-gray-800">{total.toLocaleString("id-ID")} K</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 text-sm">
                                <span className="font-semibold text-gray-700">Jumlah Dibayar</span>
                                <span className="text-gray-800">{amountPaid.toLocaleString("id-ID")} K</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 text-sm">
                                <span className="font-semibold text-gray-700">Kembalian</span>
                                <span className="text-gray-800">{(amountPaid - total).toLocaleString("id-ID")} K</span>
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
                </div>
            </div>
        </div>
    );
}
