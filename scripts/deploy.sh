#!/bin/bash

echo "🚀 Starting deployment process for Edulita Insight..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$GOOGLE_GENERATIVE_AI_API_KEY" ]; then
    echo "⚠️  Warning: GOOGLE_GENERATIVE_AI_API_KEY not set in environment"
    echo "   Make sure to set it in Vercel dashboard after deployment"
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Running linting..."
npm run lint --fix

echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files and commit
echo "📝 Committing changes..."
git add .
git commit -m "feat: deploy Edulita Insight to Vercel - $(date)"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No Git remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/USERNAME/edulita-insight.git"
    echo "   Then run this script again."
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "🎉 Code pushed to GitHub successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Login with your GitHub account"
echo "3. Click 'New Project'"
echo "4. Import your 'edulita-insight' repository"
echo "5. Set environment variables:"
echo "   - GOOGLE_GENERATIVE_AI_API_KEY"
echo "   - NEXT_PUBLIC_SUPABASE_URL (optional)"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (optional)"
echo "6. Click 'Deploy'"
echo ""
echo "🚀 Your app will be live at: https://your-project-name.vercel.app"
