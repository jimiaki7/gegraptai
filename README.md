# 📖 Gegraptai (ゲグラプタイ)

**「書かれている」言葉を、もっと身近に。**

Gegraptaiは、ヘブライ語とギリシャ語の聖書原文を、誰でも直感的に読み、学び、記録できるモダンなWebアプリケーションです。

インストール不要。ブラウザを開くだけで、数千年の時を超えたテキストにすぐにアクセスできます。

> _"Gegraptai" (Гέγραπται) はギリシャ語で「書かれている」を意味します。_

---

## ✨ 主な機能

### 1. 🚀 瞬時の起動とアクセシビリティ
- **待機時間ゼロ**: アプリを開いた瞬間、創世記とヨハネの福音書が表示されます。
- **ログイン不要**: 面倒な登録なしで、すぐに読み始められます。
- **オフライン対応**: インターネットがない場所でも利用可能です（PWA対応予定）。

### 2. 🔍 深い原文研究
- **単語タップで解析**: 単語をクリックするだけで、辞書形・文法情報（パース）・語源が表示されます。
- **ヘブライ語 & ギリシャ語**: 旧約聖書（OSHB）と新約聖書（MorphGNT）を完全収録。

### 3. 📝 自分だけのノート (Local & Cloud)
- **ローカル保存**: ログインしなくても、あなたの書いたメモはブラウザに自動保存されます。
- **クラウド同期**: アカウントを作れば、スマホやPCなど複数のデバイスでノートを同期できます。

---

## 🛠 使い方

### ステップ 1: 起動する
以下のコマンドを実行するだけで、ローカル環境で開発サーバーが立ち上がります。

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

### ステップ 2: 読む・調べる
画面には左右に聖書テキストが表示されます。
- **調べたい単語をクリック**してみてください。
- 右側（スマホでは下部）に**Detail Panel**が開き、その単語の詳細が表示されます。

### ステップ 3: 書く
Detail Panelの「Exegetical Notes」欄に、気になったことや黙想を書き込んでみましょう。
- 入力するとすぐに **`✓ Local`** と表示され、保存されます。
- ブラウザを閉じてもデータは消えません。

---

## 🏗 アーキテクチャ

Gegraptaiはパフォーマンスを最優先に設計されています。

```mermaid
graph TD
    User[👤 User] -->|Access| App[📱 Gegraptai Web App]
    
    subgraph Frontend
    App -->|Dynamic Import| Data[📚 Bible Data (Chunks)]
    App -->|Read/Write| Local[💾 LocalStorage (No Login)]
    end
    
    subgraph Cloud
    App -->|Auth & Sync| Supabase[☁️ Supabase (Optional)]
    end
    
    Note right of Data: 必要な巻だけを<br>瞬時にロード
```

### 技術スタック
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS (Premium Design System)
- **Data**: Optimized JSON Chunks (Dynamic Imports)
- **Backend**: Supabase (Auth & DB)

---

## 💾 データ管理について

あなたの研究データは大切に守られます。

| 状態 | 保存場所 | 特徴 |
|------|----------|------|
| **未ログイン** | **LocalStorage** | ブラウザ内に保存。誰にも見られません。手軽ですが、ブラウザのキャッシュクリアで消える可能性があります。 |
| **ログイン** | **Supabase (Cloud)** | 安全なクラウドデータベースに保存。デバイスを変えても続きから研究できます。 |

---

## 🤝 貢献 (Contribution)

Gegraptaiはオープンソースプロジェクトです。
バグ報告や機能提案は [Issues](https://github.com/your-repo/gegraptai/issues) からお気軽にどうぞ。

License: MIT
