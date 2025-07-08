# Git Repository Setup Guide

## Method 1: GitHub Desktop (Recommended for Beginners)

### Step 1: Install GitHub Desktop
1. Download from [desktop.github.com](https://desktop.github.com)
2. Install and sign in with your GitHub account

### Step 2: Create Repository
1. **Option A: Create New Repository**
   - Click "Create a New Repository on your hard drive"
   - Repository name: `adigun-studios-bg-remover`
   - Description: `AI-powered background removal and image enhancement tool`
   - Local path: Choose where to save (e.g., `C:\Projects\` or `~/Projects/`)
   - ✅ Initialize with README
   - Git ignore: `Node`
   - License: `MIT`
   - Click "Create Repository"

2. **Option B: Clone Existing Repository**
   - Click "Clone a repository from the Internet"
   - Enter repository URL or search your GitHub repos
   - Choose local path
   - Click "Clone"

### Step 3: Add Project Files
1. Copy all your project files into the repository folder
2. GitHub Desktop will automatically detect changes
3. You'll see all new files in the "Changes" tab

### Step 4: Initial Commit
1. In GitHub Desktop, review the changes
2. Add commit message: `Initial commit: Adigun Studios Background Remover`
3. Click "Commit to main"

### Step 5: Publish to GitHub
1. Click "Publish repository" button
2. ✅ Keep code private (uncheck if you want it public)
3. Click "Publish Repository"

### Step 6: Verify Setup
1. Go to github.com and check your new repository
2. All files should be visible online

## Method 2: Command Line Git

### Step 1: Install Git
- **Windows**: Download from [git-scm.com](https://git-scm.com)
- **Mac**: `brew install git` or download from git-scm.com
- **Linux**: `sudo apt install git` (Ubuntu) or equivalent

### Step 2: Configure Git (First Time Only)
\`\`\`bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
\`\`\`

### Step 3: Create Local Repository
\`\`\`bash
# Navigate to your project directory
cd /path/to/your/project

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Adigun Studios Background Remover"
\`\`\`

### Step 4: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Repository name: `adigun-studios-bg-remover`
4. Description: `AI-powered background removal and image enhancement tool`
5. Choose Public or Private
6. **Don't** initialize with README (since you already have files)
7. Click "Create repository"

### Step 5: Connect Local to GitHub
\`\`\`bash
# Add GitHub as remote origin
git remote add origin https://github.com/yourusername/adigun-studios-bg-remover.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
\`\`\`

## Method 3: Visual Studio Code Integration

### Step 1: Open Project in VS Code
1. Open VS Code
2. File → Open Folder → Select your project folder

### Step 2: Initialize Git
1. Click Source Control icon (Ctrl+Shift+G)
2. Click "Initialize Repository"
3. VS Code will create .git folder

### Step 3: Stage and Commit
1. Click "+" next to files to stage them
2. Enter commit message: `Initial commit: Adigun Studios Background Remover`
3. Click "✓ Commit"

### Step 4: Add Remote and Push
1. Open terminal in VS Code (Ctrl+`)
2. Add remote:
\`\`\`bash
git remote add origin https://github.com/yourusername/adigun-studios-bg-remover.git
\`\`\`
3. Push to GitHub:
\`\`\`bash
git push -u origin main
\`\`\`

## Daily Git Workflow

### Using GitHub Desktop
1. **Pull latest changes**: Click "Fetch origin" then "Pull origin"
2. **Make changes**: Edit your files
3. **Review changes**: Check the "Changes" tab
4. **Commit**: Add message and click "Commit to main"
5. **Push**: Click "Push origin"

### Using Command Line
\`\`\`bash
# Pull latest changes
git pull origin main

# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "feat: add new image enhancement feature"

# Push to GitHub
git push origin main
\`\`\`

### Using VS Code
1. **Pull**: Source Control → "..." → Pull
2. **Stage**: Click "+" next to changed files
3. **Commit**: Enter message and click "✓"
4. **Push**: Click "..." → Push

## Branch Management

### Creating Feature Branches
\`\`\`bash
# Create and switch to new branch
git checkout -b feature/background-removal-improvements

# Make changes and commit
git add .
git commit -m "improve background removal algorithm"

# Push feature branch
git push origin feature/background-removal-improvements

# Switch back to main
git checkout main

# Merge feature branch (after testing)
git merge feature/background-removal-improvements

# Delete feature branch
git branch -d feature/background-removal-improvements
\`\`\`

## Troubleshooting

### Common Issues

#### 1. Authentication Problems
\`\`\`bash
# Use personal access token instead of password
# Generate token at: github.com → Settings → Developer settings → Personal access tokens
\`\`\`

#### 2. Large Files
\`\`\`bash
# If you have large files, use Git LFS
git lfs install
git lfs track "*.psd"
git add .gitattributes
\`\`\`

#### 3. Merge Conflicts
\`\`\`bash
# Pull latest changes first
git pull origin main

# If conflicts occur, edit files to resolve
# Then add and commit
git add .
git commit -m "resolve merge conflicts"
\`\`\`

#### 4. Undo Last Commit
\`\`\`bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1
\`\`\`

## Best Practices

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Fix background removal edge detection"
- Use prefixes:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting
  - `refactor:` for code restructuring

### File Management
- Use `.gitignore` to exclude unnecessary files
- Don't commit sensitive data (API keys, passwords)
- Keep commits focused and atomic
- Test before committing

### Repository Structure
\`\`\`
adigun-studios-bg-remover/
├── .git/                 # Git metadata (hidden)
├── .gitignore           # Files to ignore
├── README.md            # Project documentation
├── package.json         # Dependencies
├── app/                 # Next.js app
├── components/          # React components
├── docs/               # Documentation
└── scripts/            # Build scripts
\`\`\`
