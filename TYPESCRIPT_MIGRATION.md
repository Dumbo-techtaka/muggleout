# 🔷 TypeScript Migration Guide

## 📋 Overview

Muggleout를 JavaScript에서 TypeScript로 점진적으로 마이그레이션하는 가이드입니다.

## 🎯 Migration Strategy

### Phase 1: 준비 단계 (v1.1.0)

#### 1. TypeScript 설정
```bash
npm install --save-dev typescript @types/node @types/inquirer @types/commander
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### 2. tsconfig.json 생성
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,              // 처음엔 false로 시작
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowJs": true,              // JS 파일 허용
    "checkJs": true,              // JS 파일도 체크
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3. package.json 업데이트
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "prepare": "npm run build"
  }
}
```

### Phase 2: 점진적 전환 (v1.2.0 - v1.5.0)

#### 1. 타입 정의 파일 생성
```typescript
// src/types/index.ts
export interface Tool {
  name: string;
  command: string;
  emoji: string;
}

export interface InstallConfig {
  name: string;
  check: () => Promise<boolean> | boolean;
  install: () => Promise<void>;
  requires?: string[];
  postInstall?: () => Promise<void>;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export type MenuChoice = 
  | 'beautify' 
  | 'install' 
  | 'ai-tools' 
  | 'cli-guide'
  | 'troubleshoot' 
  | 'status' 
  | 'docs' 
  | 'prompt' 
  | 'exit';
```

#### 2. 유틸리티부터 전환
```typescript
// src/utils/runner.ts
import { execa, ExecaError } from 'execa';
import chalk from 'chalk';
import { CommandResult } from '../types';

interface RunOptions {
  interactive?: boolean;
  silent?: boolean;
}

export async function runCommand(
  command: string, 
  options: RunOptions = {}
): Promise<CommandResult> {
  const { interactive = false, silent = false } = options;
  
  // 타입 안전한 홈 디렉토리 확장
  const expandedCommand = command.replace(/~/g, process.env.HOME || '');
  
  if (!silent) {
    console.log(chalk.gray(`$ ${command}`));
  }
  
  try {
    if (interactive) {
      await execa('bash', ['-c', expandedCommand], {
        stdio: 'inherit',
        shell: true
      });
      return { stdout: '', stderr: '', exitCode: 0 };
    } else {
      const result = await execa('bash', ['-c', expandedCommand]);
      
      if (result.stdout && !silent) {
        console.log(result.stdout);
      }
      
      if (result.stderr && !silent) {
        console.error(chalk.yellow(result.stderr));
      }
      
      return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        exitCode: result.exitCode || 0
      };
    }
  } catch (error) {
    const execaError = error as ExecaError;
    
    if (!silent) {
      console.error(chalk.red(`명령어 실행 실패: ${execaError.message}`));
    }
    
    if (silent && execaError.exitCode !== undefined) {
      return {
        stdout: execaError.stdout || '',
        stderr: execaError.stderr || '',
        exitCode: execaError.exitCode
      };
    }
    
    throw error;
  }
}

export async function commandExists(command: string): Promise<boolean> {
  try {
    const { stdout } = await execa('which', [command]);
    return !!stdout;
  } catch {
    return false;
  }
}
```

#### 3. 설치 설정 타입화
```typescript
// src/commands/install.ts
import { InstallConfig } from '../types';

const installConfigs: Record<string, InstallConfig> = {
  'homebrew': {
    name: 'Homebrew',
    check: () => commandExists('brew'),
    install: async () => {
      console.log(chalk.yellow('📋 Homebrew 설치 스크립트를 실행합니다...'));
      // ... 설치 로직
    }
  },
  // ... 다른 도구들
};

export async function installTool(toolName: string): Promise<void> {
  const config = installConfigs[toolName];
  
  if (!config) {
    console.log(chalk.red(`❌ ${toolName}은(는) 지원하지 않는 도구입니다.`));
    return;
  }
  
  // ... 설치 로직
}
```

#### 4. UI 컴포넌트 타입화
```typescript
// src/ui/interactive.ts
import inquirer, { ListQuestion } from 'inquirer';
import { MenuChoice } from '../types';

interface MenuOption {
  name: string;
  value: MenuChoice;
  short: string;
}

const mainMenuChoices: MenuOption[] = [
  {
    name: `${emoji.get('art')} 터미널 꾸미기`,
    value: 'beautify',
    short: '터미널 꾸미기'
  },
  // ... 다른 메뉴들
];

export async function startInteractiveMode(
  initialMenu?: MenuChoice
): Promise<void> {
  // ... 구현
}
```

