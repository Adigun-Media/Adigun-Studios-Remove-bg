# GitHub Desktop Setup Guide

## Installation

### Download and Install
1. Go to [desktop.github.com](https://desktop.github.com)
2. Download GitHub Desktop for your operating system
3. Install and launch the application
4. Sign in with your GitHub account

## Creating Your Repository

### Option 1: Create New Repository
1. **Click "Create a New Repository on your hard drive"**
2. **Fill in details:**
   - Name: `adigun-studios-bg-remover`
   - Description: `AI-powered background removal and image enhancement tool`
   - Local path: Choose folder (e.g., `Documents/GitHub/`)
   - ✅ Initialize this repository with a README
   - Git ignore: Select `Node`
   - License: Select `MIT License`
3. **Click "Create Repository"**

### Option 2: Add Existing Project
1. **Click "Add an Existing Repository from your hard drive"**
2. **Choose your project folder**
3. **Click "create a repository"** if not already a Git repo

## Adding Your Project Files

### Copy Files to Repository
1. **Navigate to your repository folder** (shown in GitHub Desktop)
2. **Copy all your project files** into this folder
3. **GitHub Desktop will automatically detect changes**

### Review Changes
1. **Check the "Changes" tab** in GitHub Desktop
2. **Review all the files** that will be added
3. **Uncheck any files** you don't want to include

## Making Your First Commit

### Commit Changes
1. **Add commit summary:** `Initial commit: Adigun Studios Background Remover`
2. **Add description (optional):**
   \`\`\`
   - AI-powered background removal
   - Image enhancement features  
   - Mobile-responsive design
   - Built with Next.js + TypeScript
   \`\`\`
3. **Click "Commit to main"**

## Publishing to GitHub

### Publish Repository
1. **Click "Publish repository"** button
2. **Configure settings:**
   - Name: `adigun-studios-bg-remover`
   - Description: `AI-powered background removal and image enhancement tool`
   - ☐ Keep this code private (uncheck for public)
   - Organization: Select your account
3. **Click "Publish Repository"**

### Verify on GitHub
1. **Go to github.com**
2. **Check your repositories**
3. **Verify all files are uploaded**

## Daily Workflow with GitHub Desktop

### Making Changes
1. **Edit your code** in your preferred editor
2. **GitHub Desktop automatically detects changes**
3. **Review changes** in the "Changes" tab

### Committing Changes
1. **Select files to commit** (check/uncheck boxes)
2. **Add commit message:** e.g., `feat: add image enhancement feature`
3. **Click "Commit to main"**

### Syncing with GitHub
1. **Click "Push origin"** to upload changes
2. **Click "Fetch origin"** to check for updates
3. **Click "Pull origin"** if there are updates

### Creating Branches
1. **Click "Current branch"** dropdown
2. **Click "New branch"**
3. **Enter branch name:** e.g., `feature/background-removal`
4. **Click "Create branch"**

### Merging Branches
1. **Switch to main branch**
2. **Click "Choose a branch to merge into main"**
3. **Select your feature branch**
4. **Click "Create a merge commit"**

## Visual Guide

### Main Interface
\`\`\`
┌─────────────────────────────────────────┐
│ GitHub Desktop                          │
├─────────────────────────────────────────┤
│ Current repository: adigun-studios...   │
│ Current branch: main                    │
├─────────────────────────────────────────┤
│ Changes (12) │ History                  │
├─────────────────────────────────────────┤
│ ☑ app/page.tsx                         │
│ ☑ components/BackgroundRemover.tsx     │
│ ☑ package.json                         │
│ ☑ README.md                            │
├─────────────────────────────────────────┤
│ Summary: Add new features               │
│ Description: [Optional]                 │
│                                         │
│ [Commit to main]                        │
└─────────────────────────────────────────┘
\`\`\`

### Repository Settings
\`\`\`
┌─────────────────────────────────────────┐
│ Publish Repository                      │
├─────────────────────────────────────────┤
│ Name: adigun-studios-bg-remover        │
│ Description: AI-powered background...   │
│ ☐ Keep this code private               │
│ Organization: YourUsername              │
│                                         │
│ [Cancel] [Publish Repository]           │
└─────────────────────────────────────────┘
\`\`\`

## Troubleshooting

### Common Issues

#### Authentication Problems
- **Sign out and sign back in**
- **Check your GitHub credentials**
- **Enable two-factor authentication if required**

#### Repository Not Syncing
- **Check internet connection**
- **Try "Repository" → "Repository settings" → "Remote"**
- **Verify repository URL is correct**

#### Large Files Warning
- **Use Git LFS for files over 100MB**
- **Go to "Repository" → "Repository settings" → "Git LFS"**

#### Merge Conflicts
- **GitHub Desktop will highlight conflicts**
- **Edit files to resolve conflicts**
- **Commit the resolved changes**

### Getting Help
- **Help menu** in GitHub Desktop
- **GitHub Desktop documentation**
- **GitHub Community Forum**

## Tips for Success

### Best Practices
- **Commit frequently** with descriptive messages
- **Pull before pushing** to avoid conflicts  
- **Use branches** for new features
- **Review changes** before committing

### Commit Message Examples
\`\`\`
✅ Good:
- feat: add AI background removal
- fix: resolve mobile responsiveness issue
- docs: update installation guide

❌ Bad:
- updated stuff
- fixes
- changes
\`\`\`

### File Organization
\`\`\`
adigun-studios-bg-remover/
├── 📁 app/              # Next.js pages
├── 📁 components/       # React components  
├── 📁 docs/            # Documentation
├── 📁 public/          # Static files
├── 📄 package.json     # Dependencies
├── 📄 README.md        # Project info
└── 📄 .gitignore       # Ignored files
