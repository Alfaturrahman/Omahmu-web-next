'use client';

import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, Label  } from 'recharts';

const COLORS = ['#ECA641', '#BFBFBF'];

export default function AdvancedCharts({ data }) {
  const [currentWeek, setCurrentWeek] = useState(0); // Mulai dari minggu ke-0

  function formatTanggal(tanggalString) {
    const date = new Date(tanggalString);
    const tanggal = String(date.getDate()).padStart(2, '0');
    return `${tanggal}`;
  }
  
  // Handle pie chart data
  const pieRawData = data?.dashboard_presentase || [];
  const pieData = pieRawData.map(item => ({
    name: item.product_type,
    value: parseFloat(item.persentase), // Store it as a number for the Pie chart
    percentage: `${parseFloat(item.persentase).toFixed(2)}%` // For displaying with %
  }));

  // Handle bar chart data
  const allBarData = [];
  if (data?.dashboard_daily) {
    const temp = {};

    data.dashboard_daily.forEach(item => {
      if (!temp[item.tanggal]) {
        temp[item.tanggal] = { tanggal: formatTanggal(item.tanggal), makanan: 0, minuman: 0 };
      }
      if (item.product_type === 'Makanan') {
        temp[item.tanggal].makanan = item.jumlah_terjual;
      } else if (item.product_type === 'Minuman') {
        temp[item.tanggal].minuman = item.jumlah_terjual;
      }
    });

    allBarData.push(...Object.values(temp));
  }

  // Split data per minggu
  const itemsPerPage = 7;
  const totalWeeks = Math.ceil(allBarData.length / itemsPerPage);

  const startIdx = currentWeek * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentBarData = allBarData.slice(startIdx, endIdx);

  // Cek apakah semua penjualan 0
  const isEmpty = currentBarData.every(item => item.makanan === 0 && item.minuman === 0);

  // Menangani grafik kosong
  const emptyBarData = currentBarData.length > 0 ? currentBarData : [{ tanggal: '', makanan: 0, minuman: 0 }];

  return (
    <div className="flex flex-col md:flex-row lg:flex-col items-center justify-center gap-6">
      
      {/* Grafik Batang */}
      <div className="bg-[#FFF4E8] rounded-lg p-4 shadow-lg flex flex-col items-center justify-center w-full h-[260px]">
        <h3 className="text-center text-black font-bold mb-4">Penjualan Terlaris</h3>
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emptyBarData}>
              <XAxis dataKey="tanggal" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="makanan" fill="#ECA641" />
              <Bar dataKey="minuman" fill="#BFBFBF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

          {/* Navigasi Minggu */}
          <div className="flex justify-center items-center gap-4 mb-2">
          <button
            className="px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
            onClick={() => setCurrentWeek(prev => prev - 1)}
            disabled={currentWeek === 0}
          >
            &lt;
          </button>
          <span className="text-black font-medium">
            Minggu {currentWeek + 1} / {totalWeeks}
          </span>
          <button
            className="px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
            onClick={() => setCurrentWeek(prev => prev + 1)}
            disabled={currentWeek >= totalWeeks - 1}
          >
            &gt;
          </button>
        </div>

      </div>

      {/* Grafik Pie (Produk Terlaris) */}
      <div className="bg-[#FFF4E8] rounded-lg p-4 shadow-lg flex flex-col items-center justify-center w-full h-[320px]">
        <h2 className="text-center text-black font-bold mb-4">Produk Terlaris</h2>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`} // Show label outside slice
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name, props) => [`${value}%`, name]}
              labelFormatter={() => ''}
            />
          </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <span
                className="w-4 h-4 inline-block rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="text-sm text-black">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
