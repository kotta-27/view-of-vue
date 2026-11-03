# View of Vue

公開版: https://kotta-27.github.io/view-of-vue/

Vue 3 を基礎から内部実装、実務の知識まで、動かして学ぶ教材。全 26 章。

- 入門 A〜G: 最初のアプリからコンポーネントまで
- 第 1〜4 部: リアクティビティ、レンダリング、コンポーネント、再利用の仕組み（第 1〜12 章）
- 第 5 部: TypeScript、Vue Router、Pinia、組み込みコンポーネント、拡張、テストと性能、SSR（第 13〜19 章）

機能: ライト/ダーク、日本語/英語、やさしいモード、演習（sandbox の iframe で本物の Vue を実行して判定）、プレイグラウンド、全文検索、学習の進捗、早見表、よくある間違い、用語集。

言語を増やすときは `src/lib/settings.ts` の `LOCALES` に足し、`src/content/` の各ファイルに翻訳を加える。

```sh
npm install
npm run dev      # http://localhost:5310
npm test         # 簡略実装と本物の Vue の照合、本文の主張の確認
npm run e2e      # dev 起動中に実行。Chrome を headless で動かす
```

個人の学習用。Vue.js 公式とは無関係。

`main` に push すると、GitHub Actions が lint、テスト、ビルドを通したうえで GitHub Pages へ配信する（`.github/workflows/deploy.yml`）。
