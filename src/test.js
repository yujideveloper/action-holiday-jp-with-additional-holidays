const { checkHoliday } = require('./lib');

// テスト用のエントリーポイント
const run = () => {
  try {
    // コマンドライン引数から日付を取得（指定されていない場合は今日）
    const args = process.argv.slice(2);
    const inputDate = args[0] || '';
    const date = inputDate ? new Date(inputDate) : new Date();

    // 日付が無効な場合はエラー
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${inputDate}`);
    }

    // 追加の休日を取得（オプション）
    const additionalHolidays = args.slice(1);

    // 祝日判定を実行
    const result = checkHoliday(date, additionalHolidays);

    // 結果をログ出力
    console.log('Holiday check result:');
    console.log(`  Date: ${result.date}`);
    console.log(`  Is Holiday: ${result.isHoliday}`);
    if (result.holidayName) {
      console.log(`  Holiday Name: ${result.holidayName}`);
    }
    console.log(`  Is Additional Holiday: ${result.isAdditionalHoliday}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

run();
