const fs = require('fs');

const dict = {
  "Simpan": "Save",
  "Batal": "Cancel",
  "Hapus": "Delete",
  "Ubah": "Edit",
  "Tambah": "Add",
  "Edit": "Edit",
  "Aksi": "Action",
  "Nama": "Name",
  "Harga": "Price",
  "Harga Jual": "Selling Price",
  "Harga Beli": "Purchase Price",
  "Kategori": "Category",
  "Status": "Status",
  "Gudang": "Warehouse",
  "Pemasok": "Supplier",
  "Pelanggan": "Customer",
  "Riwayat": "History",
  "Transaksi": "Transaction",
  "Pengguna": "User",
  "Role": "Role",
  "Deskripsi": "Description",
  "Total": "Total",
  "Jumlah": "Quantity",
  "Subtotal": "Subtotal",
  "Pilih": "Select",
  "Cari": "Search",
  "Memuat data...": "Loading data...",
  "Tidak ada data": "No data available",
  "Kembali": "Back",
  "Berhasil": "Success",
  "Gagal": "Failed",
  "Perbarui": "Update",
  "Pengaturan": "Settings",
  "Keluar": "Logout",
  "Masuk": "Login",
  "Daftar": "Register",
  "Kata Sandi": "Password",
  "Lupa Kata Sandi": "Forgot Password",
  "Tanggal": "Date",
  "Catatan": "Note",
  "Alamat": "Address",
  "Telepon": "Phone",
  "Email": "Email",
  "Kredensial & API Key Developer": "Developer Credentials & API Key",
  "Generate Key": "Generate Key",
  "Penting:": "Important:",
  "Active": "Active",
  "Menu": "Menu",
  "Ubah Password": "Change Password",
  "Password Baru": "New Password",
  "Konfirmasi Password Baru": "Confirm New Password",
  "Menyimpan...": "Saving...",
  "Simpan Perubahan": "Save Changes",
  "Terang": "Light",
  "Gelap": "Dark",
  "Mode Tampilan": "Appearance Mode",
  "Warna Tema": "Theme Color",
  "Mode notifikasi": "Notification Mode",
  "Memuat...": "Loading...",
  "Stok Awal": "Initial Stock",
  "Stok": "Stock",
  "Dashboard": "Dashboard",
  "Produk": "Product",
  "Inventaris": "Inventory",
  "Penyesuaian Stok": "Stock Adjustment",
  "Prediksi Stok": "Stock Prediction",
  "Manajemen Gudang": "Warehouse Management",
  "Manajemen Pengguna": "User Management",
  "Pengaturan Aplikasi": "App Settings",
  "Dokumen": "Document",
  "Laporan": "Report",
  "Bisnis Anda": "Your Business",
  "Ringkasan bisnis Anda": "Your business summary",
  "Pemasukan": "Income",
  "Pengeluaran": "Expense",
  "Dari": "From",
  "Sampai": "To",
  "Produk Terlaris": "Top Selling Products",
  "Lebih tinggi dari bulan lalu": "Higher than last month",
  "Lebih rendah dari bulan lalu": "Lower than last month",
};

function translate(text) {
  if (dict[text]) return dict[text];
  
  let out = text;
  Object.keys(dict).forEach(k => {
    const regex = new RegExp(`\\b${k}\\b`, 'gi');
    out = out.replace(regex, dict[k]);
  });
  return out;
}

const poFile = 'src/locales/en/messages.po';
const lines = fs.readFileSync(poFile, 'utf-8').split('\n');

let translatedLines = [];
let currentMsgid = "";
let inMsgid = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('msgid "')) {
    currentMsgid = line.substring(7, line.length - 1);
    translatedLines.push(line);
    inMsgid = true;
  } else if (line.startsWith('msgstr "')) {
    inMsgid = false;
    const currentMsgstr = line.substring(8, line.length - 1);
    if (currentMsgstr === "" && currentMsgid !== "") {
      const trans = translate(currentMsgid);
      if (trans !== currentMsgid) {
         translatedLines.push(`msgstr "${trans.replace(/"/g, '\\"')}"`);
      } else {
         // Default translation just use the original to avoid blank fallback
         translatedLines.push(`msgstr "${currentMsgid.replace(/"/g, '\\"')}"`);
      }
    } else {
      translatedLines.push(line);
    }
    currentMsgid = "";
  } else {
    if (inMsgid && line.startsWith('"')) {
      currentMsgid += line.substring(1, line.length - 1);
    }
    translatedLines.push(line);
  }
}

fs.writeFileSync(poFile, translatedLines.join('\n'));
console.log("Dictionary translation complete!");
