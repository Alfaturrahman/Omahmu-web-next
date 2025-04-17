'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../services/authService'; // Import the loginUser function
import '@/globals.css';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let formErrors = { email: '', password: '' };
        let isValid = true;
    
        if (!email) {
            formErrors.email = 'Email tidak boleh kosong';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = 'Email tidak valid';
            isValid = false;
        }
    
        if (!password) {
            formErrors.password = 'Password tidak boleh kosong';
            isValid = false;
        }
    
        if (!isValid) {
            setErrors(formErrors);
            setSuccessMessage('');
        } else {
            setErrors({ email: '', password: '' });
            setSuccessMessage('Login berhasil!');
            setLoading(true);

            try {
                // Send login data to the API
                const response = await loginUser({ email, password });
                console.log(response.data); // Check the response

                const token = response.data.token;
                const role_id = response.data.user.role_id;

                localStorage.setItem('token', token); // Store the JWT token in localStorage (or use sessionStorage)
                setLoading(false);

                // Redirect based on role_id
                if (role_id === 2) {
                    // Store owner (role_id = 2)
                    router.push('/POS/Kasir');
                } else if (role_id === 3) {
                    // Customer (role_id = 3)
                    router.push('/dashboard');
                } else {
                    // Default or fallback route if role_id is not recognized
                    router.push('/');
                }
            } catch (error) {
                setLoading(false);
                setSuccessMessage('');
                if (error.response?.data?.message) {
                    setErrors({ email: '', password: error.response.data.message });
                } else {
                    setErrors({ email: '', password: 'Login gagal, silakan coba lagi.' });
                }
            } finally {
                // Clear the email and password fields after submission (success or failure)
                setEmail('');
                setPassword('');
            }
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

                {/* Sisi Kanan (Form Login) */}
                <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">
                    {/* Logo (Mobile) */}
                    <div className="md:hidden flex justify-center mb-4">
                        <img src="/logo.jpg" alt="Logo" className="w-28" />
                    </div>
                    <h2 className="text-center text-black text-2xl font-bold mb-2">Masuk</h2>
                    <p className="text-center text-black mb-6">
                        Selamat Datang di <span className="text-[#F6B543] font-bold">OmahMu</span>
                    </p>
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mb-4 text-center">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="text-black block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Masukkan alamat email anda yang aktif"
                                className={`w-full p-2 text-[#71717A] border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="text-black block mb-1 font-medium">Kata Sandi</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Buat kata sandi yang aman"
                                className={`w-full p-2 text-[#71717A] border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-[#ECA641]`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <a href="#" className="text-[#ECA641] text-sm">Lupa Kata Sandi?</a>
                        <button type="submit" className="w-full py-2 mt-4 text-white bg-[#ECA641] rounded hover:bg-[#e3a838]" disabled={loading}>
                            {loading ? "Loading..." : "Masuk"}
                        </button>
                    </form>
                    <p className="mt-4 text-black text-center text-sm">
                        Tidak Punya Akun? <a href="/Role" className="text-[#ECA641]">Daftar Disini</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
