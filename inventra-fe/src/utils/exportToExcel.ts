import * as XLSX from 'xlsx';

export const exportToExcel = (data: any, fileName: any) => {
  // 1. Buat worksheet dari data JSON
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // 2. Buat workbook baru
  const workbook = XLSX.utils.book_new();
  
  // 3. Tambahkan worksheet ke dalam workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  // 4. Unduh file Excel secara otomatis
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
