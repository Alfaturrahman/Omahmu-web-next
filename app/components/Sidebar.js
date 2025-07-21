"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Monitor, Package, BarChart, Utensils, History, X, Store, ReceiptText,
  ChevronDown, ChevronUp, Wallet, ShoppingBasket, Briefcase, ArrowDownCircle, ArrowUpCircle 
} from "lucide-react";

import { jwtDecode } from "jwt-decode";
import * as apiService from 'services/authService';

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar }) => {
  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("store_id");
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);
  const role_id = localStorage.getItem("role_id");  
  const [menuItems, setMenuItems] = useState([]);

  const featureMap = {
    "Dashboard": {
      name: "Dashboard",
      path: "/POS/Dashboard",
      icon: LayoutDashboard,
    },
    "Kasir": {
      name: "Kasir",
      path: "/POS/Kasir",
      icon: Monitor,
    },
    "Produk": {
      name: "Produk",
      path: "/POS/StokProduk",
      icon: Package,
    },
    "Daftar Menu": {
      name: "Daftar Menu",
      path: "/POS/Menu",
      icon: Utensils,
    },
    "Riwayat Pesanan": {
      name: "Riwayat Pesanan",
      path: "/POS/Riwayat",
      icon: History,
    },
  };

  const menuItemss = [
    {
      role: 1, // Superadmin
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/Superadmin/Dashboard" },
        { name: "Pengajuan Toko", icon: Monitor, path: "/Superadmin/PengajuanToko" },
        { name: "Daftar Paket", icon: Package, path: "/Superadmin/DaftarPaket" },
      ],
    },
    {
      role: 2, // POS
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/POS/Dashboard" },
        { name: "Kasir", icon: Monitor, path: "/POS/Kasir" },
        { name: "Produk", icon: Package, path: "/POS/StokProduk" },
        {
          name: "Laporan",
          icon: BarChart,
          submenu: [
            { name: "Uang Masuk", path: "/POS/UangMasuk", icon: ArrowDownCircle },
            { name: "Uang Keluar", path: "/POS/UangKeluar", icon: ArrowUpCircle },
          ],
        },
        {
          name: "Pengeluaran",
          icon: Wallet,
          submenu: [
            { name: "Stok Basah", path: "/POS/StokBasah", icon: ShoppingBasket },
            { name: "Pengeluaran Lainnya", path: "/POS/Pengeluaran", icon: Briefcase },
          ],
        },
        { name: "Daftar Menu", icon: Utensils, path: "/POS/Menu" },
        { name: "Riwayat Pesanan", icon: History, path: "/POS/Riwayat" },
      ],
    },
    {
      role: 3, // Customer
      items: [
        { name: "Dashboard", icon: Store, path: "/Cust/Dashboard" },
        { name: "Log Pemesanan", icon: ReceiptText, path: "/Cust/Log" },
      ],
    },
  ];

  const getSidebarFeatures = async () => {
    try {
      const res = await apiService.getData(`/storeowner/check_fitur/?store_id=${storeId}`);
      const fitur = res.data;

      const sidebar = [];

      // Cek dan kelompokkan submenu Laporan
      const laporanSubmenu = [];
      if (fitur.some((f) => f.feature_name === "Uang Masuk")) {
        laporanSubmenu.push({
          name: "Uang Masuk",
          path: "/POS/UangMasuk",
          icon: ArrowDownCircle,
        });
      }
      if (fitur.some((f) => f.feature_name === "Uang Keluar")) {
        laporanSubmenu.push({
          name: "Uang Keluar",
          path: "/POS/UangKeluar",
          icon: ArrowUpCircle,
        });
      }
      if (laporanSubmenu.length > 0) {
        sidebar.push({
          name: "Laporan",
          icon: BarChart,
          submenu: laporanSubmenu,
        });
      }

      // Cek dan kelompokkan submenu Pengeluaran
      const pengeluaranSubmenu = [];
      if (fitur.some((f) => f.feature_name === "Stok Basah")) {
        pengeluaranSubmenu.push({
          name: "Stok Basah",
          path: "/POS/StokBasah",
          icon: ShoppingBasket,
        });
      }
      if (fitur.some((f) => f.feature_name === "Pengeluaran Lainnya")) {
        pengeluaranSubmenu.push({
          name: "Pengeluaran Lainnya",
          path: "/POS/Pengeluaran",
          icon: Briefcase,
        });
      }
      if (pengeluaranSubmenu.length > 0) {
        sidebar.push({
          name: "Pengeluaran",
          icon: Wallet,
          submenu: pengeluaranSubmenu,
        });
      }

      // Fitur lain langsung ditambahkan
      fitur.forEach((item) => {
        const mapped = featureMap[item.feature_name];
        if (mapped) sidebar.push(mapped);
      });

      console.log("sidebar",sidebar);
      
      setMenuItems(sidebar);
    } catch (error) {
      console.error("Gagal mengambil fitur sidebar:", error);
    }
  };

  useEffect(() => {
      if (role_id === "2" && storeId) {
        getSidebarFeatures();
      }
    }, [role_id, storeId]);


  const currentMenu =
  role_id === "2"
    ? { items: menuItems } // dari backend
    : menuItemss.find((menu) => menu.role === parseInt(role_id)); // dari array statis

  if (!currentMenu) {
    return <div className="p-4">Akses tidak ditemukan</div>;
  }

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 backdrop-brightness-70 bg-opacity-80 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      <div
        className={`bg-white shadow-lg p-4 transition-all duration-500 flex flex-col fixed lg:relative z-50 h-screen
          transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="flex justify-end lg:hidden">
          <button onClick={toggleSidebar} className="p-2">
            <X className="h-6 w-6 text-black" />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-1">
          {currentMenu.items.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`flex items-center w-full space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300
                      ${item.submenu.some((sub) => pathname === sub.path)
                        ? "bg-[#ECA641] text-white"
                        : "text-[#ECA641] hover:bg-[#F6B543] hover:text-white"}`}
                  >
                    <item.icon className="h-6 w-6" />
                    {!isCollapsed && (
                      <>
                        <span className="text-lg font-medium flex-1 text-left">{item.name}</span>
                        {openDropdown === index ? <ChevronUp /> : <ChevronDown />}
                      </>
                    )}
                  </button>

                  {openDropdown === index && !isCollapsed && (
                    <div className="ml-10 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.path}>
                          <div
                            className={`flex items-center space-x-2 border-l-2 text-sm py-2 px-3 transition-colors
                              ${pathname === subItem.path
                                ? "border-[#ECA641] bg-[#ECA641] text-white"
                                : "border-gray-200 text-[#ECA641] hover:bg-[#F6B543] hover:text-white"}`}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.path} className="block">
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300
                      ${pathname === item.path
                        ? "bg-[#ECA641] text-white"
                        : "text-[#ECA641] hover:bg-[#F6B543] hover:text-white"}`}
                  >
                    <item.icon className="h-6 w-6" />
                    {!isCollapsed && <span className="text-lg font-medium">{item.name}</span>}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
