import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './db/migrations',//SQLファイルの出力先
  schema: './db/schema/*.ts',//データベースのスキーマファイル設計書の位置
  dialect: 'postgresql',//データベースの方言
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
//npx drizzle-kit generate or migration pnpxは動かない！
