'use client';

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'

export default function ProfilePage() {
    const [form, setForm] = useState({
        nama: '',
        email: '',
        telepon: '',
        alamat: '',
    })

    const [errors, setErrors] = useState({})
    const [imagePreview, setImagePreview] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!form.nama) newErrors.nama = 'Nama wajib diisi'
        if (!form.email) newErrors.email = 'Email wajib diisi'
        if (!form.telepon) newErrors.telepon = 'No Telepon wajib diisi'
        if (!form.alamat) newErrors.alamat = 'Alamat wajib diisi'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
        // Notifikasi SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Form berhasil disubmit',
            confirmButtonColor: '#F6B543'
        })
    }
}

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Background ilustrasi makanan */}
        <div className="absolute inset-0 pointer-events-none">
            <img
            src="/bg-profil.png"
            alt="Background"
            className="w-full h-full object-cover"
            />
        </div>

        {/* Card Form */}
        <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-10">
            <button
            className="absolute left-4 top-4"
            onClick={() => router.back()}
            >
                <ArrowLeft className="w-5 h-5 text-black cursor-pointer" />
            </button>

            <h1 className="text-center text-black text-xl font-semibold mb-6">Lengkapi Profil Anda</h1>

            {/* Avatar Upload */}
            <div className="flex justify-center mb-6">
                <label className="w-40 h-40 bg-gray-100 border border-gray-300 rounded-md cursor-pointer flex items-center justify-center overflow-hidden relative">
                    <img
                    src={imagePreview || "/pp.png"}
                    alt="Preview"
                    className="object-cover w-full h-full"
                    />
                    <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-md absolute opacity-50">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            </div>

            {/* Form Input */}
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm text-black font-medium mb-1">Nama</label>
                <input
                name="nama"
                type="text"
                className="w-full text-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-500 focus:ring-orange-400"
                value={form.nama}
                onChange={handleChange}
                placeholder='Masukkan nama anda di sini'
                />
                {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
            </div>

            <div>
                <label className="block text-sm text-black font-medium mb-1">Email</label>
                <input
                name="email"
                type="email"
                className="w-full text-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-500 focus:ring-orange-400"
                value={form.email}
                onChange={handleChange}
                placeholder='Masukkan email anda di sini'
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm text-black font-medium mb-1">No Telepone/Wa</label>
                <input
                name="telepon"
                type="text"
                className="w-full text-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-500 focus:ring-orange-400"
                value={form.telepon}
                onChange={handleChange}
                placeholder='Masukkan No WahatsApp anda di sini'
                />
                {errors.telepon && <p className="text-sm text-red-500">{errors.telepon}</p>}
            </div>

            <div>
                <label className="block text-sm text-black font-medium mb-1">Alamat</label>
                <input
                name="alamat"
                type="text"
                className="w-full text-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-500 focus:ring-orange-400"
                value={form.alamat}
                onChange={handleChange}
                placeholder='Masukkan alamat anda di sini'
                />
                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
            </div>

            <button
                type="submit"
                className="w-full mt-4 bg-[#ECA641] text-white py-2 cursor-pointer rounded-md"
            >
                Simpan
            </button>
            </form>
        </div>
        </div>
    )
}