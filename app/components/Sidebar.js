"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Monitor, Package, BarChart, Utensils, History, X } from "lucide-react";

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar }) => {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/POS/Dashboard" },
    { name: "Kasir", icon: Monitor, path: "/POS/Kasir" },
    { name: "Produk", icon: Package, path: "/POS/Produk" },
    { name: "Laporan Keuntungan", icon: BarChart, path: "/POS/Laporan" },
    { name: "Daftar Menu", icon: Utensils, path: "/POS/Menu" },
    { name: "Riwayat Pesanan", icon: History, path: "/POS/Riwayat" },
    { name: "Dashboard", icon: LayoutDashboard, path: "/Superadmin/Dashboard" },
    { name: "Pengajuan Toko", icon: Monitor, path: "/Superadmin/PengajuanToko" },
    { name: "Daftar Paket", icon: Package, path: "/Superadmin/DaftarPaket" },
  ];

  return (
    <>
      {/* Overlay untuk efek gelap saat sidebar muncul di mobile */}
      {isOpen && <div className="fixed inset-0 backdrop-brightness-70 bg-opacity-80 z-40 lg:hidden" onClick={toggleSidebar} />}

      <div
        className={`bg-white shadow-lg p-4 me-3 ransition-all duration-500 flex flex-col fixed lg:relative z-50 h-full lg:h-auto 
          transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Tombol Close (Hanya Muncul di Mobile) */}
        <div className="flex justify-end lg:hidden">
          <button onClick={toggleSidebar} className="p-2">
            <X className="h-6 w-6 text-black" />
          </button>
        </div>

        <div className="mt-4 flex-1">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.path} className="block">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 
                  ${
                    pathname === item.path
                      ? "bg-[#ECA641] text-white"
                      : "text-[#ECA641] hover:bg-[#F6B543] hover:text-white"
                  }
                `}
              >
                <item.icon className="h-6 w-6" />
                {!isCollapsed && <span className="text-lg font-medium">{item.name}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
