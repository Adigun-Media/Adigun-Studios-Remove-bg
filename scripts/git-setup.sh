#!/bin/bash

# Git Repository Setup Script
echo "🚀 Setting up Git repository for Adigun Studios Background Remover..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "Download from: https://git-scm.com"
    exit 1
fi

echo "✅ Git is installed: $(git --version)"

# Check if we're already in a git repository
if [ -d ".git" ]; then
    echo "✅ Already in a Git repository"
else
    echo "📁 Initializing Git repository..."
    git init
fi

# Configure git if not already configured
if [ -z "$(git config --global user.name)" ]; then
    echo "⚙️ Git user not configured. Let's set it up..."
    read -p "Enter your name: " user_name
    read -p "Enter your email: " user_email
    
    git config --global user.name "$user_name"
    git config --global user.email "$user_email"
    
    echo "✅ Git user configured:"
    echo "   Name: $(git config --global user.name)"
    echo "   Email: $(git config --global user.email)"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << 'EOL'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
EOL
    echo "✅ Created .gitignore file"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "ℹ️ No changes to commit"
else
    # Create initial commit
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: Adigun Studios Background Remover

- AI-powered background removal
- Image enhancement features
- Mobile-responsive design
- Next.js + TypeScript + Tailwind CSS"
    
    echo "✅ Initial commit created"
fi

# Check if remote origin exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote origin already configured: $(git remote get-url origin)"
else
    echo "🌐 Remote origin not configured."
    echo ""
    echo "To connect to GitHub:"
    echo "1. Create a new repository on GitHub.com"
    echo "2. Copy the repository URL"
    echo "3. Run: git remote add origin <repository-url>"
    echo "4. Run: git push -u origin main"
    echo ""
    echo "Or run this script with the repository URL:"
    echo "  ./scripts/git-setup.sh https://github.com/yourusername/adigun-studios-bg-remover.git"
fi

# If repository URL is provided as argument
if [ ! -z "$1" ]; then
    echo "🔗 Adding remote origin: $1"
    git remote add origin "$1"
    
    echo "📤 Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
        echo "🌐 Repository URL: $1"
    else
        echo "❌ Failed to push to GitHub. Please check your credentials and repository URL."
    fi
fi

echo ""
echo "🎉 Git setup complete!"
echo ""
echo "Next steps:"
echo "1. Make changes to your code"
echo "2. Stage changes: git add ."
echo "3. Commit changes: git commit -m 'your message'"
echo "4. Push changes: git push origin main"
echo ""
echo "Useful commands:"
echo "  git status          # Check repository status"
echo "  git log --oneline   # View commit history"
echo "  git branch          # List branches"
echo "  git pull origin main # Pull latest changes"
