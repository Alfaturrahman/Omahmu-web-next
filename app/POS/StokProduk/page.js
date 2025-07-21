'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Search, Filter, Minus, Plus, MoreVertical, Package, Utensils, Beer, X, UploadCloud } from 'lucide-react';
import Swal from 'sweetalert2';
import * as apiService from 'services/authService';
import withAuth from 'hoc/withAuth';

const Produk = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTipe, setSelectedTipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [products, setProducts] = useState([]);
  const [dashboardProducts, setDashboardProducts] = useState({
    total: 0,
    makanan: 0,
    minuman: 0,
  });
  const [isEditing, setIsEditing] = useState(false);  const dropdownRef = useRef(null);

  const handleStatCardClick = (category) => {
    setSelectedCategory(category);
  };
  
  const [formData, setFormData] = useState({
    kodeProduk: '',
    stok: '',
    namaProduk: '',
    tipeProduk: '',
    tipeJualan: '',
    keterangan: '',
    hargaJual: '',
    deskripsi: '',
    image: null,
    keterangan: true, // ✅ default boolean
  });

  const fetchProducts = async () => {
    try {
      const storeId = localStorage.getItem('store_id');
      
      // 1️⃣ Panggil API check_product_stock (biar backend update status & kirim notif)
      await apiService.getData(`/storeowner/check_product_stock?store_id=${storeId}`);
      
      // 2️⃣ Baru fetch list produk terbaru
      const response = await apiService.getData(`/storeowner/daftar_produk/?store_id=${storeId}`);
      console.log("wew", response.data);
      
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  };
  
  const fetchDashboardProducts = async () => {
    try {
      const storeId = localStorage.getItem('store_id');
      const response = await apiService.getData(`/storeowner/summary_produk/?store_id=${storeId}`);
      setDashboardProducts({
        total: response.data[0].total_product,
        makanan: response.data[0].total_makanan,
        minuman: response.data[0].total_minuman,
      });
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  };

  const disableProductsWithZeroStock = async (productList) => {
    try {
      for (const product of productList) {
        if (product.stock === 0 && product.is_active) {
          await apiService.putData(`/storeowner/update_status/?product_id=${product.product_id}&is_active=false`);
        }
      }
    } catch (error) {
      console.error('Gagal nonaktifkan produk dengan stok habis:', error.message);
    }
  };

  useEffect(() => {
    const storeId = localStorage.getItem('store_id');

    const loadData = async () => {
      try {
        await apiService.getData(`/storeowner/check_product_stock/?store_id=${storeId}`);
        const response = await apiService.getData(`/storeowner/daftar_produk/?store_id=${storeId}`);
        console.log("wew", response.data);
        setProducts(response.data);
        await disableProductsWithZeroStock(response.data);
        await fetchDashboardProducts();
      } catch (error) {
        console.error("Gagal load data:", error);
      }
    };

    // Jalankan pertama kali
    loadData();

    // Jalankan ulang setiap 1 menit
    const interval = setInterval(() => {
      loadData();
    }, 60000); // 60.000 ms = 60 detik

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, []);

   const updateStock = async (productId, newStock) => {
    try {
      await apiService.putData(`/storeowner/update_stock/?product_id=${productId}&new_stock=${newStock}`);
      setProducts(prev =>
        prev.map(p => p.product_id === productId ? { ...p, stock: newStock } : p)
      );
    } catch (error) {
      console.error("Gagal update stok:", error.message);
    }
  };


  const handleDelete = async (product) => {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: `Produk ${product.product_name} akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.deleteData(`/storeowner/delete_produk/${product.product_id}/`);
  
          setProducts((prev) => prev.filter((p) => p.product_id !== product.product_id));
  
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Produk berhasil dihapus.',
            confirmButtonColor: '#F6B543',
          });
        } catch (error) {
          console.error("Gagal menghapus produk:", error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menghapus produk.',
            confirmButtonColor: '#F6B543',
          });
        }
      }
    });
  
    setActiveDropdown(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? product.product_type === selectedCategory : true;
    const matchTipe = selectedTipe ? product.selling_type === selectedTipe : true;
    return matchSearch && matchCategory && matchTipe;
  });
  
  const handleStockChange = (id, newStock) => {
    const parsedStock = parseInt(newStock, 10);
      if (!isNaN(parsedStock) && parsedStock >= 0) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? { ...product, stock: parsedStock } : product
          )
      );
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.stok) {
      formErrors.stok = 'Stok tidak boleh kosong';
      isValid = false;
    }
    if (!formData.namaProduk) {
      formErrors.namaProduk = 'Nama Produk tidak boleh kosong';
      isValid = false;
    }
    if (!formData.tipeProduk) {
      formErrors.tipeProduk = 'Tipe Produk harus dipilih';
      isValid = false;
    }
    
    if (!formData.tipeJualan) {
      formErrors.tipeJualan = 'Tipe Jualan harus dipilih';
      isValid = false;
    }
    if (!formData.keterangan) {
      formErrors.keterangan = 'Keterangan harus dipilih';
      isValid = false;
    }
    if (!formData.hargaModal) {
      formErrors.hargaModal = 'Harga Modal tidak boleh kosong';
      isValid = false;
    }
    if (!formData.hargaJual) {
      formErrors.hargaJual = 'Harga Jual tidak boleh kosong';
      isValid = false;
    }
    if (!formData.deskripsi) {
      formErrors.deskripsi = 'Deskripsi tidak boleh kosong';
      isValid = false;
    }
    if (!formData.image) {
      formErrors.image = 'Gambar produk harus diupload';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;
  
    console.log("isEditing", isEditing);
  
    const storeId = localStorage.getItem('store_id');
    const formPayload = new FormData();
  
    // Menambahkan nilai produk ke dalam FormData
    formPayload.append('store_id', storeId);
    formPayload.append('product_code', formData.kodeProduk);
    formPayload.append('stock', formData.stok);
    formPayload.append('product_name', formData.namaProduk);
    formPayload.append('product_type', formData.tipeProduk);
    formPayload.append('selling_type', formData.tipeJualan); 
    formPayload.append('description', formData.deskripsi);
    formPayload.append('capital_price', "0");
    formPayload.append('selling_price', formData.hargaJual);
    console.log("Keterangan sebelum dikirim:", formData.keterangan);
    formPayload.append('is_active', formData.keterangan); // Mengirim string 'true' atau 'false'

    console.log("Form data before sending:", formData);

    // Jika gambar baru dipilih, tambahkan gambar ke dalam FormData
    if (formData.image instanceof File) {
      formPayload.append('product_picture', formData.image);
      console.log("Gambar berhasil ditambahkan:", formData.image);
    } else {
      // Jika tidak ada gambar baru yang dipilih, tambahkan log
      console.log("Tidak ada gambar yang dipilih, gambar lama tetap digunakan");
    }
  
    // Cek data di FormData sebelum dikirim
    for (let pair of formPayload.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      if (isEditing) {
        // Edit produk
        await apiService.putData(`/storeowner/update_produk/${formData.productId}/`, formPayload);
      } else {
        // Tambah produk
        await apiService.postData('/storeowner/insert_produk/', formPayload);
      }
  
      Swal.fire({
        icon: 'success',
        title: isEditing ? 'Berhasil Diubah!' : 'Berhasil Ditambahkan!',
        text: 'Data produk berhasil disimpan!',
        confirmButtonColor: '#F6B543',
      });
  
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
      fetchDashboardProducts();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data.',
        confirmButtonColor: '#F6B543',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      kodeProduk: '',
      stok: '',
      namaProduk: '',
      tipeProduk: '',
      keterangan: '',
      hargaModal: '',
      hargaJual: '',
      deskripsi: '',
      image: null,
    });
    setErrors({});
    setPreviewImage(null);
    setIsEditing(false); // Reset status edit
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file }); // simpan file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, image: null });
      setPreviewImage(null);
    }
  };
  

  const openModalForEdit = (product) => {
    setIsEditing(true);
    setFormData({
      kodeProduk: product.id,
      stok: product.stock,
      namaProduk: product.name,
      tipeProduk: product.category,
      keterangan: product.active ? 'Aktif' : 'Tidak Aktif',
      hargaModal: product.hargaModal,
      hargaJual: product.price,
      deskripsi: product.deskripsi,
      image: product.image,
    });
    setPreviewImage(product.image);
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setIsEditing(false);
    resetForm(); // Reset form ketika modal tambah produk dibuka
    setIsModalOpen(true);
  };

  const toggleActive = async (id) => {
    try {
      const product = products.find(p => p.product_id === id);
      if (!product) return;

      const updatedStatus = !product.is_active; // false -> true, true -> false

      // Cek stok
      if (updatedStatus && product.stock === 0) {
        // Artinya user mau aktifkan produk, tapi stoknya 0
        Swal.fire({
          icon: "warning",
          title: "Tidak bisa aktifkan produk",
          text: "Stok produk ini habis. Silakan tambah stok terlebih dahulu.",
          confirmButtonColor: "#ECA641"
        });
        return;
      }

      const statusString = updatedStatus ? 'true' : 'false';

      await apiService.putData(`/storeowner/update_status/?product_id=${id}&is_active=${statusString}`);

      // Update state lokal
      setProducts(prev =>
        prev.map(p => (p.product_id === id ? { ...p, is_active: updatedStatus } : p))
      );

      // Refresh data dari server
      fetchDashboardProducts();
      fetchProducts();
    } catch (error) {
      console.error('Gagal update status:', error.message);
    }
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
      // Tutup filter jika klik di luar elemen dengan class tertentu
      if (!event.target.closest('.dropdown-wrapper')) {
        setIsFilterOpen(false);
      }
  
      // Tutup dropdown jika klik di luar elemen dropdownRef
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
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

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
          {/* Statistik Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Produk"
              value={dashboardProducts.total}
              icon={Package}
              onClick={() => handleStatCardClick(null)}
            />
            <StatCard
              title="Total Makanan"
              value={dashboardProducts.makanan}
              icon={Utensils}
              onClick={() => handleStatCardClick("Makanan")}
            />
            <StatCard
              title="Total Minuman"
              value={dashboardProducts.minuman}
              icon={Beer}
              onClick={() => handleStatCardClick("Minuman")}
            />
          </div>


          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80">
                <Search className="text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama produk"
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
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-300 rounded-xl shadow-xl z-10 overflow-hidden text-sm">
                    {/* Kategori */}
                    <div className="px-4 py-2 border-b text-gray-500 font-semibold text-xs tracking-wide">
                      KATEGORI
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedTipe(null);
                        setIsFilterOpen(false);
                      }}
                    >
                      Semua
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setSelectedCategory("Makanan");
                        setIsFilterOpen(false);
                      }}
                    >
                      Makanan
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setSelectedCategory("Minuman");
                        setIsFilterOpen(false);
                      }}
                    >
                      Minuman
                    </button>

                    {/* Divider */}
                    <div className="px-4 py-2 border-b mt-1 text-gray-500 font-semibold text-xs tracking-wide">
                      TIPE JUALAN
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setSelectedTipe("Permanen");
                        setIsFilterOpen(false);
                      }}
                    >
                      Permanen
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setSelectedTipe("Harian");
                        setIsFilterOpen(false);
                      }}
                    >
                      Harian
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

          {/* Produk Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-4 text-center text-lg text-gray-500">
                Tidak ada data yang sesuai
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="w-full max-w-xs mx-auto rounded-lg border shadow-sm overflow-hidden bg-white flex flex-col h-[290px]"
                >
                  {/* Label stok */}
                  <div className="flex justify-end pt-2 h-7"> {/* ⬅️ Tetapkan tinggi tetap */}
                    {product.stock === 0 ? (
                      <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-[2px] pl-5 rounded-bl-xl relative">
                        STOK HABIS
                      </div>
                    ) : product.stock > 0 && product.stock <= 10 ? (
                      <div className="bg-yellow-500 text-white text-[10px] font-bold px-3 py-[2px] pl-5 rounded-bl-xl relative">
                        STOK TIPIS
                      </div>
                    ) : (
                      // Dummy label tak terlihat untuk menjaga tinggi tetap
                      <div className="invisible text-[10px] font-bold px-3 py-[2px] pl-5">.</div>
                    )}
                  </div>

                  {/* Header: Toggle & More icon */}
                  <div className="flex items-center justify-between px-3 pt-1 relative">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.is_active}
                        onChange={() => toggleActive(product.product_id)}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>

                    {/* Icon titik tiga */}
                    <div className="relative dropdown-wrapper" ref={dropdownRef}>
                    <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === product.product_id ? null : product.product_id) // Ganti `product.id` ke `product.product_id`
                        }
                        className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {activeDropdown === product.product_id && ( // Periksa dengan `product.product_id` yang benar
                        <div ref={dropdownRef} // Hubungkan dropdown dengan ref
                        className="absolute right-0 z-10 mt-2 w-28 bg-white border rounded-md shadow-lg text-sm">
                          <button
                            className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                            onClick={() => {

                              setFormData({
                                kodeProduk: product.product_code,
                                stok: product.stock,
                                namaProduk: product.product_name,
                                tipeProduk: product.product_type,
                                tipeJualan: product.selling_type,
                                keterangan: product.is_active,
                                hargaModal: product.capital_price,
                                hargaJual: product.selling_price,
                                deskripsi: product.description,
                                image: product.product_picture,
                                productId: product.product_id,
                              });
                              if (product.product_picture) {
                                setPreviewImage(`https://posvanapi-production.up.railway.app${product.product_picture}`);
                              } else {
                                setPreviewImage(null); // Atau gambar default
                              }
                              setIsEditing(true);
                              setIsModalOpen(true);
                              setTimeout(() => setActiveDropdown(null), 100); // ⬅️ Tambahkan delay di sini
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(product)}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center mt-2">
                    <img
                      src={`https://posvanapi-production.up.railway.app${product.product_picture}`}
                      alt={product.product_name}
                      className="w-40 h-28 object-cover rounded"
                    />
                  </div>

                  <div className="px-3 pt-2 text-xs text-gray-500">#{product.product_code}</div>
                  <div className="flex justify-between items-center px-3 pt-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {product.product_name}
                    </span>
                    {product.selling_type === 'Harian' && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">
                        Harian
                      </span>
                    )}
                    {product.selling_type === 'Permanen' && (
                      <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full">
                        Permanen
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-3 flex justify-between items-center text-sm font-semibold text-gray-800 whitespace-nowrap overflow-hidden">
                  <div className="truncate">
                  Rp {Number(product.selling_price).toLocaleString('id-ID')}
                  </div>
                    <div className="flex items-center gap-x-2 flex-nowrap">
                        {/* Tombol Minus */}
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const newStock = Math.max(product.stock - 1, 0); // pastikan ga negatif
                            updateStock(product.product_id, newStock);
                          }}
                          disabled={product.stock <= 0}
                          className={`cursor-pointer rounded-lg w-6 h-6 flex items-center justify-center text-xs transition
                            ${product.stock > 0 
                              ? "bg-[#ECA641] text-white" 
                              : "bg-white text-[#ECA641] border border-[#CAC4D0]"}`}
                        >
                          −
                        </button>

                        {/* Input Angka */}
                        <div className="flex items-center flex-nowrap">
                          <span className='text-xs text-gray-500 w-10 text-center'>Stok : </span>
                          <input
                            type="number"
                            min="0"
                            value={product.stock}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value >= 0) {
                                updateStock(product.product_id, value);
                              }
                            }}
                            className="w-12 text-center text-xs text-gray-700 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#ECA641] no-spinner"
                          />
                        </div>

                        {/* Tombol Plus */}
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const newStock = product.stock + 1;
                            updateStock(product.product_id, newStock);
                          }}
                          className="cursor-pointer bg-[#ECA641] text-white rounded-lg w-6 h-6 flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* MODAL Tambah Data */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 sm:p-8 w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-black">{isEditing ? 'Edit Produk' : 'Tambah Produk'}</h2>
                  <button
                    className="text-gray-500 hover:text-black"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X />
                  </button>
                </div>

                <form encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bagian kiri: form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="hidden">
                        <label className="block text-sm font-medium text-black">Kode Produk</label>
                        <input
                          type="text"
                          placeholder="Masukkan Kode Produk (#MK001)"
                          className={`w-full text-black border ${errors.kodeProduk ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2`}
                          value={formData.kodeProduk}
                          onChange={(e) => setFormData({ ...formData, kodeProduk: e.target.value })}
                        />
                        {errors.kodeProduk && <p className="text-red-500 text-sm">{errors.kodeProduk}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black">Stok</label>
                        <input
                          type="number"
                          placeholder="Masukkan Stok Produk"
                          className={`w-full border ${errors.stok ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                          value={formData.stok}
                          onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                        />
                        {errors.stok && <p className="text-red-500 text-sm">{errors.stok}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black">Nama Produk</label>
                      <input
                        type="text"
                        placeholder="Masukkan Nama Produk"
                        className={`w-full border ${errors.namaProduk ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                        value={formData.namaProduk}
                        onChange={(e) => setFormData({ ...formData, namaProduk: e.target.value })}
                      />
                      {errors.namaProduk && <p className="text-red-500 text-sm">{errors.namaProduk}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black">Tipe Produk</label>
                        <select
                          className={`w-full border ${errors.tipeProduk ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                          value={formData.tipeProduk}
                          onChange={(e) => setFormData({ ...formData, tipeProduk: e.target.value })}
                        >
                          <option>Pilih Salah Satu</option>
                          <option>Makanan</option>
                          <option>Minuman</option>
                        </select>
                        {errors.tipeProduk && <p className="text-red-500 text-sm">{errors.tipeProduk}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black">Tipe Jualan</label>
                        <select
                          className={`w-full border ${errors.tipeJualan ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                          value={formData.tipeJualan}
                          onChange={(e) => setFormData({ ...formData, tipeJualan: e.target.value })}
                        >
                          <option>Pilih Salah Satu</option>
                          <option>Harian</option>
                          <option>Permanen</option>
                        </select>
                        {errors.tipeJualan && <p className="text-red-500 text-sm">{errors.tipeJualan}</p>}
                      </div>
                    </div>
                    

                    <div>
                      <label className="block text-sm font-medium text-black">Keterangan</label>
                      <select
                        className={`w-full border ${errors.keterangan ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                        value={formData.keterangan}
                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                      >
                        <option>Pilih Salah Satu</option>
                        <option value="true">Aktif</option>
                        <option value="false">Tidak Aktif</option>
                      </select>
                      {errors.keterangan && <p className="text-red-500 text-sm">{errors.keterangan}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="hidden">
                        <label className="block text-sm font-medium text-black">Harga Modal</label>
                        <input
                          type="text"
                          placeholder="Masukkan Harga Modal"
                          className={`w-full border ${errors.hargaModal ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                          value={formData.hargaModal}
                          onChange={(e) => setFormData({ ...formData, hargaModal: e.target.value })}
                        />
                        {errors.hargaModal && <p className="text-red-500 text-sm">{errors.hargaModal}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black">Harga Jual</label>
                        <input
                          type="text"
                          placeholder="Masukkan Harga Jual"
                          className={`w-full border ${errors.hargaJual ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                          value={formData.hargaJual}
                          onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                        />
                        {errors.hargaJual && <p className="text-red-500 text-sm">{errors.hargaJual}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Bagian kanan: gambar & deskripsi */}
                  <div className="space-y-4">
                    <label className="block w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer relative overflow-hidden hover:border-blue-400 transition">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview Produk"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                          <UploadCloud className="w-8 h-8 mb-2" />
                          <span className="text-sm">Klik untuk upload gambar</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </label>

                    <textarea
                      placeholder="Deskripsi produk"
                      className={`w-full border ${errors.deskripsi ? 'border-red-500' : 'border-gray-300'} text-black rounded-md px-4 py-2`}
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    ></textarea>
                    {errors.deskripsi && <p className="text-red-500 text-sm">{errors.deskripsi}</p>}
                  </div>

                  {/* Tombol Simpan */}
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-[#F6B543] text-white font-medium hover:bg-[#e2a530]"
                    >
                      {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
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

export default withAuth(Produk,['2']);

function StatCard({ icon: Icon = Package, title, value, onClick }) {
  return (
    <div className="bg-[#FFF4E8] text-black px-6 py-4 rounded-xl shadow flex items-center gap-4 h-[100px] cursor-pointer" onClick={onClick}>
      <div className="bg-[#F6B543] p-3 rounded-lg">
        <Icon size={28} className="text-white" />
      </div>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
