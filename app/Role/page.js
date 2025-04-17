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
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center [&::-webkit-scrollbar]:hidden scrollbar-hide">
          {/* Logo (Mobile) */}
          <div className="md:hidden flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="w-28" />
          </div>

          {/* Opsi Role */}
          <h2 className="text-2xl font-semibold mb-4 text-center text-black">Pilih Jenis Pengguna</h2>
          <div className="flex flex-col gap-4">
            <div
              onClick={() => handleCardClick("customer")}
              className="cursor-pointer p-6 rounded-xl bg-gray-50 border-gray-200 border-2 hover:shadow-md hover:bg-[#FFF4E8] transition-all"
            >
              <h3 className="text-lg font-bold mb-2 text-black">Customer</h3>
              <p className="text-sm text-gray-600">Saya ingin memesan makanan dan menikmati layanan Angkringan OmahMu.</p>
            </div>

            <div
              onClick={() => handleCardClick("owner")}
              className="cursor-pointer p-6 rounded-xl border-2 bg-gray-50 border-gray-200 hover:shadow-md hover:bg-[#FFF4E8] transition-all"
            >
              <h3 className="text-lg font-bold mb-2 text-black">Pemilik Toko</h3>
              <p className="text-sm text-gray-600">Saya adalah pemilik angkringan dan ingin mengelola toko saya.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
