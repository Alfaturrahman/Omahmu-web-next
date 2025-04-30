'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Navbar';
import '@/globals.css';
import { X, Clock } from 'lucide-react';
import withAuth from 'hoc/withAuth';
import * as apiService from 'services/authService';

const sampleOrders = [
  {
    id: 1,
    status: 'Sedang Dibuat',
    name: 'AngkringanOmahmU - Batam Center',
    method: 'Pre-Order',
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
  }
];

function Log() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('Semua');
    const [listLog, setListLog] = useState([]);
    const [detailLog, setDetailLog] = useState([]);

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
        setIsSidebarOpen(!isSidebarOpen);
        } else {
        setIsCollapsed(!isCollapsed);
        }
    };

      async function fetchDetailLog(orderId) {
        try {
          const result = await apiService.getData(`/customer/detail_log/?order_id=${orderId}`);
          setDetailLog(result.data); // pastikan `data` berisi detail yang kamu butuhkan
        } catch (err) {
          console.error(err.message);
        }
      }
  
      async function fetchDataLog() {
        try {
            const result = await apiService.getData(`/customer/log_pemesanan/`);
            const mappedData = result.data.map((item) => ({
                id: item.order_id,
                name: item.store_name,
                method: item.pickup_method || (item.is_dine_in ? "Makan di tempat" : "Ambil sendiri"),
                time: new Date(item.created_at).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                total: parseInt(item.total_amount),
                items: item.total_items,
                status: item.status_label,
                detail: item // kamu bisa gunakan ini untuk offcanvas/detail view
            }));
            setListLog(mappedData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        fetchDataLog();
        fetchDetailLog();
    }, []);

    const filteredOrders =
        filter === 'Semua'
        ? listLog
        : listLog.filter((order) => order.status === filter);


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
                onClick={() => {
                  fetchDetailLog(order.id); // order.id = order_id
                  setSelectedOrder(order);
                }}
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
                      order.status === 'Selesai'
                        ? 'text-[#8BED52]'
                        : 'text-[#E8EB2A]'
                    }`}
                  >
                    {order.status}
                  </p>
                  <p className="text-sm text-black">{order.items} Items</p>
                  <p className="text-sm text-black font-semibold">
                    Total Pembelian :{' '}
                    <strong>Rp {order.total.toLocaleString('id-ID')},00</strong>
                  </p>
                  <p className="text-sm text-gray-500">Lihat semua &gt;</p>
                </div>
              </div>
            ))
          )}

          {/* Modal Detail */}
          {selectedOrder && detailLog.length > 0 && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                <div className="bg-white text-black rounded-lg w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
                  {/* Header */}
                  <div className="flex justify-between items-center pb-4">
                    <h2 className="text-xl font-bold text-center w-full">Detail Pesanan</h2>
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
                        <p className="font-medium">{detailLog[0]?.get_order_json?.customer_name}</p>
                      </div>
                      <div className="border-2 border-gray-300 p-2 rounded-md text-right">
                        <p className="text-xs text-gray-500">Tanggal Pemesanan</p>
                        <p className="font-medium">
                          {new Date(detailLog[0]?.get_order_json?.order_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-2">
                      <div className="flex justify-between">
                        <p className="font-semibold text-black">Detail Pesanan</p>
                        <p className="font-semibold text-xs md:text-sm text-gray-500">
                          Kode Pesanan : {detailLog[0]?.get_order_json?.order_code}
                        </p>
                      </div>

                      {/* Items */}
                      {detailLog[0]?.get_order_json?.items?.map((item, idx) => (
                        <div className="flex gap-3 mt-2 border-b py-4" key={idx}>
                          <img
                            src={item.product_picture ? `http://localhost:8000/${item.product_picture}` : '/default-image.png'}
                            alt={item.product_name}
                            className="w-20 h-16 rounded object-cover"
                          />
                          <div className="flex justify-between w-full">
                            <div className="flex flex-col justify-start">
                              <p className="font-semibold">{item.product_name}</p>
                              <p className="text-gray-500 text-xs">{item.product_type}</p>
                            </div>
                            <div className="flex flex-row gap-2 justify-end items-end">
                              <p className="font-bold text-sm">{item.quantity}x</p>
                              <p className="font-bold text-sm">
                                Rp {parseInt(item.price).toLocaleString('id-ID')},00
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <textarea
                        className="mt-5 w-full border rounded-md p-2 mb-4 text-sm"
                        placeholder="Catatan"
                        defaultValue={detailLog[0]?.get_order_json?.remarks}
                        readOnly
                      ></textarea>

                      {/* Total Section */}
                      <div className="mt-2 pt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Item</span>
                          <span className="font-semibold text-black">
                            {detailLog[0]?.get_order_json?.items?.length} (items)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold text-black">
                            Rp{' '}
                            {detailLog[0]?.get_order_json?.items?.reduce(
                              (total, item) => total + parseInt(item.price) * item.quantity,
                              0
                            ).toLocaleString('id-ID')}
                            ,00
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Keterangan</span>
                          <span className="font-semibold text-black">
                            {detailLog[0]?.get_order_json?.payment_method}
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
                      {detailLog[0]?.get_order_json?.items?.reduce(
                        (total, item) => total + parseInt(item.price) * item.quantity,
                        0
                      ).toLocaleString('id-ID')}
                      ,00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default withAuth(Log, ['3'])