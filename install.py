#!/usr/bin/env python3
"""
Dev Setup CLI 설치 도우미
macOS에 기본 설치된 Python3로 실행 가능
사용법: curl -fsSL https://example.com/install.py | python3
"""

import os
import sys
import subprocess
import platform
import urllib.request
import tempfile
import shutil

# 색상 코드
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_color(text, color=RESET):
    print(f"{color}{text}{RESET}")

def check_macos():
    """macOS 확인"""
    if platform.system() != "Darwin":
        print_color("❌ 이 도구는 macOS에서만 작동합니다.", RED)
        sys.exit(1)
    print_color("✅ macOS 감지됨", GREEN)

def check_command(command):
    """명령어 존재 확인"""
    return shutil.which(command) is not None

def download_nodejs():
    """Node.js 다운로드"""
    print_color("\n📦 Node.js를 다운로드하고 있습니다...", BLUE)
    
    # Apple Silicon vs Intel 확인
    is_arm = platform.machine() == "arm64"
    node_version = "v20.11.0"  # LTS 버전
    
    if is_arm:
        filename = f"node-{node_version}-darwin-arm64.pkg"
    else:
        filename = f"node-{node_version}-darwin-x64.pkg"
    
    url = f"https://nodejs.org/dist/{node_version}/{filename}"
    
    try:
        # 임시 디렉토리에 다운로드
        with tempfile.NamedTemporaryFile(suffix=".pkg", delete=False) as tmp_file:
            print_color(f"다운로드 중: {url}", YELLOW)
            urllib.request.urlretrieve(url, tmp_file.name)
            return tmp_file.name
    except Exception as e:
        print_color(f"❌ 다운로드 실패: {e}", RED)
        return None

def install_nodejs_pkg(pkg_path):
    """Node.js pkg 파일 설치"""
    print_color("\n🔧 Node.js를 설치하고 있습니다...", BLUE)
    print_color("관리자 비밀번호가 필요할 수 있습니다.", YELLOW)
    
    try:
        # macOS installer 실행
        subprocess.run(["open", "-W", pkg_path], check=True)
        return True
    except subprocess.CalledProcessError:
        # 대체 방법: sudo installer 사용
        try:
            subprocess.run(["sudo", "installer", "-pkg", pkg_path, "-target", "/"], check=True)
            return True
        except:
            return False

def install_with_homebrew():
    """Homebrew로 설치"""
    print_color("\n🍺 Homebrew로 설치를 시도합니다...", BLUE)
    
    # Homebrew 설치 확인
    if not check_command("brew"):
        print_color("Homebrew가 없습니다. 설치하시겠습니까? (y/n)", YELLOW)
        response = input("➜ ").lower()
        
        if response == 'y':
            print_color("Homebrew 설치 중...", BLUE)
            brew_install = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
            subprocess.run(brew_install, shell=True)
        else:
            return False
    
    # Node.js 설치
    print_color("Node.js 설치 중...", BLUE)
    subprocess.run(["brew", "install", "node"], check=True)
    return True

def install_dev_setup():
    """dev-setup-cli 설치"""
    print_color("\n📦 dev-setup-cli 설치 중...", BLUE)
    
    try:
        subprocess.run(["npm", "install", "-g", "dev-setup-cli"], check=True)
        return True
    except:
        # 로컬 개발 버전 설치 시도
        if os.path.exists("package.json"):
            print_color("로컬 버전 설치 중...", YELLOW)
            subprocess.run(["npm", "install"], check=True)
            subprocess.run(["npm", "link"], check=True)
            return True
        return False

def main():
    """메인 설치 프로세스"""
    print_color("🚀 Dev Setup CLI 설치 도우미", BLUE)
    print_color("비개발자를 위한 개발 환경 설정 도구\n", YELLOW)
    
    # macOS 확인
    check_macos()
    
    # Node.js 확인
    if check_command("node"):
        print_color(f"✅ Node.js가 이미 설치되어 있습니다!", GREEN)
    else:
        print_color("⚠️  Node.js가 설치되어 있지 않습니다.", YELLOW)
        print_color("\n설치 방법을 선택하세요:")
        print_color("1. 공식 사이트에서 다운로드 (권장)")
        print_color("2. Homebrew로 설치")
        print_color("3. 수동으로 설치하기")
        
        choice = input("\n선택 (1/2/3): ")
        
        if choice == "1":
            pkg_path = download_nodejs()
            if pkg_path:
                if install_nodejs_pkg(pkg_path):
                    print_color("✅ Node.js 설치 완료!", GREEN)
                    os.unlink(pkg_path)  # 임시 파일 삭제
                else:
                    print_color("❌ 설치 실패", RED)
                    print_color("https://nodejs.org 에서 직접 다운로드하세요.", YELLOW)
                    sys.exit(1)
        elif choice == "2":
            if not install_with_homebrew():
                print_color("❌ Homebrew 설치 실패", RED)
                sys.exit(1)
        else:
            print_color("\n수동 설치 안내:", BLUE)
            print_color("1. https://nodejs.org 접속")
            print_color("2. LTS 버전 다운로드")
            print_color("3. 다운로드한 파일 실행")
            print_color("4. 설치 완료 후 이 스크립트 다시 실행")
            sys.exit(0)
    
    # npm 확인
    if not check_command("npm"):
        print_color("❌ npm이 없습니다. Node.js를 다시 설치하세요.", RED)
        sys.exit(1)
    
    # dev-setup 설치
    if install_dev_setup():
        print_color("\n✅ 모든 설치가 완료되었습니다! 🎉", GREEN)
        print_color("\n사용법:", BLUE)
        print_color("  dev-setup              # 대화형 모드")
        print_color("  dev-setup 터미널 예쁘게  # 터미널 꾸미기")
        print_color("  dev-setup status       # 상태 확인")
        print_color("\n터미널을 재시작하고 dev-setup을 실행해보세요!", YELLOW)
    else:
        print_color("❌ dev-setup-cli 설치 실패", RED)
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_color("\n\n설치가 취소되었습니다.", YELLOW)
        sys.exit(0)
    except Exception as e:
        print_color(f"\n❌ 오류 발생: {e}", RED)
        sys.exit(1)