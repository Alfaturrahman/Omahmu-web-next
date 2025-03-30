import React from 'react';
import '@/globals.css';
import Link from "next/link";

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFF4E8] p-4">
            <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl h-auto md:h-150 rounded-2xl shadow-lg overflow-hidden">
                {/* Sisi Kiri (Desktop) */}
                <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/login-bg.png)' }}>
                    <div className="flex flex-col items-center justify-center h-full pe-10 ps-10">
                        <img src="/logo.png" alt="Logo" className="w-35 mb-20" />
                        <p className="text-black text-center italic text-lg mb-60 font-medium" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                            "Lebih dari Sekadar Tempat Makan, Angkringan OmahMu Adalah Rumah Kedua di Setiap Suapannya"
                        </p>
                    </div>
                </div>

                {/* Sisi Kanan (Form Login) */}
                <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">
                    {/* Logo (Mobile) */}
                    <div className="md:hidden flex justify-center mb-4">
                        <img src="/logo.png" alt="Logo" className="w-28" />
                    </div>
                    <h2 className="text-center text-black text-2xl font-bold mb-2">Masuk</h2>
                    <p className="text-center text-black mb-6">
                        Selamat Datang di <span className="text-[#F6B543] font-bold">OmahMu</span>
                    </p>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="text-black block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Masukkan alamat email anda yang aktif"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-black block mb-1 font-medium">Kata Sandi</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Buat kata sandi yang aman"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                            />
                        </div>
                        <a href="#" className="text-[#ECA641] text-sm">Lupa Kata Sandi?</a>
                        <Link href="/POS/Dashboard"><button className="w-full py-2 mt-4 text-white bg-[#ECA641] rounded hover:bg-[#e3a838]">Masuk</button></Link>
                    </form>
                    <p className="mt-4 text-black text-center text-sm">
                        Tidak Punya Akun? <a href="#" className="text-[#ECA641]">Daftar Disini</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
