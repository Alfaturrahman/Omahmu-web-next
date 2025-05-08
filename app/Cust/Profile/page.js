'use client';

import { ArrowLeft } from 'lucide-react'
import { useState,useEffect  } from 'react'
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'
import * as apiService from 'services/authService';


export default function ProfilePage() {
    const [form, setForm] = useState({
        nama: '',
        email: '',
        telepon: '',
        alamat: '',
        avatar: null, // For image upload
    });

    console.log("TESSSS", form);
    

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchProfileData = async () => {
        try {
            const response = await apiService.getData('/customer/profile_cust/');
            console.log('Response:', response); // Log seluruh response
            if (response.data) {
                setForm({
                    nama: response.data.custname_name,
                    email: response.data.customer_email,
                    telepon: response.data.phone_number,
                    avatar: response.data.avatar || null, // Assuming avatar is a URL or path
                });
                setImagePreview(response.data.avatar || '/pp.png');
            } else {
                console.error('Data tidak ditemukan:', response);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };
    
    useEffect(() => {
        fetchProfileData();
    }, []);

    // Handle form input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setForm({ ...form, avatar: file });
            };
            reader.readAsDataURL(file);
        }
    };

    // Validate the form data
    const validateForm = () => {
        const newErrors = {};
        if (!form.nama) newErrors.nama = 'Nama wajib diisi';
        if (!form.email) newErrors.email = 'Email wajib diisi';
        if (!form.telepon) newErrors.telepon = 'No Telepon wajib diisi';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
        const handleSubmit = async (e) => {
            e.preventDefault();

            if (validateForm()) {
                try {
                    setLoading(true);

                    // Create FormData object to send file and other form fields
                    const formData = new FormData();
                    formData.append('custname_name', form.nama);
                    formData.append('email', form.email);
                    formData.append('phone_number', form.telepon);

                    // Only append avatar if it's selected
                    if (form.avatar) {
                        formData.append('avatar', form.avatar);
                    }

                    // Call API to update profile data
                    const response = await apiService.postData('/customer/update_profile_cust/', formData);

                    // Show success notification
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Profil berhasil diperbarui.',
                        confirmButtonColor: '#F6B543',
                    });

                    // Optionally navigate back to the previous page after success
                    router.back()
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.',
                    });
                    console.error('Error submitting profile:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

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
                            src={imagePreview || '/pp.png'}
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
                            placeholder="Masukkan nama anda di sini"
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
                            placeholder="Masukkan email anda di sini"
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
                            placeholder="Masukkan No WahatsApp anda di sini"
                        />
                        {errors.telepon && <p className="text-sm text-red-500">{errors.telepon}</p>}
                    </div>

                    <div className='hidden'>
                        <label className="block text-sm text-black font-medium mb-1">Alamat</label>
                        <input
                            name="alamat"
                            type="text"
                            className="w-full text-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-500 focus:ring-orange-400"
                            value={form.alamat}
                            onChange={handleChange}
                            placeholder="Masukkan alamat anda di sini"
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