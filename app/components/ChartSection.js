'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthNames = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'
];

export default function ChartSection({ data }) {
  // Transform data dari API ke bentuk yang diinginkan
  const formattedData = [];

  if (data?.length) {
    const grouped = {};

    data.forEach((item) => {
      const monthNumber = parseInt(item.bulan.split('-')[1], 10); // ambil bulan dari "2025-04"
      const monthName = monthNames[monthNumber];

      if (!grouped[monthName]) {
        grouped[monthName] = { name: monthName, makanan: 0, minuman: 0 };
      }

      if (item.product_type === 'Makanan') {
        grouped[monthName].makanan = item.total_penjualan;
      } else if (item.product_type === 'Minuman') {
        grouped[monthName].minuman = item.total_penjualan;
      }
    });

    // Convert object ke array
    for (const key in grouped) {
      formattedData.push(grouped[key]);
    }
  }

  return (
    <div className="bg-[#FFF4E8] p-4 rounded-lg shadow-lg">
      <h2 className="text-lg text-black font-semibold text-center mb-4">Grafik Penjualan Tahun Ini</h2>
      <ResponsiveContainer width="100%" height={327}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="makanan" stroke="#ECA641" strokeWidth={2} />
          <Line type="monotone" dataKey="minuman" stroke="#888888" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
