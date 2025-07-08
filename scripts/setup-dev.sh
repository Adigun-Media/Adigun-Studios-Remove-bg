#!/bin/bash

# Development Environment Setup Script
echo "🚀 Setting up Adigun Studios Background Remover development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_NAME=Adigun Studios Background Remover
NEXT_PUBLIC_APP_VERSION=1.0.0
EOL
    echo "✅ Created .env.local file"
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Run linter
echo "🧹 Running linter..."
npm run lint

# Build the project
echo "🏗️ Building project..."
npm run build

echo "🎉 Development environment setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To deploy:"
echo "  npm run deploy:preview  # Preview deployment"
echo "  npm run deploy         # Production deployment"
