'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import React, { useState } from 'react';
import {
  Search, Filter, Plus, MoreVertical, Package, Utensils, Beer, X, UploadCloud 
} from 'lucide-react';

const Produk = () => {
  const [menuIndex, setMenuIndex] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const [products, setProducts] = useState([
    { id: "P001", category:"Makanan", name: "TEMPE MENDOAN", stock: 0, price: 7000, image: "/kopi-susu.png", active: true },
    { id: "P002",  category:"Makanan", name: "SATE AYAM", stock: 10, price: 7000, image: "/produk/sate.jpg", active: true },
    { id: "P003",  category:"Makanan", name: "TELUR PUYUH", stock: 40, price: 7000, image: "/produk/telur.jpg", active: true },
    { id: "P004", category:"Minuman", name: "ES TEH", stock: 40, price: 7000, image: "/produk/esteh.jpg", active: true },
    { id: "P005", category:"Minuman", name: "KOPI SUSU", stock: 40, price: 7000, image: "/produk/kopi.jpg", active: false },
    { id: "M002", category:"Minuman", name: "TEH TARIK", stock: 10, price: 7000, image: "/produk/tehtarik.jpg", active: true },
  ]);


  const toggleActive = (id) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, active: !product.active } : product
    ));
  };

  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    price: '',
    image: null
  });
  
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
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Statistik Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Produk" value="100" icon={Package} />
            <StatCard title="Total Makanan" value="50" icon={Utensils} />
            <StatCard title="Total Minuman" value="50" icon={Beer} />
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80">
                <Search className="text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama produk"
                  className="ml-2 w-full focus:outline-none text-black"
                />
              </div>
              <div className="relative">
                <button
                  className="border border-gray-500 text-black flex items-center justify-center bg-[#F3F3F3] px-4 py-2 rounded-lg text-sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filter <Filter size={18} className="ml-2" />
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
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
              className="bg-[#F6B543] text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm whitespace-nowrap"
              onClick={() => setIsModalOpen(true)} // <- Buka modal
            >
              <Plus size={18} className="mr-2" /> Tambah Data
            </button>
          </div>

          {/* Produk Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
              .filter(product => {
                // Filter produk berdasarkan kategori yang dipilih
                if (selectedCategory) {
                  return product.category === selectedCategory;
                }
                return true;
              })
              .map((product) => (
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
                  <div className="flex items-center justify-between px-3 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.active}
                        onChange={() => toggleActive(product.id)}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>

                    <button className="text-gray-500">
                      <MoreVertical size={16} />
                    </button>
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
              ))}
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

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bagian kiri: form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black">Kode Produk</label>
                        <input
                          type="text"
                          placeholder="Masukkan Kode Produk (#MK001)"
                          className="w-full text-black border border-gray-300 rounded-md px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Stok</label>
                        <input
                          type="number"
                          placeholder="Masukkan Stok Produk"
                          className="w-full border text-black border-gray-300 rounded-md px-4 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black">Nama Produk</label>
                      <input
                        type="text"
                        placeholder="Masukkan Nama Produk"
                        className="w-full border text-black border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black">Tipe Produk</label>
                        <select className="w-full border text-black border-gray-300 rounded-md px-4 py-2">
                          <option>Pilih Salah Satu</option>
                          <option>Makanan</option>
                          <option>Minuman</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Keterangan</label>
                        <select className="w-full border text-black border-gray-300 rounded-md px-4 py-2">
                          <option>Aktif</option>
                          <option>Tidak Aktif</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black">Harga Modal</label>
                        <input
                          type="text"
                          placeholder="Masukkan Harga Modal"
                          className="w-full border text-black border-gray-300 rounded-md px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black">Harga Jual</label>
                        <input
                          type="text"
                          placeholder="Masukkan Harga Jual"
                          className="w-full border text-black border-gray-300 rounded-md px-4 py-2"
                        />
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
                      className="w-full border text-black border-gray-300 rounded-md px-4 py-2 h-[100px]"
                    ></textarea>
                  </div>

                  {/* Tombol Simpan */}
                  <div className="md:col-span-2 flex justify-end">
                    <button
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
  );
};

export default Produk;

function StatCard({ icon: Icon = Package, title, value }) {
  return (
    <div className="bg-[#FFF4E8] text-black px-6 py-4 rounded-xl shadow flex items-center gap-4 h-[100px]">
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
