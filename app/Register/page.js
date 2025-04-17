'use client';

import '@/globals.css';
import Link from "next/link";
import React, { useState } from "react";
import Flag from "react-world-flags";
import { registerCustomer } from '../../services/authService';

const countryFlags = {
  ID: { code: "+62", label: "ID" },
  US: { code: "+1", label: "US" },
  SG: { code: "+65", label: "SG" },
  IN: { code: "+91", label: "IN" }
};

const Register = () => {
  const [selectedCountry, setSelectedCountry] = useState("ID");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: selectedCountry + formData.phoneNumber,
        password: formData.password,
      };

      const response = await registerCustomer(payload);

      if (response.messagetype === 'S') {
        alert('Registrasi Berhasil');
      } else {
        setError('Pendaftaran gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF4E8] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl h-auto md:h-150 rounded-2xl shadow-lg overflow-hidden">

        {/* Kiri (Desktop) */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url(/login-bg.png)' }}
        >
          <div className="flex flex-col items-center justify-center h-full pe-10 ps-10">
            <img src="/logo.jpg" alt="Logo" className="w-45 mb-20 mix-blend-multiply" />
            <p
              className="text-black text-center italic text-lg mb-60 font-medium"
              style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
            >
              "Lebih dari Sekadar Tempat Makan, Angkringan OmahMu Adalah Rumah Kedua di Setiap Suapannya"
            </p>
          </div>
        </div>

        {/* Kanan (Form) */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">
          <div className="md:hidden flex justify-center mb-4">
            <img src="/logo.jpg" alt="Logo" className="w-28" />
          </div>

          <h2 className="text-center text-black text-2xl font-bold mb-2">Daftar</h2>
          <p className="text-center text-black mb-6">
            Selamat Datang di <span className="text-[#F6B543] font-bold">Posvana</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">

            <div>
              <label htmlFor="nama" className="text-black block mb-1 font-bold">Nama</label>
              <input
                type="text"
                id="nama"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama anda"
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-black block mb-1 font-bold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan alamat email anda yang aktif"
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
              />
            </div>

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
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Masukkan no WhatsApp anda yang aktif"
                  className="flex-1 outline-none text-[#71717A] placeholder-[#C0C0C0]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-black block mb-1 font-bold">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-black block mb-1 font-bold">Konfirmasi Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Konfirmasi password"
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-[#ECA641] rounded hover:bg-[#e3a838]"
              disabled={isLoading}
            >
              {isLoading ? 'Sedang Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="mt-4 text-black text-center text-sm">
            Sudah Punya Akun? <Link href="/Login" className="text-[#ECA641]">Login Disini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
