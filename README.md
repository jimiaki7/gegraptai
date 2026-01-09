# 📖 Gegraptai

**Bringing "It is written" closer to you.**

> _"Man shall not live by bread alone, but by every word that comes from the mouth of God" (ESV / Matthew 4:4)_

Gegraptai is a simple web application that allows anyone to intuitively read, learn, and record from the original Hebrew and Greek Bible texts.

No installation required. Just open your browser to instantly access biblical texts.

> _"Gegraptai" (Гέγραπται) means "It is written" in Greek._

---

## ✨ Key Features

### 1. 🚀 Instant Launch & Accessibility
- **Zero Wait**: Genesis and John are displayed the moment you open the app.
- **No Login Required**: Start reading immediately without tedious registration.
- **Offline Ready**: Usable even without internet access (PWA support coming soon).

### 2. 🔍 Deep Original Text Study
- **Tap to Parse**: Simply click a word to record parsing information, and exegetical notes.
- **Hebrew & Greek**: Complete Old Testament (OSHB) and New Testament (MorphGNT) included.

### 3. 📝 Personal Notes (Local & Cloud)
- **Local Save**: Your notes are automatically saved to your browser even without logging in.
- **Cloud Sync**: Create an account to sync your notes across multiple devices like your phone and PC.

---

## 🛠 How to Use

### Step 1:  Read & Research
Bible text is displayed on the screen.
- **Click on a word** you want to investigate.
- The **Detail Panel** will be opened showing details for that word.

### Step 2: Write
Write your thoughts or meditations in the "Exegetical Notes" section of the Detail Panel.
- **`✓ Local`** appears immediately as you type, indicating it is saved.
- Your data remains safe even if you close the browser.

---

## 🏗 Architecture

Gegraptai is designed with performance as the top priority.

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
    
    Note right of Data: Instantly load only<br>necessary books
```

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS (Premium Design System)
- **Data**: Optimized JSON Chunks (Dynamic Imports)
- **Backend**: Supabase (Auth & DB)

---

## 💾 Data Management

Your study data is securely protected.

| State | Storage | Features |
|---|---|---|
| **Guest** | **LocalStorage** | Saved in browser (private). Easy, but may be lost if cache is cleared. |
| **Logged In** | **Supabase (Cloud)** | Saved in secure cloud DB. Continue studying across devices. |

---

## 🤝 Contribution

Gegraptai is an open source project.
Feel free to submit bug reports or feature requests via [Issues](https://github.com/your-repo/gegraptai/issues).

License: MIT

<br>
<br>
<br>

---
---

# 📖 Gegraptai (日本語)

**「書かれている」言葉を、もっと身近に。**

> **「人はパンだけで生きるのではなく、神の口から出る一つ一つのことばで生きる」（新改訳2017/マタイ4:4）**

Gegraptai（ゲグラプタイ）は、ヘブライ語とギリシャ語の聖書原文を、誰でも直感的に読み、学び、記録できるモダンなWebアプリケーションです。

インストール不要。ブラウザを開くだけで、聖書の原文テキストにすぐにアクセスできます。

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

### ステップ 1: 読む・調べる
画面には左右に聖書テキストが表示されます。
- **調べたい単語をクリック**してみてください。
- **Detail Panel**が開き、その単語の詳細が表示されます。

### ステップ 2: 書く
Detail Panelの「Exegetical Notes」欄に、気になったことや黙想を書き込んでみましょう。
- 入力するとすぐに **`✓ Local`** と表示され、保存されます。
- ブラウザを閉じてもデータは消えません。

---

## 🏗 アーキテクチャ

Gegraptaiはパフォーマンスを最優先に設計されています。

### 技術スタック
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS (Premium Design System)
- **Data**: Optimized JSON Chunks (Dynamic Imports: データは分割され、オンデマンドで読み込まれます)
- **Backend**: Supabase (Auth & DB)

---

## 💾 データ管理について

あなたの研究データは大切に守られます。

| 状態 | 保存場所 | 特徴 |
|---|---|---|
| **未ログイン** | **LocalStorage** | ブラウザ内に保存。誰にも見られません。手軽ですが、ブラウザのキャッシュクリアで消える可能性があります。 |
| **ログイン** | **Supabase (Cloud)** | 安全なクラウドデータベースに保存。デバイスを変えても続きから研究できます。 |

---

## 🤝 貢献 (Contribution)

Gegraptaiはオープンソースプロジェクトです。
バグ報告や機能提案は [Issues](https://github.com/your-repo/gegraptai/issues) からお気軽にどうぞ。

License: MIT
