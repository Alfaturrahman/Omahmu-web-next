'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', makanan: 180, minuman: 120 },
  { name: 'Feb', makanan: 200, minuman: 150 },
  { name: 'Mar', makanan: 190, minuman: 220 },
  { name: 'Apr', makanan: 220, minuman: 250 },
  { name: 'Mei', makanan: 210, minuman: 260 },
  { name: 'Jun', makanan: 180, minuman: 280 },
  { name: 'Jul', makanan: 170, minuman: 300 },
  { name: 'Aug', makanan: 300, minuman: 400 },
  { name: 'Okt', makanan: 350, minuman: 670 },
  { name: 'Nov', makanan: 400, minuman: 500 },
  { name: 'Sept', makanan: 450, minuman: 450 },
  { name: 'Des', makanan: 500, minuman: 400 },
];

export default function ChartSection() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg text-black font-semibold text-center mb-4">Grafik Penjualan Bulan Ini</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
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