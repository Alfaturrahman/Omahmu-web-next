'use client';

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const barData = [
  { name: '1', makanan: 50, minuman: 30 },
  { name: '2', makanan: 55, minuman: 35 },
  { name: '3', makanan: 60, minuman: 40 },
  { name: '4', makanan: 70, minuman: 50 },
  { name: '5', makanan: 65, minuman: 55 },
  { name: '6', makanan: 75, minuman: 60 },
  { name: '7', makanan: 80, minuman: 65 }
];

const pieData = [
  { name: 'Makanan', value: 75 },
  { name: 'Minuman', value: 15 }
];

const COLORS = ['#ECA641', '#BFBFBF'];

export default function AdvancedCharts() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Grafik Batang */}
      <div className="bg-[#FFF4E8] rounded-lg p-4 shadow flex flex-col items-center justify-center w-full max-w-md">
        <h3 className="text-center text-black font-bold mb-2">Penjualan Terlaris</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="makanan" fill="#ECA641" />
            <Bar dataKey="minuman" fill="#BFBFBF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Pie */}
      <div className="bg-[#FFF4E8] rounded-lg p-4 shadow flex flex-col items-center justify-center w-full max-w-lg">
        <h2 className="text-sm font-semibold text-center text-black mb-2">Distribusi Produk</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="flex justify-center gap-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <span className="w-4 h-4 inline-block rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></span>
              <span className="text-sm text-black">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
