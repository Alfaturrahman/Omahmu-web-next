"use client";

import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import { AcademicCapIcon, BellIcon, CheckCircleIcon, PresentationChartLineIcon , CreditCardIcon, StarIcon, TicketIcon } from '@heroicons/react/24/solid';
import '@/globals.css';

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth < 768); // Jika layar lebih kecil dari tablet (768px)
        };

        handleResize(); // Cek ukuran layar saat pertama kali render
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            {/* Header */}
<<<<<<< HEAD
            <header style={{ backgroundColor: '#FFF4E8', color: 'white', padding: '16px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Landing Page - Fatur</h1>
                        <button onClick={toggleSidebar}>
                            {isOpen ? <XMarkIcon className="w-8 h-8 text-[#F6B543]" /> : <Bars3Icon className="w-8 h-8 text-[#F6B543]" />}
                        </button>
                    </div>
                    <nav className="hidden lg:flex gap-6">
                        <a href="#beranda" className="hover:text-gray-200 text-[#F6B543]">Beranda</a>
                        <a href="#layanan" className="hover:text-gray-200 text-[#F6B543]">Layanan Kami</a>
                        <a href="#kontak" className="hover:text-gray-200 text-[#F6B543]">Kontak Kami</a>
                    </nav>
                    <div className="hidden lg:block">
                        <a href="/login">
                            <button className="bg-[#F6B543] text-white px-4 py-2 rounded-[10px] mr-2 font-bold">Masuk</button>
                        </a>
                        <a href="/register">
                            <button className="bg-white text-black px-4 py-2 rounded-[10px] hover:bg-[#F6B543] font-bold">Daftar</button>
>>>>>>> Ariffin-Dev
                        </a>
                    </div>
                </div>
                    <div className="lg:hidden bg-white text-black p-4 shadow-md">
                        <a href="#beranda" className="block py-2 hover:bg-gray-100">Beranda</a>
                        <a href="#layanan" className="block py-2 hover:bg-gray-100">Layanan Kami</a>
                        <a href="#kontak" className="block py-2 hover:bg-gray-100">Kontak Kami</a>
                        <a href="/login">
                            <button className="bg-[#F6B543] text-white px-4 py-2 rounded-[10px] mr-2 font-bold">Masuk</button>
                        </a>
                        <a href="/register">
                            <button className="bg-white text-black px-4 py-2 rounded-[10px] hover:bg-[#F6B543] border-2 border-[#F6B543] font-bold">Daftar</button>
                        </a>
                    </div>
                )}
            </header>

            {/* Hero Image Section */}
            <section id="beranda" className="flex items-start justify-start bg-cover bg-center h-screen pt-20 px-6 md:px-10" style={{ backgroundImage: 'url(/landing-page.png)' }}>
                <div className="max-w-4xl">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-snug">
                        Kelola Bisnis Kuliner Kamu <br />
                        ke Level Berikutnya, <br />
                        <span className="text-[#F6B543]">Tanpa Drama!</span>
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-8 max-w-xl break-words">
                        Stok selalu terpantau secara real-time, transaksi jadi lebih cepat dan efisien,
                        serta laporan keuangan tersusun otomatis tanpa ribet. Kini, mengelola bisnis kuliner
                        jadi lebih mudah, praktis, dan tanpa drama!
                    </p>
                    <div className="flex gap-4 flex-col sm:flex-row">
                        <button className="bg-[#F6B543] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e0a738]">
                            Lihat Fitur Kami
                        </button>
                        <button className="bg-[#71717A] text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800">
                            Mulai Kolaborasi Sekarang &rarr;
                        </button>
                    </div>
                </div>
            </section>


            {/* Tentang Kami Section */}
            <section id="tentang-kami" className="flex items-center justify-center py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 md:flex md:items-center gap-8">
                    {/* Gambar */}
                    <div className="md:w-1/2 relative mb-9">
                        <div className="relative">
                            <img src="/tentang-kami.png" alt="Tentang Kami" className="rounded-lg shadow-lg w-full h-auto" />
                            {/* Garis Dekoratif Kiri Atas */}
                            <div className="absolute top-[-20px] left-[-20px] w-20 h-20 border-t-4 border-l-4 border-[#F6B543]"></div>
                            {/* Garis Dekoratif Kanan Bawah */}
                            <div className="absolute bottom-[-20px] right-[-20px] w-20 h-20 border-b-4 border-r-4 border-[#F6B543]"></div>
                        </div>
                    </div>

                    {/* Teks */}
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        {/* Judul */}
                        <h3 className="text-1xl md:text-2xl lg:text-3xl font-extrabold text-black">
                            POSVANA <span className="text-[#F6B543]">itu Apa Sih?</span>
                        </h3>
                        <div className="w-50 h-1 md:w-70 lg:w-95 bg-[#F6B543] mx-auto my-2"></div>

                        {/* Teks Deskripsi */}
                        <p className="text-gray-600 text-lg font-light leading-relaxed text-left">
                            <span className="text-[#F6B543] font-semibold">POSVANA</span> adalah platform yang lahir dari Project-Based Learning (PBL) oleh tim PBL08-TRPL di Politeknik Negeri Batam.
                        </p>
                        <p className="text-gray-600 text-lg font-light leading-relaxed text-left mt-4">
                            Kami hadir untuk membantu pemilik angkringan dalam mengelola usaha mereka dengan lebih modern dan efisien.
                        </p>
                        <p className="text-gray-600 text-lg font-light leading-relaxed text-left mt-4">
                            Dengan fitur pemantauan stok real-time, transaksi lebih cepat, dan laporan otomatis, <span className="text-[#F6B543] font-semibold">POSVANA</span> siap menjadi solusi bagi siapa saja yang ingin mengembangkan bisnis angkringannya.
                        </p>
                    </div>
                </div>
            </section>

            {/* Layanan Kami */}
            <section className="bg-[#FDF4EB] py-16 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-1xl md:text-2xl lg:text-3xl font-semibold text-[#F4A933]">Mengapa Memilih <span className="font-bold text-black">POSVANA</span></h2>
                    <div className="w-30 md:w-55 lg:w-70 h-1 bg-[#F6B543] mx-auto my-2"></div>
                    <p className="text-gray-700 mt-2">
                    POSVANA menawarkan solusi manajemen angkringan yang mempermudah pengelolaan usaha Anda.
                    Dengan platform yang inovatif, kami membantu pemilik angkringan mengatur stok,
                    mencatat transaksi, dan memantau laporan secara otomatis.
                    </p>
                </div>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg p-6 text-left flex gap-4">
                    <PresentationChartLineIcon className="w-10 h-10 text-[#F4A933]" />
                    <div>
                        <h3 className="font-semibold text-black">Monitoring Stok Real-Time</h3>
                        <p className="text-gray-600 text-sm mt-1">Pantau stok produk langsung tanpa ribet, kapan saja dan di mana saja, agar operasional tetap lancar.</p>
                    </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-left flex gap-4">
                    <CreditCardIcon className="w-10 h-10 text-[#F4A933]" />
                    <div>
                        <h3 className="font-semibold text-black">Pencatatan Transaksi Otomatis</h3>
                        <p className="text-gray-600 text-sm mt-1">Semua transaksi tercatat otomatis, lebih cepat dan akurat.</p>
                    </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-left flex gap-4">
                    <AcademicCapIcon className="w-10 h-10 text-[#F4A933]" />
                    <div>
                        <h3 className="font-semibold text-black">Laporan Keuangan Rapi</h3>
                        <p className="text-gray-600 text-sm mt-1">Rekap keuangan tersusun dengan baik untuk analisis bisnis yang lebih mudah.</p>
                    </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-left flex gap-4">
                    <TicketIcon className="w-10 h-10 text-[#F4A933]" />
                    <div>
                        <h3 className="font-semibold text-black">Pesan Lebih Praktis</h3>
                        <p className="text-gray-600 text-sm mt-1">Pelanggan bisa pre-order dan pesan sebelum tiba, mengurangi waktu antre dan meningkatkan kenyamanan.</p>
                    </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-left flex gap-4">
                    <BellIcon className="w-10 h-10 text-[#F4A933]" />
                    <div>
                        <h3 className="font-semibold text-black">Notifikasi Stok</h3>
                        <p className="text-gray-600 text-sm mt-1">Pemberitahuan saat stok menipis atau habis, sehingga tidak ada pesanan untuk produk yang sudah tidak tersedia.</p>
                    </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-left flex gap-4">
                    <StarIcon className="w-10 h-10 text-[#F4A933]" />
                    <div>
                        <h3 className="font-semibold text-black">Dukungan Profesional</h3>
                        <p className="text-gray-600 text-sm mt-1">Tim kami siap membantu pengelolaan dan pengembangan usaha angkringan Anda.</p>
                    </div>
                    </div>
                </div>
            </section>
            
            {/* Fitur */}
            <section className="px-6 py-12 md:px-12 lg:px-24 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
                    {/* KIRI: Judul, Deskripsi & Daftar Fitur */}
                    <div className="w-full md:w-1/2">
                        {/* Judul & Deskripsi */}
                        <h2 className="text-center text-lg md:text-2xl lg:text-3xl font-bold text-[#ECA641]">
                            Sistem Pemesanan Fleksibel di <span className="text-black">POSVANA</span>
                        </h2>
                        <div className="w-40 md:w-50 lg:w-100 h-1 bg-[#F6B543] mx-auto my-2"></div>
                        <p className="text-gray-600 text-sm md:text-base mb-6">
                            Kami menyediakan sistem pemesanan yang memudahkan pelanggan dan pemilik angkringan! 
                            Dengan fitur lengkap dan fleksibel, pelanggan bisa:
                        </p>

                        {/* Daftar Fitur */}
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">Melihat Pesanan</h3>
                                <p className="text-sm text-gray-600">Cek daftar menu, jumlah, dan total harga sebelum checkout.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">Pilih Metode Pemesanan</h3>
                                <p className="text-sm text-gray-600">Pre-order atau makan di tempat sesuai kenyamanan pelanggan.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">Pilih Pengambilan Pesanan</h3>
                                <p className="text-sm text-gray-600">Pilih tanggal dan jam sesuai kebutuhan.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">Atur Waktu Pengambilan</h3>
                                <p className="text-sm text-gray-600">Bisa diantar langsung atau ambil sendiri.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">Pembayaran Praktis dengan QRIS</h3>
                                <p className="text-sm text-gray-600">Bebas repot dengan metode pembayaran digital.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">Notifikasi Pesanan</h3>
                                <p className="text-sm text-gray-600">Pemilik angkringan akan mendapatkan notifikasi otomatis setiap ada pesanan baru.</p>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Mockup Mobile */}
                    {!isMobile && (
                        <div className="w-full md:w-1/2 flex justify-center">
                            <img 
                                src="/mockup-mobile.png" 
                                alt="Mockup Ponsel" 
                                width={350} 
                                height={600} 
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </section>
            
            {/* Fitur 2*/}
            <section className="px-6 py-12 md:px-12 lg:px-24 bg-[#F8EDE3]">
                <div className="max-w-5xl mx-auto text-center mb-8">
                    <h2 className="text-1xl md:text-2xl lg:text-3xl font-bold text-[#F6B543]">
                    Dashboard Manajemen Toko
                    </h2>
                    <div className="w-30 h-1 md:w-50 lg:w-70 bg-[#F6B543] mx-auto my-2"></div>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                    Pantau performa bisnis angkringan Anda dengan dashboard interaktif! Dengan tampilan yang informatif dan mudah digunakan, Anda bisa:
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Mockup Image di sebelah kiri */}
                    {!isMobile && (
                    <div className="hidden md:block md:w-1/2">
                        <img src="/mockup-laptop.png" alt="Dashboard Mockup" width={700} height={500} className="object-contain" />
                    </div>
                    )}

                    {/* Fitur List di sebelah kanan */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                            <h3 className="text-sm md:text-md lg:text-lg font-semibold text-gray-800">Melihat Total Penjualan</h3>
                            <p className="text-sm text-gray-600">Ketahui total omzet secara real-time.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                            <h3 className="text-sm md:text-md lg:text-lg font-semibold text-gray-900">Memantau Jumlah Pesanan</h3>
                            <p className="text-gray-600 text-sm">Lihat total pesanan yang sudah masuk.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                            <h3 className="text-sm md:text-md lg:text-lg font-semibold text-gray-800">Notifikasi Pesanan</h3>
                            <p className="text-sm text-gray-600">Pemilik angkringan akan mendapatkan notifikasi otomatis setiap ada pesanan baru.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                            <h3 className="text-sm md:text-md lg:text-lg font-semibold text-gray-800">Pilih Pengambilan Pesanan</h3>
                            <p className="text-sm text-gray-600">Pilih tanggal dan jam sesuai kebutuhan.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                            <h3 className="text-sm md:text-md lg:text-lg font-semibold text-gray-800">Atur Waktu Pengambilan</h3>
                            <p className="text-sm text-gray-600">Bisa diantar langsung atau ambil sendiri.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                            <h3 className="text-sm md:text-md lg:text-lg font-semibold text-gray-800">Pembayaran Praktis dengan QRIS</h3>
                            <p className="text-sm text-gray-600">Bebas repot dengan metode pembayaran digital.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Fitur 3 */}
            <section className="px-6 py-12 md:px-12 lg:px-24 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Judul & Deskripsi */}
                    <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#F6B543]">
                    Sistem Kasir Digital
                    </h2>
                    <div className="w-40 md:w-50 lg:w-70 h-1 bg-[#F6B543] mx-auto my-3"></div>
                    <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                    Permudah transaksi dengan sistem kasir modern yang cepat dan efisien. Dengan fitur ini, Anda bisa:
                    </p>
                </div>

                {/* Konten 2 Kolom */}
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12 mt-8">
                    
                    {/* KIRI: Daftar Fitur */}
                    <div className="w-full md:w-1/2 space-y-5">
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        <div>
                        <h3 className="text-md font-semibold text-gray-900">Kelola Pesanan Secara Real-Time</h3>
                        <p className="text-sm text-gray-600">Pantau antrian pesanan yang masuk dan yang sudah selesai.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        <div>
                        <h3 className="text-md font-semibold text-gray-900">Navigasi Menu yang Mudah</h3>
                        <p className="text-sm text-gray-600">Kategorikan menu berdasarkan makanan, minuman, dan favorit.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        <div>
                        <h3 className="text-md font-semibold text-gray-900">Tambah ke Keranjang dengan Sekali Klik</h3>
                        <p className="text-sm text-gray-600">Proses pemesanan lebih cepat tanpa ribet.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        <div>
                        <h3 className="text-md font-semibold text-gray-900">Transaksi Tanpa Kesalahan</h3>
                        <p className="text-sm text-gray-600">Semua pesanan tercatat otomatis dalam sistem.</p>
                        </div>
                    </div>
                    </div>

                    {/* KANAN: Mockup Tablet */}
                    {!isMobile && (
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img 
                            src="/mockup-tab.png" 
                            alt="Mockup Tablet Kasir" 
                            width={500} 
                            height={200} 
                            className="object-contain"
                        />
                    </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer id="kontak" style={{ backgroundColor: '#2563EB', color: 'white', padding: '24px', textAlign: 'center' }}>
                <p>&copy; 2025 Landing Page. All rights reserved.</p>
            </footer>
        </div>
    );
}
