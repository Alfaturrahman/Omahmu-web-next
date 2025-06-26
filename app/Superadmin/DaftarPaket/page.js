'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from "lucide-react";
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Dialog } from '@headlessui/react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import Select from 'react-select';
import Swal from 'sweetalert2'
import '@/globals.css';

export default function DaftarPaket() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const menuRef = useRef(null);

    const handleDetailPengguna = () => {
        router.push('/Superadmin/DetailPenggunaPaket');
    };      

    const [paketList, setPaketList] = useState([
      { nama: 'Paket 1', durasi: '1', harga: 'Rp100.000', deskripsi: 'Deskripsi Paket 1', fitur: ['1-5 Pengguna'] },
      { nama: 'Paket 2', durasi: '3', harga: 'Rp250.000', deskripsi: 'Deskripsi Paket 2', fitur: ['Tidak Terbatas Pengguna', 'Live Chat'] },
    ]);

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

    const openModal = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setFormData({
            nama: '',
            durasi: '',
            harga: '',
            deskripsi: '',
            fitur: []
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);  // Tutup modal
        setFormData({
            nama: '',
            durasi: '',
            harga: '',
            deskripsi: '',
            fitur: [],
        });  // Reset form data
        setErrors({});  // Reset errors
    };

    const toggleSidebar = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(!isSidebarOpen);
      } else {
        setIsCollapsed(!isCollapsed);
      }
    };

    const toggleMenu = (index) => {
      setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleEdit = (index) => {
        const data = paketList[index];
        setFormData({
            nama: data.nama,
            durasi: data.durasi,
            harga: data.harga,
            deskripsi: data.deskripsi,
            fitur: data.fitur,
        });
        setEditIndex(index);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = (index) => {
      Swal.fire({
        title: 'Apakah Kamu yakin?',
        text: 'Paket ini akan dihapus dan tindakan ini tidak bisa dibatalkan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F6B543',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedList = [...paketList];
          updatedList.splice(index, 1);
          setPaketList(updatedList);
          Swal.fire({
            title: 'Terhapus!',
            text: 'Paket berhasil dihapus.',
            icon: 'success',
            confirmButtonColor: '#F6B543',
          });
        }
      });
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFiturChange = (selected) => {
      setFormData(prev => ({ ...prev, fitur: selected }));
    };

    const handleSubmit = () => {
        // Reset errors sebelum validasi
        setErrors({});
    
        const newErrors = {};
    
        if (!formData.nama) newErrors.nama = "Nama paket wajib diisi";
        if (!formData.durasi) newErrors.durasi = "Durasi wajib diisi";
        if (!formData.harga) newErrors.harga = "Harga wajib diisi";
        if (!formData.deskripsi) newErrors.deskripsi = "Deskripsi wajib diisi";
        if (formData.fitur.length === 0) newErrors.fitur = "Minimal pilih 1 fitur";
    
        // Kalau ada error, setErrors dan hentikan submit
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        // Kalau validasi lolos, lanjut proses
        if (isEditMode) {
            const updatedList = [...paketList];
            updatedList[editIndex] = formData;
            setPaketList(updatedList);
    
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Paket berhasil diperbarui!',
                confirmButtonColor: '#F6B543',
            });
        } else {
            setPaketList([...paketList, formData]);
    
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Paket berhasil ditambahkan!',
                confirmButtonColor: '#F6B543',
            });
        }
    
        // Reset form dan modal
        setIsModalOpen(false);
        setFormData({
            nama: '',
            durasi: '',
            harga: '',
            deskripsi: '',
            fitur: [],
        });
        setErrors({}); // Reset error
    };

    useEffect(() => {
        // Reset error saat modal ditutup
        if (!isModalOpen) {
            setErrors({});
        }
    
        // Handle klik di luar dropdown menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuIndex(null);
            }
        };
    
        // Pasang event listener hanya jika menu terbuka
        if (openMenuIndex !== null) {
            document.addEventListener('click', handleClickOutside); // pakai 'click' daripada 'mousedown'
        }
    
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isModalOpen, openMenuIndex]);    

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Wrapper untuk Sidebar & Konten */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Konten Dashboard */}
        <div className={`flex-1 flex flex-col gap-6 p-3 transition-all overflow-y-auto min-h-0 duration-300`}>
            {/* Judul dan Tambah Paket */}
            <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-5">
                <h1 className="text-base md:text-md lg:text-lg font-semibold text-black">
                    Paket Langganan POS
                </h1>

                <button
                    onClick={openModal}
                    className="flex items-center justify-center gap-2 bg-[#ECA641] hover:bg-[#d69739] text-white px-4 py-2 rounded-lg shadow-lg w-full sm:w-fit cursor-pointer"
                    >
                    <Plus size={18} />
                    Tambah Paket
                </button>
            </div>

            {/* Modal Tambah Paket */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="px-6 py-4 bg-[#FEF1E7] border-b">
                        <Dialog.Title className="text-lg font-semibold text-center text-black">
                        {isEditMode ? "Edit Paket" : "Tambah Paket"}
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
                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
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
                                value={formData.durasi || ''}
                                onChange={(e) => setFormData({ ...formData, durasi: e.target.value })}
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
                                value={formData.harga ? formData.harga.replace('Rp', '').replace('.', '') : ''}
                                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                rows="4"
                                className="w-full border rounded-md px-3 py-2"
                                placeholder="Masukkan Deskripsi Paket"
                            />
                            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}

                        </div>

                        {/* Fitur (Multi Select) */}
                        <div>
                            <label className="block text-xs font-semibold mb-1">Fitur Paket</label>
                            <Select
                                isMulti
                                name="fitur"
                                value={formData.fitur.map((f) => ({ value: f, label: f }))}
                                onChange={(selected) =>
                                setFormData({ ...formData, fitur: selected.map((item) => item.value) })
                                }
                                options={fiturOptions}
                                className="text-xs"
                            />
                            {errors.fitur && <p className="text-red-500 text-xs mt-1">{errors.fitur}</p>}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end items-center gap-4 px-6 py-4">
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                        Tutup
                        </button>
                        <button
                        onClick={handleSubmit}
                        className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white cursor-pointer"
                        >
                            {isEditMode ? "Simpan Perubahan" : "Tambah"}

                        </button>
                    </div>

                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Card Paket Langganan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 pb-10">
                {[1, 2].map((paket, index) => (
                    <div key={index} className="relative rounded-xl p-6 shadow overflow-hidden bg-white border-gray-300 border">
                    {/* Gradient hanya di atas (30%) */}
                    <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-orange-100 to-transparent pointer-events-none z-0"></div>
                    {/* Konten paket di atas gradient */}
                    <div className="relative z-10">
                      {/* Titik tiga icon */}
                        <div className="absolute right-1">
                            <button onClick={() => toggleMenu(index)} className="text-gray-600 hover:text-black focus:outline-none">
                            <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer" />
                            </button>

                            {openMenuIndex === index && (
                                <div ref={menuRef} className="absolute right-0 mt-2 w-37 bg-white rounded shadow-md z-50">
                                <button onClick={() => handleEdit(index)} className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
                                    Edit
                                </button>
                                <button onClick={handleDetailPengguna} className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
                                    Detail Pengguna
                                </button>
                                <button onClick={() => handleDelete(index)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    Hapus
                                </button>
                                </div>
                            )}
                            </div>

                            {/* Judul, harga, dan fitur di sini */}
                            <h2 className="text-lg font-semibold text-black mb-1">
                                {index === 0 ? 'Paket 1 (Basic)' : 'Paket 2 Pro (AI Enhanced)'}
                            </h2>
                            <p className="text-2xl font-bold text-orange-800 mb-4">
                                {index === 0 ? 'Rp0.00/bulan' : 'Rp150.00/bulan'}
                            </p>                  

                            {/* List fitur */}
                            <ul className="space-y-3 text-base text-black">
                                {index === 0 ? (
                                <>
                                    <li className="flex items-start gap-2"><span>✅</span> 1-5 Pengguna</li>
                                    <li className="flex items-start gap-2"><span>✅</span> 1 Cabang</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Maksimal 500 Produk</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Laporan Penjualan Dasar</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Dukungan Email</li>
                                    <li className="flex items-start gap-2 text-red-500"><span>❌</span> Bantuan AI</li>
                                    <li className="flex items-start gap-2 text-red-500"><span>❌</span> Rekomendasi Menu Otomatis</li>
                                    <li className="flex items-start gap-2 text-red-500"><span>❌</span> Live Chat Dukungan</li>
                                </>
                                ) : (
                                <>
                                    <li className="flex items-start gap-2"><span>✅</span> Tidak Terbatas Pengguna</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Tidak Terbatas Cabang</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Tidak Terbatas Produk</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Laporan Penjualan Lengkap & Analitik</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Bantuan AI (Rekomendasi Menu, Harga, Tren Penjualan)</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Live Chat Dukungan 24/7</li>
                                    <li className="flex items-start gap-2"><span>✅</span> Integrasi API</li>
                                </>
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
