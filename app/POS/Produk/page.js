'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Search, Filter, Plus, MoreVertical, Package, Utensils, Beer, X, UploadCloud } from 'lucide-react';
import Swal from 'sweetalert2';

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
  const dropdownRef = useRef(null);

  const handleStatCardClick = (category) => {
    setSelectedCategory(category);
  };
  
  const [formData, setFormData] = useState({
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

  const [isEditing, setIsEditing] = useState(false);

  const [products, setProducts] = useState([
    { id: "P001", category: "Makanan", name: "TEMPE MENDOAN", stock: 0, hargaModal: 3000, deskripsi: "Makanan Lezat", price: 7000, image: "/kopi-susu.png", active: true },
    { id: "P002", category: "Makanan", name: "SATE KAMBING", stock: 10, hargaModal: 3000, deskripsi: "Makanan Lezat", price: 7000, image: "/sate-kambing.png", active: true },
    { id: "P003", category: "Makanan", name: "TELUR PUYUH", stock: 40, hargaModal: 3000, deskripsi: "Makanan Lezat", price: 7000, image: "/telur-puyuh.png", active: true },
    { id: "P004", category: "Minuman", name: "ES TEH", stock: 40, hargaModal: 3000, deskripsi: "Makanan Lezat", price: 7000, image: "/es-teh.png", active: true },
    { id: "P005", category: "Minuman", name: "KOPI SUSU", stock: 40, hargaModal: 3000, deskripsi: "Makanan Lezat", price: 7000, image: "/kopi-susu.png", active: false },
    { id: "M002", category: "Minuman", name: "TEH TARIK", stock: 10, hargaModal: 3000, deskripsi: "Makanan Lezat", price: 7000, image: "/teh-tarik.png", active: true },
  ]);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.kodeProduk) {
      formErrors.kodeProduk = 'Kode Produk tidak boleh kosong';
      isValid = false;
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      Swal.fire({
        icon: 'success',
        title: isEditing ? 'Berhasil Diubah!' : 'Berhasil Ditambahkan!',
        text: 'Data produk berhasil disimpan!',
        confirmButtonColor: '#F6B543',
      });
      setIsModalOpen(false); // Tutup modal setelah submit
      resetForm(); // Reset form setelah submit
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const openModalForAdd = () => {
    setIsEditing(false);
    resetForm(); // Reset form ketika modal tambah produk dibuka
    setIsModalOpen(true);
  };

  const toggleActive = (id) => {
    setProducts(products.map((product) =>
      product.id === id ? { ...product, active: !product.active } : product
    ));
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
            <StatCard title="Total Produk" value="100" icon={Package} onClick={() => handleStatCardClick(null)} />
            <StatCard title="Total Makanan" value="50" icon={Utensils} onClick={() => handleStatCardClick("Makanan")} />
            <StatCard title="Total Minuman" value="50" icon={Beer} onClick={() => handleStatCardClick("Minuman")} />
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
                        checked={product.active}
                        onChange={() => toggleActive(product.id)}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>

                    {/* Icon titik tiga */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === product.id ? null : product.id)
                        }
                        className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {activeDropdown === product.id && (
                        <div className="absolute right-0 z-10 mt-2 w-28 bg-white border rounded-md shadow-lg text-sm">
                          <button
                            className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                            onClick={() => {
                              setActiveDropdown(null);
                              setFormData({
                                kodeProduk: product.id,
                                stok: product.stock,
                                namaProduk: product.name,
                                tipeProduk: product.category,
                                keterangan: product.keterangan,
                                hargaModal: product.hargaModal,
                                hargaJual: product.price,
                                deskripsi: product.deskripsi,
                                image: product.image,
                              });
                              setIsEditing(true);
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setActiveDropdown(null);
                              Swal.fire({
                                title: 'Yakin ingin menghapus?',
                                text: `Produk ${product.name} akan dihapus!`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#aaa',
                                confirmButtonText: 'Ya, hapus!',
                                cancelButtonText: 'Batal',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  setProducts(products.filter((p) => p.id !== product.id));
                                  Swal.fire({
                                    icon: 'success',
                                    title: 'Terhapus!',
                                    text: 'Produk berhasil dihapus.',
                                    confirmButtonColor: '#F6B543',
                                  });
                                }
                              });
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center mt-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-40 h-28 object-cover rounded"
                    />
                  </div>

                  <div className="px-3 pt-2 text-xs text-gray-500">#{product.id}</div>
                  <div className="px-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">{product.name}</span>
                    <span className="text-xs text-gray-500">Stok: {product.stock}</span>
                  </div>

                  <div className="px-3 pb-3 text-right text-sm font-semibold text-gray-800">
                    RP {product.price.toLocaleString('id-ID')},00
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
                  <h2 className="text-2xl font-bold text-black">  {isEditing ? 'Edit Produk' : 'Tambah Produk'}</h2>
                  <button
                    className="text-gray-500 hover:text-black"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X />
                  </button>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bagian kiri: form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
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
                        <option>Aktif</option>
                        <option>Tidak Aktif</option>
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

export default Produk;

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
