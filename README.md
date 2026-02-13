# Check JP Holidays and Additional Holidays

日本の祝日または追加の休日かどうかを判定する GitHub Action です。

## 機能

- 日本の祝日を [@holiday-jp/holiday_jp](https://github.com/holiday-jp/holiday_jp-js) を使って判定
- 追加の休日を指定可能（年末年始など）
- タイムゾーンを JST（日本標準時）に変換して判定

## Inputs

### `date`

判定する日付（ISO 8601 形式、例: `2025-01-01`）。指定しない場合は今日の日付を使用します。

- **Required**: false
- **Default**: `''` (今日の日付)

### `additional_holidays`

追加の休日（MM-DD または YYYY-MM-DD 形式、カンマ区切り）。

- `MM-DD` 形式：毎年その日が追加の休日（例: `12-29` → 毎年 12/29）
- `YYYY-MM-DD` 形式：特定の年のその日のみ追加の休日（例: `2025-01-04` → 2025 年 1/4 のみ）

- **Required**: false
- **Default**: `''`

### `additional_holidays_file`

追加の休日を定義したファイルのパス（1行1日付、MM-DD または YYYY-MM-DD 形式）。`additional_holidays` と併用可能で、両方指定された場合はマージされます（重複は除去）。

- **Required**: false
- **Default**: `''`

## Outputs

### `is_holiday`

祝日または追加の休日かどうか (`true`/`false`)

### `holiday_name`

祝日の場合はその名前。追加の休日の場合は空文字列。

### `is_additional_holiday`

追加の休日かどうか (`true`/`false`)

### `date`

チェックした日付（JST、YYYY-MM-DD 形式）

## 使い方

```yaml
name: Check Holiday

on:
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check if today is a holiday
        id: check
        uses: your-username/action-holiday-jp-with-additional-holidays@v1

      - name: Show result
        run: |
          echo "Date: ${{ steps.check.outputs.date }}"
          echo "Is Holiday: ${{ steps.check.outputs.is_holiday }}"
          echo "Holiday Name: ${{ steps.check.outputs.holiday_name }}"
          echo "Is Additional Holiday: ${{ steps.check.outputs.is_additional_holiday }}"

      - name: Check specific date
        id: check_date
        uses: your-username/action-holiday-jp-with-additional-holidays@v1
        with:
          date: '2025-01-01'

      - name: Skip if holiday
        if: steps.check.outputs.is_holiday == 'true'
        run: echo "Today is a holiday, skipping..."

      - name: Check with additional holidays (comma-separated)
        id: check_with_holidays
        uses: your-username/action-holiday-jp-with-additional-holidays@v1
        with:
          additional_holidays: '12-29,12-30,12-31,01-01,01-02,01-03'

      - name: Check with holidays file
        id: check_with_file
        uses: your-username/action-holiday-jp-with-additional-holidays@v1
        with:
          additional_holidays_file: '.github/holidays.txt'
```

## 追加の休日の指定

### 日付形式

- **MM-DD 形式**：毎年その日が追加の休日
  - 例: `12-29` → 毎年 12 月 29 日
- **YYYY-MM-DD 形式**：特定の年のその日のみ追加の休日
  - 例: `2025-01-04` → 2025 年 1 月 4 日のみ

### カンマ区切り文字列で指定

```yaml
- uses: your-username/action-holiday-jp-with-additional-holidays@v1
  with:
    # 毎年の年末年始 + 2025 年 1/4 のみ
    additional_holidays: '12-29,12-30,12-31,01-01,01-02,01-03,2025-01-04'
```

### ファイルで指定

`.github/holidays.txt` の例：

```
# 年末年始（毎年）
12-29
12-30
12-31
01-01
01-02
01-03

# お盆（毎年）
08-13
08-14
08-15

# 特定の年のみの休日
2025-01-04
2025-12-29
```

```yaml
- uses: your-username/action-holiday-jp-with-additional-holidays@v1
  with:
    additional_holidays_file: '.github/holidays.txt'
```

ファイル形式：
- 1行1日付（MM-DD または YYYY-MM-DD 形式）
- `#` で始まる行はコメントとして無視
- 空行は無視

### 両方を併用

`additional_holidays` と `additional_holidays_file` は同時に指定でき、両方が指定された場合はマージされます（重複は自動的に除去されます）。

```yaml
- uses: your-username/action-holiday-jp-with-additional-holidays@v1
  with:
    # ファイルから基本的な休日を読み込み
    additional_holidays_file: '.github/holidays.txt'
    # 追加で特定の休日を指定
    additional_holidays: '2025-01-04,2025-12-29'
```

## ライセンス

このアクションは MIT ライセンスの下でオープンソースとして公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。
