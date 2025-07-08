'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import ToastProvider from '@/components/Toast';
import { Search, Filter, Edit, Trash2, Eye, Plus, X, Upload} from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Image from 'next/image';
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';
import { jwtDecode } from "jwt-decode";

function StokBasah() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpenAddItem, setIsModalOpenAddItem] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [paymentProof, setPaymentProof] = useState(null);
  const [StokBasah, setListStokBasah] = useState([]);
  const [dtlStokBasah, setDetailStokBasah] = useState([]);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;

  // Modal Form 1 (Tambah Stok Basah)
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    nameBuyer: "",
    image: null,
  });

  async function listStokBasah() {
    try {
      const storeId = localStorage.getItem('store_id');
      const result = await apiService.getData(`/storeowner/list_stok_basah/?store_id=${storeId}`);
      console.log("WALAWE", result.data);

      // Group per stock_entry_id
      const grouped = {};
      result.data.forEach(item => {
        if (!grouped[item.stock_entry_id]) {
          grouped[item.stock_entry_id] = {
            stock_entry_id: item.stock_entry_id,
            date: item.date,
            place: item.place,
            officer: item.officer,
            proof_of_payment: item.proof_of_payment,
            total_items: item.total_items,
            total_amount: item.total_amount,
          };
        }
      });

      // Buat array yang siap untuk tabel
      const finalData = Object.values(grouped).map(entry => ({
        stock_entry_id: entry.stock_entry_id,
        nameBuyer: entry.officer,
        date: entry.date,
        amount: entry.total_items,
        totalPrice: entry.total_amount
      }));

      console.log("Data untuk tabel:", finalData);

      setListStokBasah(finalData);  
    } catch (err) {
      console.error(err.message);
    }
  }
  async function detailStokBasah() {
      try {
          const stockEntryId = 4;
          const result = await apiService.getData(`/storeowner/detail_stok_basah/?stock_entry_id=${stockEntryId}`);
          console.log("CIBAI",result.data);
          
          setDetailStokBasah(result.data);  
      } catch (err) {
          console.error(err.message);
      }
  }

  useEffect(() => {
        listStokBasah();
        detailStokBasah();
    }, []);

  const handleAddStokBasah = async () => {
    const errors = {};
    const storeId = localStorage.getItem('store_id');

    if (!formData.date) errors.date = "Tanggal wajib diisi";
    if (!formData.location) errors.location = "Tempat pembelian wajib diisi";
    if (!formData.nameBuyer) errors.nameBuyer = "Nama pembeli wajib diisi";
    if (!formData.image) errors.image = "Bukti pembayaran wajib diupload";
    if (items.length === 0) errors.items = "Minimal 1 item harus ditambahkan";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("date", formData.date);
      formDataToSend.append("place", formData.location);
      formDataToSend.append("officer", formData.nameBuyer);
      formDataToSend.append("store_id", storeId);
      formDataToSend.append("proof_of_payment", formData.image); // file

      // items harus dikirim sebagai JSON string karena form-data nggak support nested array
      formDataToSend.append("items", JSON.stringify(
        items.map(item => ({
          item_name: item.nama,
          unit: item.unit,
          unit_price: item.price,
          quantity: item.amount,
          sub_total: item.total
        }))
      ));

      console.log("Payload FormData:", formDataToSend);

      const response = await apiService.postData(`/storeowner/insert_stok_basah/`, formDataToSend);

      if (response.messagetype === "S") {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Stok basah berhasil ditambahkan!',
          timer: 2000,
          showConfirmButton: false
        });

        setItems([]);
        setFormData({
          date: "",
          location: "",
          nameBuyer: "",
          image: null,
        });
        setIsModalOpen(false);
      } else {
        Swal.fire('Error', response.message || 'Gagal menambahkan stok basah', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan saat menambahkan stok basah', 'error');
    }
  };

  const handleUpdateStokBasah = async () => {
    const errors = {};
    const storeId = localStorage.getItem('store_id');

    if (!formData.date) errors.date = "Tanggal wajib diisi";
    if (!formData.location) errors.location = "Tempat pembelian wajib diisi";
    if (!formData.nameBuyer) errors.nameBuyer = "Nama pembeli wajib diisi";
    if (items.length === 0) errors.items = "Minimal 1 item harus ditambahkan";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('stock_entry_id', selectedDetail.stock_entry.stock_entry_id);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('place', formData.location);
      formDataToSend.append('officer', formData.nameBuyer);
      formDataToSend.append('store_id', storeId);

      // items di-stringify jadi JSON
      formDataToSend.append('items', JSON.stringify(
        items.map(item => ({
          item_name: item.nama,
          unit: item.unit,
          unit_price: item.price,
          quantity: item.amount,
          sub_total: item.total
        }))
      ));

      // cek apakah user upload gambar baru
      if (formData.image && typeof formData.image !== 'string') {
        // file baru
        formDataToSend.append('proof_of_payment', formData.image);
      } else if (formData.image && typeof formData.image === 'string') {
        // URL lama
        formDataToSend.append('proof_of_payment_url', formData.image);
      }

      console.log("formDataToSend", formDataToSend);

      const response = await apiService.postData('/storeowner/update_stok_basah/', formDataToSend);

      if (response.messagetype === "S") {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Stok basah berhasil diupdate!',
          timer: 2000,
          showConfirmButton: false
        });

        setIsModalOpen(false);
        setIsEditing(false);
        setItems([]);
        setFormData({
          date: "",
          location: "",
          nameBuyer: "",
          image: null,
        });
      } else {
        Swal.fire('Error', response.message || 'Gagal update stok basah', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan saat update stok basah', 'error');
    }
  };

  const handleDeleteStokBasah = (id) => {
    Swal.fire({
      title: 'Yakin ingin menghapus data ini?',
      text: 'Data yang sudah dihapus tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        // Lakukan penghapusan data di sini
        setProducts((prevProducts) => prevProducts.filter((item) => item.id !== id));

        Swal.fire({
          title: 'Terhapus!',
          text: 'Data berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Modal Form Ke 2 (Tambah Items)
  const [formDataAddItem, setFormDataAddItem] = useState({
    nama: "",
    amount: "",
    price: "",
    unit: "",
    total: "",
  });

  const validateAddItemForm = () => {
    const errors = {};
    if (!formDataAddItem.nama) errors.nama = "Nama item wajib diisi";
    if (!formDataAddItem.amount) {
        errors.amount = "Jumlah wajib diisi";
      } else if (isNaN(formDataAddItem.amount)) {
        errors.amount = "Jumlah harus berupa angka";
      }

      if (!formDataAddItem.price) {
        errors.price = "Harga wajib diisi";
      } else if (isNaN(formDataAddItem.price)) {
        errors.price = "Harga harus berupa angka";
      }
    if (!formDataAddItem.unit) errors.unit = "Satuan wajib dipilih";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Data Dummy  Items (Di Modal Tambah Stok Basah)
  const [items, setItems] = useState([]);
  
  const handleDetailClick = async (item) => {
      try {
          const result = await apiService.getData(`/storeowner/detail_stok_basah/?stock_entry_id=${item.stock_entry_id}`);
          console.log('Detail stok:', result.data);
          
          setSelectedDetail(result.data);      // simpan data detail (yang berisi items)
          setIsDetailModalOpen(true);          // buka modal
      } catch (err) {
          console.error('Gagal ambil detail:', err);
      }
  };

  const handleEditClick = async (item) => {
    try {
      const result = await apiService.getData(`/storeowner/detail_stok_basah/?stock_entry_id=${item.stock_entry_id}`);
      const data = result.data?.stock_entry;
      console.log('Detail stok (edit):', data);

      if (data) {
        // simpan ke selectedDetail agar handleUpdateStokBasah bisa ambil id
        setSelectedDetail({ stock_entry: data });

        // panggil handleEditStokBasah buat isi form & buka modal
        handleEditStokBasah(data);
      }
    } catch (err) {
      console.error('Gagal ambil detail untuk edit:', err);
      Swal.fire('Error', 'Gagal mengambil detail stok', 'error');
    }
  };


  const handleEditStokBasah = (item) => {
    setIsEditing(true);
    setIsModalOpen(true);
    setFormErrors({});

    setFormData({
      date: item.date || '',
      location: item.place || '',
      nameBuyer: item.officer || '',
      image: item.proof_of_payment || null,     // URL lama
    });

    // Tampilkan nama file lama kalau ada
    if (item.proof_of_payment) {
      setPaymentProof({ name: item.proof_of_payment.split('/').pop() });
    } else {
      setPaymentProof(null);
    }

    // Isi ulang items
    setItems(
      (item.items || []).map(i => ({
        id: i.stock_item_id,
        nama: i.item_name,
        unit: i.unit,
        price: i.unit_price,
        amount: i.quantity,
        total: i.sub_total
      }))
    );
  };

  
  const filteredProducts = StokBasah.filter(item => {
    const matchCategory =
      selectedCategory === "All" || !selectedCategory
        ? true
        : item.category === selectedCategory;

    const matchSearch =
      searchTerm === ""
        ? true
        : item.nameBuyer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.totalPrice?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFormAddItem = () => {
    setFormDataAddItem({
      nama: "",
      amount: "",
      price: "",
      unit: "",
      total: "",
      category: "",
    });
    setIsModalOpenAddItem(false);
    setFormErrors({});
  };

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
                  placeholder="Cari berdasarkan nama pembeli belanja"
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
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <button
                      className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsFilterOpen(false);
                      }}
                    >
                      Semua
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory("Bahan Baku");
                        setIsFilterOpen(false);
                      }}
                    >
                      Bahan Baku
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory("Peralatan");
                        setIsFilterOpen(false);
                      }}
                    >
                      Peralatan
                    </button>
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
                  {filteredProducts.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                          Tidak ada data yang sesuai
                      </div>
                  ) : (
                      <table className="min-w-[900px] w-full shadow-lg">
                          <thead className="text-black text-xs md:text-[10px] lg:text-[15px] border-y border-gray-500">
                              <tr>
                                  {['NO', 'NAMA PEMBELI', 'TANGGAL', 'JUMLAH ITEM', 'TOTAL BELANJA', 'AKSI'].map((header, index) => (
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
                                <tr key={index} className="...">
                                  {[
                                    index + 1 + (currentPage - 1) * itemsPerPage,
                                    item.nameBuyer,
                                    item.date,
                                    item.amount,
                                    item.totalPrice
                                  ].map((value, idx) => (
                                    <td key={idx} className="py-3 px-4 relative">
                                      {value}
                                      {idx !== 4 && ( // hanya tambahkan garis kalau bukan kolom terakhir
                                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                      )}
                                    </td>
                                  ))}
                                  <td className="py-3 px-4 relative">
                                    <button onClick={() => handleDetailClick(item)} className="text-black px-3 cursor-pointer">
                                      <Eye />
                                    </button>
                                    <button onClick={() => handleEditClick(item)} className="text-black cursor-pointer">
                                      <Edit />
                                    </button>
                                    <button onClick={() => handleDeleteStokBasah(item.stock_entry_id)} className="text-black px-3 cursor-pointer">
                                      <Trash2 />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  )}
              </div>

              {/* Pagenation */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600 p-2">
                  <span>Menampilkan {currentPage * itemsPerPage - itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} entri</span>
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
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto shadow-lg">
                
                {/* Header */}
                <div className="bg-[#FFF5EB] px-6 py-4 rounded-t-xl flex justify-between items-center">
                  <h2 className="text-black text-lg font-semibold">
                    {isEditing ? 'EDIT STOK BASAH' : 'TAMBAH STOK BASAH'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="cursor-pointer text-black text-xl">
                    <X />
                  </button>
                </div>

                {/* Form Section */}
                <div className="p-6 space-y-6">
                  {/* Form Data Stok Basah */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Tanggal Belanja</label>
                      <input type="date" className="border border-gray-300 rounded-md px-4 py-2 text-black w-full" value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                      {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Tempat Pembelian</label>
                      <input type="text" className="border border-gray-300 rounded-md px-4 py-2 text-black w-full" value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder='Masukkan Lokasi Belanja Disini'
                      />
                      {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Nama Pembelian</label>
                      <input type="text" className="border border-gray-300 rounded-md px-4 py-2 text-black w-full" value={formData.nameBuyer || ''}
                        onChange={(e) => setFormData({ ...formData, nameBuyer: e.target.value })} placeholder='Masukkan Nama Pembeli Disini'
                      />
                      {formErrors.nameBuyer && <p className="text-red-500 text-xs mt-1">{formErrors.nameBuyer}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">
                        Upload Bukti Pembayaran
                      </label>
                      <label className="cursor-pointer text-gray-500 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 w-full">
                        <span className="truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                          {paymentProof ? paymentProof.name : "Upload File"}
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
                  </div>

                  {/* Tabel Item Belanja */}
                  <div>
                    {/* Tombol Tambah Data */}
                    <div className="flex justify-between mb-4">
                      <h3 className="text-base font-semibold text-black mb-3">List Item Belanja</h3>

                      <button
                        type="button"
                        onClick={() => setIsModalOpenAddItem(true)}
                        className="bg-[#F6B543] hover:bg-[#e2a530] text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                      >
                        + Tambah Data
                      </button>
                    </div>

                    {/* Tabel */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-separate border-spacing-y-2 text-sm text-black">
                        <thead className="text-left border-b">
                          <tr>
                            <th className="px-4 py-2 font-medium">NO</th>
                            <th className="px-4 py-2 font-medium">NAMA ITEM</th>
                            <th className="px-4 py-2 font-medium">JUMLAH</th>
                            <th className="px-4 py-2 font-medium">SATUAN</th>
                            <th className="px-4 py-2 font-medium">HARGA/ITEM</th>
                            <th className="px-4 py-2 font-medium">TOTAL BELANJA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">{item.nama}</td>
                              <td className="px-4 py-2">{item.amount}</td>
                              <td className="px-4 py-2">{item.unit}</td>
                              <td className="px-4 py-2">RP {item.price}</td>
                              <td className="px-4 py-2">RP {item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Modal Add List Item */}
                    {isModalOpenAddItem && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                        <div className="bg-white w-[400px] rounded-lg overflow-hidden shadow-lg">
                          <div className="bg-[#FFF2E1] text-black text-center py-4 text-lg font-semibold">
                            TAMBAH ITEM
                          </div>
                          <div className="p-6 space-y-4">
                            <div>
                              <label className="text-black text-sm font-medium">NAMA ITEM</label>
                              <input
                                type="text"
                                placeholder="Masukkan Nama Belanja"
                                className="w-full border text-gray-500 border-gray-500 px-3 py-2 rounded-md"
                                value={formDataAddItem.nama}
                                onChange={(e) => setFormDataAddItem({ ...formDataAddItem, nama: e.target.value })}
                              />
                              {formErrors.nama && <p className="text-red-500 text-sm mt-1">{formErrors.nama}</p>}
                            </div>
                            <div>
                              <label className="text-black text-sm font-medium">JUMLAH</label>
                              <input
                                type="number"
                                placeholder="Masukkan Jumlah Yang Dibeli"
                                className="w-full border text-gray-500 border-gray-500 px-3 py-2 rounded-md"
                                value={formDataAddItem.amount}
                                onChange={(e) => {
                                  const amount = e.target.value;
                                  const total = formDataAddItem.price * amount;
                                  setFormDataAddItem({ ...formDataAddItem, amount, total });
                                }}
                              />
                              {formErrors.amount && <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>}
                            </div>
                            <div>
                              <label className="text-black text-sm font-medium">HARGA/ITEM</label>
                              <input
                                type="number"
                                placeholder="Masukkan Harga per Itemnya"
                                className="w-full border text-gray-500 border-gray-500 px-3 py-2 rounded-md"
                                value={formDataAddItem.price}
                                onChange={(e) => {
                                  const price = e.target.value;
                                  const total = formDataAddItem.amount * price;
                                  setFormDataAddItem({ ...formDataAddItem, price, total });
                                }}
                              />
                              {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                            </div>
                            <div>
                              <label className="text-black text-sm font-medium">SATUAN</label>
                              <select
                                className="w-full border text-gray-500 border-gray-500 px-3 py-2 rounded-md"
                                value={formDataAddItem.unit}
                                onChange={(e) => setFormDataAddItem({ ...formDataAddItem, unit: e.target.value })}
                              >
                                <option value="">Pilih Salah Satu</option>
                                <option value="kg">Kg</option>
                                <option value="gram">Gram</option>
                                <option value="pcs">Pcs</option>
                              </select>
                              {formErrors.unit && <p className="text-red-500 text-sm mt-1">{formErrors.unit}</p>}
                            </div>
                            <div>
                              <label className="text-black text-sm font-medium">TOTAL</label>
                              <input
                                type="text"
                                value={`Rp ${formDataAddItem.total || 0}`}
                                readOnly
                                className="w-full border text-gray-500 border-gray-500 px-3 py-2 rounded-md bg-gray-100"
                              />
                              {formErrors.total && <p className="text-red-500 text-sm mt-1">{formErrors.total}</p>}
                            </div>
                            <div className="flex justify-between pt-4">
                              <button
                                onClick={() => {
                                  resetFormAddItem();
                                  setIsModalOpenAddItem(false);
                                }}
                                className="text-red-500 border border-red-500 px-4 py-2 rounded-md"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => {
                                  if (validateAddItemForm()) {
                                    console.log(formDataAddItem);
                                    toast.success('Item berhasil ditambahkan');
                                    setItems(prev => [...prev, {
                                      ...formDataAddItem,
                                      total: Number(formDataAddItem.amount) * Number(formDataAddItem.price)
                                    }]);
                                    setIsModalOpenAddItem(false);
                                    setFormDataAddItem({
                                      nama: "",
                                      amount: "",
                                      price: "",
                                      unit: "",
                                      category: "",
                                      total: "",
                                    });
                                    setFormErrors({});
                                  }
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                              >
                                Simpan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer Modal */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="border border-red-500 text-red-500 px-5 py-2 rounded-md font-medium hover:bg-red-100 cursor-pointer"
                    >
                      Tutup
                    </button>
                   <button
                    onClick={isEditing ? handleUpdateStokBasah : handleAddStokBasah}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Simpan
                  </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Detail Belanja */}
          {isDetailModalOpen && selectedDetail && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto shadow-lg">
                {/* Header */}
                <div className="bg-[#FFF5EB] px-6 py-4 rounded-t-xl flex justify-between items-center">
                  <h2 className="text-lg font-bold text-black uppercase">Detail Pembelian</h2>
                  <button onClick={() => setIsDetailModalOpen(false)} className="cursor-pointer text-black text-xl">
                    <X />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Tanggal Belanja</label>
                      <input type="date" className="border border-gray-300 rounded-md px-4 py-2 text-black w-full bg-gray-100" value={selectedDetail.stock_entry.date} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Tempat Pembelian</label>
                      <input type="text" className="border border-gray-300 rounded-md px-4 py-2 text-black w-full bg-gray-100" value={selectedDetail.stock_entry.place} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Nama Pembelian</label>
                      <input type="text" className="border border-gray-300 rounded-md px-4 py-2 text-black w-full bg-gray-100" value={selectedDetail.stock_entry.officer} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Bukti Pembayaran</label>
                      <img
                        src={`http://localhost:8000${selectedDetail.stock_entry.proof_of_payment}`}
                        alt="Bukti Transaksi"
                        className="w-32 h-32 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                        onClick={() => {
                          setPreviewImage(`http://localhost:8000${selectedDetail.stock_entry.proof_of_payment}`);
                          setIsImageModalOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* Tabel Item Belanja */}
                  <div>
                    <h3 className="text-base font-semibold text-black mb-3">List Item Belanja</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-separate border-spacing-y-2 text-sm text-black">
                        <thead className="text-left border-b">
                          <tr>
                            <th className="px-4 py-2 font-medium">NO</th>
                            <th className="px-4 py-2 font-medium">NAMA ITEM</th>
                            <th className="px-4 py-2 font-medium">JUMLAH</th>
                            <th className="px-4 py-2 font-medium">SATUAN</th>
                            <th className="px-4 py-2 font-medium">HARGA/ITEM</th>
                            <th className="px-4 py-2 font-medium">TOTAL BELANJA</th>
                            <th className="px-4 py-2 font-medium">KATEGORI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDetail.stock_entry.items?.map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">{item.item_name}</td>
                              <td className="px-4 py-2">{item.quantity}</td>
                              <td className="px-4 py-2">{item.unit}</td>
                              <td className="px-4 py-2">Rp {item.unit_price}</td>
                              <td className="px-4 py-2">Rp {item.sub_total}</td>
                              <td className="px-4 py-2"> {item.kategori} </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="border border-red-500 text-red-500 px-5 py-2 rounded-md font-medium hover:bg-red-100 cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Preview Image */}
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
        </div>
      </div>
    </div>
)};

export default withAuth(StokBasah,['2']);