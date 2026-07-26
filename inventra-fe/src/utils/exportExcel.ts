import * as XLSX from 'xlsx';

/**
 * Utility to export an array of JSON objects to an Excel (.xlsx) file.
 * @param data Array of objects to export
 * @param filename Name of the file (without .xlsx extension)
 */
export const exportToExcel = <T>(data: T[], filename: string) => {
  if (!data || data.length === 0) {
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
