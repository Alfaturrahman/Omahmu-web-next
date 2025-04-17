'use client';

import '@/globals.css';
import Link from "next/link";
import React, { useState } from "react";
import Flag from "react-world-flags";
import { Upload } from 'lucide-react';
import { registerStoreOwner } from '../../../services/authService'; // pastikan path sesuai

const countryFlags = {
  ID: { code: "+62", label: "ID" },
  US: { code: "+1", label: "US" },
  SG: { code: "+65", label: "SG" },
  IN: { code: "+91", label: "IN" }
};

const Register = () => {
  const [selectedCountry, setSelectedCountry] = useState("ID");

  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    email: '',
    noHp: '',
    namaToko: '',
    alamatToko: '',
    deskripsiToko: '',
    paket: '',
  });

  const [uploads, setUploads] = useState({
    fotoToko: null,
    ktp: null,
    suratPernyataan: null,
    izinUsaha: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e, key) => {
    setUploads(prev => ({ ...prev, [key]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = new FormData();
        payload.append('email', formData.email);
        payload.append('name_owner', formData.nama);
        payload.append('no_nik', formData.nik);
        payload.append('no_hp', `${countryFlags[selectedCountry].code}${formData.noHp}`);
        payload.append('store_name', formData.namaToko);
        payload.append('store_address', formData.alamatToko);
        payload.append('description', formData.deskripsiToko);
        payload.append('package_id', formData.paket);
        payload.append('submission_code', "SUBM-001" ); // misalnya: 'SUBM-001'
        payload.append('no_virtual_account', "VA123456");         // misalnya: 'VA123456'
        payload.append('start_date', formData.start_date);   
        payload.append('end_date', formData.end_date);      
        payload.append('password', 'securePassword123');
        
        payload.append('store_picture', uploads.fotoToko);
        payload.append('ktp_picture', uploads.ktp);
        payload.append('statement_letter', uploads.suratPernyataan);
        
      if (uploads.izinUsaha) {
        payload.append('business_license', uploads.izinUsaha);
      }

      payload.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

      const result = await registerStoreOwner(payload);
      alert("Registrasi berhasil!");
      // Reset form input
      setFormData({
        nama: '',
        nik: '',
        email: '',
        noHp: '',
        namaToko: '',
        alamatToko: '',
        deskripsiToko: '',
        paket: '',
        start_date: '',
        end_date: ''
      });

      // Reset file uploads
      setUploads({
        fotoToko: null,
        ktp: null,
        suratPernyataan: null,
        izinUsaha: null
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF4E8] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-4xl rounded-2xl shadow-lg overflow-hidden">
        {/* Kiri */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/login-bg.png)' }}>
          <div className="flex flex-col items-center justify-center h-full px-10">
            <img src="/logo.jpg" alt="Logo" className="w-35 mb-20 mix-blend-multiply" />
            <p className="text-black text-center italic text-lg mb-60 font-medium font-serif">
              "Lebih dari Sekadar Tempat Makan, Angkringan OmahMu Adalah Rumah Kedua di Setiap Suapannya"
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 overflow-y-auto max-h-screen">
          <div className="md:hidden flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-28" />
          </div>
          <h2 className="text-center text-black text-2xl font-bold mb-2">Daftar</h2>
          <p className="text-center text-black mb-6">Selamat Datang di <span className="text-[#F6B543] font-bold">Posvana</span></p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Input */}
            {[
              { label: "Nama", id: "nama", placeholder: "Masukkan nama anda" },
              { label: "NIK", id: "nik", placeholder: "Masukkan nik valid anda" },
              { label: "Email", id: "email", type: "email", placeholder: "Masukkan alamat email anda" },
              { label: "Nama Toko", id: "namaToko", placeholder: "Masukkan nama toko anda" },
              { label: "Alamat Toko", id: "alamatToko", placeholder: "Masukkan alamat toko anda" },
            ].map(({ label, id, type = "text", placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="text-black block mb-1 font-bold">{label}</label>
                <input
                  type={type}
                  id={id}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
                />
              </div>
            ))}

            {/* WhatsApp */}
            <div>
              <label htmlFor="noHp" className="text-black block mb-1 font-bold">No WhatsApp</label>
              <div className="flex items-center border p-2 rounded focus-within:ring-2 focus-within:ring-[#ECA641]">
                <Flag code={selectedCountry.toLowerCase()} style={{ width: 20, height: 15, marginRight: 8 }} />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="mr-2 bg-transparent border-none text-black font-semibold focus:outline-none cursor-pointer"
                >
                  {Object.entries(countryFlags).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <span className="text-black font-semibold mr-2">{countryFlags[selectedCountry].code}</span>
                <input
                  type="text"
                  id="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  placeholder="Masukkan nomor WhatsApp"
                  className="flex-1 outline-none text-[#71717A] placeholder-[#C0C0C0]"
                />
              </div>
            </div>

            {/* Deskripsi Toko */}
            <div>
              <label htmlFor="deskripsiToko" className="text-black block mb-1 font-bold">Deskripsi Toko</label>
              <textarea
                id="deskripsiToko"
                value={formData.deskripsiToko}
                onChange={handleChange}
                placeholder="Masukkan deskripsi toko"
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
              />
            </div>

            {/* Paket */}
            <div>
              <label htmlFor="paket" className="text-black block mb-1 font-bold">Paket</label>
              <select
                id="paket"
                value={formData.paket}
                onChange={handleChange}
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
              >
                <option value="">Pilih salah satu</option>
                <option value="1">Basic</option>
                <option value="2">Premium</option>
              </select>
            </div>

            <div>

            {/* Tanggal Mulai dan Berakhir */}
            <label htmlFor="start_date" className="text-black block mb-1 font-bold">Tanggal Mulai</label>
            <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
            />
            </div>

            <div>
            <label htmlFor="end_date" className="text-black block mb-1 font-bold">Tanggal Berakhir</label>
            <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-2 text-[#71717A] border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#ECA641]"
            />
            </div>

            {/* Uploads */}
            {[
              { label: "Unggah Foto Toko", key: "fotoToko" },
              { label: "Unggah KTP Pemilik", key: "ktp" },
              { label: "Surat Pernyataan Keabsahan Data", key: "suratPernyataan" },
              { label: "Surat Izin Usaha (Opsional)", key: "izinUsaha" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-black font-bold mb-1 block">{label}</label>
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 w-fit">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-500 font-medium text-sm">
                    {uploads[key]?.name || "Add file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, key)}
                  />
                </label>
              </div>
            ))}

            {/* Tombol Daftar */}
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-[#ECA641] rounded hover:bg-[#e3a838]"
            >
              Daftarkan Akun
            </button>
          </form>

          <p className="mt-4 text-black text-center text-sm">
            Sudah Punya Akun? <a href="/Login" className="text-[#ECA641]">Login Disini </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
