<?php

namespace App\Services;

use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Log;

class GeminiService
{

    private function basePrompt()
    {
        return "
    Kamu adalah AI Business Analyst untuk aplikasi Inventra (inventory & financial UMKM).

    Tugas:
    - Analisis data bisnis
    - Berikan insight yang jelas dan actionable
    - Fokus ke profit, penjualan, dan stok

    Gaya:
    - Bahasa Indonesia
    - Singkat, jelas, to the point
    - Jangan hanya deskripsi, harus ada insight

    Jika data kurang → katakan dengan jujur
    ";
    }

    public function askWithContext(string $question, $dataContext = null)
    {
        try {
            $formattedContext = is_string($dataContext)
                ? $dataContext
                : json_encode($dataContext, JSON_PRETTY_PRINT);

            $prompt = $this->basePrompt() . "

        DATA:
        $formattedContext

        PERTANYAAN:
        $question

        Jawaban:
        ";

            return Gemini::generativeModel(model: 'gemini-2.5-flash')->generateContent($prompt);
        } catch (\Exception $e) {
            Log::error("Gemini Error: " . $e->getMessage());
            return "Maaf, sistem AI sedang mengalami gangguan.";
        }
    }

    public function analyzeInventory($products)
    {
        $prompt = $this->basePrompt() . "

    DATA PRODUK:
    " . $products->toJson() . "

    Analisis dan berikan:
    1. Produk yang harus segera restock
    2. Produk dengan stok aman
    3. Risiko kehabisan stok
    4. Rekomendasi tindakan

    Format jawaban:
    - poin poin
    ";
        return Gemini::generativeModel(model: 'gemini-2.5-flash')->generateContent($prompt);
    }

    public function analyzeSales($sales)
    {
        $prompt = $this->basePrompt() . "

    DATA PENJUALAN:
    " . $sales->toJson() . "

    Analisis dan berikan:

    1. Total keuntungan
    2. Tren penjualan (naik / turun)
    3. Produk terlaris
    4. Insight utama (maks 3 poin)
    5. Rekomendasi bisnis

    Jawaban harus ringkas dan actionable.
    ";

        return Gemini::generativeModel(model: 'gemini-2.5-flash')->generateContent($prompt);
    }

    public function analyzeFinancial($data)
    {
        $prompt = $this->basePrompt() . "

    DATA KEUANGAN:
    " . json_encode($data, JSON_PRETTY_PRINT) . "

    Analisis:
    1. Total income
    2. Total expense
    3. Profit / loss
    4. Kondisi cashflow (sehat / tidak)
    5. Rekomendasi perbaikan

    Jawaban singkat dan jelas.
    ";

        return Gemini::generativeModel(model: 'gemini-2.5-flash')->generateContent($prompt);
    }
}
