'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import { X, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import '@/globals.css';

export default function Kasir() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('Semua');

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
        setIsSidebarOpen(!isSidebarOpen);
        } else {
        setIsCollapsed(!isCollapsed);
        }
    };

    const sampleOrders = [
      {
        id: 1,
        status: 'Sedang Dibuat',
        name: 'AngkringanOmahmU - Batam Center',
        method: 'Ambil Sendiri',
        time: '12.08pm',
        total: 15000,
        items: 2,
        detail: {
          date: '10/03/2025',
          kode: 'D468',
          customer: 'Alfaturrizki',
          foods: [
            { name: 'Sate Kambing', type: 'Makanan', qty: 1, price: 15000, image: '/sate-kambing.png' },
            { name: 'Kopi susu', type: 'Minuman', qty: 1, price: 7000, image: '/kopi-susu.png' }
          ],
          catatan: 'Saya nak aer',
          metode: 'Ambil sendiri',
          wa: '082290000491'
        }
      },
      {
        id: 2,
        status: 'Selesai',
        name: 'AngkringanOmahmU - Batam Center',
        method: 'Ambil sendiri',
        time: '12.08pm',
        total: 15000,
        items: 2,
        detail: {
          date: '10/03/2025',
          kode: 'D469',
          customer: 'Alfaturrizki',
          foods: [
            { name: 'Sate Kambing', type: 'Makanan', qty: 1, price: 15000, image: '/sate-kambing.png' },
            { name: 'Kopi susu', type: 'Minuman', qty: 1, price: 7000, image: '/kopi-susu.png' }
          ],
          catatan: 'Walid Nak Dewi Boleh?',
          metode: 'Ambil sendiri',
          wa: '082290000491'
        }
      },
      {
        id: 3,
        status: 'Pending',
        name: 'AngkringanOmahmU - Batam Center',
        method: 'Di Antar',
        time: '12.08pm',
        total: 15000,
        items: 2,
        detail: {
          date: '10/03/2025',
          kode: 'D469',
          customer: 'Alfaturrizki',
          foods: [
            { name: 'Sate Kambing', type: 'Makanan', qty: 1, price: 15000, image: '/sate-kambing.png' },
            { name: 'Kopi susu', type: 'Minuman', qty: 1, price: 7000, image: '/kopi-susu.png' }
          ],
          catatan: 'Walid Nak Dewi Boleh?',
          metode: 'Ambil sendiri',
          wa: '082290000491'
        }
      },
    ];

    const handleCancelOrder = (orderId) => {
      Swal.fire({
        title: 'Batalkan Pesanan?',
        text: 'Apakah kamu yakin ingin membatalkan pesanan ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, batalkan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Pesanan dibatalkan:', orderId);

          setSelectedOrder(null);

          Swal.fire(
            'Dibatalkan!',
            'Pesanan berhasil dibatalkan.',
            'success'
          );
        }
      });
    };

    const filteredOrders = filter === 'Semua'
      ? sampleOrders
      : sampleOrders.filter((order) => order.status === filter);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative h-full overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        <div className="p-4 md:p-6 transition-all overflow-y-auto min-h-0 duration-300 w-full">
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-1 rounded-md cursor-pointer ${
                filter === 'Semua'
                  ? 'bg-[#F6B543] text-white'
                  : 'border border-[#F6B543] text-black'
              }`}
              onClick={() => setFilter('Semua')}
            >
              Semua
            </button>
            <button
              className={`px-4 py-1 rounded-md cursor-pointer ${
                filter === 'Sedang Dibuat'
                  ? 'bg-[#F6B543] text-white'
                  : 'border border-[#F6B543] text-black'
              }`}
              onClick={() => setFilter('Sedang Dibuat')}
            >
              Sedang Dibuat
            </button>
            <button
              className={`px-4 py-1 rounded-md cursor-pointer ${
                filter === 'Selesai'
                  ? 'bg-[#F6B543] text-white'
                  : 'border border-[#F6B543] text-black'
              }`}
              onClick={() => setFilter('Selesai')}
            >
              Selesai
            </button>
          </div>

          {/* Order Cards */}
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Tidak ada data yang sesuai
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="flex items-start justify-between border rounded-lg p-4 mb-4 cursor-pointer shadow-md border-gray-300"
              >
                <div className="flex gap-3">
                  <img
                    src="/Toko1.png"
                    className="w-20 h-20 rounded-full"
                    alt="logo"
                  />
                  <div>
                    <h2 className="font-semibold mb-2 text-black">{order.name}</h2>
                    <p className="text-sm mb-2 text-gray-500">{order.method}</p>
                    <p className="text-sm mb-2 flex text-gray-500 items-center gap-2">
                      <Clock /> {order.time}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-3">
                  <p
                    className={`text-sm font-semibold ${
                      order.status === 'Pending'
                        ? 'text-yellow-500'
                        : order.status === 'Sedang Dibuat'
                        ? 'text-blue-700'
                        : order.status === 'Selesai'
                        ? 'text-green-500'
                        : order.status === 'Ditolak'
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {order.status}
                  </p>
                  <p className="text-sm text-black">{order.items} Items</p>
                  <p className="text-sm text-black font-semibold">
                    Total Pembelian :{' '}
                    <strong>Rp {order.total.toLocaleString('id-ID')}</strong>
                  </p>
                  <p className="text-sm text-gray-500">Lihat semua &gt;</p>
                </div>
              </div>
            ))
          )}

          {/* Modal Detail */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                <div className="bg-white text-black rounded-lg w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
                  {/* Header */}
                  <div className="flex justify-between items-cente pb-4">
                    <h2 className="text-xl font-bold text-center w-full">
                      Detail Pesanan
                    </h2>
                    <button
                      className="absolute right-6"
                      onClick={() => setSelectedOrder(null)}
                    >
                      <X className="w-5 h-5 cursor-pointer" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="mt-4 space-y-4 text-sm">
                    <div className="flex flex-row justify-between gap-2">
                      <div className="border-2 border-gray-300 p-2 rounded-md">
                        <p className="text-xs text-gray-500">Nama Customer</p>
                        <p className="font-medium">Alfatturrizki</p>
                      </div>
                      <div className="border-2 border-gray-300 p-2 rounded-md text-right">
                        <p className="text-xs text-gray-500">
                          Tanggal Pemesanan
                        </p>
                        <p className="font-medium">10 Maret 2023</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-2">
                      <div className="flex justify-between">
                        <p className="font-semibold text-black">Detail Pesanan</p>
                        <p className="font-semibold text-xs md:text-sm text-gray-500">
                          Kode Pesanan : 15032023
                        </p>
                      </div>

                      {/* Items */}
                      {selectedOrder.detail.foods.map((item, idx) => (
                        <div
                          className="flex gap-3 mt-2 border-b py-4"
                          key={idx}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-16 rounded object-cover"
                          />
                          <div className="flex justify-between w-full">
                            <div className="flex flex-col justify-start">
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-gray-500 text-xs">{item.type}</p>
                            </div>
                            <div className="flex flex-row gap-2 justify-end items-end">
                              <p className="font-bold text-sm">{item.qty}x</p>
                              <p className="font-bold text-sm">
                                Rp {item.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <textarea
                        className="mt-5 w-full border rounded-md p-2 mb-4 text-sm"
                        placeholder="Catatan"
                        defaultValue={selectedOrder.detail.catatan}
                        readOnly
                      ></textarea>

                      {/* Total Section */}
                      <div className="mt-2 pt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Item</span>
                          <span className="font-semibold text-black">
                            {selectedOrder.detail.foods.length} (items)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold text-black">
                            Rp{' '}
                            {selectedOrder.detail.foods
                              .reduce(
                                (total, item) => total + item.price * item.qty,
                                0
                              )
                              .toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Keterangan</span>
                          <span className="font-semibold text-black">
                            {selectedOrder.detail.metode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-row justify-between border-t mt-5 py-3 text-right font-semibold">
                    <p>Total</p>
                    <p>
                      Rp{' '}
                      {selectedOrder.detail.foods
                        .reduce(
                          (total, item) => total + item.price * item.qty,
                          0
                        )
                        .toLocaleString('id-ID')}
                    </p>
                  </div>

                  {selectedOrder.status === 'Pending' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Batalkan Pesanan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
