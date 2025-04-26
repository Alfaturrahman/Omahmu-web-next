'use client';

import { useState, useEffect } from 'react';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Plus, X } from "lucide-react";
import { Dialog } from '@headlessui/react';
import Select from 'react-select';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import Swal from 'sweetalert2'
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';


function DaftarPaket() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null)
    const openModal = () => setIsModalOpen(true);
    const [isClient, setIsClient] = useState(false);
    const [errors, setErrors] = useState({});
    const [paketList, setPaketList] = useState([]);

    const fetchPaketList = async () => {
        try {
          const result = await apiService.getData('/superadmin/list_package/');
          setPaketList(result.data);
        } catch (err) {
          console.error('Gagal ambil data paket:', err.message);
        }
      };
      
      useEffect(() => {
        setIsClient(true);
        fetchPaketList();
      }, []);
    
    const closeModal = () => {
        setIsModalOpen(false);
        // Reset form setelah modal ditutup
        setFormData({
          nama: '',
          durasi: '',
          harga: '',
          deskripsi: '',
          fitur: [],
        });
    };
    
    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index)
    }

    const handleEdit = (index) => {
        console.log(`Edit Paket ${index + 1}`)
    }

    const handleDelete = (packageId) => {
        Swal.fire({
          title: 'Apakah Kamu yakin?',
          text: 'Paket ini akan dihapus dan tindakan ini tidak bisa dibatalkan!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#aaa',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await apiService.deleteData(`/superadmin/delete_package/${packageId}/`); // ganti sesuai service kamu
      
              Swal.fire('Terhapus!', 'Paket berhasil dihapus.', 'success');
      
              // Refresh data setelah hapus
              fetchPaketList(); // pastikan fungsi ini ada
      
            } catch (err) {
              Swal.fire('Gagal!', err.message || 'Terjadi kesalahan saat menghapus.', 'error');
            }
          }
        });
      };
      
    const [formData, setFormData] = useState({
      nama: '',
      durasi: '',
      harga: '',
      deskripsi: '',
      fitur: [],
    });
  
    const fiturOptions = [
      { value: '1-5 Pengguna', label: '1-5 Pengguna' },
      { value: 'Tidak Terbatas Pengguna', label: 'Tidak Terbatas Pengguna' },
      { value: 'Live Chat', label: 'Live Chat' },
      { value: 'Dukungan AI', label: 'Dukungan AI' },
      { value: 'Laporan Penjualan', label: 'Laporan Penjualan' },
      { value: 'API Integrasi', label: 'API Integrasi' },
    ];
  
    const toggleSidebar = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(!isSidebarOpen);
      } else {
        setIsCollapsed(!isCollapsed);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleFiturChange = (selected) => {
      setFormData(prev => ({ ...prev, fitur: selected }));
    };

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(formData.harga));
  
    const handleSubmit = async () => {
        const newErrors = {};
      
        // Validasi field
        if (!formData.nama) newErrors.nama = 'Nama paket wajib diisi';
        if (!formData.durasi) newErrors.durasi = 'Durasi wajib diisi';
        if (!formData.harga) newErrors.harga = 'Harga wajib diisi';
        if (!formData.deskripsi) newErrors.deskripsi = 'Deskripsi wajib diisi';
        if (!formData.fitur || formData.fitur.length === 0) newErrors.fitur = 'Minimal pilih 1 fitur';
      
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
      
        try {
          // Siapkan payload untuk dikirim
          const payload = {
            package_name: formData.nama,
            duration: Number(formData.durasi),
            price: formattedPrice,
            description: formData.deskripsi,
            fitur: formData.fitur.map(f => f.value), // hanya ambil value dari select
          };
      
          // Kirim ke backend
          await apiService.postData('/superadmin/insert_package/', payload);
      
          // Success!
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data paket berhasil ditambahkan.',
            confirmButtonColor: '#F6B543',
          });
      
          // Reset form dan tutup modal
          setFormData({
            nama: '',
            durasi: '',
            harga: '',
            deskripsi: '',
            fitur: [],
          });
          setIsModalOpen(false);
          setErrors({});
      
          // Refresh list paket
          fetchPaketList(); // pastikan ini dideklarasikan di luar handleSubmit
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: err.message || 'Terjadi kesalahan saat menyimpan data.',
          });
        }
      };
    
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Wrapper untuk Sidebar & Konten */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Konten Dashboard */}
        <div className={`flex-1 flex flex-col gap-6 p-3 transition-all duration-300`}>
            {/* Judul dan Tambah Paket */}
            <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-5">
                <h1 className="text-base md:text-md lg:text-lg font-semibold text-black">
                    Paket Langganan POS
                </h1>

                <button
                    onClick={openModal}
                    className="flex items-center justify-center gap-2 bg-[#ECA641] hover:bg-[#d69739] text-white px-4 py-2 rounded-lg shadow-lg w-full sm:w-fit"
                    >
                    <Plus size={18} />
                    Tambah Paket
                </button>
            </div>

            {/* Modal Tambah Paket */}
            <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="px-6 py-4 bg-[#FEF1E7] border-b">
                        <Dialog.Title className="text-lg font-semibold text-center text-black">
                        TAMBAH PAKET LANGGANAN
                        </Dialog.Title>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4 space-y-4 text-sm text-black">
                        {/* Nama Paket */}
                        <div>
                            <label className="block text-xs font-semibold mb-1">Nama Paket</label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2"
                                placeholder="Masukkan Nama Paket"
                            />
                            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                        </div>

                        {/* Durasi */}
                        <div>
                            <label className="block text-xs font-semibold mb-1">Durasi</label>
                            <input
                                type="number"
                                name="durasi"
                                value={formData.durasi}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2"
                                placeholder="Durasi (dalam bulan)"
                            />
                            {errors.durasi && <p className="text-red-500 text-xs mt-1">{errors.durasi}</p>}

                        </div>

                        {/* Harga */}
                        <div>
                            <label className="block text-xs font-semibold mb-1">Harga</label>
                            <input
                                type="number"
                                name="harga"
                                value={formData.harga}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2"
                                placeholder="Harga Paket (Rp)"
                            />
                            {errors.harga && <p className="text-red-500 text-xs mt-1">{errors.harga}</p>}

                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-xs font-semibold mb-1">Deskripsi</label>
                            <textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border rounded-md px-3 py-2"
                                placeholder="Masukkan Deskripsi Paket"
                            />
                            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}

                        </div>

                        {/* Fitur (Multi Select) */}
                        <div>
                            <label className="block text-xs font-semibold mb-1">Fitur Paket</label>
                            <Select isMulti name="fitur"
                                options=
                                {[
                                    { value: '1-5 Pengguna', label: '1-5 Pengguna' },
                                    { value: 'Tidak Terbatas Pengguna', label: 'Tidak Terbatas Pengguna' },
                                    { value: '1 Cabang', label: '1 Cabang' },
                                    { value: 'Tidak Terbatas Cabang', label: 'Tidak Terbatas Cabang' },
                                    { value: 'Maks. 500 Produk', label: 'Maks. 500 Produk' },
                                    { value: 'Laporan Penjualan Dasar', label: 'Laporan Penjualan Dasar' },
                                    { value: 'Laporan Lengkap & Analitik', label: 'Laporan Lengkap & Analitik' },
                                    { value: 'Dukungan Email', label: 'Dukungan Email' },
                                    { value: 'Live Chat 24/7', label: 'Live Chat 24/7' },
                                    { value: 'Bantuan AI', label: 'Bantuan AI' },
                                    { value: 'Rekomendasi Menu Otomatis', label: 'Rekomendasi Menu Otomatis' },
                                    { value: 'Integrasi API', label: 'Integrasi API' },
                                ]}
                                value={formData.fitur}
                                onChange={handleFiturChange}
                                className="text-sm"
                                classNamePrefix="select"
                                placeholder="Pilih fitur yang tersedia"

                                menuPortalTarget={isClient ? document.body : null}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    control: (base, state) => ({
                                    ...base,
                                    backgroundColor: 'white',
                                    color: 'black',
                                    }),
                                    option: (base, state) => ({
                                    ...base,
                                    color: 'black',
                                    cursor: 'pointer',
                                    }),
                                    multiValue: base => ({
                                    ...base,
                                    color: 'black',
                                    }),
                                    multiValueLabel: base => ({
                                    ...base,
                                    color: 'black',
                                    }),
                                    input: base => ({
                                    ...base,
                                    color: 'black',
                                    }),
                            }}
                            />
                            {errors.fitur && <p className="text-red-500 text-xs mt-1">{errors.fitur}</p>}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end items-center gap-4 px-6 py-4">
                        <button
                        onClick={closeModal}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                        >
                        Tutup
                        </button>
                        <button
                        onClick={handleSubmit}
                        className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white"
                        >
                        Simpan
                        </button>
                    </div>

                    </Dialog.Panel>
                </div>
            </Dialog>
            
            {/* Card Paket Langganan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 pb-10">
                {paketList.map((paket, index) => (
                    <div key={index} className="bg-[#FFF3E6] rounded-xl p-6 shadow-sm relative">
                    {/* Titik tiga icon */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleMenu(index)}
                        className="text-gray-600 hover:text-black focus:outline-none"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                  
                      {openMenuIndex === index && (
                        <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow-md z-10">
                          <button
                            onClick={() => handleEdit(index)}
                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(paket.package_id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  
                    {/* Nama Paket */}
                    <h2 className="text-lg font-semibold text-center text-black mb-4">
                      {paket.package_name}
                    </h2>
                  
                    {/* Deskripsi */}
                    <p className="text-sm text-center text-gray-700 mb-4">{paket.description}</p>
                  
                    {/* Simulasi fitur (sementara hardcoded) */}
                    <ul className="space-y-2 text-sm text-black">
                      {index === 0 ? (
                        <>
                          <li>✅ 1-5 Pengguna</li>
                          <li>✅ 1 Cabang</li>
                          <li>✅ Maksimal 500 Produk</li>
                          <li>✅ Laporan Penjualan Dasar</li>
                          <li>✅ Dukungan Email</li>
                          <li className="text-red-500">❌ Bantuan AI</li>
                          <li className="text-red-500">❌ Rekomendasi Menu Otomatis</li>
                          <li className="text-red-500">❌ Live Chat Dukungan</li>
                        </>
                      ) : (
                        <>
                          <li>✅ Tidak Terbatas Pengguna</li>
                          <li>✅ Tidak Terbatas Cabang</li>
                          <li>✅ Tidak Terbatas Produk</li>
                          <li>✅ Laporan Penjualan Lengkap & Analitik</li>
                          <li>✅ Bantuan AI (Rekomendasi Menu, Harga, Tren Penjualan)</li>
                          <li>✅ Live Chat Dukungan 24/7</li>
                          <li>✅ Integrasi API</li>
                        </>
                      )}
                    </ul>
                  
                    {/* Harga dari API */}
                    <div className="absolute bottom-4 right-4 text-black font-semibold text-sm">
                      {paket.price}
                    </div>
                  </div>
                  
                ))}
            </div>

        </div>
      </div>
    </div>
  );
}

export default withAuth(DaftarPaket,['1'])