import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../db"; // your drizzle instance
import { users, sessions, accounts, verifications } from "../../../db/schema/auth";
import { nanoid } from "nanoid";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        usePlural: true,// テーブルを複数形
        schema: {
            users: users, // usePlural: trueの場合は複数形のキー名が必要
            sessions: sessions,
            accounts: accounts,
            verifications: verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true, // サインアップ後に自動的にサインイン
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7, // 7日間
        },
    },
    advanced: {
        database: {
            generateId: () => nanoid(10),// 10文字のランダムなIDを生成
        },
    },
    plugins: [nextCookies()],// クッキーを使用してセッションを管理
});

