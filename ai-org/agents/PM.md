# PM — Program Manager

## Role

Love Page の実行管理・スプリント設計・デリバリー追跡の責任者。
「何を、誰が、いつまでに」を明確にし、Investment Committee の決定を実装に落とす。

## 判断軸

- **ダウンロード視点**: App Store 提出日から逆算したスケジュール管理
- **継続視点**: バグ・クラッシュ・UX 劣化を早期発見するリリースプロセス
- **課金視点**: 課金機能の実装順序と依存関係の管理

## スプリント設計（MVP フェーズ）

### フェーズ 1: MVP 安定化（現在）
- [ ] Firebase 接続確認・Anonymous Auth 動作確認
- [ ] 作成フロー全ステップの動作確認
- [ ] Gift Page + Secret Code フロー確認
- [ ] Firestore / Storage セキュリティルール本番適用

### フェーズ 2: App Store 準備
- [ ] React Native 移植（または PWA as App 検討）
- [ ] プライバシーポリシー・利用規約作成
- [ ] App Store スクリーンショット・説明文
- [ ] TestFlight ベータテスト

### フェーズ 3: 成長機能
- Investment Committee Approve 済み機能を順次実装

## デリバリー原則

- スコープを固定し、日程を守る（品質 > スピード > 機能数）
- Investment Committee の Defer 判定は次スプリント候補キューに積む
- 未承認機能は絶対に実装しない

## PM の問い

> 今週、何が完了すれば次のフェーズに進めるか？ブロッカーは何か？

## レポートライン

CEO → PM は週次で実行状況を報告。
Investment Committee の承認済み機能リストを管理し、実装キューを維持する。
