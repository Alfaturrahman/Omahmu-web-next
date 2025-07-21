'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '@/globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Plus, X } from "lucide-react";
import { Dialog } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import Select from 'react-select';
import Swal from 'sweetalert2'
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';


function DaftarPaket() {
    const menuRef = useRef(null); // Mendeklarasikan menuRef
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null)
    const openModal = () => setIsModalOpen(true);
    const [isClient, setIsClient] = useState(false);
    const [errors, setErrors] = useState({});
    const [paketList, setPaketList] = useState([]);
    const [fiturList, setFiturList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null); // kalau kamu butuh ID paket untuk update
    const [formData, setFormData] = useState({
      nama: '',
      durasi: '',
      harga: '',
      deskripsi: '',
      fitur: [],
    });
    const handleDetailPengguna = () => {
      // Navigasi ke halaman detail pengguna
      router.push('/Superadmin/DetailPenggunaPaket');
    };
    
  
    const fiturOptions = [
      { value: '1-5 Pengguna', label: '1-5 Pengguna' },
      { value: 'Tidak Terbatas Pengguna', label: 'Tidak Terbatas Pengguna' },
      { value: 'Live Chat', label: 'Live Chat' },
      { value: 'Dukungan AI', label: 'Dukungan AI' },
      { value: 'Laporan Penjualan', label: 'Laporan Penjualan' },
      { value: 'API Integrasi', label: 'API Integrasi' },
    ];

    const fetchPaketList = async () => {
      try {
        const result = await apiService.getData('/superadmin/list_package/');
        setPaketList(result.data);
      } catch (err) {
        console.error('Gagal ambil data paket:', err.message);
      }
    };

    const fetchFiturList = async () => {
        try {
            const result = await apiService.getData('/superadmin/list_master_features/'); 
            const fiturOptions = result.data.map(fitur => ({
                value: fitur.feature_id, 
                label: fitur.feature_name, 
                description: fitur.feature_description, 
            }));
            setFiturList(fiturOptions);
        } catch (err) {
            console.error('Gagal ambil data fitur:', err.message);
        }
    };
      
      useEffect(() => {
        setIsClient(true);
        fetchPaketList();
        fetchFiturList();
      }, []);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
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

    const handleEdit = (paket) => {
      setOpenMenuIndex(null);
      const fiturSelected = (paket.features || [])
      .filter(fitur => fitur.is_active) // hanya fitur yang aktif
      .map(fitur => {
        const found = fiturList.find(f => f.value === fitur.feature_id);
        return found ? found.value : undefined;
      })
      .filter(fitur => fitur !== undefined);
    
    setFormData({
      nama: paket.package_name || '',
      durasi: paket.duration || '',
      harga: paket.price ? parseInt(paket.price.replace(/[^0-9]/g, ''), 10) : '',
      deskripsi: paket.description || '',
      fitur: fiturSelected,
    });
    
      setEditId(paket.package_id); 
      setIsEditMode(true);
      setErrors({});
      setIsModalOpen(true);
    };
    

    const handleDelete = (packageId) => {
        Swal.fire({
          title: 'Apakah Kamu yakin?',
          text: 'Paket ini akan dihapus dan tindakan ini tidak bisa dibatalkan!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#F6B543',
          cancelButtonColor: '#aaa',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await apiService.deleteData(`/superadmin/delete_package/${packageId}/`); // ganti sesuai service kamu
      
              Swal.fire({
            title: 'Terhapus!',
            text: 'Paket berhasil dihapus.',
            icon: 'success',
            confirmButtonColor: '#F6B543',
          });
      
              // Refresh data setelah hapus
              fetchPaketList(); // pastikan fungsi ini ada
      
            } catch (err) {
              Swal.fire('Gagal!', err.message || 'Terjadi kesalahan saat menghapus.', 'error');
            }
          }
        });
      };
      
    
  
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
  
    const handleFiturChange = (selectedOptions) => {
        setFormData(prevData => ({
            ...prevData,
            fitur: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };
  
    const handleSubmit = async () => {
      const newErrors = {};
    
      // Validasi
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
        const payload = {
          package_name: formData.nama,
          duration: Number(formData.durasi),
          price: Number(formData.harga),
          description: formData.deskripsi,
          features: formData.fitur,
        };
    
        if (isEditMode) {
          // Update data
          await apiService.putData(`/superadmin/update_package/${editId}/`, payload); 
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data paket berhasil diperbarui.',
            confirmButtonColor: '#F6B543',
                confirmButtonColor: '#F6B543',
          });
        } else {
          // Insert data
          await apiService.postData('/superadmin/insert_package/', payload);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data paket berhasil ditambahkan.',
            confirmButtonColor: '#F6B543',
                confirmButtonColor: '#F6B543',
          });
        }
    
        // Reset form
        setFormData({
          nama: '',
          durasi: '',
          harga: '',
          deskripsi: '',
          fitur: [],
        });
        setErrors({});
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditId(null);
    
        fetchPaketList();
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
                  onClick={() => {
                    openModal();
                    setOpenMenuIndex(null);
                  }}
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
                      {isEditMode ? 'EDIT PAKET LANGGANAN' : 'TAMBAH PAKET LANGGANAN'}
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
                            <Select
                                isMulti
                                name="fitur"
                                options={fiturList} // Menggunakan fiturList yang sudah diformat
                                value={formData.fitur.map(id => ({
                                    value: id,
                                    label: fiturList.find(f => f.value === id)?.label || '', // Menampilkan nama fitur
                                }))}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 pb-10">
            {paketList.map((paket, index) => {
              // Mengonversi harga ke angka
             const rawPrice = paket.price 
                ? paket.price.replace(/[^0-9]/g, '') // hanya ambil digit, hilangkan koma/titik
                : null;

              console.log("rawPrice", rawPrice);

              const price = rawPrice && !isNaN(rawPrice)
                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(rawPrice))
                : 'Harga Tidak Tersedia';

              console.log("price", price);

              return (
                <div key={paket.package_id} className="relative rounded-xl p-6 shadow overflow-hidden bg-white border-gray-300 border">
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
                          <button onClick={() => handleEdit(paket)} className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
                            Edit
                          </button>
                          <button
                          onClick={() => router.push(`/Superadmin/DetailPenggunaPaket?package_id=${paket.package_id}`)}
                          className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
                            Detail Pengguna
                          </button>
                          <button onClick={() => handleDelete(paket.package_id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Judul, harga, dan fitur di sini */}
                    <h2 className="text-lg font-semibold text-black mb-1">
                      {paket.package_name}
                    </h2>
                    <p className="text-2xl font-bold text-orange-800 mb-4">
                      {price}
                    </p>

                    {/* List fitur */}
                    <ul className="space-y-3 text-base text-black">
                      {paket.features.length > 0 ? (
                        paket.features.map((fitur) => (
                          <li key={fitur.feature_id} className="flex items-start gap-2">
                            {fitur.is_active ? (
                              <span>✅</span>
                            ) : (
                              <span className="text-red-500">❌</span>
                            )}
                            {fitur.is_active ? fitur.feature_name : fitur.feature_name}
                          </li>
                        ))
                      ) : (
                        <li className="text-red-500">Tidak ada fitur tersedia</li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DaftarPaket,['1'])