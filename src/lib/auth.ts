import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db"; // your drizzle instance
import { nanoid } from "nanoid";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    baseURL: "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        usePlural: true,// テーブルを複数形
    }),
    advanced: {
        database: {
            generateId: () => nanoid(10),// 10文字のランダムなIDを生成
        },
    },
    plugins: [nextCookies()],// クッキーを使用してセッションを管理
});