"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation'

const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Dapatkan path halaman saat ini
  const router = useRouter()

  // Konversi path URL ke judul halaman yang lebih user-friendly
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
    };
    return pageTitles[path] || "Halaman Tidak Diketahui";
  };

  return (
    
    <header className="flex justify-between items-center px-6 py-3 bg-[#fdf6ed] shadow-md">
      {/* Kiri: Tombol Toggle (Selalu Ada) */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleSidebar}>
        <Menu className="h-6 w-6 text-black" />
        <span className="text-sm md:text-md lg:text-lg text-black font-semibold">
          {getPageTitle(pathname)} {/* Menampilkan nama halaman sesuai URL */}
        </span>
      </div>

      {/* Kanan: Notifikasi & Profile */}
      <div className="flex items-center space-x-4 relative">
        {/* Notifikasi */}
        <div className="relative">
          <Bell className="text-black cursor-pointer w-5 h-5" />
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        <span className="text-[11px] md:text-[13px] lg:text-[15px] text-black font-semibold">
          Angkringan OmahMu
        </span>

        {/* Avatar dan Dropdown */}
        <div className="relative">
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
                {/* Profil */}
                <button
                    onClick={() => router.push('/POS/Profile')}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-black rounded-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                </button>

                {/* Logout */}
                <button className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-lg text-red-500">
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
