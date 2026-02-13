const holiday_jp = require('@holiday-jp/holiday_jp');

/**
 * 日本の祝日または追加の休日かを判定する関数
 * @param {Date} date - 判定する日付
 * @param {Array<string>} additionalHolidays - 追加の休日（MM-DD または YYYY-MM-DD 形式の配列）。指定しない場合は空配列
 * @returns {Object} 判定結果
 * @returns {boolean} returns.isHoliday - 祝日または追加の休日かどうか
 * @returns {string} returns.holidayName - 祝日の名前（追加の休日の場合は空文字列）
 * @returns {boolean} returns.isAdditionalHoliday - 追加の休日かどうか
 * @returns {string} returns.date - チェックした日付（JST、YYYY-MM-DD 形式）
 */
const checkHoliday = (date, additionalHolidays = []) => {
  // UTC 時間を JST（日本標準時：UTC+9）に変換
  const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));

  // 日本の祝日をチェック（JST ベース）
  const isJapanHoliday = holiday_jp.isHoliday(jstDate);
  let holidayName = '';
  if (isJapanHoliday) {
    const holidays = holiday_jp.between(jstDate, jstDate);
    holidayName = holidays.length > 0 ? holidays[0].name : '';
  }

  // チェックした日付を YYYY-MM-DD 形式で返す
  const dateStr = `${jstDate.getFullYear()}-${String(jstDate.getMonth() + 1).padStart(2, '0')}-${String(jstDate.getDate()).padStart(2, '0')}`;
  const monthDay = `${String(jstDate.getMonth() + 1).padStart(2, '0')}-${String(jstDate.getDate()).padStart(2, '0')}`;

  // 追加の休日をチェック（JST ベース）
  // YYYY-MM-DD 形式：特定の年のみ
  // MM-DD 形式：毎年
  const isAdditionalHoliday = additionalHolidays.some(holiday => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(holiday)) {
      // YYYY-MM-DD 形式：完全一致
      return holiday === dateStr;
    } else if (/^\d{2}-\d{2}$/.test(holiday)) {
      // MM-DD 形式：月日のみ一致
      return holiday === monthDay;
    }
    return false;
  });

  return {
    isHoliday: isJapanHoliday || isAdditionalHoliday,
    holidayName,
    isAdditionalHoliday,
    date: dateStr,
  };
};

module.exports = {
  checkHoliday,
};
