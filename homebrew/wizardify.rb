class Wizardify < Formula
  desc "Transform muggles into terminal wizards"
  homepage "https://github.com/your-username/wizardify"
  url "https://github.com/your-username/wizardify/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "PLACEHOLDER_SHA256" # 실제 릴리즈 후 업데이트 필요
  license "MIT"

  # 의존성
  depends_on "node"

  def install
    # npm 의존성 설치
    system "npm", "ci", "--production"
    
    # 실행 파일 설치
    libexec.install Dir["*"]
    bin.install_symlink libexec/"bin/dev-setup"
    
    # 완료 메시지용 파일 생성
    (prefix/"completions").mkpath
    (prefix/"completions/dev-setup.bash").write bash_completion
    (prefix/"completions/dev-setup.zsh").write zsh_completion
  end

  def post_install
    # 설치 후 메시지
    ohai "🎉 dev-setup-cli가 설치되었습니다!"
    ohai "실행: dev-setup"
    ohai "도움말: dev-setup --help"
  end

  # Bash 자동완성
  def bash_completion
    <<~EOS
      _dev_setup_completion() {
        local cur prev opts
        COMPREPLY=()
        cur="${COMP_WORDS[COMP_CWORD]}"
        prev="${COMP_WORDS[COMP_CWORD-1]}"
        opts="install status doctor fix prompt help"

        case "${prev}" in
          install)
            opts="homebrew node iterm2 oh-my-zsh claude-code gemini-cli"
            ;;
          fix)
            opts="command-not-found permission path"
            ;;
        esac

        COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
        return 0
      }
      complete -F _dev_setup_completion dev-setup
    EOS
  end

  # Zsh 자동완성
  def zsh_completion
    <<~EOS
      #compdef dev-setup

      _dev_setup() {
        local -a commands
        commands=(
          'install:Install development tools'
          'status:Check system status'
          'doctor:Diagnose system issues'
          'fix:Fix common problems'
          'prompt:Start prompt mode'
          'help:Show help'
        )

        _arguments -C \\
          '1: :->command' \\
          '*::arg:->args'

        case $state in
          command)
            _describe 'command' commands
            ;;
          args)
            case $words[1] in
              install)
                local -a tools
                tools=(
                  'homebrew:Package manager for macOS'
                  'node:JavaScript runtime'
                  'iterm2:Better terminal'
                  'oh-my-zsh:Terminal framework'
                  'claude-code:Claude CLI'
                  'gemini-cli:Gemini CLI'
                )
                _describe 'tool' tools
                ;;
              fix)
                local -a problems
                problems=(
                  'command-not-found:Fix command not found errors'
                  'permission:Fix permission issues'
                  'path:Fix PATH issues'
                )
                _describe 'problem' problems
                ;;
            esac
            ;;
        esac
      }

      _dev_setup
    EOS
  end

  test do
    # 테스트: 버전 확인
    assert_match "dev-setup", shell_output("#{bin}/dev-setup --version")
    
    # 테스트: 상태 확인 (비대화형 모드)
    assert_match "시스템 상태", shell_output("#{bin}/dev-setup status")
  end
end