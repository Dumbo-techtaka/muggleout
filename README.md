# 🧙 Muggleout

> Transform muggles into terminal wizards ✨

[![npm version](https://img.shields.io/npm/v/muggleout.svg)](https://www.npmjs.com/package/muggleout)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Turn your boring terminal into a magical development environment with just one command! No more fear of the command line - become a terminal wizard today! 🎩

## 📦 Installation

First, you'll need either **Node.js** or **Homebrew** installed:

### Prerequisites

<details>
<summary><b>macOS</b> (Choose one)</summary>

#### Option 1: Install Node.js
Download from [nodejs.org](https://nodejs.org/) and install

#### Option 2: Install Homebrew (Recommended)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
</details>

<details>
<summary><b>Windows</b> (Coming Soon)</summary>

Download Node.js from [nodejs.org](https://nodejs.org/)
</details>

### Install Muggleout

Once you have Node.js or Homebrew:

```bash
# Using npm
npm install -g muggleout

# Using Homebrew (macOS)
brew install muggleout

# Using yarn
yarn global add muggleout

# Using bun
bun add -g muggleout
```

## 🚀 Quick Start

After installation, just run:

```bash
muggleout
```

That's it! The interactive wizard will guide you through everything! 🪄

## ✨ Features

### 🗣️ Natural Language Commands
No need to memorize complex commands:
```bash
muggleout "make my terminal pretty"
muggleout "install claude cli"
muggleout "help me with git"
```

### 🎮 Interactive Mode
Just type `muggleout` and choose from the menu:
- 🎨 **Beautify Terminal** - Install themes, fonts, and colors
- 🛠️ **Install Dev Tools** - Git, Node.js, Python, and more
- 🤖 **Setup AI Tools** - Claude, GitHub Copilot, ChatGPT
- 🔧 **Fix Problems** - Solve common terminal issues

### 🏥 Auto-diagnosis
```bash
muggleout doctor    # Check your system
muggleout status    # See what's installed
```

## 🎯 Who is this for?

- 👔 **Office Workers** - Collaborate with dev teams without fear
- 🎨 **Designers** - Set up tools for design-to-code workflows  
- 📚 **Students** - Start your coding journey the easy way
- ✍️ **Writers** - Use AI tools in your terminal
- 🚀 **Anyone** - Who wants a beautiful, functional terminal!

## 💡 Examples

### Make Terminal Beautiful
```bash
muggleout beautify
# Installs: iTerm2 + Oh My Zsh + Powerlevel10k theme
```

### Install AI Assistant
```bash
muggleout "install claude"
# Installs: Claude CLI and guides through setup
```

### Fix Common Issues
```bash
muggleout fix "command not found"
# Auto-fixes PATH issues
```

## 🪄 Magic Commands

| What you want | Type this |
|--------------|-----------|
| Pretty terminal | `muggleout beautify` |
| Install tools | `muggleout install [tool]` |
| Fix problems | `muggleout fix [issue]` |
| Check system | `muggleout doctor` |
| See help | `muggleout help` |

## 📱 iTerm2 Recommended

For the best experience on macOS, we recommend iTerm2:

```bash
brew install --cask iterm2
```

Muggleout will remind you if you're not using iTerm2! 

## 🌍 Language Support

Muggleout speaks your language:
- 🇺🇸 English
- 🇰🇷 한국어 
- 🇯🇵 日本語 (Coming soon)

## 🤝 Contributing

Found a bug? Have an idea? Contact me!

- 📧 Email: rlawlsgus97@gmail.com
- 💬 More ways to contribute coming soon!

## 🔧 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/muggleout.git
cd muggleout

# Install dependencies
npm install

# Link for local testing
npm link

# Run muggleout locally
muggleout
```

### Testing in Dev Container
VS Code's Dev Container provides a clean environment for testing:

1. Open project in VS Code
2. Open Command Palette (Cmd+Shift+P)
3. Select "Dev Containers: Reopen in Container"
4. Once container starts, run:
   ```bash
   ./.devcontainer/test-muggleout.sh
   ```

This simulates a fresh system with no Node.js or development tools installed.

### Testing with Docker
```bash
# Quick test with Node.js environment
./quick-test.sh

# Test in minimal environments
docker-compose -f docker-compose.light.yml up
```

## 📜 License

MIT © dumbokim

---

<p align="center">
  Made with ❤️ for muggles everywhere<br>
  <i>No magic wand required!</i> 🪄
</p>