'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { Search, Filter, Eye, Plus, X, UploadCloud } from 'lucide-react';
import Swal from 'sweetalert2';

const Produk = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpenAddItem, setIsModalOpenAddItem] = useState(false);
  const itemsPerPage = 10;

  const [formDataAddItem, setFormDataAddItem] = useState({
    name: "",
    amount: "",
    price: "",
    unit: "",
    total: "",
    category: "",
  });

  const [formData, setFormData] = useState({
    tanggal: "",
  });


  const [products, setProducts] = useState([
    { id: "1", date: "05/05/2002", amount: "2", totalPrice: "Rp 200.000", },
    { id: "2", date: "05/05/2005", amount: "2", totalPrice: "Rp 200.000", },
    { id: "3", date: "05/05/2005", amount: "2", totalPrice: "Rp 200.000", },
    { id: "4", date: "05/05/2005", amount: "2", totalPrice: "Rp 200.000", },
    { id: "5", date: "05/05/2005", amount: "2", totalPrice: "Rp 200.000", },
    { id: "6", date: "05/05/2005", amount: "2", totalPrice: "Rp 200.000", },
  ]);

  const [items, setItems] = useState([
    { name: 'AYAM', qty: 2, unit: 'KG', price: '12.000', total: '24.000', category: 'BAHAN BAKU' },
    { name: 'TELUR PUYUH', qty: 1, unit: 'PAPAN', price: '12.000', total: '12.000', category: 'BAHAN BAKU' },
  ]);
  
  const filteredProducts = products.filter(item => {
    const matchCategory = !selectedCategory || selectedCategory === "All" || item.category === selectedCategory || true;
    const matchSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || true;
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDetailClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpenDetail(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

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
    setIsEditing(false);
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

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
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
                                  {['NO', 'TANGGAL', 'JUMLAH ITEM', 'TOTAL BELANJA', 'AKSI'].map((header, index) => (
                                      <th key={index} className="py-3 px-4 relative">
                                        {header}
                                        {index !== 4 && (
                                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                        )}
                                    </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                              {displayedData.map((item, index) => (
                                  <tr key={index} className="text-center text-black hover:bg-gray-100 text-xs md:text-sm lg:text-[15px] relative">
                                    {[index + 1 + (currentPage - 1) * itemsPerPage, item.date, item.amount, item.totalPrice].map((value, idx) => (
                                        <td key={idx} className="py-3 px-4 relative">
                                            {value}
                                            {idx !== 7 && (
                                                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[2px] h-3 bg-gray-300"></span>
                                            )}
                                        </td>
                                    ))}

                                    <td className="py-3 px-4 relative">
                                      <button onClick={() => handleDetailClick(item)} className="text-black cursor-pointer">
                                        <Eye/>
                                      </button>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  )}
              </div>
          </div>

          {/* Modal Tambah Data Stok Basah*/}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto shadow-lg">
                
                {/* Header */}
                <div className="bg-[#FFF5EB] px-6 py-4 rounded-t-xl flex justify-between items-center">
                  <h2 className="text-lg font-bold text-black uppercase">Tambah Stok Basah</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-black text-xl">
                    <X />
                  </button>
                </div>

                {/* Form Section */}
                <div className="p-6 space-y-6">

                  {/* Tanggal & Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Tanggal Belanja</label>
                      <input type="date" className="border border-gray-300 rounded-md px-4 py-2 text-black w-full" value={formData.tanggal || ''}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1">Upload Bukti Pembayaran</label>
                      <div className="flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-gray-500" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="border border-gray-300 rounded-md px-4 py-2 w-full cursor-pointer text-black"
                        />
                      </div>
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
                        className="bg-[#F6B543] hover:bg-[#e2a530] text-white px-4 py-2 rounded-md text-sm font-medium"
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
                            <th className="px-4 py-2 font-medium">KATEGORI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2">{item.qty}</td>
                              <td className="px-4 py-2">{item.unit}</td>
                              <td className="px-4 py-2">RP {item.price}</td>
                              <td className="px-4 py-2">RP {item.total}</td>
                              <td className="px-4 py-2">{item.category}</td>
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
                                value={formDataAddItem.name}
                                onChange={(e) => setFormDataAddItem({ ...formDataAddItem, name: e.target.value })}
                              />
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
                            </div>
                            <div>
                              <label className="text-black text-sm font-medium">TOTAL</label>
                              <input
                                type="text"
                                value={`Rp ${formDataAddItem.total || 0}`}
                                readOnly
                                className="w-full border text-gray-500 border-gray-500 px-3 py-2 rounded-md bg-gray-100"
                              />
                            </div>
                            <div>
                              <label className="text-black text-sm font-medium">KATEGORI</label>
                              <select
                                className="w-full border text-gray-500 border-gray-500 px-3 py-2 rounded-md"
                                value={formDataAddItem.category}
                                onChange={(e) => setFormDataAddItem({ ...formDataAddItem, category: e.target.value })}
                              >
                                <option value="">Pilih Salah Satu</option>
                                <option value="sayur">Sayur</option>
                                <option value="daging">Daging</option>
                                <option value="ikan">Ikan</option>
                              </select>
                            </div>
                            <div className="flex justify-between pt-4">
                              <button
                                onClick={() => setIsModalOpenAddItem(false)}
                                className="text-red-500 border  border-red-500 px-4 py-2 rounded-md"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => {
                                  // Lakukan simpan data di sini
                                  console.log(formData);
                                  setIsModalOpenAddItem(false);
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
                      className="border border-red-500 text-red-500 px-5 py-2 rounded-md font-medium hover:bg-red-100"
                    >
                      Tutup
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-green-500 text-white px-5 py-2 rounded-md font-medium hover:bg-green-600"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
)};

export default Produk;