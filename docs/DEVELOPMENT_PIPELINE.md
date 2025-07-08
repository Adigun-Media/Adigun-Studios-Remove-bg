# Development Pipeline - Adigun Studios Background Remover

## Overview
This document outlines the complete development workflow from local development to production deployment on Vercel.

## Pipeline Flow
\`\`\`
Local Development → Git (Local) → GitHub → Vercel (Auto-Deploy) → Production
\`\`\`

## 1. Local Development Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account

### Initial Setup
\`\`\`bash
# Clone or initialize the project
git clone <your-repo-url>
cd adigun-studios-bg-remover

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Development Commands
\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
\`\`\`

## 2. Git Workflow (Local)

### Branch Strategy
- `main` - Production branch (auto-deploys to Vercel)
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Git Commands
\`\`\`bash
# Create and switch to feature branch
git checkout -b feature/new-enhancement

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add AI image enhancement with multiple modes"

# Push to remote
git push origin feature/new-enhancement

# Switch back to main
git checkout main

# Merge feature (after PR approval)
git merge feature/new-enhancement

# Push to main (triggers Vercel deployment)
git push origin main
\`\`\`

## 3. GitHub Integration

### Repository Setup
1. Create repository on GitHub
2. Connect local repo to GitHub:
\`\`\`bash
git remote add origin https://github.com/yourusername/adigun-studios-bg-remover.git
git branch -M main
git push -u origin main
\`\`\`

### GitHub Actions (Optional)
Create `.github/workflows/ci.yml` for automated testing and building.

## 4. Vercel Deployment

### Initial Setup
1. Connect GitHub repo to Vercel
2. Configure build settings
3. Set environment variables
4. Enable auto-deployments

### Vercel Configuration
See `vercel.json` for deployment settings.

## 5. Environment Management

### Local (.env.local)
\`\`\`env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

### Production (Vercel Dashboard)
\`\`\`env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
\`\`\`

## 6. Continuous Integration/Deployment

### Automated Workflow
1. Push to `main` branch
2. GitHub webhook triggers Vercel build
3. Vercel builds and deploys automatically
4. Production site updates

### Manual Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
\`\`\`

## 7. Development Best Practices

### Code Quality
- Use TypeScript for type safety
- Follow ESLint rules
- Format with Prettier
- Write meaningful commit messages

### Testing Strategy
- Unit tests for utility functions
- Integration tests for components
- E2E tests for critical user flows

### Performance Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track user interactions

## 8. Troubleshooting

### Common Issues
1. **Build Failures**: Check build logs in Vercel dashboard
2. **Environment Variables**: Ensure all required vars are set
3. **Type Errors**: Run `npm run type-check` locally
4. **Deployment Issues**: Check Vercel function logs

### Debug Commands
\`\`\`bash
# Check build locally
npm run build

# Analyze bundle
npm run analyze

# Check types
npm run type-check
