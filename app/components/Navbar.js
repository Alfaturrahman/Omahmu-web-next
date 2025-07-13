"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, User, LogOut, Lock, Moon, Sun, PackageCheck, AlertTriangle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import * as apiService from 'services/authService';
// import { toast } from 'your-toast-lib'; // kalau pakai toast

const Header = ({ toggleSidebar }) => {
  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("store_id");

  let userEmail = "";
  let userRole = "";
  let userRoleId = "";

  if (token) {
    const decoded = jwtDecode(token);
    userEmail = decoded.email;
    userRole = decoded.role_name;
    userRoleId = decoded.role_id;
  }

  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toggle, setToggle] = useState(false);  // store open/close
  const [activeTab, setActiveTab] = useState(userRole === "SuperAdmin" ? "package" : "order");
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({
    package: 0,
    submission: 0,
    order: 0,
    stock: 0
  });
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  // 🔔 Fetch notifications saat notif dibuka
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await apiService.getData('/superadmin/get_notifications/');
        if (result.status_code === 200) {
          setNotifications(result.data);
        } else if (result.status_code === 401) {
          handleLogout();
        }
      } catch (error) {
        console.error("Gagal fetch notifikasi:", error);
      }
    };
    if (isNotifOpen) {
      fetchNotifications();
    }
  }, [isNotifOpen]);

  // 🔍 Filter notif sesuai activeTab
  useEffect(() => {
      let filtered = [];
      if (activeTab === "order") {
        filtered = notifications.filter(n => n.type === "order");
      } else if (activeTab === "stock") {
        filtered = notifications.filter(n => n.type === "stock");
      } else if (activeTab === "package") {
        filtered = notifications.filter(n =>
          ["package_created", "package_updated", "package_deleted"].includes(n.type)
        );
      } else if (activeTab === "submission") {
        filtered = notifications.filter(n => n.type === "store_submission");
      }
      setFilteredNotifications(filtered);
    }, [activeTab, notifications]);

    useEffect(() => {
    const counts = {
      package: notifications.filter(n =>
        ["package_created", "package_updated", "package_deleted"].includes(n.type) && !n.is_read
      ).length,
      submission: notifications.filter(n => n.type === "store_submission" && !n.is_read).length,
      order: notifications.filter(n => n.type === "order" && !n.is_read).length,
      stock: notifications.filter(n => n.type === "stock" && !n.is_read).length
    };
    setUnreadCounts(counts);

    let total = 0;
    if (userRole === "SuperAdmin") {
      total = counts.package + counts.submission;
    } else {
      total = counts.order + counts.stock;
    }
    setTotalUnreadCount(total);
  }, [notifications, userRole]);

  // ✅ Hitung unreadCount hanya notif yang difilter (per tab)
  const unreadCount = unreadCounts[activeTab] || 0;

  // ✅ Mark notification as read
  const handleMarkAsRead = async (notifId) => {
    try {
      await apiService.patchData(`/superadmin/mark_notification_read/${notifId}`);
      setNotifications(prev =>
        prev.map(n => (n.id === notifId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Gagal menandai notif:", error);
    }
  };

  // 🏪 Toggle store open/close
  const handleToggleStore = async () => {
    try {
      const newStatus = !toggle;
      await apiService.putData(`/storeowner/update_open_status/?store_id=${storeId}&is_open=${newStatus}`);
      setToggle(newStatus);
      // toast.success(`Toko berhasil ${newStatus ? 'dibuka' : 'ditutup'}`);
    } catch (error) {
      console.error("Gagal memperbarui status toko:", error);
      // toast.error("Gagal memperbarui status toko");
    }
  };

  // 🏪 Fetch status toko saat load
  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        const result = await apiService.getData(`/storeowner/profile/${storeId}/`);
        setToggle(result?.data?.is_open);
      } catch (error) {
        console.error("Gagal ambil status toko:", error);
      }
    };
    if (storeId) {
      fetchStoreStatus();
    }
  }, [storeId]);

  // 📌 Tutup dropdown saat klik luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role_id');
    router.push('/Login');
  };

  // 📄 Dynamic page title
  const getPageTitle = (path) => {
    const pageTitles = {
      "/POS/Dashboard": "Dashboard",
      "/POS/Kasir": "Kasir",
      "/POS/StokProduk": "Stok Produk",
      "/POS/StokBasah": "Stok Basah",
      "/POS/UangMasuk": "Laporan Uang Masuk",
      "/POS/UangKeluar": "Laporan Uang Keluar",
      "/POS/Pengeluaran": "Pengeluaran Lainnya",
      "/POS/Menu": "Menu",
      "/POS/Riwayat": "Riwayat Pesanan",
      "/Superadmin/Dashboard": "Dashboard",
      "/Superadmin/DashboardToko": "Dashboard",
      "/Superadmin/PengajuanToko": "Pengajuan Toko",
      "/Superadmin/DaftarPaket": "Daftar Paket",
      "/Superadmin/DetailPenggunaPaket": "Detail Pengguna Paket",
      "/Cust/Dashboard": "Dashboard",
      "/Cust/Kasir": "Kasir",
      "/Cust/Log": "Log Pemesanan",
    };
    return pageTitles[path] || "Halaman Tidak Diketahui";
  };

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
              {totalUnreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                  {totalUnreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50 overflow-hidden border border-gray-200 animate-fade-in">
                {/* Tabs */}
                <div className="flex border-b text-sm font-medium">
                  {userRole === "SuperAdmin" ? (
                    <>
                      <button
                        onClick={() => setActiveTab("package")}
                        className={`w-1/2 py-2 flex items-center justify-center gap-1 ${
                          activeTab === "package"
                            ? "border-b-2 border-[#F6B543] text-[#F6B543]"
                            : "text-gray-500"
                        }`}
                      >
                        <span>Paket</span>
                        {unreadCounts.package > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1 rounded-full">
                            {unreadCounts.package}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveTab("submission")}
                        className={`w-1/2 py-2 flex items-center justify-center gap-1 ${
                          activeTab === "submission"
                            ? "border-b-2 border-[#F6B543] text-[#F6B543]"
                            : "text-gray-500"
                        }`}
                      >
                        <span>Pengajuan</span>
                        {unreadCounts.submission > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1 rounded-full">
                            {unreadCounts.submission}
                          </span>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveTab("order")}
                        className={`w-1/2 py-2 flex items-center justify-center gap-1 ${
                          activeTab === "order"
                            ? "border-b-2 border-[#F6B543] text-[#F6B543]"
                            : "text-gray-500"
                        }`}
                      >
                        <span>Pesan Online</span>
                        {unreadCounts.order > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1 rounded-full">
                            {unreadCounts.order}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveTab("stock")}
                        className={`w-1/2 py-2 flex items-center justify-center gap-1 ${
                          activeTab === "stock"
                            ? "border-b-2 border-[#F6B543] text-[#F6B543]"
                            : "text-gray-500"
                        }`}
                      >
                        <span>Produk</span>
                        {unreadCounts.stock > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1 rounded-full">
                            {unreadCounts.stock}
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Tab Content */}
                <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications
                      .map((notif) => (
                        <li
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`px-4 py-3 text-sm hover:bg-gray-50 transition cursor-pointer ${
                            !notif.is_read ? "font-semibold" : "text-gray-800"
                          }`}
                        >
                          {["package_created", "package_updated", "package_deleted"].includes(notif.type) ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-purple-600">
                                <PackageCheck className="w-4 h-4" />
                                <span className="font-medium">{notif.title}</span>
                              </div>
                              <div className="text-xs text-gray-600">{notif.message}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                              </div>
                            </div>
                          ) : notif.type === "order" ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-orange-600">
                                <PackageCheck className="w-4 h-4" />
                                <span className="font-medium">{notif.title}</span>
                              </div>
                              <div className="text-xs text-gray-600">{notif.message}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="font-medium">{notif.title}</span>
                              </div>
                              <div className="text-xs text-gray-600">{notif.message}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
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
          {(userRoleId === 2) && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={toggle}
                onChange={handleToggleStore}
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 relative after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          )}
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
              <p className="text-sm text-black font-semibold">{userRole}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>

              <div className="py-2">

              {userRoleId === 3 && (
                  <button
                    onClick={() => router.push('/Cust/Profile')} // Arahkan ke /Cust/Profile untuk userRoleId 3
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-black rounded-lg cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </button>
                )}
              {userRoleId === 2 && (
                <button
                  onClick={() => router.push('/POS/Profile')}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-black rounded-lg cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </button>
                )}
                <button
                  onClick={() => router.push('/POS/GantiSandi')}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-black rounded-lg cursor-pointer"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Ganti Kata Sandi
                </button>

                <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-lg text-red-500 cursor-pointer">
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
