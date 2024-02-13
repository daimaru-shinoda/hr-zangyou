自動実行には windows のタスクスケジューラ設定が必要

## King of Time から勤務データを取得する

## 注意点

次の時間帯（JST）は API へのアクセスが禁止されています
08:30 ～ 10:00, 17:30 ～ 18:30

### 参考資料

API 連携サービス以外に、直接 WebAPI を利用する方法 (初回設定)
https://support.ta.kingoftime.jp/hc/ja/articles/360038857633-API%E9%80%A3%E6%90%BA%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E4%BB%A5%E5%A4%96%E3%81%AB-%E7%9B%B4%E6%8E%A5WebAPI%E3%82%92%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95#h_01G0GK393W68121NYSH8YQ7BH8

実行場所でのグローバル IP アドレスを設定する必要がある
Home > 設定 > その他 > オプション > King of Time 勤怠管理 WebAPI 連携設定 > 連携設定
編集(鉛筆マーク) > 許可 IP アドレス

## 実行方法

`exec.bat`

### TODO

取り込み / GAS
