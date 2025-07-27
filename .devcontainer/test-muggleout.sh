#!/bin/bash

echo "🧙 Muggleout Dev Container Test Script"
echo "======================================"
echo ""

# Set test environment
export MUGGLEOUT_TEST=1

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from muggleout root directory"
    exit 1
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installed!"
else
    echo "✅ Node.js already installed ($(node --version))"
fi

# Install muggleout dependencies
echo ""
echo "📦 Installing muggleout dependencies..."
npm install

# Link muggleout for testing
echo ""
echo "🔗 Linking muggleout for local testing..."
sudo npm link

echo ""
echo "✅ Setup complete!"
echo ""
echo "🧙 You can now test muggleout commands:"
echo "  muggleout"
echo "  muggleout status"
echo "  muggleout install homebrew"
echo "  muggleout prompt"
echo ""
echo "💡 This environment simulates a fresh system:"
echo "  - No Homebrew installed"
echo "  - No developer tools (except basic git)"
echo "  - No terminal customizations"
echo ""