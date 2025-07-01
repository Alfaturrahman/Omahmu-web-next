'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import Image from 'next/image';
import Swal from "sweetalert2";
import Flag from "react-world-flags";
import { ShoppingCart, X, Minus, Plus, ScanQrCode, Calendar, Clock   } from 'lucide-react';
import '@/globals.css';

export default function Kasir() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showQrisModal, setShowQrisModal] = useState(false);
    const [catatan, setCatatan] = useState("");
    const [orderType, setOrderType] = useState("");
    const [preorderOption, setPreorderOption] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("ID");
    const [errors, setErrors] = useState({});

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        phoneNumber: "",
        deliveryAddress: "",
        orderDate: getTodayDate(),
    });
    
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
    };
    
    const countryFlags = {
        ID: { code: "+62", label: "ID" },
        US: { code: "+1", label: "US" },
        SG: { code: "+65", label: "SG" },
        IN: { code: "+91", label: "IN" }
    };

    const handlePayment = () => {
        if (!validateForm()) {
            return;
        }
    
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

    const closeCart = () => {
        setIsCartOpen(false);
        setCart([]);
        setCatatan("");
        setOrderType("");
        setPreorderOption("");
        setPickupDate("");
        setPickupTime("");
        setFormData({ phoneNumber: "" });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
      
        if (!orderType) {
          newErrors.orderType = "Tipe pemesanan wajib dipilih.";
        }
      
        if (orderType === "preorder") {
          if (!preorderOption) {
            newErrors.preorderOption = "Opsi pre-order wajib dipilih.";
          }
          if (!pickupDate) {
            newErrors.pickupDate = "Tanggal pengambilan wajib diisi.";
          }
          if (!pickupTime) {
            newErrors.pickupTime = "Jam pengambilan wajib diisi.";
          }
          if (!formData.deliveryAddress) {
            newErrors.deliveryAddress = "Alamat wajib diisi.";
          }
        }
      
        if (orderType === "dinein") {
          if (!pickupDate) {
            newErrors.pickupDate = "Tanggal pengambilan wajib diisi.";
          }
          if (!pickupTime) {
            newErrors.pickupTime = "Jam pengambilan wajib diisi.";
          }
        }

        if (!formData.phoneNumber) {
          newErrors.phoneNumber = "Nomor HP wajib diisi.";
        } else if (!/^\d+$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = "Nomor HP harus berupa angka.";
        }
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;
      
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
                    {/* Kategori Menu */}
                    <div className="mb-6">
                        <h2 className="text-lg md:text-xl text-black font-semibold mb-3">Menu Pesanan</h2>
                        <div className="overflow-x-auto max-w-full">
                            <div className="flex space-x-2 md:space-x-4 w-full flex-wrap">
                                {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-3 py-1 md:px-4 md:py-2 mb-3 rounded-lg text-sm md:text-lg font-medium cursor-pointer whitespace-nowrap ${
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
                                            <p className="text-[#ECA641] font-bold text-sm ml-auto">Rp {item.price.toLocaleString("id-ID")},00</p>
                                        </div>
                                    </div>
                                    <button onClick={() => addToCart(item)} className="mt-2 bg-[#ECA641] text-white px-4 py-2 w-full rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                                        Tambah Ke Keranjang <ShoppingCart size={16} />
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                    {/* Modal Keranjang */}
                    <div className={`fixed right-0 top-0 h-full w-80 lg:w-95 bg-white shadow-lg p-2 overflow-y-auto transition-transform transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                                    value={formData.orderDate}
                                    onChange={(e) =>
                                    setFormData({ ...formData, orderDate: e.target.value })
                                    }
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

                        {/* Catatan */}
                        <div className="mt-6">
                        <label className="text-sm font-medium text-black mb-2 block">Catatan</label>
                        <textarea
                            name="catatan"
                            placeholder="Tulis catatan pesanan jika ada..."
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-black"
                            rows="3"
                            onChange={(e) => setCatatan(e.target.value)}
                        />
                        </div>

                        {/* Tipe Pemesanan */}
                        <div className="mt-4 flex flex-col gap-2">
                            <label className="text-sm font-medium text-black">Tipe Pemesanan</label>
                            <div className="flex gap-4 mt-1">
                                <label className="flex items-center gap-2 text-sm text-black">
                                    <input
                                        type="radio"
                                        name="orderType"
                                        value="preorder"
                                        checked={orderType === "preorder"}
                                        onChange={() => setOrderType("preorder")}
                                        className="form-radio text-[#ECA641]"
                                    />
                                    Pre-order
                                </label>
                                <label className="flex items-center gap-2 text-sm text-black">
                                    <input
                                        type="radio"
                                        name="orderType"
                                        value="dinein"
                                        checked={orderType === "dinein"}
                                        onChange={() => setOrderType("dinein")}
                                        className="form-radio text-[#ECA641]"
                                    />
                                    Makan di tempat
                                </label>
                            </div>
                            {errors.orderType && <p className="text-red-500 text-sm">{errors.orderType}</p>}
                        </div>

                        {/* Jika Pre-order */}
                        {orderType === "preorder" && (
                            <div className="mt-4 space-y-4">
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm text-black">
                                        <input
                                            type="radio"
                                            name="preorderOption"
                                            value="diantar"
                                            checked={preorderOption === "diantar"}
                                            onChange={() => setPreorderOption("diantar")}
                                            className="form-radio text-[#ECA641]"
                                        />
                                        Diantar
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-black">
                                        <input
                                            type="radio"
                                            name="preorderOption"
                                            value="pickup"
                                            checked={preorderOption === "pickup"}
                                            onChange={() => setPreorderOption("pickup")}
                                            className="form-radio text-[#ECA641]"
                                        />
                                        Bayar Sendiri
                                    </label>
                                </div>
                                {errors.preorderOption && <p className="text-red-500 text-sm">{errors.preorderOption}</p>}

                                {/* Pickup Date dan Time sama seperti sebelumnya */}
                                <div className="flex gap-4">
                                    {/* Tanggal Pengambilan */}
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-sm text-black mb-1">Tanggal Pengambilan</label>
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 gap-2">
                                            <input
                                                type="date"
                                                name="pickupDate"
                                                className={`outline-none text-sm text-black flex-1 bg-transparent ${errors.pickupDate ? 'border-red-500' : ''}`}
                                                onChange={(e) => setPickupDate(e.target.value)}
                                            />
                                        </div>
                                        {errors.pickupDate && <p className="text-red-500 text-sm">{errors.pickupDate}</p>}
                                    </div>

                                    {/* Jam Pengambilan */}
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-sm text-black mb-1">Jam Pengambilan</label>
                                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 gap-2">
                                            <input
                                                type="time"
                                                name="pickupTime"
                                                className={`outline-none text-sm text-black flex-1 bg-transparent ${errors.pickupTime ? 'border-red-500' : ''}`}
                                                onChange={(e) => setPickupTime(e.target.value)}
                                            />
                                        </div>
                                        {errors.pickupTime && <p className="text-red-500 text-sm">{errors.pickupTime}</p>}
                                    </div>
                                </div>

                                {/* Alamat */}
                                {preorderOption === "diantar" && (
                                    <div className="flex flex-col">
                                        <label className="text-sm text-black mb-1">Alamat Pengiriman</label>
                                        <textarea
                                            name="deliveryAddress"
                                            className={`outline-none text-sm text-black border border-gray-300 rounded-md px-3 py-2 ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                                            rows="2"
                                            placeholder="Masukkan alamat lengkap"
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                        />
                                        {errors.deliveryAddress && <p className="text-red-500 text-sm">{errors.deliveryAddress}</p>}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Jika Makan di Tempat */}
                        {orderType === "dinein" && (
                        <div className="flex mt-4 gap-4">
                            {/* Tanggal Pengambilan */}
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm text-black mb-1">Tanggal Pengambilan</label>
                                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 gap-2">
                                    <input
                                        type="date"
                                        name="pickupDate"
                                        className={`outline-none text-sm text-black flex-1 bg-transparent ${errors.pickupDate ? 'border-red-500' : ''}`}
                                        onChange={(e) => setPickupDate(e.target.value)}
                                    />
                                </div>
                                {errors.pickupDate && <p className="text-red-500 text-sm">{errors.pickupDate}</p>}
                            </div>

                            {/* Jam Pengambilan */}
                            <div className="flex flex-col w-1/2">
                                <label className="text-sm text-black mb-1">Jam Pengambilan</label>
                                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 gap-2">
                                    <input
                                        type="time"
                                        name="pickupTime"
                                        className={`outline-none text-sm text-black flex-1 bg-transparent ${errors.pickupTime ? 'border-red-500' : ''}`}
                                        onChange={(e) => setPickupTime(e.target.value)}
                                    />
                                </div>
                                {errors.pickupTime && <p className="text-red-500 text-sm">{errors.pickupTime}</p>}
                            </div>
                        </div>
                        )}

                        {/* No WhatsApps */}
                        <div className={`mt-4 flex items-center w-full p-2 border rounded ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-[#ECA641]`}>
                            <Flag code={selectedCountry.toLowerCase()} style={{ width: 20, height: 15, marginRight: 8 }} />
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="mr-2 bg-transparent border-none text-black font-semibold focus:outline-none cursor-pointer"
                            >
                                {Object.keys(countryFlags).map((key) => (
                                <option key={key} value={key}>{countryFlags[key].label}</option>
                                ))}
                            </select>
                            <span className="text-black font-semibold mr-2">{countryFlags[selectedCountry].code}</span>
                            <input
                                type="number"
                                id="noHp"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Masukkan no WhatsApp anda yang aktif"
                                className="flex-1 outline-none text-[#71717A] placeholder-[#C0C0C0] bg-transparent appearance-none -webkit-appearance-none -moz-appearance-none"
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}

                        {/* Metode Pembayaran */}
                        <h3 className="text-black font-semibold mt-6 mb-2">Metode Pembayaran</h3>
                        <div className="flex gap-4">
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