const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const { checkHoliday } = require('./lib');

/**
 * 追加の休日を読み込む
 * @returns {Array<string>} 追加の休日の配列（MM-DD または YYYY-MM-DD 形式）
 */
const loadAdditionalHolidays = () => {
  const allHolidays = [];

  // ファイルから読み込む
  const filePath = core.getInput('additional_holidays_file');
  if (filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const content = fs.readFileSync(absolutePath, 'utf8');
      const holidays = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#')) // 空行とコメント行を除外
        .filter(line => /^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2})$/.test(line)); // YYYY-MM-DD または MM-DD 形式
      allHolidays.push(...holidays);
      core.info(`Loaded ${holidays.length} holidays from file: ${filePath}`);
    } catch (error) {
      throw new Error(`Failed to read additional holidays file: ${error.message}`);
    }
  }

  // カンマ区切り文字列から読み込む
  const holidaysStr = core.getInput('additional_holidays');
  if (holidaysStr) {
    const holidays = holidaysStr
      .split(',')
      .map(h => h.trim())
      .filter(h => h && /^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2})$/.test(h)); // YYYY-MM-DD または MM-DD 形式
    allHolidays.push(...holidays);
    core.info(`Loaded ${holidays.length} holidays from input parameter`);
  }

  // 重複を除去
  const uniqueHolidays = [...new Set(allHolidays)];

  if (uniqueHolidays.length === 0) {
    core.info('No additional holidays specified');
  } else {
    core.info(`Total ${uniqueHolidays.length} unique holidays loaded`);
  }

  return uniqueHolidays;
};

// GitHub Actions 用のエントリーポイント
const run = () => {
  try {
    // 入力日付を取得（指定されていない場合は今日）
    const inputDate = core.getInput('date') || '';
    const date = inputDate ? new Date(inputDate) : new Date();

    // 日付が無効な場合はエラー
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${inputDate}`);
    }

    // 追加の休日を読み込む
    const additionalHolidays = loadAdditionalHolidays();

    // 祝日判定を実行
    const result = checkHoliday(date, additionalHolidays);

    // GitHub Actions の出力に設定
    core.setOutput('is_holiday', result.isHoliday);
    core.setOutput('holiday_name', result.holidayName);
    core.setOutput('is_additional_holiday', result.isAdditionalHoliday);
    core.setOutput('date', result.date);

    // 結果をログ出力
    core.info('Holiday check result:');
    core.info(`  Date: ${result.date}`);
    core.info(`  Is Holiday: ${result.isHoliday}`);
    if (result.holidayName) {
      core.info(`  Holiday Name: ${result.holidayName}`);
    }
    core.info(`  Is Additional Holiday: ${result.isAdditionalHoliday}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
