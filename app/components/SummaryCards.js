'use client';

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-[#FFF4E8] p-4 rounded-lg h-[145px] shadow-lg flex flex-col justify-center items-center text-center">
        <h3 className="text-sm font-semibold text-[#F39117]">Total Penjualan</h3>
        <p className="text-sm md:text-md lg:text-[18px] font-bold text-black">Rp 150.000.000</p>
      </div>

      <div className="bg-[#FFF4E8] p-4 rounded-lg h-[145px] shadow-lg flex flex-col justify-center items-center text-center">
        <h3 className="text-sm font-semibold text-[#F39117]">Total Pesanan</h3>
        <p className="text-sm md:text-md lg:text-[18px] font-bold text-black">150</p>
      </div>

      <div className="bg-[#FFF4E8] p-4 rounded-lg h-[145px] shadow-lg flex flex-col justify-center items-center text-center">
        <h3 className="text-sm font-semibold text-[#F39117]">Total Produk</h3>
        <p className="text-sm md:text-md lg:text-[18px] font-bold text-black">150</p>
      </div>
    </div>
  );
}