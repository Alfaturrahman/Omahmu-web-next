'use client';

import '@/globals.css';
import Link from "next/link";
import React, { useState } from "react";
import Flag from "react-world-flags";
import { Upload } from 'lucide-react'

const countryFlags = {
    ID: { code: "+62", label: "ID" },
    US: { code: "+1", label: "US" },
    SG: { code: "+65", label: "SG" },
    IN: { code: "+91", label: "IN" }
  };

const Register = () => {
    const [selectedCountry, setSelectedCountry] = useState("ID");

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFF4E8] p-4">
            <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl h-auto md:h-150 rounded-2xl shadow-lg overflow-hidden">
                {/* Sisi Kiri (Desktop) */}
                <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/login-bg.png)' }}>
                    <div className="flex flex-col items-center justify-center h-full pe-10 ps-10">
                        <img src="/logo.jpg" alt="Logo" className="w-35 mb-20 mix-blend-multiply" />
                        <p className="text-black text-center italic text-lg mb-60 font-medium" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                            "Lebih dari Sekadar Tempat Makan, Angkringan OmahMu Adalah Rumah Kedua di Setiap Suapannya"
                        </p>
                    </div>
                </div>

                {/* Sisi Kanan (Form Login) */}
                <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center [&::-webkit-scrollbar]:hidden scrollbar-hide">
                    {/* Logo (Mobile) */}
                    <div className="md:hidden flex justify-center mb-4">
                        <img src="/logo.png" alt="Logo" className="w-28" />
                    </div>
                    <h2 className="text-center text-black text-2xl font-bold mb-2">Daftar</h2>
                    <p className="text-center text-black mb-6">
                        Selamat Datang di <span className="text-[#F6B543] font-bold">Posvana</span>
                    </p>
                    <div className="max-h-[600px] overflow-y-auto p-4 bg-white rounded">
                        <form className="space-y-4">
                            {/* Nama */}
                            <div>
                                <label htmlFor="nama" className="text-black block mb-1 font-bold">Nama</label>
                                <input
                                type="text"
                                id="nama"
                                placeholder="Masukkan nama anda"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                                />
                            </div>

                            {/* NIK */}
                            <div>
                                <label htmlFor="nik" className="text-black block mb-1 font-bold">NIK</label>
                                <input
                                type="text"
                                id="nik"
                                placeholder="Masukkan nik valid anda"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="text-black block mb-1 font-bold">Email</label>
                                <input
                                type="email"
                                id="email"
                                placeholder="Masukkan alamat email anda yang aktif"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                                />
                            </div>

                            {/* No WhatsApp */}
                            <div>
                                <label htmlFor="noHp" className="text-black block mb-1 font-bold">No WhatsApp</label>
                                <div className="flex items-center w-full p-2 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-[#ECA641]">
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
                                    type="text"
                                    id="noHp"
                                    placeholder="Masukkan no WhatsApp anda yang aktif"
                                    className="flex-1 outline-none text-[#71717A] placeholder-[#C0C0C0]"
                                />
                                </div>
                            </div>

                            {/* Nama Toko */}
                            <div>
                                <label htmlFor="namaToko" className="text-black block mb-1 font-bold">Nama Toko</label>
                                <input
                                type="text"
                                id="namaToko"
                                placeholder="Masukkan nama toko anda"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                                />
                            </div>

                            {/* Alamat Toko */}
                            <div>
                                <label htmlFor="alamatToko" className="text-black block mb-1 font-bold">Alamat Toko</label>
                                <input
                                type="text"
                                id="alamatToko"
                                placeholder="Masukkan alamat toko anda"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                                />
                            </div>

                            {/* Deskripsi Toko */}
                            <div>
                                <label htmlFor="deskripsiToko" className="text-black block mb-1 font-bold">Deskripsi Toko</label>
                                <textarea
                                id="deskripsiToko"
                                placeholder="Masukkan deskripsi toko anda"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                                ></textarea>
                            </div>

                            {/* Download Surat Pernyataan */}
                            <div>
                                <label className="text-black block mb-1 font-bold">Surat Pernyataan Keabsahan Data</label>
                                <a href="/document.pdf" download className="text-[#ECA641] hover:underline text-sm">⬇️ Download document.pdf</a>
                            </div>

                            {/* Paket */}
                            <div>
                                <label htmlFor="paket" className="text-black block mb-1 font-bold">Paket</label>
                                <select
                                id="paket"
                                className="w-full p-2 text-[#71717A] border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                                >
                                <option value="">Pilih salah satu</option>
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                </select>
                            </div>

                            {/* Uploads */}
                            <div>
                                <label className="text-black font-bold mb-1 block">Unggah Foto Toko</label>
                                <label className="cursor-pointer flex flex-row items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition w-fit">
                                    <Upload className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-500 font-medium text-sm">Add file</span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            <div>
                                <label className="text-black font-bold mb-1 block">Unggah KTP Pemilik Toko</label>
                                <label className="cursor-pointer flex flex-row items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition w-fit">
                                    <Upload className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-500 font-medium text-sm">Add file</span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            <div>
                                <label className="text-black font-bold mb-1 block">Surat Pernyataan Keabsahan Data</label>
                                <label className="cursor-pointer flex flex-row items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition w-fit">
                                    <Upload className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-500 font-medium text-sm">Add file</span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            <div>
                                <label className="text-black font-bold mb-1 block">Surat Izin Usaha (Opsional)</label>
                                <label className="cursor-pointer flex flex-row items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition w-fit">
                                    <Upload className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-500 font-medium text-sm">Add file</span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            {/* Tombol Daftar */}
                            <Link href="/POS/Kasir">
                                <button className="w-full py-2 mt-4 text-white bg-[#ECA641] rounded hover:bg-[#e3a838]">Daftarkan Akun</button>
                            </Link>
                        </form>
                    </div>
                    <p className="mt-4 text-black text-center text-sm">
                    Sudah Punya Akun? <a href="/Login" className="text-[#ECA641]">Login Disini </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
