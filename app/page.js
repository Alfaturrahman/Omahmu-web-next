"use client";

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { AcademicCapIcon, BellIcon, CheckCircleIcon, PresentationChartLineIcon , CreditCardIcon, StarIcon, TicketIcon } from '@heroicons/react/24/solid';
import { CheckCircle, XCircle, Instagram, Youtube, MessageSquare } from 'lucide-react';
import '@/globals.css';
import gambar from "public/side.png"

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const basicFeatures = [
        { label: '1–5 Pengguna', included: true },
        { label: '1 Cabang', included: true },
        { label: 'Maksimal 500 Produk', included: true },
        { label: 'Laporan Penjualan Dasar', included: true },
        { label: 'Dukungan Email', included: true },
        { label: 'Bantuan AI', included: false },
        { label: 'Rekomendasi Menu Otomatis', included: false },
        { label: 'Live Chat Dukungan', included: false },
    ];

    const proFeatures = [
    { label: 'Tidak Terbatas Pengguna', included: true },
    { label: 'Tidak Terbatas Cabang', included: true },
    { label: 'Tidak Terbatas Produk', included: true },
    { label: 'Laporan Penjualan Lengkap & Analitik', included: true },
    { label: 'Bantuan AI (Rekomendasi Menu, Harga, Tren Penjualan)', included: true },
    { label: 'Live Chat Dukungan 24/7', included: true },
    { label: 'Integrasi API', included: true },
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024); // Menyesuaikan ukuran layar tablet
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
           {/* Header */}
           <header className="fixed top-0 left-0 right-0 bg-white shadow-md px-6 py-4 z-50 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/Logo.jpg" alt="Logo" className="h-14 mix-blend-multiply" />
                </div>

                {/* Navigation + Auth Buttons (Desktop) */}
                <div className="hidden lg:flex items-center gap-8">
                    <nav className="flex gap-6 text-[#F6B543] font-medium">
                    <a href="#beranda" className="hover:text-gray-700">Beranda</a>
                    <a href="#tentang-kami" className="hover:text-gray-700">Tentang Kami</a>
                    <a href="#fitur-kami" className="hover:text-gray-700">Fitur Kami</a>
                    </nav>
                    <div className="flex gap-2">
                    <a href="/Login">
                        <button className="bg-[#F6B543] text-white px-4 py-2 rounded-[10px] font-bold cursor-pointer">
                        Masuk
                        </button>
                    </a>
                    <a href="/Role">
                        <button className="bg-white text-black px-4 py-2 border-2 border-gray-400 rounded-[10px] font-bold cursor-pointer">
                        Daftar
                        </button>
                    </a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                {isMobile && (
                    <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-black">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                )}

                {/* Sidebar Overlay */}
                <div
                    className={`fixed inset-0 backdrop-brightness-50 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => setIsOpen(false)}
                />

                {/* Sidebar Menu */}
                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 p-6 flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <button onClick={() => setIsOpen(false)} className="self-end mb-4">
                    <X className="w-6 h-6 text-black" />
                    </button>
                    <a href="#beranda" className="block py-2 text-[#F6B543]">Beranda</a>
                    <a href="#tentang-kami" className="block py-2 text-[#F6B543]">Tentang Kami</a>
                    <a href="#fitur-kami" className="block py-2 text-[#F6B543]">Fitur Kami</a>
                    <a href="/Login">
                    <button className="w-full bg-[#F6B543] text-white px-4 py-2 rounded-[10px] mt-4 font-bold">
                        Masuk
                    </button>
                    </a>
                    <a href="/Register">
                    <button className="w-full bg-white text-black px-4 py-2 mt-2 border-2 border-gray-400 rounded-[10px] font-bold">
                        Daftar
                    </button>
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section
            id="beranda"
            className="pt-[90px] min-h-screen bg-cover bg-center"
            style={{ backgroundImage: 'url(/landing-page1.png)' }}
            >
            <div className="flex flex-col-reverse lg:flex-row justify-between w-full h-full">
                <div className="w-full mt-3 lg:mt-14 px-6 md:px-10 flex flex-col">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-snug">
                    Kelola Bisnis Kuliner Kamu <br />
                    ke Level Berikutnya, <br />
                    <span className="text-[#F6B543]">Tanpa Drama!</span>
                </h3>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-8 max-w-xl">
                    Stok selalu terpantau secara real-time, transaksi jadi lebih cepat dan efisien,
                    serta laporan keuangan tersusun otomatis tanpa ribet. Kini, mengelola bisnis kuliner
                    jadi lebih mudah, praktis, dan tanpa drama!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#fitur-kami">
                    <button className="bg-[#F6B543] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e0a738] cursor-pointer w-full sm:w-auto">
                        Lihat Fitur Kami
                    </button>
                    </a>
                    <a href="/Login">
                    <button className="bg-[#71717A] text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 cursor-pointer w-full sm:w-auto">
                        Mulai Kolaborasi Sekarang &rarr;
                    </button>
                    </a>
                </div>
                </div>

                {/* Gambar Tanulblok */}
                <div className="w-full flex justify-center items-center p-6 lg:p-0">
                <Image src={gambar} alt="Ilustrasi Kolaborasi" className="max-w-full h-auto" />
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

            {/* Fitur Kami */}
            <section id="fitur-kami" className="bg-[#FDF4EB] py-16 px-6 text-center">
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
            <section className="relative px-6 py-12 md:px-12 lg:px-24 bg-white overflow-hidden">
                {/* KANAN: Mockup Mobile */}
                    {!isMobile && (
                        <div className="hidden md:block absolute top-0 right-0 h-full items-center">
                        <img
                            src="/mockup-mobile.png"
                            alt="Mockup Ponsel"
                            width={350}
                            height={600}
                            className="object-contain"
                        />
                        </div>
                    )}

                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
                    {/* KIRI: Judul, Deskripsi & Daftar Fitur */}
                    <div className="w-full md:w-1/2">
                        {/* Judul & Deskripsi */}
                        <h2 className="text-center text-2xl md:text-2xl lg:text-3xl font-bold text-[#ECA641]">
                            Sistem Pemesanan Fleksibel di <span className="text-black">POSVANA</span>
                        </h2>
                        <div className="w-40 md:w-50 lg:w-100 h-1 bg-[#F6B543] mx-auto my-2"></div>
                        <p className="text-gray-600 text-lg md:text-base mb-6">
                            Kami menyediakan sistem pemesanan yang memudahkan pelanggan dan pemilik angkringan! 
                            Dengan fitur lengkap dan fleksibel, pelanggan bisa:
                        </p>

                        {/* Daftar Fitur */}
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Melihat Pesanan</h3>
                                <p className="text-lg text-gray-600">Cek daftar menu, jumlah, dan total harga sebelum checkout.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Pilih Metode Pemesanan</h3>
                                <p className="text-lg text-gray-600">Pre-order atau makan di tempat sesuai kenyamanan pelanggan.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Pilih Pengambilan Pesanan</h3>
                                <p className="text-lg text-gray-600">Pilih tanggal dan jam sesuai kebutuhan.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Atur Waktu Pengambilan</h3>
                                <p className="text-lg text-gray-600">Bisa diantar langsung atau ambil sendiri.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Pembayaran Praktis dengan QRIS</h3>
                                <p className="text-lg text-gray-600">Bebas repot dengan metode pembayaran digital.</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Notifikasi Pesanan</h3>
                                <p className="text-lg text-gray-600">Pemilik angkringan akan mendapatkan notifikasi otomatis setiap ada pesanan baru.</p>
                            </div>
                            </div>
                        </div>
                    </div>
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

            {/* Daftar Paket */}
            <div className="min-h-screen bg-[#FFF4E8] py-16 px-4 md:px-8 lg:px-16">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#F6B543]">Tersedia Paket di POSVANA</h1>
                    <div className="w-24 h-1 bg-[#F6B543] mx-auto mt-2 mb-4 rounded-full" />
                    <p className="text-gray-600 text-sm md:text-base">Pilih paket sesuai kebutuhan Bisnis Anda</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto justify-items-center">
                    {/* Paket Basic */}
                    <div className="w-full max-w-sm rounded-xl shadow-xl overflow-hidden bg-[linear-gradient(180deg,_rgba(255,151,0,0.3)_0%,_white_30%)]">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-black mb-1">Paket 1 (Basic)</h2>
                        <p className="text-2xl font-bold text-black mb-4">Gratis</p>

                        <ul className="space-y-2 mb-6">
                        {basicFeatures.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-black">
                            {item.included ? (
                                <CheckCircle className="text-green-500 w-5 h-5 mt-0.5" />
                            ) : (
                                <XCircle className="text-red-500 w-5 h-5 mt-0.5" />
                            )}
                            <span>{item.label}</span>
                            </li>
                        ))}
                        </ul>
                        <a href="/Role">
                            <button className="w-full bg-[#F6B543] hover:bg-[#e6a730] transition text-white font-semibold py-2 rounded-lg">
                            Pilih Paket
                            </button>
                        </a>
                    </div>
                    </div>

                    {/* Paket Pro */}
                    <div className="w-full max-w-sm rounded-xl shadow-xl overflow-hidden bg-[linear-gradient(180deg,_rgba(255,151,0,0.3)_0%,_white_30%)]">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-black mb-1">Paket 2 Pro (AI Enchanced)</h2>
                        <p className="text-2xl font-bold text-black mb-4">150.000 / Bulan</p>

                        <ul className="space-y-2 mb-6">
                        {proFeatures.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-black">
                            {item.included ? (
                                <CheckCircle className="text-green-500 w-5 h-5 mt-0.5" />
                            ) : (
                                <XCircle className="text-red-500 w-5 h-5 mt-0.5" />
                            )}
                            <span>{item.label}</span>
                            </li>
                        ))}
                        </ul>
                        <a href="/Role">
                            <button className="w-full bg-[#F6B543] hover:bg-[#e6a730] transition text-white font-semibold py-2 rounded-lg">
                            Pilih Paket
                            </button>
                        </a>
                    </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative h-[500px] flex items-center justify-center text-center text-white">
                {/* Background Image */}
                <Image
                    src="/cta-section.png"
                    alt="Hero Background"
                    fill
                    className="object-cover brightness-50"
                    priority
                />

                {/* Overlay Content */}
                <div className="z-10 px-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-snug">
                    Jadikan usaha Anda lebih profesional dengan <br />
                    sistem yang membantu bisnis berkembang pesat!
                    </h1>
                    <button className="bg-[#F6B543] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-all">
                    Mulai Kolaborasi Sekarang
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#fef4ea] px-8 py-6 text-sm text-black">
                {/* Copyright */}
                <div className="text-end text-xs mb-4">
                    Copyright © 2025 Posvana08
                </div>

                <div className="border-t border-black pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 my-5">
                    {/* Logo dan Tagline */}
                    <div className="flex items-start gap-4">
                    <img src="/Logo.jpg" alt="Posvana Logo" className="w-40 object-contain mix-blend-multiply"/>
                    <div className="font-semibold text-2xl">
                        <p>Mudah, Cepat, dan</p>
                        <p>Nyaman untuk</p>
                        <p>Bisnis Kuliner Anda</p>
                    </div>
                    </div>

                    {/* Kontak */}
                    <div className="space-y-2">
                    <p><strong>Alamat</strong> <br />
                        Jl. Ahmad Yani, Tlk. Tering, Kec. Batam Kota,<br />
                        Kota Batam, Kepulauan Riau 29461
                    </p>
                    <p><strong>Kontak</strong> <br /> 085960657391</p>
                    <p><strong>Email</strong> <br /> posvana_08@gmail.com</p>
                    </div>

                    {/* Sosial Media */}
                    <div className="flex items-start justify-end gap-3 mt-4 md:mt-0">
                        <Image
                            src="ig.svg"
                            alt="WhatsApp"
                            width={30}
                            height={30}
                            className="cursor-pointer hover:scale-110 transition"
                        />
                        <Image
                            src="wa.svg"
                            alt="WhatsApp"
                            width={30}
                            height={30}
                            className="cursor-pointer hover:scale-110 transition"
                        />
                        <Image
                            src="yt.svg"
                            alt="WhatsApp"
                            width={30}
                            height={30}
                            className="cursor-pointer hover:scale-110 transition"
                        />
                    </div>
                </div>
            </footer>
        </div>
    );
}