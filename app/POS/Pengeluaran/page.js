'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import ToastProvider from '@/components/Toast';
import { Search, Filter, Plus, X, Upload, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import Image from 'next/image';
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';
import { jwtDecode } from "jwt-decode";

function Pengeluaran() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [paymentProof, setPaymentProof] = useState(null);
  const [selectedEditId, setSelectedEditId] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;

  const listPengeluaran = async () => {
    try {
      const storeId = localStorage.getItem('store_id');
      const result = await apiService.getData(`/storeowner/list_pengeluaran/?store_id=${storeId}`);
      console.log('List pengeluaran:', result.data);
      setPengeluarans(result.data); // atau format sesuai tabel kamu
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
          listPengeluaran();
      }, []);
      
  // Modal Form Pengeluaran
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    total: "",
    desc: "",
    image: null,
  });

  const Pengeluaran = () => {
    const errors = {};

    if (!formData.date) errors.date = "Tanggal Pengeluran wajib diisi";
    if (!formData.type) errors.type = "Jenis Pengeluaran wajib diisi";
    if (!formData.total) errors.total = "Total Pengeluran wajib diisi";
    if (!formData.desc) errors.desc = "Deskripsi Pengeluran wajib diisi";
    if (!formData.image) errors.image = "Bukti pembayaran wajib diunggah";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const formattedTotal = `Rp ${parseInt(formData.total).toLocaleString('id-ID')}`;

    const updatedData = {
      id: selectedEditId ?? Date.now().toString(),
      date: formData.date,
      type: formData.type,
      total: formattedTotal,
      desc: formData.desc,
      image: formData.image,
    };

    let newData;
    if (isEditing && selectedEditId) {
      newData = Pengeluarans.map(p =>
        p.id === selectedEditId ? updatedData : p
      );
    } else {
      newData = [updatedData, ...Pengeluarans];
    }

    setPengeluran(newData);
    setFormData({
      date: "",
      type: "",
      total: "",
      desc: "",
      image: null,
    });
    setIsEditing(false);
    setSelectedEditId(null);
    setPaymentProof(null);

    Swal.fire({
      icon: 'success',
      title: isEditing ? 'Berhasil Diedit!' : 'Berhasil!',
      text: isEditing ? 'Pengeluaran berhasil diperbarui!' : 'Pengeluaran berhasil ditambahkan!',
      timer: 2000,
      showConfirmButton: false
    });

    setIsModalOpen(false);
  };

  const handleAddPengeluaran = async () => {
    const storeId = localStorage.getItem('store_id');
    const errors = {};

    if (!formData.date) errors.date = "Tanggal wajib diisi";
    if (!formData.type) errors.type = "Jenis pengeluaran wajib diisi";
    if (!formData.total) errors.total = "Total wajib diisi";
    if (!formData.desc) errors.desc = "Deskripsi wajib diisi";
    if (!formData.image) errors.image = "Bukti pembayaran wajib diupload";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('store_id', storeId);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('description', formData.desc);
      formDataToSend.append('spending', formData.total);
      formDataToSend.append('type_expenses', formData.type.toLowerCase());
      formDataToSend.append('proof_of_expenses', formData.image);

      const response = await apiService.postData('/storeowner/insert_pengeluaran/', formDataToSend);

      if (response.messagetype === "S") {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Pengeluaran berhasil ditambahkan', timer: 2000, showConfirmButton: false });
        listPengeluaran(); // refresh data
        setIsModalOpen(false);
        setFormData({ date: "", type: "", total: "", desc: "", image: null });
      } else {
        Swal.fire('Error', response.message || 'Gagal menambahkan pengeluaran', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan saat menambahkan pengeluaran', 'error');
    }
  };

  const handleUpdatePengeluaran = async () => {
    const storeId = localStorage.getItem('store_id');
    const errors = {};

    if (!formData.date) errors.date = "Tanggal wajib diisi";
    if (!formData.type) errors.type = "Jenis pengeluaran wajib diisi";
    if (!formData.total) errors.total = "Total wajib diisi";
    if (!formData.desc) errors.desc = "Deskripsi wajib diisi";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('other_expenses_id', selectedEditId);
      formDataToSend.append('store_id', storeId);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('description', formData.desc);
      formDataToSend.append('spending', formData.total);
      formDataToSend.append('type_expenses', formData.type.toLowerCase());

      if (formData.image && typeof formData.image !== 'string') {
        formDataToSend.append('proof_of_expenses', formData.image); // file baru
      } else if (formData.image && typeof formData.image === 'string') {
        formDataToSend.append('proof_of_expenses_url', formData.image); // URL lama
      }

      const response = await apiService.postData('/storeowner/update_pengeluaran/', formDataToSend);

      if (response.messagetype === "S") {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Pengeluaran berhasil diupdate', timer: 2000, showConfirmButton: false });
        listPengeluaran(); // refresh data
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedEditId(null);
        setFormData({ date: "", type: "", total: "", desc: "", image: null });
      } else {
        Swal.fire('Error', response.message || 'Gagal update pengeluaran', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan saat update pengeluaran', 'error');
    }
  };

  const handleDeletePengeluaran = async (other_expenses_id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus data ini?',
      text: 'Data yang sudah dihapus tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true, // 👉 tukar posisi
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiService.deleteData(`/storeowner/delete_pengeluaran/${other_expenses_id}/`);

          if (response.messagetype === "S") {
            Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Pengeluaran berhasil dihapus', timer: 1500, showConfirmButton: true });
            listPengeluaran(); // refresh data
          } else {
            Swal.fire('Error', response.message || 'Gagal menghapus pengeluaran', 'error');
          }
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'Terjadi kesalahan saat menghapus pengeluaran', 'error');
        }
      }
    });
  };

  // Data Dummy Tabel Utama
  const [Pengeluarans, setPengeluarans] = useState([
    // {  id: "1",  date: "2025-05-05",  type: "Gaji", total: "Rp 400.000", desc: "Bayar Gaji Karyawan Bulan Juni", image: "https://kledo.com/blog/wp-content/uploads/2021/11/bukti-kas-keluar.jpg"},
    // {  id: "2",  date: "2025-05-05",  type: "Air", total: "Rp 400.000", desc: "Bayar Air Bulan Juni", image: "/transaksi.png"},
    // {  id: "3",  date: "2025-05-05",  type: "Listrik", total: "Rp 400.000", desc: "Bayar Listrik Bulan Juni", image: "https://mediakonsumen.com/files/2023/09/Bukti-Transaksi-di-MBanking.jpeg"},
    // {  id: "4",  date: "2025-05-05",  type: "Sewa", total: "Rp 400.000", desc: "Bayar Tempat Sewa Bulan Juni", image: "https://4.bp.blogspot.com/-lp73DzGVCBo/WQ2XFYgU77I/AAAAAAAAB3k/ODySRAtEjmgfpiqw8AZuneE_GC94q5AXQCLcB/s1600/Bukti%2BKas%2BKeluar.jpg"},
  ]);
  
  const handleEditPengeluaran = async (id) => {
    try {

      const response = await apiService.getData(`/storeowner/data_edit_pengeluaran/?other_expenses_id=${id}`);

      if (response.messagetype === "S") {
        const data = response.data;
        setFormData({
          date: data.date,
          type: data.type_expenses,
          total: data.spending,
          desc: data.description,
          image: data.proof_of_expenses,  // ini url string
        });
        setSelectedEditId(data.other_expenses_id);
        setIsEditing(true);
        setIsModalOpen(true);
        setFormErrors({});
        setPaymentProof(null);
      } else {
        Swal.fire('Error', response.message || 'Gagal mengambil data pengeluaran', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan saat mengambil data pengeluaran', 'error');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID");
  };

  const filteredPengeluaran = Pengeluarans.filter(item => {
    const matchSearch =
      searchTerm === "" ? true : item.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDate = filterDate
      ? formatDate(item.date) === formatDate(filterDate)
      : true;

    return matchSearch && matchDate;
  });

  const handleResetFilter = () => {
      setFilterDate('');
  };

  const totalPages = Math.ceil(filteredPengeluaran.length / itemsPerPage);
  const displayedData = filteredPengeluaran.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModalForAdd = () => {
    setIsEditing(false);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-wrapper')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative h-full overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <ToastProvider />

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80">
                <Search className="text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan harga belanja"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-2 w-full focus:outline-none text-black"
                />
              </div>

              <div className="relative dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="cursor-pointer border border-gray-500 text-black flex items-center justify-center bg-white px-4 py-2 rounded-lg text-sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filter <Filter size={18} className="ml-2" />
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-2 w-55 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="mb-4 px-2 py-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pesanan</label>
                        <DatePicker
                            selected={filterDate}
                            onChange={(date) => setFilterDate(date)}
                            placeholderText="00/00/0000"
                            dateFormat="dd/MM/yyyy"
                            className="w-full border rounded p-2 text-sm text-gray-500"
                            wrapperClassName="w-full"
                            popperClassName="z-50"
                        />
                        <button
                        onClick={handleResetFilter}
                        className="w-full mt-3 bg-red-100 text-red-600 hover:bg-red-200 font-semibold px-4 rounded text-sm"
                        >
                        Reset Filter
                        </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
            <button
              className="cursor-pointer bg-[#F6B543] text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm whitespace-nowrap"
              onClick={openModalForAdd}
            >
              <Plus size={18} className="mr-2" /> Tambah Data
            </button>
          </div>

          {/* Tabel */}
          <div className="w-full flex flex-col h-[600px] overflow-hidden">
              {/* Table Area */}
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                  {filteredPengeluaran.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                          Tidak ada data yang sesuai
                      </div>
                  ) : (
                      <table className="min-w-[900px] w-full shadow-lg">
                          <thead className="text-black text-xs md:text-[10px] lg:text-[15px] border-y border-gray-500">
                              <tr>
                                  {['NO', 'TANGGAL', 'JENIS PENGELUARAN', 'JUMLAH PENGELUARAN', 'DESKRIPSI', 'BUKTI PENGELUARAN', 'AKSI'].map((header, index) => (
                                      <th key={index} className="py-3 px-4 relative">
                                        {header}
                                        {index !== 5 && (
                                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                        )}
                                    </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                            {displayedData.map((item, index) => (
                              <tr key={index} className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative">
                                {[
                                  index + 1 + (currentPage - 1) * itemsPerPage,
                                  item.date,
                                  item.type_expenses,
                                  item.spending,
                                  item.description,
                                  <img
                                    src={`http://localhost:8000${item.proof_of_expenses}`}
                                    alt="Bukti Transaksi"
                                    className="w-32 h-32 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                                    onClick={() => {
                                      setPreviewImage(`http://localhost:8000${item.proof_of_expenses}`);
                                      setIsImageModalOpen(true);
                                    }}
                                  />
                                ].map((value, idx) => (
                                  <td key={idx} className="py-3 px-4 relative">
                                    {value}
                                    {idx !== 7 && (
                                      <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                    )}
                                  </td>
                                ))}

                                <td className="py-3 px-4 relative">
                                  <button
                                    onClick={() => handleEditPengeluaran(item.other_expenses_id)}
                                    className="text-black px-4 cursor-pointer"
                                  >
                                    <Edit />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePengeluaran(item.other_expenses_id)}
                                    className="text-black cursor-pointer"
                                  >
                                    <Trash2 />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                      </table>
                  )}
              </div>

              {isImageModalOpen && previewImage && (
                <div
                  className="fixed inset-0 backdrop-brightness-50 bg-opacity-70 z-50 flex justify-center items-center"
                  onClick={() => setIsImageModalOpen(false)}
                >
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setIsImageModalOpen(false)}
                      className="cursor-pointer absolute top-2 right-2 text-white text-2xl"
                    >
                      <X />
                    </button>
                    <img
                      src={previewImage} // ✅ gunakan previewImage di sini
                      alt="Preview Bukti"
                      className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )}

              {/* Pagenation */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600 p-2">
                  <span>Menampilkan {currentPage * itemsPerPage - itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredPengeluaran.length)} dari {filteredPengeluaran.length} entri</span>
                  <div className="flex gap-2">
                  <button 
                      className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'cursor-not-allowed' : 'bg-[#ECA641] text-white'}`} 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                  >
                      Sebelumnya
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                      <button 
                      key={i} 
                      className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-[#ECA641] text-white' : 'bg-gray-300'}`} 
                      onClick={() => setCurrentPage(i + 1)}
                      >
                      {i + 1}
                      </button>
                  ))}
                  <button 
                      className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'cursor-not-allowed' : 'bg-[#ECA641] text-white'}`} 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                  >
                      Selanjutnya
                  </button>
                  </div>
              </div>
          </div>

          {/* Modal Tambah Data Stok Basah*/}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                {/* <!-- Modal Container --> */}
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                    {/* <!-- Header --> */}
                    <div className="bg-orange-100 text-center py-4 rounded-t-xl">
                      <h2 className="text-black text-lg font-semibold">
                        {isEditing ? 'EDIT PENGELUARAN' : 'TAMBAH PENGELUARAN'}
                      </h2>
                    </div>

                    {/* <!-- Form Body --> */}
                    <form className="px-6 py-6 space-y-4" onSubmit={(e) => { e.preventDefault(); Pengeluaran(); }}>
                    {/* Tanggal Pengeluaran */}
                    <div>
                        <label className="text-sm font-semibold text-black block mb-1">TANGGAL PENGELUARAN</label>
                        <input
                            type="date"
                            className={`text-black w-full border rounded-lg px-3 py-2 outline-none ${formErrors.date ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                    </div>


                    {/* <!-- Jenis Pengeluaran --> */}
                    <div>
                        <label className="text-sm font-semibold text-black block mb-1">JENIS PENGELUARAN</label>
                        <select className={`text-black w-full border rounded-lg px-3 py-2 outline-none ${formErrors.type ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="sewa_tempat">Sewa Tempat</option>
                            <option value="gaji">Gaji</option>
                            <option value="air">Air</option>
                            <option value="listrik">Listrik</option>
                            <option value="pengeluaran_lain">Pengeluaran Lain</option>
                        </select>
                        {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}

                    </div>

                    {/* <!-- Deskripsi --> */}
                    <div>
                        <label className="text-sm font-semibold text-black block mb-1">DESKRIPSI</label>
                        <input
                            type="text"
                            className={`text-black w-full border rounded-lg px-3 py-2 outline-none ${formErrors.desc ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan Deskripsi"
                            value={formData.desc}
                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        />
                        {formErrors.desc && <p className="text-red-500 text-xs mt-1">{formErrors.desc}</p>}

                    </div>

                    {/* <!-- Jumlah Pengeluaran --> */}
                    <div>
                        <label className="text-sm font-semibold text-black block mb-1">JUMLAH PENGELUARAN</label>
                        <input
                            type="number"
                            className={`text-black w-full border rounded-lg px-3 py-2 outline-none ${formErrors.total ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="0"
                            value={formData.total}
                            onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                        />
                        {formErrors.total && <p className="text-red-500 text-xs mt-1">{formErrors.total}</p>}
                    </div>

                    {/* <!-- Upload Bukti --> */}
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">
                        Upload Bukti Pengeluaran
                        </label>
                        <label className="cursor-pointer text-gray-500 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 w-full">
                        <span className="truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                          {paymentProof 
                            ? paymentProof.name                   
                            : (typeof formData.image === 'string' 
                                ? formData.image.split('/').pop() 
                                : "Upload File")}
                        </span>
                        <Upload className="w-5 h-5 text-gray-500 shrink-0" />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setPaymentProof(file);
                                setFormData((prev) => ({ ...prev, image: file })); 
                            }
                            }}
                            />
                        </label>
                        {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
                    </div>

                    {/* <!-- Buttons --> */}
                    <div className="flex justify-end space-x-4 pt-2">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="border border-red-500 text-red-500 px-5 py-2 rounded-md font-medium hover:bg-red-100 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={isEditing ? handleUpdatePengeluaran : handleAddPengeluaran}
                          className="cursor-pointer bg-white border border-green-500 text-green-500 px-5 py-1.5 rounded-md hover:bg-green-100"
                        >
                          Simpan
                        </button>
                    </div>
                    </form>
                </div>
            </div>
            
          )}
        </div>
      </div>
    </div>
)};

export default withAuth(Pengeluaran,['2']);
