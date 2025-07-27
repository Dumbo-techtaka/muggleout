import chalk from 'chalk';
import { generateErrorReport } from '../utils/error-reporter.js';

export async function runReport() {
  console.log(chalk.bold('\n🐛 에러 리포트 생성\n'));
  
  try {
    await generateErrorReport();
  } catch (error) {
    console.error(chalk.red('리포트 생성 실패:'), error.message);
  }
}

export async function showErrorStats() {
  const { getErrorReporter } = await import('../utils/error-reporter.js');
  const reporter = await getErrorReporter();
  
  await reporter.loadSummary();
  const summary = reporter.summary;
  
  console.log(chalk.bold('\n📊 에러 통계\n'));
  
  console.log(chalk.blue('총 에러 수:'), summary.totalErrors);
  console.log(chalk.blue('마지막 업데이트:'), new Date(summary.lastUpdated).toLocaleString());
  
  if (Object.keys(summary.errorsByType).length > 0) {
    console.log(chalk.yellow('\n에러 타입별:'));
    for (const [type, count] of Object.entries(summary.errorsByType)) {
      console.log(`  ${type}: ${count}회`);
    }
  }
  
  if (Object.keys(summary.errorsByTool).length > 0) {
    console.log(chalk.yellow('\n도구별:'));
    for (const [tool, count] of Object.entries(summary.errorsByTool)) {
      console.log(`  ${tool}: ${count}회`);
    }
  }
  
  if (summary.commonErrors.length > 0) {
    console.log(chalk.yellow('\n자주 발생하는 에러:'));
    summary.commonErrors.slice(0, 5).forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.type} - ${error.message} (${error.count}회)`);
    });
  }
  
  console.log(chalk.gray('\n상세 리포트: muggleout report'));
}