'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Search, Filter, Plus, MoreVertical, Package, Utensils, Beer, X, UploadCloud } from 'lucide-react';
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
    hargaModal: '',
    hargaJual: '',
    deskripsi: '',
    image: null,
    keterangan: true, // ✅ default boolean
  });

  const fetchProducts = async () => {
    try {
      const storeId = localStorage.getItem('store_id');
      const response = await apiService.getData(`/storeowner/daftar_produk/?store_id=${storeId}`);
      setProducts(response.data); // Sesuaikan dengan format API kamu
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

  useEffect(() => {
    fetchProducts();
    fetchDashboardProducts();
  }, []);

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
    return matchSearch && matchCategory;
  });
  
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
    if (!validateForm()) return;
  
    console.log("isEditing", isEditing);
  
    const storeId = localStorage.getItem('store_id');
    const formPayload = new FormData();
  
    // Menambahkan nilai produk ke dalam FormData
    formPayload.append('store_id', storeId);
    formPayload.append('product_code', formData.kodeProduk);
    formPayload.append('stock', formData.stok);
    formPayload.append('product_name', formData.namaProduk);
    formPayload.append('product_type', formData.tipeProduk);
    formPayload.append('description', formData.deskripsi);
    formPayload.append('capital_price', formData.hargaModal);
    formPayload.append('selling_price', formData.hargaJual);
    formPayload.append('is_active', String(formData.keterangan === 'true'));
  
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
  
      const statusString = updatedStatus ? 'true' : 'false';
  
      await apiService.putData(`/storeowner/update_status/?product_id=${id}&is_active=${statusString}`);
  
      setProducts(prev =>
        prev.map(p => (p.product_id === id ? { ...p, is_active: updatedStatus } : p))
      );
  
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
                        setSelectedCategory("Makanan");
                        setIsFilterOpen(false);
                      }}
                    >
                      Makanan
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory("Minuman");
                        setIsFilterOpen(false);
                      }}
                    >
                      Minuman
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
                  key={product.id}
                  className="w-full max-w-xs mx-auto rounded-lg border shadow-sm overflow-hidden bg-white flex flex-col"
                >
                  <div className="flex justify-end pt-2">
                    {product.stock === 0 && (
                      <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-[2px] pl-5 rounded-bl-xl relative">
                        STOK HABIS
                      </div>
                    )}
                    {product.stock > 0 && product.stock <= 10 && (
                      <div className="bg-yellow-500 text-white text-[10px] font-bold px-3 py-[2px] pl-5 rounded-bl-xl relative">
                        STOK TIPIS
                      </div>
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
                        <div className="absolute right-0 z-10 mt-2 w-28 bg-white border rounded-md shadow-lg text-sm">
                          <button
                            className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                            onClick={() => {
                              setFormData({
                                kodeProduk: product.product_code,
                                stok: product.stock,
                                namaProduk: product.product_name,
                                tipeProduk: product.product_type,
                                keterangan: product.is_active,
                                hargaModal: product.capital_price,
                                hargaJual: product.selling_price,
                                deskripsi: product.description,
                                image: product.product_picture,
                                productId: product.product_id,
                              });
                              setPreviewImage(`http://localhost:8000${product.product_picture}`);
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
                      src={`http://localhost:8000${product.product_picture}`}
                      alt={product.product_name}
                      className="w-40 h-28 object-cover rounded"
                    />
                  </div>

                  <div className="px-3 pt-2 text-xs text-gray-500">#{product.product_code}</div>
                  <div className="px-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">{product.product_name}</span>
                    <span className="text-xs text-gray-500">Stok: {product.stock}</span>
                  </div>

                  <div className="px-3 pb-3 text-right text-sm font-semibold text-gray-800">
                    RP {product.selling_price.toLocaleString('id-ID')},00
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
                  <h2 className="text-2xl font-bold text-black">Tambah Produk</h2>
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
                      <div>
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
