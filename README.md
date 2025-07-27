# Edulita Insight - Platform Pendidikan AI

Platform edukatif berbasis chatbot AI multimodal untuk meningkatkan mutu pendidikan di Indonesia.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Google AI Studio API Key
- Supabase Account (opsional untuk development)

### Installation

1. **Clone atau download project ini**
2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup environment variables:**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Edit `.env.local` dan tambahkan:
   \`\`\`env
   # Google AI Studio (WAJIB)
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
   
   # Supabase (Opsional untuk development)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Jalankan development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Buka browser dan akses:**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 🔑 Cara Mendapatkan API Keys

### Google AI Studio API Key (WAJIB)
1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Create API Key"
4. Copy API key dan paste ke `.env.local`

### Supabase Setup (Opsional)
1. Kunjungi [Supabase](https://supabase.com)
2. Buat project baru
3. Copy URL dan Anon Key dari Settings > API
4. Jalankan SQL scripts di `scripts/` folder

## 👥 Login Credentials (Development Mode)

Untuk testing, Anda bisa menggunakan kredensial apapun:

**Siswa:**
- Email: `siswa@demo.com`
- Password: `password123`
- Role: Siswa

**Guru:**
- Email: `guru@demo.com`
- Password: `password123`
- Role: Guru

**Kepala Sekolah:**
- Email: `kepsek@demo.com`
- Password: `password123`
- Role: Kepala Sekolah

## 🎯 Fitur Utama

- 🤖 **AI Chatbot** dengan Google Gemini
- 📚 **Multi-Role Dashboard** (Siswa, Guru, Kepala Sekolah, dll)
- 📄 **Upload & Analisis Dokumen**
- 🧠 **Generator Kuis AI**
- 📊 **Visualisasi Data Pembelajaran**
- 🔐 **Sistem Autentikasi Multi-Role**

## 🛠️ Development Commands

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint
\`\`\`

## 📁 Project Structure

\`\`\`
edulita-insight/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── chatbot/          # AI Chatbot
│   ├── dashboards/       # Role-specific dashboards
│   ├── file-upload/      # File upload functionality
│   ├── quiz/             # Quiz generator
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utilities and configurations
│   ├── database.ts       # Database operations
│   └── supabase.ts       # Supabase client
├── scripts/              # Database scripts
└── hooks/                # Custom React hooks
\`\`\`

## 🔧 Troubleshooting

### Error: "Google AI API key not configured"
- Pastikan `GOOGLE_GENERATIVE_AI_API_KEY` ada di `.env.local`
- Restart development server setelah menambah environment variable

### Error: "Module not found"
- Jalankan `npm install` untuk install dependencies
- Pastikan Node.js versi 18+

### Chatbot tidak merespons
- Periksa API key Google AI Studio
- Cek console browser untuk error messages
- Pastikan koneksi internet stabil

### Database errors (jika menggunakan Supabase)
- Periksa Supabase URL dan keys
- Jalankan SQL scripts di Supabase dashboard
- Pastikan RLS policies sudah disetup

## 🚀 Deployment ke Vercel

### Persiapan Sebelum Deploy

1. **Pastikan semua environment variables sudah siap:**
   \`\`\`env
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url (opsional)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key (opsional)
   \`\`\`

2. **Test aplikasi di local terlebih dahulu:**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

### Cara Deploy ke Vercel

#### Metode 1: Deploy via GitHub (Recommended)

1. **Push code ke GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/edulita-insight.git
   git push -u origin main
   \`\`\`

2. **Deploy via Vercel Dashboard:**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan akun GitHub
   - Klik "New Project"
   - Import repository "edulita-insight"
   - Configure project settings:
     - Framework Preset: **Next.js**
     - Root Directory: **/** (default)
     - Build Command: **npm run build** (default)
     - Output Directory: **.next** (default)

3. **Set Environment Variables di Vercel:**
   - Di project dashboard, klik "Settings" → "Environment Variables"
   - Tambahkan:
     \`\`\`
     GOOGLE_GENERATIVE_AI_API_KEY = your_api_key_here
     NEXT_PUBLIC_SUPABASE_URL = your_supabase_url (jika pakai)
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_key (jika pakai)
     \`\`\`

4. **Deploy:**
   - Klik "Deploy"
   - Tunggu proses build selesai (2-5 menit)
   - Aplikasi akan tersedia di: `https://your-project-name.vercel.app`

#### Metode 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login ke Vercel:**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy aplikasi:**
   \`\`\`bash
   vercel
   \`\`\`
   
   Ikuti prompt:
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name: **edulita-insight**
   - Directory: **./** (default)

4. **Set environment variables:**
   \`\`\`bash
   vercel env add GOOGLE_GENERATIVE_AI_API_KEY
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   \`\`\`

5. **Redeploy dengan env vars:**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Custom Domain (Opsional)

1. **Beli domain atau gunakan domain yang sudah ada**
2. **Di Vercel Dashboard:**
   - Klik project → "Settings" → "Domains"
   - Tambahkan domain custom
   - Update DNS records sesuai instruksi Vercel

### Monitoring & Maintenance

1. **Analytics:**
   - Vercel menyediakan analytics gratis
   - Monitor traffic dan performance

2. **Logs:**
   - Cek logs di Vercel dashboard untuk debugging
   - Monitor function execution

3. **Auto-deployment:**
   - Setiap push ke main branch akan auto-deploy
   - Preview deployments untuk branch lain

### Troubleshooting Deployment

#### Build Errors:
\`\`\`bash
# Jika ada TypeScript errors
npm run build
# Fix errors yang muncul

# Jika ada dependency issues
npm install
npm audit fix
\`\`\`

#### Environment Variables Issues:
- Pastikan semua env vars sudah diset di Vercel
- Restart deployment setelah menambah env vars
- Cek di function logs apakah env vars terbaca

#### Performance Issues:
- Enable Edge Runtime jika perlu
- Optimize images dan assets
- Monitor function execution time

### Security Checklist

- ✅ API keys tidak di-commit ke Git
- ✅ Environment variables di-set dengan benar
- ✅ CORS settings sudah tepat
- ✅ Rate limiting untuk API calls
- ✅ Input validation di semua forms

## 📞 Support

Jika mengalami masalah, periksa:
1. Console browser (F12) untuk error messages
2. Terminal untuk server errors
3. Network tab untuk API call failures

## 🎓 Demo Accounts

Aplikasi mendukung mode development dengan mock authentication. Anda bisa login dengan email dan password apapun, pilih role yang diinginkan untuk testing fitur yang berbeda.
