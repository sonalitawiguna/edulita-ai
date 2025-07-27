# PowerShell deployment script for Windows users

Write-Host "🚀 Starting deployment process for Edulita Insight..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Make sure you're in the project root directory." -ForegroundColor Red
    exit 1
}

# Check if required environment variables are set
if (-not $env:GOOGLE_GENERATIVE_AI_API_KEY) {
    Write-Host "⚠️  Warning: GOOGLE_GENERATIVE_AI_API_KEY not set in environment" -ForegroundColor Yellow
    Write-Host "   Make sure to set it in Vercel dashboard after deployment" -ForegroundColor Yellow
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

Write-Host "🔍 Running linting..." -ForegroundColor Blue
npm run lint

Write-Host "🏗️  Building application..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing Git repository..." -ForegroundColor Blue
    git init
    git branch -M main
}

# Add all files and commit
Write-Host "📝 Committing changes..." -ForegroundColor Blue
git add .
$commitMessage = "feat: deploy Edulita Insight to Vercel - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "⚠️  No Git remote found. Please add your GitHub repository:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/USERNAME/edulita-insight.git" -ForegroundColor Yellow
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
git push origin main

Write-Host "🎉 Code pushed to GitHub successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Login with your GitHub account" -ForegroundColor White
Write-Host "3. Click 'New Project'" -ForegroundColor White
Write-Host "4. Import your 'edulita-insight' repository" -ForegroundColor White
Write-Host "5. Set environment variables:" -ForegroundColor White
Write-Host "   - GOOGLE_GENERATIVE_AI_API_KEY" -ForegroundColor Yellow
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL (optional)" -ForegroundColor Yellow
Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (optional)" -ForegroundColor Yellow
Write-Host "6. Click 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your app will be live at: https://your-project-name.vercel.app" -ForegroundColor Green
