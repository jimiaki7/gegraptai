# Gegraptai (聖書原語研究アプリ)

Vite + React + TypeScript で構築された、オフライン対応の聖書研究アプリケーションです。
ヘブライ語（旧約）とギリシャ語（新約）の全テキストを含み、形態素解析データの表示や独自の釈義メモを作成できます。

## 🚀 使い方 (ローカルでの実行)

このフォルダで以下のコマンドを実行するだけで、ブラウザ上でアプリが起動します。

### 1. 開発サーバーの起動
普段使いや開発を行う場合に使います。

```bash
npm run dev
```
コマンド実行後、表示される URL (例: `http://localhost:5173`) をブラウザで開いてください。

### 2. 本番ビルドのプレビュー
より製品版に近い動作を確認したい場合に使います。

```bash
npm run build
npm run preview
```

---

## 🌐 ウェブへの公開 (デプロイ)

このアプリは静的な Web サイトとして、**GetHub Pages**, **Vercel**, **Netlify** などのホスティングサービスで無料で公開できます。

### 簡単な手順 (Vercel / Netlify の場合)

1. このプロジェクトフォルダを GitHub にアップロード（プッシュ）します。
2. Vercel や Netlify にログインし、「Import Project」から GitHub リポジトリを選択します。
3. Framework Preset は `Vite` が自動選択されます。
4. `Deploy` ボタンを押せば、世界中からアクセスできる URL が発行されます。

### 🔥 Netlify へのデプロイ（一番かんたんな方法）

最も手軽な方法は「Netlify Drop」機能を使うことです。アカウント登録さえあれば、コマンド操作なしで公開できます。

1.  **ビルド（ファイルの準備）**:
    このプロジェクトのターミナルで、以下のコマンドを実行します。
    ```bash
    npm run build
    ```
    実行後、プロジェクトフォルダ内に `dist` という新しいフォルダが作成されます（これが公開用ファイル一式です）。

2.  **Netlify Drop へアクセス**:
    Webブラウザで [Netlify Drop](https://app.netlify.com/drop) を開きます。
    （ログインしていない場合は、サインアップまたはログインしてください）

3.  **ドラッグ＆ドロップ**:
    画面に `Drag and drop your site output folder here` と表示されているエリアへ、先ほど作成された **`dist` フォルダごと**ドラッグ＆ドロップします。

4.  **公開完了**:
    数秒〜数十秒でアップロードが完了し、ランダムな URL（例: `https://heuristic-babbage-xxxxxx.netlify.app`）が発行されます。その URL にアクセスすれば、世界中からアプリを利用できます。

### その他の方法（GitHub 連携）

GitHub にリポジトリを作成済みであれば、Netlify のダッシュボードから `New site from Git` を選択し、リポジトリを選んで連携させる方法もおすすめです。この場合、コードを GitHub にプッシュするたびに自動で更新（再デプロイ）されるようになります。

- **Build command**: `npm run build`
- **Publish directory**: `dist`

---

## 💾 データについて

- **保存**: 入力したパースやメモは、ブラウザの **LocalStorage** に自動保存されます。
- **バックアップ**: 画面右上の設定（歯車アイコン）> **「データ管理」** から、入力データを JSON ファイルとしてエクスポートできます。定期的なバックアップをお勧めします。

## 📚 含まれるデータ
- 旧約聖書: OSHB (Open Scriptures Hebrew Bible)
- 新約聖書: MorphGNT (SBLGNT)
# gegraptai
