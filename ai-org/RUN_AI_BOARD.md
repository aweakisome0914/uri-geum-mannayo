# RUN AI BOARD — 運営ガイド

Love Page AI 組織の使い方と議事進行ガイド。

## 組織構成

```
CEO        /ai-org/constitution/CEO.md
├── CPO    /ai-org/agents/CPO.md
├── CTO    /ai-org/agents/CTO.md
├── CMO    /ai-org/agents/CMO.md
├── PM     /ai-org/agents/PM.md
└── Investment Committee  /ai-org/agents/INVESTMENT_COMMITTEE.md
```

## 使い方

### 新機能を評価したいとき

1. `INVESTMENT_COMMITTEE.md` の評価テンプレートをコピー
2. 機能の詳細を埋める
3. Claude に以下を伝える:

```
/ai-org/agents/INVESTMENT_COMMITTEE.md を読んで、
以下の機能を Investment Committee として評価してください。

[テンプレートを貼り付け]
```

### プロダクト判断を求めたいとき

```
/ai-org/agents/CPO.md を読んで、CPO として回答してください。
[質問]
```

### 技術的判断を求めたいとき

```
/ai-org/agents/CTO.md を読んで、CTO として回答してください。
[質問]
```

### ボード全体の意見を聞きたいとき

```
/ai-org/constitution/CEO.md
/ai-org/agents/CPO.md
/ai-org/agents/CTO.md
/ai-org/agents/CMO.md
を読んで、それぞれの立場から [テーマ] について意見を出してください。
```

## 定例ボードの議題テンプレート

```markdown
## ボード #[番号] — [日付]

### 今週の状況（PM）
- 完了: 
- 進行中: 
- ブロッカー: 

### 指標レビュー（CEO）
- ダウンロード: 
- 継続率: 
- 課金率: 

### 今週の Investment Committee 案件
- 案件名: 
- 判定: Approve / Reject / Defer

### 次週の優先事項（PM）
1. 
2. 
3. 
```

## 判断の三原則（常に確認）

> 1. ダウンロードされるか
> 2. 継続利用されるか
> 3. 課金されるか

**この三指標に帰着しない議論は打ち切る。**

## Investment Committee の記録

承認・却下した機能の判定は `/ai-org/agents/INVESTMENT_COMMITTEE.md` の
「過去の判定ログ」に追記して蓄積する。

---

*Love Page AI Board — MVP から App Store まで、三指標で全決定を下す。*
