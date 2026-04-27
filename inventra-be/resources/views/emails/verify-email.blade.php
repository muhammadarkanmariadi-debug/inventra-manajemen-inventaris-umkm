<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email Anda</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f9f9fb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; line-height: 1.6; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f9f9fb; padding-bottom: 60px; padding-top: 40px; }
        .webkit { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); overflow: hidden; }
        .header { padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border-bottom: 1px solid #f3f4f6; }
        .header img { max-width: 140px; height: auto; }
        .content { padding: 30px 40px 40px; text-align: left; }
        h1 { color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 20px; }
        p { color: #4b5563; font-size: 16px; margin-bottom: 24px; }
        .btn-wrapper { text-align: center; margin: 35px 0; }
        .btn { display: inline-block; background-color: #10b981; color: #ffffff !important; font-weight: 600; font-size: 16px; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39); transition: all 0.3s ease; }
        .sub-text { font-size: 14px; color: #6b7280; margin-top: 24px; }
        .footer { padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: center; }
        .footer p { color: #9ca3af; font-size: 13px; margin: 0; }
        a.link { color: #10b981; text-decoration: none; word-break: break-all; }
        a.link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="webkit">
            <!-- Header with Logo -->
            <div class="header">
                <!-- Gunakan link logo asli Anda di sini jika ada. Placeholder menggunakan teks premium untuk sementarra. -->
                <img src="https://via.placeholder.com/280x80/10b981/ffffff?text=INVENTRA" alt="Inventra Logo">
            </div>
            
            <!-- Email Body -->
            <div class="content">
                <h1>Verifikasi Alamat Email Anda</h1>
                <p>Halo,</p>
                <p>Terima kasih telah bergabung dengan <strong>Inventra</strong>, sistem manajemen inventaris UMKM pilihan. Untuk memastikan keamanan akun Anda dan mengakses semua fitur premium kami, harap verifikasi alamat email Anda dengan mengklik tombol di bawah ini.</p>
                
                <div class="btn-wrapper">
                    <a href="{{ $url }}" class="btn">Verifikasi Email Sekarang</a>
                </div>
                
                <p>Jika Anda tidak mendaftarkan akun di Inventra, Anda dapat mengabaikan email ini dengan aman.</p>
                
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p class="sub-text">
                    Kesulitan mengklik tombol di atas? Salin dan tempel URL berikut ke peramban web (browser) Anda:<br>
                    <a href="{{ $url }}" class="link">{{ $url }}</a>
                </p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>&copy; {{ date('Y') }} Inventra by Muhammad Arkan. Seluruh hak cipta dilindungi.</p>
                <p>Gedung Menara Inventra, Jakarta - Indonesia</p>
            </div>
        </div>
    </div>
</body>
</html>
