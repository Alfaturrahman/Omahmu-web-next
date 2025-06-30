"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, Monitor, Package, BarChart, Utensils, History, X, Store, ReceiptText,
  ChevronDown, ChevronUp, Wallet, ShoppingBasket, Briefcase, ArrowDownCircle, ArrowUpCircle 
} from "lucide-react";

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar }) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);
  const role_id = localStorage.getItem("role_id");  

  const menuItems = [
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

  const currentMenu = menuItems.find((menu) => menu.role === parseInt(role_id));
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
