#!/bin/bash

# Muggleout Installer Script
# This script helps install muggleout on systems without Node.js

set -e

echo "🧙 Muggleout Installer"
echo "===================="
echo ""

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     OS=Linux;;
    Darwin*)    OS=macOS;;
    *)          OS="UNKNOWN:${OS}"
esac

echo "📍 Detected OS: $OS"
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is already installed ($(node --version))"
    echo ""
    echo "📦 Installing muggleout..."
    npm install -g muggleout
    echo ""
    echo "✨ Installation complete! Run 'muggleout' to start!"
    exit 0
fi

# Node.js not installed
echo "❌ Node.js is not installed"
echo ""
echo "Please install Node.js first using one of these methods:"
echo ""

if [ "$OS" = "macOS" ]; then
    echo "🍎 For macOS:"
    echo ""
    echo "Option 1: Install via Homebrew (recommended)"
    echo "  1. Install Homebrew:"
    echo "     /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "  2. Install Node.js:"
    echo "     brew install node"
    echo ""
    echo "Option 2: Download from nodejs.org"
    echo "  Visit https://nodejs.org and download the installer"
    echo ""
elif [ "$OS" = "Linux" ]; then
    echo "🐧 For Linux:"
    echo ""
    echo "Option 1: Using NodeSource (recommended)"
    echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    echo "Option 2: Using package manager"
    echo "  Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "  Fedora: sudo dnf install nodejs npm"
    echo "  Arch: sudo pacman -S nodejs npm"
    echo ""
fi

echo "After installing Node.js, run this script again or use:"
echo "  npm install -g muggleout"
echo ""
echo "Need help? Visit: https://github.com/your-username/muggleout"