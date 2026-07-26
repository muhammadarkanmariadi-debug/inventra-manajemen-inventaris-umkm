const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

// Dictionary for B2B overrides
const dictionary = {
  "Surat Jalan": "Delivery Order",
  "Barang": "Product",
  "Gudang": "Warehouse",
  "Pemasok": "Supplier",
  "Pelanggan": "Customer",
  "Simpan": "Save",
  "Ubah": "Edit",
  "Hapus": "Delete",
  "Batal": "Cancel",
  "Memuat": "Loading",
  "Tambah": "Add",
  "Keluar": "Logout",
  "Masuk": "Login",
  "Beranda": "Dashboard",
  "Pengaturan": "Settings",
  "Laporan": "Reports",
  "Pilih": "Select",
  "Berhasil": "Success",
  "Gagal": "Failed",
  "Cari": "Search",
  "Kembali": "Back",
  "Status": "Status",
  "Aksi": "Action",
  "Kategori": "Category",
  "Harga": "Price",
  "Nama": "Name",
  "Tidak ada data": "No data available",
  "Peringatan": "Warning",
  "Stok Menipis": "Low Stock",
  "Peran": "Role",
  "Pengguna": "User",
  "Hak Akses": "Permissions",
  "Terjadi kesalahan saat menyimpan": "An error occurred while saving",
  "Data berhasil disimpan": "Data saved successfully",
  "Apakah Anda yakin": "Are you sure",
  "Ya": "Yes",
  "Tidak": "No",
  "Tanggal": "Date",
  "Jumlah": "Quantity",
  "Total": "Total",
  "Produk": "Product",
  "Riwayat": "History",
};

function applyOverrides(text) {
  let out = text;
  for (const [id, en] of Object.entries(dictionary)) {
    // Case sensitive exact match
    if (out === id) {
      return en;
    }
    // Case insensitive replacement for longer phrases
    const regex = new RegExp(`\\b${id}\\b`, 'gi');
    out = out.replace(regex, (match) => {
      // Preserve case
      if (match === match.toUpperCase()) return en.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return en.charAt(0).toUpperCase() + en.slice(1);
      return en.toLowerCase();
    });
  }
  return out;
}

async function run() {
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
        // Needs translation
        console.log(`Translating: ${currentMsgid}`);
        try {
          // If it matches exactly in dictionary
          if (dictionary[currentMsgid]) {
            translatedLines.push(`msgstr "${dictionary[currentMsgid]}"`);
          } else {
            const res = await translate(currentMsgid, { to: 'en' });
            let translated = res.text;
            translated = applyOverrides(translated);
            // Replace any accidental smart quotes or backticks to regular if needed
            translatedLines.push(`msgstr "${translated.replace(/"/g, '\\"')}"`);
          }
        } catch (e) {
          console.error(`Failed to translate: ${currentMsgid}`, e.message);
          translatedLines.push(`msgstr ""`);
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
    
    // rate limit prevention
    if (i % 20 === 0) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  fs.writeFileSync(poFile, translatedLines.join('\n'));
  console.log("Translation complete!");
}

run();
