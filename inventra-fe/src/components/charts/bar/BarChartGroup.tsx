"use client";
import React, { useEffect, useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { analyzeIncomeExpenses } from "../../../../services/dashboard.service";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyStats {
  income: number;
  expense: number;
}

// Struktur data utama (Object dengan Key string dan Value MonthlyStats)
interface FinancialDataState {
  [monthYear: string]: MonthlyStats;
}

export default function BarChartGroup() {
  const [apiData, setApiData] = useState<FinancialDataState>({})
  useEffect(() => {
    const handleFunction = async () => {
      const apiData = await analyzeIncomeExpenses();
      setApiData(apiData)
    }
    handleFunction()


  }, [])
  const labels = Object.keys(apiData); // ['January 2026', 'February 2026', ...]

  // 2. Ambil nilai Income untuk Series 1
  const incomeData = labels.map(month => apiData[month].income);

  // 3. Ambil nilai Expense untuk Series 2
  const expenseData = labels.map(month => apiData[month].expense);
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartGroup" className="min-w-[1000px]">
        <BarChart
          xAxis={[{
            data: labels, // Label bulan-tahun
            scaleType: 'band'
          }]}
          series={[
            {
              data: incomeData,
              label: 'Pemasukan',
              color: '#4caf50' // Hijau
            },
            {
              data: expenseData,
              label: 'Pengeluaran',
              color: '#f44336' // Merah
            }
          ]}
          height={300}
          // Tambahkan margin agar label xAxis tidak terpotong
          margin={{ top: 50, bottom: 50, left: 80, right: 10 }}
        />


      </div>
    </div>
  );
}


