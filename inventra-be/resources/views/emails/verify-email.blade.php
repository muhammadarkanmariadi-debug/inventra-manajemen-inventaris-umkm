<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email Anda</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; line-height: 1.6; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding: 40px 0; }
        .webkit { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01); overflow: hidden; }
        .header { padding: 40px; text-align: center; background: linear-gradient(135deg, #465fff 0%, #2a31d8 100%); color: #ffffff; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 8px 0 0; font-size: 16px; color: #c2d6ff; font-weight: 500; }
        .content { padding: 40px; text-align: left; background-color: #ffffff; }
        .content h2 { color: #111827; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; }
        .content p { color: #4b5563; font-size: 16px; margin-bottom: 24px; line-height: 1.7; }
        .btn-wrapper { text-align: center; margin: 40px 0; }
        .btn { display: inline-block; background-color: #465fff; color: #ffffff !important; font-weight: 600; font-size: 16px; text-decoration: none; padding: 16px 32px; border-radius: 10px; box-shadow: 0 4px 14px 0 rgba(70, 95, 255, 0.39); transition: transform 0.2s, box-shadow 0.2s; }
        .btn:hover { background-color: #3641f5; box-shadow: 0 6px 20px 0 rgba(70, 95, 255, 0.5); }
        .sub-text { font-size: 14px; color: #6b7280; margin-top: 24px; background-color: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #f3f4f6; }
        .footer { padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: center; }
        .footer p { color: #9ca3af; font-size: 14px; margin: 0 0 8px 0; }
        a.link { color: #465fff; text-decoration: none; word-break: break-all; }
        a.link:hover { text-decoration: underline; }
        .logo-img { max-height: 48px; width: auto; margin-bottom: 20px; display: inline-block; border: 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="webkit">
            <!-- Header -->
            <div class="header">
                <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}" style="display:inline-block; text-decoration:none;">
                    <img src="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/images/logo/logo-dark.svg" alt="Inventra" class="logo-img">
                </a>
                <h1>Verifikasi Email Anda</h1>
                <p>Satu langkah lagi untuk mulai mengelola bisnis Anda</p>
            </div>
            
            <!-- Email Body -->
            <div class="content">
                <h2>Halo Sobat Inventra,</h2>
                <p>Terima kasih telah mendaftar di <strong>Inventra</strong>, platform manajemen inventaris dan keuangan UMKM terpercaya. Untuk memastikan keamanan akun Anda, silakan verifikasi alamat email ini dengan menekan tombol di bawah.</p>
                
                <div class="btn-wrapper">
                    <a href="{{ $url }}" class="btn">Verifikasi Email Sekarang</a>
                </div>
                
                <p>Jika Anda merasa tidak pernah mendaftar akun di Inventra, Anda dapat mengabaikan email ini. Tautan verifikasi ini akan kedaluwarsa dalam 60 menit.</p>
                
                <div class="sub-text">
                    Kesulitan menekan tombol di atas? Salin dan tempel tautan berikut ke peramban web (browser) Anda:<br><br>
                    <a href="{{ $url }}" class="link">{{ $url }}</a>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>&copy; {{ date('Y') }} Inventra by Muhammad Arkan. Hak cipta dilindungi.</p>
                <p>Punya pertanyaan? <a href="mailto:support@inventra.id" class="link">Hubungi Dukungan Kami</a></p>
            </div>
        </div>
    </div>
</body>
</html>
