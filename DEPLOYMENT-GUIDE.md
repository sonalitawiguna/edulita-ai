# 🚀 Panduan Deployment Edulita Insight ke Vercel

## 📋 Checklist Sebelum Deploy

### ✅ Persiapan Kode
- [ ] Aplikasi berjalan dengan baik di local (`npm run dev`)
- [ ] Build berhasil tanpa error (`npm run build`)
- [ ] Semua dependencies sudah terinstall
- [ ] Code sudah di-commit ke Git repository

### ✅ Environment Variables
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY` sudah didapat dari Google AI Studio
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (jika menggunakan Supabase)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (jika menggunakan Supabase)

### ✅ Account Setup
- [ ] Akun GitHub sudah ada
- [ ] Akun Vercel sudah dibuat
- [ ] Repository sudah di-push ke GitHub

---

## 🎯 Langkah-langkah Deploy

### 1️⃣ Persiapan Repository

\`\`\`bash
# Inisialisasi Git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "feat: initial commit - Edulita Insight platform"

# Set branch utama
git branch -M main

# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/edulita-insight.git

# Push ke GitHub
git push -u origin main
\`\`\`

### 2️⃣ Deploy via Vercel Dashboard

1. **Buka [vercel.com](https://vercel.com)**
2. **Login dengan GitHub**
3. **Klik "New Project"**
4. **Import repository "edulita-insight"**
5. **Configure settings:**
   \`\`\`
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   \`\`\`

### 3️⃣ Set Environment Variables

Di Vercel Dashboard → Settings → Environment Variables:

\`\`\`env
# WAJIB - Google AI API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# OPSIONAL - Supabase (jika digunakan)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4️⃣ Deploy & Test

1. **Klik "Deploy"**
2. **Tunggu build process (2-5 menit)**
3. **Test aplikasi di URL yang diberikan**
4. **Verifikasi semua fitur berfungsi**

---

## 🔧 Deployment via CLI (Alternative)

### Install Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

### Login & Deploy
\`\`\`bash
# Login ke Vercel
vercel login

# Deploy aplikasi
vercel

# Set environment variables
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Production deployment
vercel --prod
\`\`\`

---

## 🌐 Custom Domain Setup

### 1. Beli Domain
- Namecheap, GoDaddy, atau provider lainnya
- Atau gunakan domain yang sudah ada

### 2. Setup di Vercel
1. **Project Dashboard → Settings → Domains**
2. **Add domain:** `edulita-insight.com`
3. **Update DNS records:**
   \`\`\`
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   \`\`\`

### 3. SSL Certificate
- Vercel otomatis provide SSL certificate
- HTTPS akan aktif dalam 24 jam

---

## 📊 Monitoring & Analytics

### Built-in Analytics
- **Real-time visitors**
- **Page views**
- **Performance metrics**
- **Error tracking**

### Custom Analytics (Optional)
\`\`\`typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined') {
    // Google Analytics, Mixpanel, etc.
    console.log('Event:', eventName, properties);
  }
};
\`\`\`

---

## 🚨 Troubleshooting

### Build Errors

#### TypeScript Errors:
\`\`\`bash
# Check dan fix TypeScript errors
npm run build

# Jika masih error, temporary disable strict mode
# di tsconfig.json: "strict": false
\`\`\`

#### Dependency Issues:
\`\`\`bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update
\`\`\`

### Runtime Errors

#### Environment Variables:
\`\`\`bash
# Cek apakah env vars terbaca
console.log('API Key exists:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
\`\`\`

#### API Issues:
- Cek Vercel Function Logs
- Monitor API rate limits
- Verify CORS settings

### Performance Issues

#### Optimize Bundle:
\`\`\`javascript
// next.config.mjs
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
};
\`\`\`

#### Monitor Performance:
- Vercel Analytics
- Core Web Vitals
- Function execution time

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit API keys to Git
- ✅ Use different keys for development/production
- ✅ Rotate keys regularly

### API Security
\`\`\`typescript
// Rate limiting example
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};
\`\`\`

### Input Validation
\`\`\`typescript
// Validate all user inputs
import { z } from 'zod';

const messageSchema = z.object({
  content: z.string().min(1).max(1000),
  role: z.enum(['user', 'assistant']),
});
\`\`\`

---

## 📞 Support & Resources

### Vercel Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Platform](https://vercel.com/docs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Community Support
- [Vercel Discord](https://discord.gg/vercel)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)

### Emergency Contacts
- Vercel Support: support@vercel.com
- Status Page: status.vercel.com

---

## 🎉 Post-Deployment Checklist

### ✅ Functionality Test
- [ ] Login system works
- [ ] AI Chatbot responds
- [ ] File upload works
- [ ] All dashboards load
- [ ] Database operations work

### ✅ Performance Test
- [ ] Page load speed < 3 seconds
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] API response times

### ✅ SEO & Analytics
- [ ] Meta tags configured
- [ ] Analytics tracking
- [ ] Sitemap generated
- [ ] Search console setup

### ✅ Security Audit
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] Input validation working
- [ ] Rate limiting active

---

**🚀 Selamat! Aplikasi Edulita Insight sudah live dan siap digunakan publik!**

URL Aplikasi: `https://your-project-name.vercel.app`
