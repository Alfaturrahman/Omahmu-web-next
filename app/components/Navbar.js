"use client";
import { Menu, Bell } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-[#fdf6ed] shadow-md">
      {/* Kiri: Tombol Toggle (Selalu Ada) */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleSidebar}>
        <Menu className="h-6 w-6 text-black" />
        <span className="text-sm md:text-md lg:text-lg text-black font-semibold">Dashboard</span>
      </div>

      {/* Kanan: Notifikasi & Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="text-black cursor-pointer w-5 h-5" />
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full">
            3
          </span>
        </div>
        <span className="text-sm md:text-md lg:text-lg text-black font-semibold">Angkringan OmahMu</span>
        <div className="w-8 h-8 bg-[#ECA641] rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;
