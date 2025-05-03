"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, User, LogOut, Lock, Moon, Sun, PackageCheck, AlertTriangle  } from "lucide-react";
import { useRouter } from 'next/navigation'

const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter()
  const [toggle, setToggle] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("order");
  const notifRef = useRef(null);

  const notifications = {
    order: [
      {
        type: "order",
        code: "ORD123456",
        items: 3,
        date: "03 Mei 2025",
        status: "Baru",
      },
      {
        type: "order",
        code: "ORD654321",
        items: 1,
        date: "02 Mei 2025",
        status: "Diproses",
      },
    ],
    stock: [
      {
        type: "stock",
        product: "Tinta Printer Canon",
        remaining: 2,
      },
      {
        type: "stock",
        product: "Kertas A4 70gr",
        remaining: 0,
      },
    ],
  };
  
  const filteredNotifications = notifications[activeTab] || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitle = (path) => {
    const pageTitles = {
      "/POS/Dashboard": "Dashboard",
      "/POS/Kasir": "Kasir",
      "/POS/Produk": "Produk",
      "/POS/Laporan": "Laporan Keuntungan",
      "/POS/Menu": "Menu",
      "/POS/Riwayat": "Riwayat Pesanan",
      "/Superadmin/Dashboard": "Dashboard",
      "/Superadmin/PengajuanToko": "Pengajuan Toko",
      "/Superadmin/DaftarPaket": "Daftar Paket",
      "/Cust/Dashboard": "Dashboard",
      "/Cust/Kasir": "Kasir",
      "/Cust/Log": "Log Pemesanan",
    };
    return pageTitles[path] || "Halaman Tidak Diketahui";
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-[#fdf6ed] shadow-md">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleSidebar}>
        <Menu className="h-6 w-6 text-black" />
        <span className="text-sm md:text-md lg:text-lg text-black font-semibold">
          {getPageTitle(pathname)}
        </span>
      </div>

      {/* Kanan: Notifikasi & Profile */}
      <div className="flex items-center space-x-4 relative">
        <div className="relative flex items-center gap-3">
          {/* Bell Icon */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative">
              <Bell className="text-black cursor-pointer w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[13px] min-h-[13px] flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50 overflow-hidden border border-gray-200 animate-fade-in">
                {/* Tabs */}
                <div className="flex border-b text-sm font-medium">
                  <button
                    onClick={() => setActiveTab("order")}
                    className={`w-1/2 py-2 ${
                      activeTab === "order"
                        ? "border-b-2 border-[#F6B543] text-[#F6B543]"
                        : "text-gray-500"
                    }`}
                  >
                    Pesan Online
                  </button>
                  <button
                    onClick={() => setActiveTab("stock")}
                    className={`w-1/2 py-2 ${
                      activeTab === "stock"
                        ? "border-b-2 border-[#F6B543] text-[#F6B543]"
                        : "text-gray-500"
                    }`}
                  >
                    Produk
                  </button>
                </div>

                {/* Tab Content */}
                <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition"
                      >
                        {notif.type === "order" ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-orange-600">
                              <PackageCheck className="w-4 h-4" />
                              <span className="font-medium">Pesanan Baru</span>
                            </div>
                            <div className="text-xs text-gray-600">Kode: {notif.code}</div>
                            <div className="text-xs text-gray-600">
                              {notif.items} item • {notif.date}
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              Status: {notif.status}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-medium">
                                {notif.remaining === 0 ? "Stok Habis" : "Stok Menipis"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">{notif.product}</div>
                            <div
                              className={`text-xs font-semibold ${
                                notif.remaining === 0 ? "text-red-500" : "text-yellow-500"
                              }`}
                            >
                              Sisa: {notif.remaining} unit
                            </div>
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-gray-500 text-sm">Tidak ada notifikasi</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggle}
              onChange={() => setToggle(!toggle)}
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 relative after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>

        <span className="text-[11px] md:text-[13px] lg:text-[15px] text-black font-semibold">
          Angkringan OmahMu
        </span>

        {/* Avatar dan Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* Avatar Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <span className="text-white font-bold">A</span>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-3 z-50">
              <div className="px-3 py-2 border-b">
                <p className="text-sm text-black font-semibold">Customer</p>
                <p className="text-xs text-gray-500">Alfaturrizki@gmail.com</p>
              </div>

              <div className="py-2">
                <button
                  onClick={() => router.push('/POS/Profile')}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-black rounded-lg cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </button>

                <button
                  onClick={() => router.push('/POS/GantiSandi')}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-black rounded-lg cursor-pointer"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Ganti Kata Sandi
                </button>

                <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-lg text-red-500 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
