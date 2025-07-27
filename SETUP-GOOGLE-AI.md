# 🤖 Setup Google AI Studio untuk Edulita Insight

## 📋 Langkah-langkah Setup

### 1. Dapatkan Google AI API Key

1. **Buka Google AI Studio:**
   - Kunjungi: https://makersuite.google.com/app/apikey
   - Login dengan akun Google Anda

2. **Buat API Key:**
   - Klik tombol "Create API Key"
   - Pilih project Google Cloud (atau buat baru)
   - Copy API key yang dihasilkan

### 2. Konfigurasi Environment Variable

1. **Edit file .env.local:**
   \`\`\`bash
   # Buka file .env.local dengan text editor
   notepad .env.local
   \`\`\`

2. **Ganti placeholder dengan API key asli:**
   \`\`\`env
   # Ganti baris ini:
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here
   
   # Dengan API key Anda:
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyC-your-actual-api-key-here
   \`\`\`

### 3. Restart Development Server

\`\`\`bash
# Stop server (Ctrl+C) lalu restart
npm run dev
\`\`\`

## ✅ Verifikasi Setup

1. **Buka aplikasi:** http://localhost:3000
2. **Login dengan role apapun**
3. **Buka tab "AI Assistant"**
4. **Cek status di header chatbot:**
   - ✅ "Powered by Gemini" = API key berhasil dikonfigurasi
   - ⚠️ "Demo Mode" = API key belum dikonfigurasi

## 🔧 Troubleshooting

### Error: "Google AI API key not configured"
- Pastikan API key sudah dimasukkan ke .env.local
- Pastikan tidak ada typo dalam API key
- Restart development server

### Error: "API key invalid"
- Periksa kembali API key di Google AI Studio
- Pastikan API key tidak expired
- Coba generate API key baru

### Chatbot masih dalam "Demo Mode"
- Periksa file .env.local sudah tersimpan
- Pastikan API key tidak masih berupa placeholder
- Restart server dengan npm run dev

## 💡 Tips

1. **Gratis:** Google AI Studio memberikan quota gratis yang generous
2. **Keamanan:** Jangan commit file .env.local ke git
3. **Backup:** Simpan API key di tempat yang aman
4. **Testing:** Coba berbagai pertanyaan untuk test AI

## 🎯 Fitur yang Aktif Setelah Setup

- ✅ **AI Chatbot Cerdas** dengan Google Gemini
- ✅ **Respons Kontekstual** sesuai role pengguna
- ✅ **Bahasa Indonesia Natural** 
- ✅ **Penjelasan Materi Pelajaran** yang mendalam
- ✅ **Rekomendasi Pembelajaran** yang personal
