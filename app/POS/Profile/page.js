'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { UploadCloud, Upload } from 'lucide-react';
import Swal from 'sweetalert2';
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';

function ProfilToko() {
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState(null);
    const [previewPernyataan, setPreviewPernyataan] = useState(null);
    const [previewKTP, setPreviewKTP] = useState(null);
    const [previewIzinUsaha, setPreviewIzinUsaha] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [storeId, setStoreId] = useState(null);
    const [formData, setFormData] = useState({
        namaToko: '',
        email: '',
        nik: '',
        whatsapp: '',
        alamat: '',
        jamBuka: '',
        jamTutup: '',
        deskripsi: ''
    });
    const [errors, setErrors] = useState({
        namaToko: '',
        email: '',
        nik: '',
        whatsapp: '',
        alamat: '',
        jamBuka: '',
        jamTutup: '',
        deskripsi: '',
        pernyataan: '',
        ktp: ''
    });
    
    // Ambil store_id dari localStorage
    useEffect(() => {
        const storedId = localStorage.getItem("store_id");
        if (storedId) {
            setStoreId(storedId);  // Simpan store_id di state
            // Ambil data store berdasarkan store_id dari URL yang sesuai
            apiService.getData(`/storeowner/profile/${storedId}/`)
                .then((response) => {
                    const storeData = response.data;
                    // Menetapkan data yang diterima ke formData
                    setFormData({
                        namaToko: storeData.store_name || '',
                        email: storeData.email || '',
                        nik: storeData.no_nik || '',
                        whatsapp: storeData.no_hp || '',
                        alamat: storeData.store_address || '',
                        jamBuka: storeData.open_time || '',
                        jamTutup: storeData.close_time || '',
                        deskripsi: storeData.description || '',
                    });
                    
                    // Menyimpan gambar dan dokumen yang sudah ada jika ada
                    setPreviewImage(storeData.store_picture);
                    setPreviewPernyataan(storeData.statement_letter);
                    setPreviewKTP(storeData.ktp_picture);
                    setPreviewIzinUsaha(storeData.business_license);
                })
                .catch((error) => {
                    console.error('Error fetching store data:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Tidak dapat memuat data toko.',
                    });
                });
        }
    }, []);  // Pastikan effect hanya berjalan sekali saat pertama kali dimuat
    
    const getFileName = (file) => {
        if (!file) return "";
        if (typeof file === "string") {
          return file.split("/").pop(); // dari URL atau path
        }
        return file.name; // dari File object
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];
    
        if (!allowedTypes.includes(file.type)) {
            alert("File harus berupa PDF atau gambar (JPG/PNG)");
            return;
        }
    
        switch (type) {
            case "pernyataan":
                setPreviewPernyataan(file);
                break;
            case "ktp":
                setPreviewKTP(file);
                break;
            case "izin":
                setPreviewIzinUsaha(file);
                break;
            default:
                break;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          setImageFile(file); // <--- ini penting!
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setImageFile(null);
          setPreviewImage(null);
        }
      };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!formData.namaToko) {
            formErrors.namaToko = 'Nama Toko tidak boleh kosong';
            isValid = false;
        }
        if (!formData.email) {
            formErrors.email = 'Email tidak boleh kosong';
            isValid = false;
        }
        if (!formData.nik) {
            formErrors.nik = 'NIK tidak boleh kosong';
            isValid = false;
        }
        if (!formData.whatsapp) {
            formErrors.whatsapp = 'No WhatsApp tidak boleh kosong';
            isValid = false;
        }
        if (!formData.alamat) {
            formErrors.alamat = 'Alamat Toko tidak boleh kosong';
            isValid = false;
        }
        if (!formData.jamBuka) {
            formErrors.jamBuka = 'Jam buka tidak boleh kosong';
            isValid = false;
        }
        if (!formData.jamTutup) {
            formErrors.jamTutup = 'Jam tutup tidak boleh kosong';
            isValid = false;
        }
        if (!formData.deskripsi) {
            formErrors.deskripsi = 'Deskripsi Toko tidak boleh kosong';
            isValid = false;
        }
        if (!previewPernyataan) {
            formErrors.pernyataan = 'Dokumen Pernyataan keabsahan data harus diupload';
            isValid = false;
        }
        if (!previewKTP) {
            formErrors.ktp = 'Dokumen KTP harus diupload';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
      
        const formDataToSend = new FormData();
        formDataToSend.append("store_name", formData.namaToko);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("no_nik", formData.nik);
        formDataToSend.append("no_hp", formData.whatsapp);
        formDataToSend.append("store_address", formData.alamat);
        formDataToSend.append("description", formData.deskripsi);
        formDataToSend.append("open_time", formData.jamBuka);
        formDataToSend.append("close_time", formData.jamTutup);
      
        // Upload file jika ada
        if (imageFile) formDataToSend.append("store_picture", imageFile);
        if (previewPernyataan) formDataToSend.append("statement_letter", previewPernyataan);
        if (previewKTP) formDataToSend.append("ktp_picture", previewKTP);
        if (previewIzinUsaha) formDataToSend.append("business_license", previewIzinUsaha);

        for (let pair of formDataToSend.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }
      
        try {
            const storedId = localStorage.getItem("store_id");
            await apiService.postData(`/storeowner/update_profile/${storeId}/`, formDataToSend);
      
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data berhasil disimpan!',
            confirmButtonColor: '#F6B543',
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.message || 'Gagal menyimpan data.',
          });
        }
      };

    return (
        <div className="h-screen bg-[#FFF4EC] flex justify-center items-center px-4 py-10 text-black">
            <div className="absolute inset-0 pointer-events-none">
                <img
                src="/bg-profil.png"
                alt="Background"
                className="w-full h-full object-cover"
                />
            </div>

            <div className="bg-white w-full max-w-6xl rounded-lg shadow-md p-6 flex flex-col gap-6 z-20">
                {/* Head */}
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()}>
                        <ArrowLeftIcon className="w-6 h-6 text-gray-700 cursor-pointer" />
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold">Lengkapi Profil</h2>
                </div>

                {/* Body */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Kiri */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <div>
                            <label className="font-semibold">Nama Toko</label>
                            <input
                                name="namaToko"
                                type="text"
                                value={formData.namaToko}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            {errors.namaToko && <p className="text-red-500 text-sm">{errors.namaToko}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">NIK</label>
                            <input
                                name="nik"
                                type="text"
                                value={formData.nik}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            {errors.nik && <p className="text-red-500 text-sm">{errors.nik}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">No WhatsApp</label>
                            <input
                                name="whatsapp"
                                type="text"
                                value={formData.whatsapp}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">Alamat Toko</label>
                            <input
                                name="alamat"
                                type="text"
                                value={formData.alamat}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat}</p>}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Jam Buka */}
                            <div className="flex flex-col w-full">
                                <label className="font-semibold text-black mb-1">Jam Buka</label>
                                <input
                                name="jamBuka"
                                type="time"
                                value={formData.jamBuka}
                                onChange={handleInputChange}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                {errors.jamBuka && <p className="text-red-500 text-sm">{errors.jamBuka}</p>}
                            </div>

                            {/* Strip Pemisah */}
                            <span className="text-black font-semibold mt-6">-</span>

                            {/* Jam Tutup */}
                            <div className="flex flex-col w-full">
                                <label className="font-semibold text-black mb-1">Jam Tutup</label>
                                <input
                                name="jamTutup"
                                type="time"
                                value={formData.jamTutup}
                                onChange={handleInputChange}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                {errors.jamTutup && <p className="text-red-500 text-sm">{errors.jamTutup}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold block">Dokumen Pendukung</label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Pernyataan */}
                            <div className="flex flex-col items-start relative">
                                <label className="text-sm text-gray-400 block mb-2 whitespace-nowrap">Pernyataan keabsahan data</label>
                                <div className="relative w-full sm:w-fit">
                                    <button className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 w-full sm:w-[170px] truncate"
                                        title={previewPernyataan ? getFileName(previewPernyataan) : "Upload Dokumen"}>
                                        <Upload className="w-5 h-5 mr-2" />
                                        <span className="truncate">
                                        {previewPernyataan ? getFileName(previewPernyataan) : "Upload Dokumen"}
                                        </span>
                                    </button>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => handlePDFChange(e, 'pernyataan')}
                                    />
                                </div>
                                {errors.pernyataan && <p className="text-red-500 text-sm">{errors.pernyataan}</p>}
                            </div>

                            {/* KTP */}
                            <div className="flex flex-col items-start relative">
                                <label className="text-sm text-gray-400 block mb-2">KTP Pemilik Toko</label>
                                <div className="relative w-full sm:w-fit">
                                <button
                                    className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 w-full sm:w-[170px] truncate"
                                    title={previewKTP ? getFileName(previewKTP) : "Upload Dokumen"}
                                >
                                    <Upload className="w-5 h-5 mr-2" />
                                    <span className="truncate">
                                        {previewKTP ? getFileName(previewKTP) : "Upload Dokumen"}
                                    </span>
                                </button>
                                <input
                                type="file"
                                accept="application/pdf,image/jpeg,image/png"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, 'ktp')}
                                />
                                </div>
                                {errors.ktp && <p className="text-red-500 text-sm">{errors.ktp}</p>}

                            </div>

                            {/* Izin Usaha (Opsional) */}
                            <div className="flex flex-col items-start relative">
                                <label className="text-sm text-gray-400 block mb-2">Surat izin usaha (opsional)</label>
                                <div className="relative w-full sm:w-fit">
                                    <button className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 w-full sm:w-[170px] truncate"
                                        title={previewIzinUsaha ? getFileName(previewIzinUsaha) : "Upload Dokumen"}>
                                        <Upload className="w-5 h-5 mr-2" />
                                        <span className="truncate">
                                            {previewIzinUsaha ? getFileName(previewIzinUsaha) : "Upload Dokumen"}
                                        </span>
                                    </button>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => handlePDFChange(e, 'izin')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanan */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <div>
                            <label className="block w-full h-[250px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer relative overflow-hidden hover:border-yellow-400 transition">
                                {previewImage ? (
                                    <img
                                        src={`http://localhost:8000/media/${previewImage}`} // Menggunakan URL gambar dari server
                                        alt="Preview Foto Toko"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                        <UploadCloud className="w-8 h-8 mb-2" />
                                        <span className="text-sm">Klik untuk upload gambar toko</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        <div>
                            <label className="font-semibold block">Deskripsi Toko</label>
                            <textarea
                                name="deskripsi"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 h-32 resize-none"
                                value={formData.deskripsi}
                                onChange={handleInputChange}
                            />
                        </div>
                        {errors.deskripsi && <p className="text-red-500 text-sm">{errors.deskripsi}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}

export default withAuth(ProfilToko,['2'])