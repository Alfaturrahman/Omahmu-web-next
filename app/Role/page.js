'use client';

import '@/globals.css';
import React from "react";
import { useRouter } from 'next/navigation';

const Register = () => {
  const router = useRouter();

  const handleCardClick = (role) => {
    if (role === 'customer') {
      router.push('/Register');
    } else if (role === 'owner') {
      router.push('/POS/Register');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF4E8] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl h-auto md:h-150 rounded-2xl shadow-lg overflow-hidden">
        {/* Sisi Kiri (Desktop) */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/login-bg.png)' }}>
          <div className="flex flex-col items-center justify-center h-full pe-10 ps-10">
            <img src="/logo.jpg" alt="Logo" className="w-45 mb-20 mix-blend-multiply" />
            <p className="text-black text-center italic text-lg mb-60 font-medium" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
              "Lebih dari Sekadar Tempat Makan, Angkringan OmahMu Adalah Rumah Kedua di Setiap Suapannya"
            </p>
          </div>
        </div>

        {/* Sisi Kanan */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">
          {/* Logo (Mobile) */}
          <div className="md:hidden flex justify-center mb-6">
            <img src="/logo.jpg" alt="Logo" className="w-28" />
          </div>

            <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-2">Pilih Jenis Pengguna</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Kamu ingin memesan makanan atau mengelola angkringan? <br />
              Yuk pilih sesuai kebutuhanmu!
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button
                onClick={() => handleCardClick("customer")}
                className="bg-[#F4A950] hover:bg-[#e9962f] text-white font-semibold py-3 cursor-pointer rounded-lg transition-all"
              >
                Pelanggan
              </button>

              <div className="text-center text-gray-500 text-sm">Atau</div>

              <button
                onClick={() => handleCardClick("owner")}
                className="bg-[#F4A950] hover:bg-[#e9962f] text-white font-semibold py-3 cursor-pointer rounded-lg transition-all"
              >
                Pemilik Toko
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
