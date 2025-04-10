'use client';
import React, { useState } from "react";
import { Search, Filter, Plus, MoreVertical } from "lucide-react";

const Dashboard = () => {
  const [menuIndex, setMenuIndex] = useState(null);
  const [products, setProducts] = useState([
    { id: "P001", name: "TEMPE MENDOAN", stock: 0, price: 7000., image: "https://via.placeholder.com/150", active: true },
    { id: "P002", name: "SATE AYAM", stock: 10, price: 7000, image: "https://via.placeholder.com/150", active: true },
    { id: "P003", name: "TELUR PUYUH", stock: 40, price: 7000, image: "https://via.placeholder.com/150", active: true },
    { id: "P004", name: "ES TEH", stock: 40, price: 7000, image: "https://via.placeholder.com/150", active: true },
    { id: "P005", name: "KOPI SUSU", stock: 40, price: 7000, image: "https://via.placeholder.com/150", active: true },
    { id: "P006", name: "TEH TARIK", stock: 10, price: 7000, image: "https://via.placeholder.com/150", active: true }
  ]);

  const toggleMenu = (index) => {
    setMenuIndex(menuIndex === index ? null : index);
  };

  const toggleActive = (id) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, active: !product.active } : product
    ));
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Search & Filter */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-2/3">
          <Search className="text-gray-500" size={20} />
          <input type="text" placeholder="Cari berdasarkan nama produk" className="ml-2 w-full focus:outline-none" />
        </div>
        <button className="flex items-center bg-gray-200 px-4 py-2 rounded-lg">
          <Filter size={20} className="mr-2" /> Filter
        </button>
      </div>

      {/* Produk List */}
      <div className="grid grid-cols-5 gap-6">
        {products.map((product, index) => (
          <div key={product.id} className="border rounded-lg shadow-lg p-4 relative">
            {/* Label Stok Habis */}
            {product.stock === 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Stok Habis</span>
            )}

            {/* Toggle Switch */}
            <label className="absolute top-2 left-2 cursor-pointer">
              <input type="checkbox" className="hidden" checked={product.active} onChange={() => toggleActive(product.id)} />
              <div className={`w-10 h-5 flex items-center rounded-full p-1 transition ${product.active ? "bg-orange-500" : "bg-gray-300"}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${product.active ? "translate-x-5" : ""}`}></div>
              </div>
            </label>

            {/* Gambar Produk */}
            <img src={product.image} alt={product.name} className="rounded-md w-full h-32 object-cover" />
            <p className="text-gray-500 text-sm">#{product.id}</p>
            <p className="font-semibold text-black">{product.name}</p>
            <p className="text-gray-500 text-sm">Stok: {product.stock}</p>
            <p className="font-bold">RP {product.price.toLocaleString()}</p>

            {/* More Options */}
            <button className="absolute top-2 right-2" onClick={() => toggleMenu(index)}>
              <MoreVertical size={20} />
            </button>
            {menuIndex === index && (
              <div className="absolute top-8 right-2 bg-white shadow-md rounded-md p-2">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                <button className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Hapus</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Button Tambah Data */}
      <div className="mt-6">
        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg flex items-center">
          <Plus size={20} className="mr-2" /> Tambah Data
        </button>
      </div>
    </div>

  
  );
};

export default Dashboard;
