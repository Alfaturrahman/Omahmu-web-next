import React from 'react';
import './globals.css';

export default function Home() {
    return (
        <div>
            {/* Header */}
            <header className="bg-[#FFF4E8] text-white py-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Landing Page</h1>
                    <nav>
                        <ul className="flex gap-6">
                            <li><a href="#beranda" className="hover:text-gray-200 text-[#F6B543]">Beranda</a></li>
                            <li><a href="#layanan" className="hover:text-gray-200 text-[#F6B543]">Layanan Kami</a></li>
                            <li><a href="#kontak" className="hover:text-gray-200 text-[#F6B543]">Kontak Kami</a></li>
                        </ul>
                    </nav>
                    <div>
                    <a href="/Login">
                        <button className="bg-white text-blue-600 px-4 py-2 rounded mr-2 hover:bg-gray-200 font-medium">
                            Login
                        </button>
                    </a>
                    <a href="/register">
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-medium">
                            Register
                        </button>
                    </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="beranda" className="bg-cover bg-center h-screen text-center flex items-center justify-center" style={{ backgroundImage: 'url(/hero.jpg)' }}>
                <div className="bg-black bg-opacity-50 p-10 rounded-md">
                    <h2 className="text-4xl text-white font-bold mb-4">Kelola Bisnis Kuliner Kamu ke Level <br></br>Berikutnya,Tanpa Drama!</h2>
                    <p className="text-white mb-6">Stok Terpantau Real-Time, Transaksi Makin Cepat, Laporan Otomatis. <br></br>Kelola Semua dengan Mudah!</p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-[#ECA641] text-white px-6 py-2 rounded">Lihat Hasil Kami</button>
                        <button className="bg-[#EEF5F7] text-[#F6B543] px-6 py-2 rounded">Mulai Kolaborasi Sekarang</button>
                    </div>
                </div>
            </section>

            {/* Tentang Kami Section */}
            <section id="layanan" className="py-20 bg-gray-100">
                <div className="container mx-auto text-center">
                    <h3 className="text-3xl font-bold mb-8">Tentang Website Kami</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded shadow-md">
                            <h4 className="text-xl font-semibold">Sejarah</h4>
                            <p>Kami berdiri sejak 2023 dengan tujuan memajukan teknologi.</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow-md">
                            <h4 className="text-xl font-semibold">Tentang Kami</h4>
                            <p>Kami adalah tim pengembang yang berkomitmen menghadirkan solusi terbaik.</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow-md">
                            <h4 className="text-xl font-semibold">Visi Misi</h4>
                            <p>Visi: Menginspirasi dunia dengan inovasi teknologi.<br />Misi: Memberikan solusi digital yang unggul.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="kontak" className="bg-blue-600 text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 Landing Page. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