### Phase 3: 완전한 TypeScript 전환 (v2.0.0)

#### 1. Strict Mode 활성화
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

#### 2. 모든 파일 .ts로 전환
```bash
# 자동 변환 스크립트
for file in src/**/*.js; do
  mv "$file" "${file%.js}.ts"
done
```

#### 3. 타입 정의 완성
```typescript
// src/types/commands.ts
export type ToolName = 
  | 'homebrew' 
  | 'iterm2' 
  | 'oh-my-zsh' 
  | 'p10k'
  | 'node'
  | 'claude-code'
  | 'gemini-cli'
  | 'git';

export interface InstallOptions {
  force?: boolean;
  skipDependencies?: boolean;
  verbose?: boolean;
}

export interface StatusResult {
  tool: ToolName;
  installed: boolean;
  version?: string;
  path?: string;
}
```

## 📊 마이그레이션 체크리스트

### v1.1.0 - 기초 설정
- [ ] TypeScript 의존성 설치
- [ ] tsconfig.json 생성
- [ ] 빌드 스크립트 설정
- [ ] 타입 정의 파일 생성

### v1.2.0 - 유틸리티 전환
- [ ] runner.ts 전환
- [ ] config.ts 전환
- [ ] system-check.ts 전환
- [ ] terminal-check.ts 전환

### v1.3.0 - 명령어 전환
- [ ] install.ts 전환
- [ ] status.ts 전환
- [ ] doctor.ts 전환
- [ ] fix.ts 전환

### v1.4.0 - UI 전환
- [ ] interactive.ts 전환
- [ ] natural-language.ts 전환

### v1.5.0 - 메인 전환
- [ ] bin/muggleout.ts 전환
- [ ] 모든 import/export 정리

### v2.0.0 - 완성
- [ ] Strict mode 활성화
- [ ] 모든 any 타입 제거
- [ ] 테스트 코드 추가
- [ ] 문서 업데이트

## 🎯 타입 안전성 목표

### 1. 명령어 타입 안전성
```typescript
// Before (JS)
await installTool('wrong-tool'); // 런타임 에러

// After (TS)
await installTool('wrong-tool'); // 컴파일 에러!
```

### 2. 설정 타입 안전성
```typescript
interface MuggleoutConfig {
  version: string;
  installedTools: Record<ToolName, {
    date: string;
    version?: string;
  }>;
  preferences: {
    language: 'ko' | 'en';
    theme: 'auto' | 'dark' | 'light';
  };
}
```

### 3. API 응답 타입
```typescript
interface CLIGuideContent {
  title: string;
  sections: {
    heading: string;
    commands: {
      command: string;
      description: string;
      example?: string;
    }[];
  }[];
}
```

## 📈 마이그레이션 이점

1. **개발자 경험 향상**
   - 자동완성 개선
   - 리팩토링 안전성
   - 실시간 에러 감지

2. **코드 품질**
   - 타입 관련 버그 제거
   - 더 명확한 인터페이스
   - 자체 문서화

3. **유지보수성**
   - 새 기능 추가 시 안전성
   - 팀 협업 개선
   - 코드 의도 명확화

## 🚀 배포 전략

### Semantic Versioning
- v1.0.x: 버그 수정 (JS)
- v1.1.x: TS 설정 추가 (하위 호환)
- v1.2.x - v1.5.x: 점진적 전환
- v2.0.0: 완전한 TS (Breaking Change 가능)

### npm 태그 활용
```bash
# 안정 버전 (JS)
npm publish --tag stable

# 베타 버전 (TS 전환 중)
npm publish --tag beta

# 사용자 선택
npm install muggleout@stable  # JS 버전
npm install muggleout@beta    # TS 버전
```

## ⚠️ 주의사항

1. **Breaking Changes 최소화**
   - API는 그대로 유지
   - 내부 구현만 변경

2. **점진적 전환**
   - 한 번에 모든 것을 바꾸지 않기
   - 각 단계마다 테스트

3. **사용자 영향 최소화**
   - 설치/사용 방법 동일
   - 성능 저하 없음

---

이 가이드를 따라 안전하게 TypeScript로 마이그레이션할 수 있습니다! 🎉