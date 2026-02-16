#!/bin/bash
set -e

echo "🚀 Paper Trading Bot Deployment Script"
echo "======================================"
echo ""

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found. Installing..."
    
    # Detect OS and install gh
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install gh
        else
            echo "❌ Homebrew not found. Please install GitHub CLI manually:"
            echo "   https://github.com/cli/cli#installation"
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install GitHub CLI manually:"
        echo "   https://github.com/cli/cli#installation"
        exit 1
    fi
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub:"
    gh auth login
fi

# Get GitHub username
USERNAME=$(gh api user -q '.login')
echo "✅ Authenticated as: $USERNAME"
echo ""

# Create repo name
REPO_NAME="paper-trading-bot"

# Check if repo exists
if gh repo view "$USERNAME/$REPO_NAME" &> /dev/null; then
    echo "⚠️  Repo $REPO_NAME already exists. Using existing repo."
else
    echo "📦 Creating GitHub repository: $REPO_NAME"
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
    echo "✅ Repository created and code pushed!"
fi

echo ""
echo "🔗 Repository URL: https://github.com/$USERNAME/$REPO_NAME"
echo ""

# Check for Render CLI or use web instructions
if command -v render &> /dev/null; then
    echo "🌐 Deploying to Render.com..."
    render deploy
else
    echo "🌐 Next step: Deploy to Render.com"
    echo ""
    echo "Option 1: Use Render Dashboard (Easiest)"
    echo "  1. Go to https://dashboard.render.com"
    echo "  2. Click 'New +' → 'Web Service'"
    echo "  3. Connect GitHub repo: $USERNAME/$REPO_NAME"
    echo "  4. Render will auto-detect render.yaml settings"
    echo "  5. Add environment variables:"
    echo "     - ALPACA_API_KEY=your_key"
    echo "     - ALPACA_SECRET_KEY=your_secret"
    echo "  6. Click 'Create Web Service'"
    echo ""
    echo "Option 2: Use Render Blueprint"
    echo "  Visit: https://render.com/deploy?repo=https://github.com/$USERNAME/$REPO_NAME"
    echo ""
fi

echo ""
echo "📱 After deployment:"
echo "  1. Open the deployed URL on your iPhone"
echo "  2. Tap Share → Add to Home Screen"
echo "  3. Enjoy your native-like trading app!"
echo ""
echo "✨ Deployment script complete!"
