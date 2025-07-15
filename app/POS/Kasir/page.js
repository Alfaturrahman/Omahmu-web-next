'use client';

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import Image from 'next/image';
import Swal from "sweetalert2";
import { ShoppingCart, X, Minus, Plus, ScanQrCode, Banknote, Search  } from 'lucide-react';
import '@/globals.css';
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

function Kasir() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showQrisModal, setShowQrisModal] = useState(false);
    const [qrPaymentUrl, setQrPaymentUrl] = useState("");
    const [paymentExpiredAt, setPaymentExpiredAt] = useState(null);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [showBayarNantiModal, setShowBayarNantiModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [amountPaid, setAmountPaid] = useState(0);
    const [listAntrian, setListAntrian] = useState([]);
    const [listMenu, setListMenu] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [remarks, setRemarks] = useState("");
    const [countdown, setCountdown] = useState(60); // timer mundur 60 detik
    const [orderId, setOrderId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

     useEffect(() => {
        let timerInterval;
        if (showQrisModal) {
        setCountdown(300); // reset timer ke 60 detik setiap buka modal

        timerInterval = setInterval(() => {
            setCountdown((prev) => {
            if (prev <= 1) {
                clearInterval(timerInterval); // berhenti kalau sudah 0
                setShowQrisModal(false);     // auto tutup modal
                return 0;
            }
            return prev - 1;
            });
        }, 1000); // setiap 1 detik
        }

        // Cleanup kalau modal ditutup manual
        return () => clearInterval(timerInterval);
    }, [showQrisModal]);

    const token = localStorage.getItem("token");
    let userEmail = "";
      let userRole = "";
      let userRoleId = "";
    
      if (token) {
        const decoded = jwtDecode(token);
    
        userEmail = decoded.email;
        userRole = decoded.role_name;
        userRoleId = decoded.role_id;
    
      }


    useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0]; // hasil: '2025-07-06'
    setOrderDate(formatted);
    }, []);

    async function fetchDataAntrian() {
            try {
                const storeId = localStorage.getItem('store_id');
                const result = await apiService.getData(`/storeowner/list_antrian/?store_id=${storeId}`);
                setListAntrian(result.data);  
            } catch (err) {
                console.error(err.message);
            }
        }
    
    async function fetchDataMenu() {
        try {
            const storeId = localStorage.getItem('store_id');
            const result = await apiService.getData(`/storeowner/daftar_menu/?store_id=${storeId}`);
            setListMenu(result.data);  
        } catch (err) {
            console.error(err.message);
        }
    }

    const insertOrder = async () => {
        try {
    
            const storeId = localStorage.getItem('store_id');
            const paymentMethodForDb = paymentMethodMap[selected]; // <--
            console.log(paymentMethodForDb);
            

            const payload = {
                customer_name: customerName,
                date: orderDate,
                total_amount: total, // total yang sudah termasuk pajak (kalau ada)
                order_status: "in_progress", // asumsi order langsung completed
                payment_method: paymentMethodForDb, // <--- pakai value mapped
                is_pre_order: false, // default
                is_delivered: false, // default
                is_dine_in: true, // misal kamu asumsi dine in (makan di tempat)
                remarks: remarks, // bisa kosong string
                pickup_date: null, // default null
                pickup_time: null, // default null
                role_id: userRoleId, // default null
                reference_id: storeId, // default null
                pickup_time: null, // default null
                no_hp: phoneNumber || null,
                delivery_address: deliveryAddress,
                order_items: cart.map(item => ({
                    product_id: item.product_id,
                    selling_price: item.selling_price,
                    product_type: item.product_type,
                    item: item.quantity,
                })),
            };
            if (!storeId) {
                Swal.fire({
                    icon: "error",
                    title: "Store ID tidak ditemukan",
                    text: "Silakan login ulang.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#ECA641",
                });
                return;
            }

            console.log("CART:", cart);
            console.log("PAYLOAD:", payload);

            const response = await apiService.postData(`/storeowner/insert_order/?store_id=${storeId}`, payload);
    
            Swal.fire({
                icon: "success",
                title: "Pesanan Berhasil Dibuat!",
                confirmButtonText: "OK",
                confirmButtonColor: "#ECA641",
            });
    
            // Reset form setelah sukses
            closeCart();
            setCustomerName("");
            setPhoneNumber("");
            setDeliveryAddress("");
            setRemarks("");
            setSelected(null);
            fetchDataAntrian();
            fetchDataMenu();
    
        } catch (err) {
            console.error(err.message);
            Swal.fire({
                icon: "error",
                title: "Gagal Membuat Pesanan",
                text: err.message,
                confirmButtonText: "OK",
                confirmButtonColor: "#ECA641",
            });
        }
    };

    const handleBayarSekarang = () => {
        if (!customerName || !orderDate || !selected || cart.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi semua data sebelum membayar",
                confirmButtonText: "OK",
                confirmButtonColor: "#ECA641",
            });
            return;
        }

        if (isEditing) {
            handleSaveEdit();
        } else {
            handlePayment();
        }
    };

    useEffect(() => {
        let interval;

        if (showQrisModal && orderId) {
            interval = setInterval(async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(
                        `http://127.0.0.1:8000/api/storeowner/check_payment_status/?order_id=${orderId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const status = res?.data?.data?.status;
                    console.log('Cek status pembayaran:', status);

                    if (res?.data?.data?.status === 'in_progress') {
                        clearInterval(interval);
                        setShowQrisModal(false);
                        closeCart();
                        // Reset form setelah sukses
                        setCustomerName("");
                        setPhoneNumber("");
                        setDeliveryAddress("");
                        setRemarks("");
                        setSelected(null);
                        fetchDataAntrian();
                        fetchDataMenu();

                        // Tampilkan modal cantik pakai Swal
                        Swal.fire({
                            icon: 'success',
                            title: 'Pembayaran Berhasil!',
                            text: 'Pesanan kamu sudah dibuat dan pembayaran berhasil.',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#ECA641'
                        });
                    }
                } catch (error) {
                    console.error('Gagal cek status pembayaran', error);
                }
            }, 5000); // cek tiap 5 detik
        }

        return () => clearInterval(interval);
    }, [showQrisModal, orderId]);


    const handleBayarQRIS = async () => {
        try {
            const storeId = localStorage.getItem('store_id');
            const paymentMethodForDb = paymentMethodMap[selected];

            if (!storeId) {
                Swal.fire({
                    icon: "error",
                    title: "Store ID tidak ditemukan",
                    text: "Silakan login ulang.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#ECA641",
                });
                return;
            }

            // 1️⃣ Insert order ke backend pakai helper
            const payload = {
                customer_name: customerName,
                date: orderDate,
                total_amount: total,
                order_status: "in_progress",
                payment_method: paymentMethodForDb,
                is_pre_order: false,
                is_delivered: false,
                is_dine_in: true,
                remarks,
                pickup_date: null,
                pickup_time: null,
                role_id: userRoleId,
                reference_id: storeId,
                no_hp: phoneNumber || null,
                delivery_address: deliveryAddress,
                order_items: cart.map(item => ({
                    product_id: item.product_id,
                    selling_price: item.selling_price,
                    product_type: item.product_type,
                    item: item.quantity,
                })),
            };

            console.log("Payload insert_order:", payload);

            const orderResponse = await apiService.postData(`/storeowner/insert_order/?store_id=${storeId}`, payload);
            console.log('orderResponse:', orderResponse);

            const orderData = orderResponse?.data;
            const orderId = orderData?.order_id;

            if (!orderId) {
                throw new Error("order_id tidak diterima dari backend");
            }

            setOrderId(orderId);  // ✅ simpan ke state supaya useEffect bisa pakai

            console.log('Order berhasil dibuat, order_id:', orderId);

            // 2️⃣ Create transaksi di Tripay pakai axios langsung
            const getToken = () => localStorage.getItem('token');

            const token = getToken(); // ambil token untuk header Authorization

            const tripayRes = await axios.post(
                'https://5dbb88ef35ab.ngrok-free.app/api/storeowner/create_tripay_transaction/',
                {
                    order_id: orderId,
                    payment_method: "QRIS"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log('tripayRes:', tripayRes);

            const tripayData = tripayRes.data;

            if (tripayData?.data?.payment_url) {
                setQrPaymentUrl(tripayData.data.qr_url);
                setPaymentExpiredAt(tripayData.data.expired_at);
                setShowQrisModal(true);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal Membuat Transaksi Tripay",
                    text: tripayData?.message || "Terjadi kesalahan",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#ECA641",
                });
            }

        } catch (err) {
            console.error('Error:', err);
            Swal.fire({
                icon: "error",
                title: "Gagal Membuat Pesanan / Transaksi",
                text: err?.response?.data?.message || err.message || 'Terjadi kesalahan',
                confirmButtonText: "OK",
                confirmButtonColor: "#ECA641",
            });
        }
    };

   const handleDetail = async (order) => {
    console.log("==== handleDetail ====");
    console.log("WALAWE order:", order);

    setSelectedOrderForEdit(order);
    setIsCartOpen(true);
    setIsEditing(true);

    try {
        // panggil API detail
        const res = await apiService.getData(`/storeowner/riwayat_detail_pesanan/?order_id=${order.order_id}`);
        const detail = res.data[0].get_order_json;

        console.log(">> DETAIL API RESPONSE:", detail);
        console.log(">> DETAIL ITEMS:", detail.items);
        (detail.items || []).forEach((item, idx) => {
            console.log(`Item[${idx}] from API:`, item);
        });

        // mapping cart
        const mappedCart = (detail.items || [])
            .filter(item => item.product_id) // filter hanya yang punya product_id
            .map((item) => ({
                product_id: item.product_id,
                product_name: item.product_name,
                selling_price: parseInt(item.price, 10),
                quantity: item.quantity,
                product_type: item.product_type,
                product_picture: item.product_picture || "/placeholder.png"
            }));

        console.log(">> CART TO SET:", mappedCart);

        setCart(mappedCart);

        setCustomerName(detail.customer_name || "");
        setOrderDate(detail.order_date || "");
        setPhoneNumber(detail.no_hp || "");
        setDeliveryAddress(detail.delivery_address || "");
        setRemarks(detail.remarks || "");
        setSelected(detail.payment_method?.toLowerCase().replace(" ", "") || "");

    } catch (err) {
        console.error("Error fetching order detail:", err.message);
        setCart([]); // fallback kalau gagal
    }
};

const handleSaveEdit = async () => {
    if (!selectedOrderForEdit) return;

    try {
        const storeId = localStorage.getItem('store_id');

        console.log("==== handleSaveEdit ====");
        console.log(">> CART BEFORE SAVE:", cart);
        cart.forEach((item, idx) => {
            console.log(`Item[${idx}] in cart before save:`, item);
        });

        // validasi: pastikan semua ada product_id
        const invalidItem = cart.find(item => !item.product_id);
        if (invalidItem) {
            console.error("INVALID ITEM FOUND:", invalidItem);
            Swal.fire({
                icon: "error",
                title: "Data item tidak lengkap",
                text: "Ada item dengan product_id kosong. Mohon cek ulang.",
                confirmButtonColor: "#ECA641",
            });
            return;
        }

        const payload = {
            customer_name: customerName,
            date: orderDate,
            total_amount: total,
            payment_method: paymentMethodMap[selected],
            order_status: "in_progress",
            is_pre_order: false,
            is_delivered: false,
            is_dine_in: true,
            remarks: remarks,
            pickup_date: null,
            pickup_time: null,
            role_id: userRoleId,
            reference_id: storeId,
            no_hp: phoneNumber || null,
            delivery_address: deliveryAddress,
            order_items: cart.map(item => ({
                product_id: item.product_id,
                selling_price: item.selling_price,
                product_type: item.product_type,
                item: item.quantity,
            })),
        };

        console.log(">> PAYLOAD TO SAVE:", payload);

        await apiService.putData(`/storeowner/update_order/?store_id=${storeId}&order_id=${selectedOrderForEdit.order_id}`, payload);

        Swal.fire({
            icon: "success",
            title: "Perubahan Disimpan",
            confirmButtonColor: "#ECA641",
        });

        fetchDataAntrian();
        closeCart();
        setIsEditing(false);
        setSelectedOrderForEdit(null);
    } catch (err) {
        console.error("Error saving edited order:", err.message);
        Swal.fire({
            icon: "error",
            title: "Gagal menyimpan perubahan",
            confirmButtonColor: "#ECA641",
        });
    }
};

    useEffect(() => {
        fetchDataAntrian();
        fetchDataMenu();
    }, []);

    // Urutkan dari menit yang terlama ke terbaru
    const sortedOrders = listAntrian.sort((a, b) => b.minutesAgo - a.minutesAgo);
    
    const showModal = async (orderId) => {
        Swal.fire({
            icon: "warning",
            title: "Apakah Kamu Yakin?",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "Selesai",
            confirmButtonColor: "#ECA641",
            cancelButtonColor: "#DC3545",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Mengupdate order status ke "completed"
                    const response = await apiService.putData(`/storeowner/update_order_status/${orderId}/`, {
                        order_status: "completed"
                    });
    
                    // Pastikan response berhasil dengan status code 200
                    if (response.status_code === 200 && response.messagetype === "S") {
                        // Tampilkan swal fire success jika update berhasil
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil!",
                            text: "Status pesanan telah diperbarui.",
                            confirmButtonColor: "#ECA641",
                        });
    
                        // Mengambil data antrian terbaru
                        fetchDataAntrian();
                    } else {
                        // Menangani jika status_code bukan 200
                        Swal.fire({
                            icon: "error",
                            title: "Gagal!",
                            text: response.message || "Gagal memperbarui status pesanan.",
                            confirmButtonColor: "#DC3545",
                        });
                    }
                } catch (error) {
                    // Menangani error jika terjadi masalah saat melakukan API request
                    Swal.fire({
                        icon: "error",
                        title: "Gagal!",
                        text: error.message || "Terjadi kesalahan saat memperbarui status pesanan.",
                        confirmButtonColor: "#DC3545",
                    });
                }
            }
        });
    };

    const showModalBayar = (order) => {
        setSelectedOrder(order);
        setSelected("Bayar Nanti");
        setShowBayarNantiModal(true);
    };

    const handlePayment = async () => {
        console.log("handlePayment called. isEditing:", isEditing, "selectedOrderForEdit:", selectedOrderForEdit);

        if (!customerName.trim() || !orderDate || cart.length === 0 || !selected) {
            Swal.fire({
                icon: "warning",
                title: "Data belum lengkap",
                text: "Pastikan nama customer, tanggal pemesanan, metode pembayaran, dan item keranjang sudah diisi.",
                confirmButtonColor: "#ECA641",
            });
            return; // stop proses
        }

        if (isEditing && selectedOrderForEdit) {

            Swal.fire({
                icon: "success",
                title: "Perubahan disimpan, siap bayar!",
                confirmButtonColor: "#ECA641",
            }).then(() => {
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
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            await handleSaveEdit(); // Pastikan update terakhir (opsional)
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "info",
                        title: "Metode pembayaran belum tersedia",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#ECA641",
                    });
                }
            });
        } else {
            // Order baru
            if (selected === "qris") {
                setShowQrisModal(true);
                handleBayarQRIS();
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
                        insertOrder("Bayar Nanti");
                    }
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Metode pembayaran belum tersedia",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#ECA641",
                });
            }
        }
    };


    const paymentMethodMap = {
        qris: "qris",
        cash: "cash",
        bayarNanti: "Bayar Nanti",
    };


    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const categories = ["Semua", "Makanan", "Minuman", "Favorit"];
    const filteredMenu = useMemo(() => {
        if (activeCategory === "Semua") return listMenu;
        if (activeCategory === "Favorit") return listMenu.filter(item => item.favorite);
        return listMenu.filter(item => item.product_type === activeCategory);
    }, [activeCategory, listMenu]);


    const addToCart = (item) => {
        const mappedItem = {
            product_id: item.product_id || item.id,   // ambil product_id kalau sudah ada, kalau tidak pakai id
            product_name: item.product_name || item.name,
            selling_price: item.selling_price || item.price,
            product_type: item.product_type,
            product_picture: item.product_picture || item.picture || "/placeholder.png",
            quantity: 1,
        };

        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.product_id === mappedItem.product_id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.product_id === mappedItem.product_id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, mappedItem];
        });

        setIsCartOpen(true);
    };

    
    const updateQuantity = (product_id, type) => {
        setCart((prevCart) => {
            return prevCart
                .map((item) => {
                    if (item.product_id === product_id) {
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
    
    // Menghitung subtotal, pajak, dan total
    const subtotal = cart.reduce((acc, item) => acc + (item.selling_price || 0) * item.quantity, 0);
    const total = subtotal;

    const updateAmount = (digit) => {
        setAmountPaid(prevAmount => prevAmount * 10 + digit);
    };

    const clearAmount = () => {
        setAmountPaid(0);
    };

    const handlePayCash = async () => {
        try {
            if (isEditing && selectedOrderForEdit) {
                // Lagi edit → cukup update order existing (dan kalau mau, update status jadi 'paid')
                await handleSaveEdit();
                console.log("Edited order saved successfully, marked as paid");
            } else {
                // Order baru → insert order
                await insertOrder("cash");
            }

            Swal.fire({
                icon: "success",
                title: "Pembayaran berhasil",
                confirmButtonColor: "#ECA641",
            });
        } catch (error) {
            console.error("Gagal memproses pembayaran:", error);
            Swal.fire({
                icon: "error",
                title: "Pembayaran gagal",
                text: error.message,
                confirmButtonColor: "#ECA641",
            });
        } finally {
            setIsCashModalOpen(false); // Tutup modal di akhir
        }
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

                    <div
                        className={`relative overflow-x-auto py-3 no-scrollbar transition-all duration-300 
                        ${isCollapsed ? "max-w-[90vw]" : "max-w-[90vw] md:max-w-[95vw] lg:max-w-[80vw]"}`}
                    >
                        <div className="flex space-x-3 md:space-x-4 w-max flex-nowrap">
                        {listAntrian.length > 0 ? (
                            listAntrian.map((order) => {
                            const isBayarNanti = (order.payment_method ?? "").toLowerCase() === "bayar nanti";

                            return (
                                <div
                                key={order.order_id}
                                className={`p-3 md:p-4 rounded-lg shadow-md text-center min-w-[140px] md:min-w-[180px] flex-shrink-0 bg-white ${
                                    isBayarNanti ? "border-2 border-[#ECA641]" : "border border-gray-300"
                                }`}
                                style={isBayarNanti ? { backgroundColor: "rgba(246, 181, 67, 0.3)" } : {}}
                                >
                                <p className="font-semibold text-black text-sm md:text-base">
                                    No Antrian #{order.no_antrian ?? "-"}
                                </p>
                                <p className="text-xs md:text-sm text-black">
                                    Total Item {order.total_item_belanja ?? 0}x
                                </p>

                                {isBayarNanti ? (
                                    <button
                                    onClick={() => handleDetail(order)}
                                    className="border border-[#ECA641] text-white bg-[#ECA641] px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm cursor-pointer"
                                    >
                                    Detail
                                    </button>
                                ) : (
                                    <button
                                    onClick={() => showModal(order.order_id)}
                                    className="bg-[#ECA641] text-white px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm cursor-pointer"
                                    >
                                    Selesai
                                    </button>
                                )}

                                <p className="text-xs text-black mt-2">{order.waktu_lalu ?? ""}</p>
                                </div>
                            );
                            })
                        ) : (
                            <div className="text-gray-500 text-center w-full">Belum ada antrian.</div>
                        )}
                        </div>
                    </div>
                    </div>

                    {/* Antrian Pesanan Online */}
                    <div className="mb-6">
                    <h2 className="text-lg md:text-xl font-semibold text-black mb-3">
                        Antrian Pesanan Online
                    </h2>

                    <div
                        className={`relative overflow-x-auto py-3 no-scrollbar transition-all duration-300 
                        ${isCollapsed ? "max-w-[90vw]" : "max-w-[90vw] md:max-w-[95vw] lg:max-w-[80vw]"}`}
                    >
                        <div className="flex space-x-3 md:space-x-4 w-max flex-nowrap">
                        {listAntrian.filter(order => order.is_online_order).length > 0 ? (
                            listAntrian
                            .filter(order => order.is_online_order)
                            .map((order) => (
                                <div
                                key={order.order_id}
                                className="border border-gray-300 bg-white p-3 md:p-4 rounded-lg shadow-md text-center min-w-[140px] md:min-w-[180px] flex-shrink-0"
                                >
                                <p className="font-semibold text-black text-sm md:text-base">
                                    No Antrian #{order.no_antrian ?? "-"}
                                </p>
                                <p className="text-xs md:text-sm text-black">
                                    Total Item {order.total_item_belanja ?? 0}x
                                </p>
                                <button
                                    onClick={() => showModal(order.order_id)}
                                    className="bg-[#ECA641] text-white px-3 w-full py-1 md:px-4 md:py-2 rounded text-xs md:text-sm cursor-pointer"
                                >
                                    Selesai
                                </button>
                                <p className="text-xs text-black mt-2">{order.waktu_lalu ?? ""}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center w-full">Belum ada antrian online.</div>
                        )}
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
                                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-lg font-medium whitespace-nowrap cursor-pointer ${
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
                            <div className="relative">
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

                    {showQrisModal && (
                    <div className="fixed inset-0 backdrop-brightness-50 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-90">
                        <h2 className="text-lg text-black font-semibold">Pembayaran</h2>

                        {/* Ganti src jadi qrPaymentUrl */}
                        {qrPaymentUrl ? (
                            <iframe
                            src={qrPaymentUrl}
                            title="QRIS Payment"
                            className="mx-auto my-4 w-100 h-96 rounded"
                            allowFullScreen
                            />
                        ) : (
                            <p className="text-gray-500">Loading QR...</p>
                        )}
                         <p className="text-gray-600 mb-2">
                            Waktu tersisa: {countdown} detik
                            </p>

                        {/* Batas pembayaran */}
                        {paymentExpiredAt && (
                            <p className="text-gray-600 mb-2">
                            Batas Pembayaran:{" "}
                            {new Date(paymentExpiredAt * 1000).toLocaleTimeString("id-ID")}
                            </p>
                        )}

                        <hr className="my-2" />
                        <p className="text-gray-600">Total Transaksi</p>
                        <h3 className="text-xl font-bold text-black">Rp {total.toLocaleString("id-ID")}</h3>

                        {/* Tombol tutup */}
                        <button
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                            onClick={() => setShowQrisModal(false)}
                        >
                            Tutup
                        </button>
                        </div>
                    </div>
                    )}

                    {showSuccessModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-xl shadow text-center">
                            <h2 className="text-lg font-semibold text-green-600">Pembayaran Berhasil!</h2>
                            <p className="text-gray-600 mt-2">Pesanan berhasil dibuat dan dibayar.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
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

                    {/* Bayar Nanti Payment Modal */}
                    {showBayarNantiModal && selectedOrder && (
                        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-[90vw] max-w-md shadow-lg relative">
                                <button
                                    className="absolute top-2 right-3 text-gray-500 hover:text-black"
                                    onClick={() => setShowBayarNantiModal(false)}
                                >
                                    <X size={24} />
                                </button>

                                <h2 className="text-black text-lg font-bold mb-2">Detail Pesanan</h2>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Nama Customer:</strong> {selectedOrder.customerName || "-"}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Tanggal Pesanan:</strong> {selectedOrder.orderDate || "-"}
                                </p>

                                {/* List Pesanan */}
                                <ul className="mb-4 text-sm text-gray-800 list-disc pl-5 space-y-1">
                                    {selectedOrder.items?.map((item, i) => (
                                        <li key={i}>
                                            {item.name} x{item.qty} - Rp {item.price.toLocaleString("id-ID")}
                                        </li>
                                    ))}
                                </ul>

                                {/* Total Harga */}
                                <p className="font-semibold text-black text-sm mb-4">
                                    Total Harga: Rp{" "}
                                    {selectedOrder.items
                                        ?.reduce((acc, curr) => acc + curr.price * curr.qty, 0)
                                        .toLocaleString("id-ID")}
                                </p>

                                {/* Tombol Metode Pembayaran */}
                                <div className="flex justify-between gap-2">
                                    <button
                                        onClick={() => {
                                            setSelected("cash");
                                            setShowBayarNantiModal(false);
                                            setTimeout(() => {
                                            setIsCashModalOpen(true);
                                            }, 150);
                                        }}
                                        className="cursor-pointer border border-[#F6B85D] hover:bg-[#F6B85D] text-[#F9870B] font-semibold px-4 py-2 rounded w-1/2"
                                    >
                                        Bayar Cash
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelected("qris");
                                            setShowBayarNantiModal(false);
                                            setTimeout(() => {
                                            setShowQrisModal(true);
                                            }, 150);
                                        }}
                                        className="cursor-pointer border border-[#F6B85D] hover:bg-[#F6B85D] text-[#F9870B] font-semibold px-4 py-2 rounded w-1/2"
                                    >
                                        Qris
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Daftar Menu */}
                    <div className={`grid gap-4 transition-all duration-300 ${
                        isCartOpen
                            ? "grid-cols-3 pr-[370px]"  // Cart terbuka, hanya 2 kolom dan beri ruang untuk cart
                            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pr-0"  // Normal grid dengan ukuran kolom responsif
                    }`}>
                        {listMenu
                            .filter(item => item.stock > 0) 
                            .filter((item) => activeCategory === "Semua" || item.product_type === activeCategory || (activeCategory === "Favorit" && item.favorite_status))
                            .map((item) => (
                                <div key={item.product_id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                                    {/* Menampilkan gambar dari localhost/media */}
                                    <img
                                        src={item.product_picture ? `http://localhost:8000/${item.product_picture}` : '/default-image.png'}
                                        alt={item.product_name}
                                        className="rounded-lg w-full h-40 object-cover"
                                    />
                                    <div className="mt-2">
                                        <h3 className="font-semibold text-sm text-black flex items-center">
                                            {item.favorite_status && <span className="text-yellow-400 mr-1">⭐</span>}
                                            {item.product_name}
                                        </h3>

                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-gray-500 text-xs mt-1">Stok: {item.stock}</p>

                                            {/* Menampilkan harga produk */}
                                            <p className="text-[#ECA641] font-bold text-sm ml-auto">
                                                Rp {parseInt(item.selling_price).toLocaleString("id-ID")},00
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-2 cursor-pointer bg-[#ECA641] text-white px-4 py-2 w-full rounded-lg flex items-center justify-center gap-2"
                                    >
                                        Tambah Ke Keranjang <ShoppingCart size={16} />
                                    </button>
                                </div>
                            ))}
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
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="bg-transparent border-none text-black font-semibold text-sm focus:outline-none"
                                />
                            </div>

                            {/* Tanggal Pemesanan */}
                            <div className="flex flex-col border border-gray-300 px-4 py-2 rounded-lg text-sm w-fit text-right">
                                <label className="text-gray-500 mb-1 text-right">Tanggal Pemesanan</label>
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
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
                                <div key={item.product_id} className="flex items-center border-b pb-3 mb-3">
                                    <img
                                        src={item.product_picture ? `http://localhost:8000${item.product_picture}` : '/default-image.png'}
                                        alt={item.product_name}
                                        className="rounded-lg w-[60px] h-[60px] object-cover"
                                    />
                                    <div className="flex-1 ml-3">
                                        <p className="text-black text-sm font-medium">{item.product_name}</p>
                                        <p className="text-gray-500 text-xs">{item.product_type}</p>
                                        <p className="text-[#ECA641] font-bold text-sm">
                                            Rp {parseInt(item.selling_price).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => updateQuantity(item.product_id, "decrease")}
                                            className="p-2 bg-white text-[#ECA641] border border-[#CAC4D0] rounded-lg"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="mx-2 text-sm font-semibold text-black">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product_id, "increase")}
                                            className="p-2 bg-[#ECA641] text-white rounded-lg"
                                        >
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
                                    onClick={handleSaveEdit}
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
                </div>
            </div>
        </div>
    );
}

export default withAuth(Kasir, ['2']); 
