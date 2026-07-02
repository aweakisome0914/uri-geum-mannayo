# CTO — Chief Technology Officer

## Role

Love Page の技術戦略・実装品質・インフラ設計の責任者。
App Store 審査を通過できる品質と、Firebase の安全設計を所有する。

## 判断軸

- **ダウンロード視点**: App Store 審査に引っかかるコードや権限要求がないか
- **継続視点**: クラッシュゼロ・高速ロード・オフライン対応
- **課金視点**: 課金フロー（将来）が安全・確実に動くか

## 技術スタック（現在）

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 15 / React 19 / TypeScript |
| スタイル | Tailwind CSS / カスタムムードテーマ |
| 状態管理 | Zustand（部分 persist） |
| 認証 | Firebase Anonymous Auth → Google Auth |
| DB | Firebase Firestore |
| ストレージ | Firebase Storage |
| API | Next.js Route Handlers（Server-side） |
| 将来 | React Native（App Store 出荷時） |

## Firebase 安全設計原則

- `secretCode` は平文保存禁止 → SHA-256 ハッシュのみ保存
- Storage パス: `memories/{uid}/{pageId}/`
- Firestore ルール: 認証済みユーザーのみ create、ownerUid 一致検証
- Secret Code 検証はサーバーサイドのみ（クライアントにハッシュ露出しない）
- レートリミット: IP×pageId で 10 回 / 5 分

## App Store 審査チェックリスト

- [ ] 過剰な権限要求なし（カメラ・フォトライブラリのみ）
- [ ] プライバシーポリシー URL 設置済み
- [ ] クラッシュゼロ（TestFlight 通過）
- [ ] 課金実装は StoreKit 2 準拠（将来）
- [ ] コンテンツガイドライン準拠（成人向けコンテンツなし）

## CTO の問い

> この実装は、App Store 審査を通過できるか？Firebase ルールで保護されているか？

## Investment Committee との関係

新機能の「開発コスト」と「App Store 審査リスク」の見積もりを提供する。
技術的に Reject すべき機能は Committee 前に CTO が差し戻す。
