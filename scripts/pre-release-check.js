#!/usr/bin/env node

import chalk from 'chalk';
import { readFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log(chalk.blue('\n🤖 Muggleout 배포 전 자동 체크 시작...\n'));

let hasError = false;
const checks = [];

// 1. 필수 파일 확인
console.log(chalk.yellow('📁 필수 파일 확인...'));
const requiredFiles = ['.gitignore', 'LICENSE', 'README.md', 'CHANGELOG.md', 'package.json'];
requiredFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (existsSync(filePath)) {
    checks.push({ name: `${file} 존재`, status: '✅' });
  } else {
    checks.push({ name: `${file} 존재`, status: '❌' });
    hasError = true;
  }
});

// 2. 실행 권한 확인
console.log(chalk.yellow('\n🔐 실행 권한 확인...'));
const binFile = path.join(projectRoot, 'bin/muggleout.js');
if (existsSync(binFile)) {
  const stats = statSync(binFile);
  const isExecutable = (stats.mode & parseInt('111', 8)) !== 0;
  if (isExecutable) {
    checks.push({ name: 'bin/muggleout.js 실행 권한', status: '✅' });
  } else {
    checks.push({ name: 'bin/muggleout.js 실행 권한', status: '❌' });
    hasError = true;
  }
}

// 3. package.json 검증
console.log(chalk.yellow('\n📦 package.json 검증...'));
try {
  const packageJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  
  // 필수 필드 확인
  const requiredFields = ['name', 'version', 'description', 'author', 'license', 'repository', 'bugs', 'homepage'];
  requiredFields.forEach(field => {
    if (packageJson[field]) {
      checks.push({ name: `package.json ${field}`, status: '✅' });
    } else {
      checks.push({ name: `package.json ${field}`, status: '❌' });
      hasError = true;
    }
  });
  
  // URL 검증
  if (packageJson.bugs?.url?.includes('github.com')) {
    checks.push({ name: 'bugs URL이 GitHub 이슈 페이지', status: '✅' });
  } else {
    checks.push({ name: 'bugs URL이 GitHub 이슈 페이지', status: '❌' });
    hasError = true;
  }
} catch (error) {
  console.error(chalk.red('package.json 읽기 실패:', error.message));
  hasError = true;
}

// 4. 민감 정보 스캔
console.log(chalk.yellow('\n🔍 민감 정보 스캔...'));
try {
  const patterns = [
    'api_key(?!.*example)',
    'API_KEY(?!.*example)',
    'secret(?!.*example)',
    'SECRET(?!.*example)',
    'password(?!.*example|.*입력)',
    'PASSWORD(?!.*example)',
    'token(?!.*example|izer)',
    'TOKEN(?!.*example|izer)'
  ];
  
  const command = `grep -r -i -E "${patterns.join('|')}" --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude="pre-release-check.js" ${projectRoot} || true`;
  const result = execSync(command, { encoding: 'utf8' });
  
  if (result.trim()) {
    checks.push({ name: '민감 정보 없음', status: '⚠️' });
    console.log(chalk.yellow('\n잠재적 민감 정보 발견:'));
    console.log(chalk.gray(result));
  } else {
    checks.push({ name: '민감 정보 없음', status: '✅' });
  }
} catch (error) {
  console.error(chalk.red('민감 정보 스캔 실패:', error.message));
}

// 5. Git 상태 확인
console.log(chalk.yellow('\n📊 Git 상태 확인...'));
try {
  const gitStatus = execSync('git status --porcelain', { cwd: projectRoot, encoding: 'utf8' });
  if (gitStatus.trim()) {
    checks.push({ name: '모든 변경사항 커밋됨', status: '⚠️' });
    console.log(chalk.yellow('\n커밋되지 않은 변경사항:'));
    console.log(chalk.gray(gitStatus));
  } else {
    checks.push({ name: '모든 변경사항 커밋됨', status: '✅' });
  }
} catch (error) {
  console.error(chalk.red('Git 상태 확인 실패:', error.message));
}

// 6. 테스트 실행 (옵션)
console.log(chalk.yellow('\n🧪 테스트 실행 건너뛰기 (수동으로 실행하세요: npm test)'));

// 결과 출력
console.log(chalk.blue('\n📋 체크 결과:\n'));
checks.forEach(check => {
  console.log(`  ${check.status} ${check.name}`);
});

if (hasError) {
  console.log(chalk.red('\n❌ 일부 체크가 실패했습니다. 위 항목들을 확인해주세요.\n'));
  process.exit(1);
} else {
  console.log(chalk.green('\n✅ 모든 체크를 통과했습니다! 배포 준비가 완료되었습니다.\n'));
  console.log(chalk.gray('다음 명령어로 배포하세요:'));
  console.log(chalk.cyan('  npm publish\n'));
}