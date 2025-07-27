# PowerShell script untuk Windows
Write-Host "🚀 Setting up Edulita Insight on Windows..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    
    $envContent = @"
# Supabase Configuration (Optional for development)
NEXT_PUBLIC_SUPABASE_URL=https://demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-anon-key

# Google AI Studio Configuration (REQUIRED)
# Ganti dengan API key Anda yang sebenarnya dari https://makersuite.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here

# OpenAI Configuration (Alternative - comment out if using Google AI)
# OPENAI_API_KEY=your-openai-api-key-here
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ .env.local file created!" -ForegroundColor Green
    Write-Host "⚠️  Please update .env.local with your actual Google AI API key" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

Write-Host "✅ Setup complete! Run 'npm run dev' to start the development server." -ForegroundColor Green
Write-Host "🌐 Don't forget to get your Google AI API key from: https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
