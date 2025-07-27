# 🚀 Muggleout Go Migration Plan

## 📋 Overview

Node.js 기반의 Muggleout를 Go로 마이그레이션하는 계획서입니다.

## 🎯 Why Go?

### Advantages
1. **단일 바이너리 배포**
   - Node.js 런타임 불필요
   - 초보자에게 더 간단한 설치 과정
   - `brew install muggleout`로 끝!

2. **빠른 실행 속도**
   - Node.js 시작 시간 제거
   - 더 빠른 명령어 실행

3. **크로스 플랫폼 빌드**
   ```bash
   GOOS=darwin GOARCH=amd64 go build  # Intel Mac
   GOOS=darwin GOARCH=arm64 go build  # M1/M2/M3 Mac
   GOOS=windows GOARCH=amd64 go build # Windows
   GOOS=linux GOARCH=amd64 go build   # Linux
   ```

4. **작은 배포 크기**
   - Node.js: ~50MB (node_modules 포함)
   - Go: ~10MB (단일 바이너리)

### Challenges
1. **UI 라이브러리 부족**
   - inquirer.js 같은 풍부한 UI 없음
   - 직접 구현 또는 대체 라이브러리 필요

2. **개발 속도**
   - JavaScript보다 느린 개발 속도
   - 타입 시스템 학습 필요

## 🛠️ Technology Stack

### Core Libraries
```go
// CLI Framework
github.com/spf13/cobra      // CLI 명령어 구조
github.com/spf13/viper      // 설정 관리

// UI/UX
github.com/AlecAivazis/survey/v2  // 대화형 프롬프트 (inquirer 대체)
github.com/fatih/color            // 터미널 색상 (chalk 대체)
github.com/pterm/pterm            // 고급 터미널 UI (boxen 대체)

// Utilities
github.com/mattn/go-isatty        // TTY 감지
github.com/mitchellh/go-homedir   // 홈 디렉토리 처리
```

## 📁 Proposed Structure

```
muggleout-go/
├── cmd/
│   ├── root.go           # 메인 명령어
│   ├── install.go        # install 서브커맨드
│   ├── status.go         # status 서브커맨드
│   ├── doctor.go         # doctor 서브커맨드
│   └── interactive.go    # 대화형 모드
├── internal/
│   ├── config/           # 설정 관리
│   │   └── config.go
│   ├── installer/        # 설치 로직
│   │   ├── homebrew.go
│   │   ├── iterm.go
│   │   └── ohmyzsh.go
│   ├── detector/         # 도구 감지
│   │   └── detector.go
│   ├── nlp/              # 자연어 처리
│   │   └── parser.go
│   └── ui/               # UI 컴포넌트
│       ├── prompt.go
│       └── display.go
├── pkg/
│   ├── runner/           # 명령 실행
│   │   └── runner.go
│   └── system/           # 시스템 체크
│       └── checker.go
├── go.mod
├── go.sum
└── main.go
```

## 🔄 Migration Steps

### Phase 1: Core Structure (Week 1)
- [ ] Go 프로젝트 초기화
- [ ] Cobra 기반 명령어 구조 구현
- [ ] 기본 서브커맨드 스켈레톤

### Phase 2: System Detection (Week 2)
- [ ] macOS 감지 로직
- [ ] 도구 설치 상태 확인
- [ ] 홈 디렉토리 경로 처리

### Phase 3: Installation Logic (Week 3-4)
- [ ] Homebrew 설치 구현
- [ ] iTerm2 설치 구현
- [ ] Oh My Zsh 설치 구현
- [ ] 의존성 관리

### Phase 4: Interactive UI (Week 5-6)
- [ ] Survey 라이브러리로 메뉴 구현
- [ ] 상태 표시 UI
- [ ] 프로그레스 바

### Phase 5: Natural Language (Week 7)
- [ ] 간단한 키워드 매칭
- [ ] 명령어 라우팅

### Phase 6: Polish & Testing (Week 8)
- [ ] 에러 처리
- [ ] 로깅
- [ ] 테스트 작성
- [ ] 문서화

## 💻 Code Examples

### 1. Main Entry Point
```go
// main.go
package main

import (
    "github.com/your-username/muggleout-go/cmd"
)

func main() {
    cmd.Execute()
}
```

### 2. Root Command
```go
// cmd/root.go
package cmd

import (
    "fmt"
    "os"
    
    "github.com/spf13/cobra"
    "github.com/fatih/color"
)

var rootCmd = &cobra.Command{
    Use:   "muggleout",
    Short: "Transform muggles into terminal wizards",
    Long: `Muggleout helps non-developers set up their terminal environment
with beautiful themes, useful tools, and AI assistants.`,
    Run: func(cmd *cobra.Command, args []string) {
        if len(args) == 0 {
            startInteractiveMode()
        } else {
            parseNaturalLanguage(args)
        }
    },
}

func Execute() {
    if err := rootCmd.Execute(); err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}
```

