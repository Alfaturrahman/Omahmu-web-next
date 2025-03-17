import React from 'react';

export default function Home() {
    return (
        <div>
            {/* Header */}
            <header style={{ backgroundColor: '#FFF4E8', color: 'white', padding: '16px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Landing Page - Fatur</h1>
                    <nav>
                        <ul style={{ display: 'flex', gap: '24px', listStyle: 'none', margin: 0, padding: 0 }}>
                            <li><a href="#beranda" style={{ color: '#F6B543', textDecoration: 'none' }}>Beranda</a></li>
                            <li><a href="#layanan" style={{ color: '#F6B543', textDecoration: 'none' }}>Layanan Kami</a></li>
                            <li><a href="#kontak" style={{ color: '#F6B543', textDecoration: 'none' }}>Kontak Kami</a></li>
                        </ul>
                    </nav>
                    <div>
                        <a href="/Login">
                            <button style={{ backgroundColor: 'white', color: 'blue', padding: '8px 16px', borderRadius: '5px', marginRight: '8px', fontWeight: '500', cursor: 'pointer' }}>Login</button>
                        </a>
                        <a href="/register">
                            <button style={{ backgroundColor: 'green', color: 'white', padding: '8px 16px', borderRadius: '5px', fontWeight: '500', cursor: 'pointer' }}>Register</button>
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="beranda" style={{ backgroundImage: 'url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '40px', borderRadius: '8px' }}>
                    <h2 style={{ fontSize: '32px', color: 'white', fontWeight: 'bold', marginBottom: '16px' }}>Kelola Bisnis Kuliner Kamu ke Level Berikutnya, Tanpa Drama!</h2>
                    <p style={{ color: 'white', marginBottom: '24px' }}>Stok Terpantau Real-Time, Transaksi Makin Cepat, Laporan Otomatis. <br />Kelola Semua dengan Mudah!</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <button style={{ backgroundColor: '#ECA641', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Lihat Hasil Kami</button>
                        <button style={{ backgroundColor: '#EEF5F7', color: '#F6B543', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Mulai Kolaborasi Sekarang</button>
                    </div>
                </div>
            </section>

            {/* Tentang Kami Section */}
            <section id="layanan" style={{ padding: '80px 0', backgroundColor: '#F3F4F6', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>Tentang Website Kami</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <h4 style={{ fontSize: '20px', fontWeight: '600' }}>Sejarah</h4>
                            <p>Kami berdiri sejak 2023 dengan tujuan memajukan teknologi.</p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <h4 style={{ fontSize: '20px', fontWeight: '600' }}>Tentang Kami</h4>
                            <p>Kami adalah tim pengembang yang berkomitmen menghadirkan solusi terbaik.</p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <h4 style={{ fontSize: '20px', fontWeight: '600' }}>Visi Misi</h4>
                            <p>Visi: Menginspirasi dunia dengan inovasi teknologi.<br />Misi: Memberikan solusi digital yang unggul.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="kontak" style={{ backgroundColor: '#2563EB', color: 'white', padding: '24px', textAlign: 'center' }}>
                <p>&copy; 2025 Landing Page. All rights reserved.</p>
            </footer>
        </div>
    );
}
