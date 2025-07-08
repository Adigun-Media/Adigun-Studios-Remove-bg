# Deployment Guide

## Quick Start

### 1. Local Development
\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/adigun-studios-bg-remover.git
cd adigun-studios-bg-remover

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### 2. GitHub Setup
\`\`\`bash
# Initialize git (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/yourusername/adigun-studios-bg-remover.git

# Push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin main
\`\`\`

### 3. Vercel Deployment

#### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables (if any)
6. Click "Deploy"

#### Option B: Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
\`\`\`

## Environment Variables

### Required Variables
\`\`\`env
NEXT_PUBLIC_APP_NAME=Adigun Studios Background Remover
NEXT_PUBLIC_APP_VERSION=1.0.0
\`\`\`

### Optional Variables
\`\`\`env
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
\`\`\`

## Continuous Deployment

### Automatic Deployment
- Push to `main` branch → Auto-deploy to production
- Push to `develop` branch → Auto-deploy to preview
- Pull requests → Deploy preview environments

### Manual Deployment
\`\`\`bash
# Deploy preview
npm run deploy:preview

# Deploy production
npm run deploy
\`\`\`

## Monitoring & Analytics

### Vercel Analytics
- Automatically enabled for all deployments
- View performance metrics in Vercel dashboard

### Error Tracking
- Configure Sentry for error monitoring
- Add SENTRY_DSN to environment variables

## Domain Configuration

### Custom Domain
1. Go to Vercel project dashboard
2. Click "Domains" tab
3. Add your custom domain
4. Configure DNS records as instructed

### SSL Certificate
- Automatically provisioned by Vercel
- Supports custom domains and subdomains

## Performance Optimization

### Build Optimization
- Next.js automatic code splitting
- Image optimization with Next.js Image component
- Static generation for better performance

### Caching Strategy
- Static assets cached at CDN edge
- API routes cached based on headers
- Dynamic content optimized for performance
