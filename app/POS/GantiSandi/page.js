'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Swal from 'sweetalert2';
import withAuth from 'hoc/withAuth';
import { jwtDecode } from "jwt-decode";
import * as apiService from 'services/authService';

function GantiPassToko() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const token = localStorage.getItem("token");

    let userId = "";

    if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.user_id;
    }
    
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
    
        if (!formData.oldPassword) {
            formErrors.oldPassword = 'Kata sandi lama tidak boleh kosong';
            isValid = false;
        }
    
        if (!formData.newPassword) {
            formErrors.newPassword = 'Kata sandi baru tidak boleh kosong';
            isValid = false;
        } else if (formData.newPassword.length < 6) {
            formErrors.newPassword = 'Kata sandi baru minimal 6 karakter';
            isValid = false;
        }
    
        if (!formData.confirmPassword) {
            formErrors.confirmPassword = 'Konfirmasi kata sandi tidak boleh kosong';
            isValid = false;
        } else if (formData.confirmPassword !== formData.newPassword) {
            formErrors.confirmPassword = 'Konfirmasi kata sandi tidak sama dengan kata sandi baru';
            isValid = false;
        }
    
        setErrors(formErrors);
        return isValid;
    };
    
    const handleSubmit = async () => {
        if (validateForm()) {
          try {
            const token = localStorage.getItem("token");
            let userId = "";
      
            if (token) {
              const decoded = jwtDecode(token);
              userId = decoded.user_id; // Ambil user_id dari token
            }
      
            const payload = {
              user_id: userId, // Menambahkan user_id ke dalam payload
              oldPassword: formData.oldPassword,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword
            };
      
            const response = await apiService.putData('/user_auth/change_password/', payload);
      
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: response.message || 'Kata sandi berhasil diperbarui!',
            });

             // Reset form
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: error.message || 'Terjadi kesalahan saat mengganti kata sandi.',
            });
          }
        }
      };

    return (
        <div
            className="min-h-screen flex justify-center items-center px-4 py-10 text-black"
            style={{
                background: 'radial-gradient(circle at top right, #F6B543, #FFF4E8)'
            }}
        >
            <div className="bg-white w-full max-w-md rounded-lg shadow-md p-4 flex flex-col gap-4">
                {/* Head */}
                <div className="grid grid-cols-3 items-center">
                    <div className="justify-self-start">
                        <button onClick={() => router.back()}>
                            <ArrowLeftIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
                        </button>
                    </div>
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold whitespace-nowrap">
                        Ganti Kata Sandi
                    </h2>
                    <div />
                </div>


                {/* Body */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Kata Sandi Lama</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
                            placeholder="Masukkan kata sandi lama"
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        />
                        {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Kata Sandi Baru</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
                            placeholder="Masukkan kata sandi baru"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        />
                        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Konfirmasi Kata Sandi</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
                            placeholder="Ulangi kata sandi baru"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}

export default withAuth(GantiPassToko, ['1', '2', '3']);