### 3. Interactive Mode with Survey
```go
// internal/ui/prompt.go
package ui

import (
    "github.com/AlecAivazis/survey/v2"
)

func MainMenu() (string, error) {
    var choice string
    prompt := &survey.Select{
        Message: "어떤 작업을 하시겠습니까?",
        Options: []string{
            "🎨 터미널 꾸미기",
            "📦 개발 도구 설치",
            "🤖 AI 도구 설정",
            "🚀 CLI 사용법 가이드",
            "📋 설치 상태 확인",
            "🚪 종료",
        },
    }
    err := survey.AskOne(prompt, &choice)
    return choice, err
}
```

### 4. Tool Detection
```go
// internal/detector/detector.go
package detector

import (
    "os"
    "os/exec"
)

type Tool struct {
    Name      string
    Command   string
    Installed bool
}

func CheckTools() []Tool {
    tools := []Tool{
        {Name: "Homebrew", Command: "brew"},
        {Name: "iTerm2", Command: ""},  // 파일 존재 체크
        {Name: "Node.js", Command: "node"},
    }
    
    for i := range tools {
        if tools[i].Command != "" {
            tools[i].Installed = commandExists(tools[i].Command)
        } else if tools[i].Name == "iTerm2" {
            tools[i].Installed = fileExists("/Applications/iTerm.app")
        }
    }
    
    return tools
}

func commandExists(cmd string) bool {
    _, err := exec.LookPath(cmd)
    return err == nil
}

func fileExists(path string) bool {
    _, err := os.Stat(path)
    return err == nil
}
```

## 🏗️ Build & Distribution

### Building
```bash
# Development
go build -o muggleout

# Release builds
goreleaser release --snapshot --clean
```

### Distribution Strategy
1. **Homebrew Tap**
   ```ruby
   class Muggleout < Formula
     desc "Transform muggles into terminal wizards"
     homepage "https://github.com/your-username/muggleout"
     url "https://github.com/.../v1.0.0.tar.gz"
     sha256 "..."
     
     def install
       bin.install "muggleout"
     end
   end
   ```

2. **Direct Download**
   - GitHub Releases with pre-built binaries
   - Install script: `curl -fsSL https://... | bash`

3. **Go Install**
   ```bash
   go install github.com/your-username/muggleout@latest
   ```

## 📊 Comparison: Node.js vs Go

| Feature | Node.js (Current) | Go (Proposed) |
|---------|------------------|---------------|
| Installation | `npm install -g muggleout` | `brew install muggleout` |
| Dependencies | Required (Node.js) | None |
| Binary Size | ~50MB | ~10MB |
| Startup Time | ~200ms | ~10ms |
| Cross-platform | Via npm | Native binaries |
| Development Speed | Fast | Moderate |
| UI Libraries | Rich (inquirer) | Limited |
| Testing | Jest/Mocha | Built-in |

## 🚧 Challenges & Solutions

### 1. UI/UX Parity
**Challenge**: Go lacks rich TUI libraries like inquirer.js
**Solution**: 
- Use `survey` for prompts
- `pterm` for advanced UI
- Custom components where needed

### 2. Natural Language Processing
**Challenge**: No direct equivalent to JS string manipulation
**Solution**: 
- Simple keyword matching
- Regular expressions
- Consider `github.com/jdkato/prose` for advanced NLP

### 3. Async Operations
**Challenge**: Different concurrency model
**Solution**: 
- Use goroutines for parallel operations
- Channels for communication
- sync.WaitGroup for coordination

## 📈 Success Metrics

1. **Performance**
   - [ ] Startup time < 50ms
   - [ ] Command execution < 100ms
   - [ ] Binary size < 15MB

2. **Functionality**
   - [ ] Feature parity with Node.js version
   - [ ] Cross-platform support
   - [ ] Backward compatibility

3. **User Experience**
   - [ ] Same or better UI/UX
   - [ ] Easier installation
   - [ ] Better error messages

## 🎯 MVP Features

For the first Go version:
1. ✅ Basic CLI structure
2. ✅ Install command (Homebrew, iTerm2, Oh My Zsh)
3. ✅ Status command
4. ✅ Interactive mode
5. ❌ Natural language (Phase 2)
6. ❌ Full UI polish (Phase 2)

## 📅 Timeline

- **Week 1-2**: Core implementation
- **Week 3-4**: Feature development
- **Week 5-6**: UI/UX refinement
- **Week 7**: Testing & documentation
- **Week 8**: Release preparation

## 🔗 Resources

- [Cobra Documentation](https://cobra.dev/)
- [Survey Examples](https://github.com/AlecAivazis/survey#examples)
- [pterm Showcase](https://github.com/pterm/pterm#-showcase)
- [Go CLI Best Practices](https://blog.carlmjohnson.net/post/2023/go-cli-best-practices/)

---

Ready to start? Let's create `muggleout-go`! 🚀