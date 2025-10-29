import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
import { nanoid } from "nanoid";


export const auth = betterAuth({
    baseUrl: "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        usePlural: true,// テーブルを複数形
    }),
    adovanced: {
        database: {
            generateId: () => nanoid(10),// 10文字のランダムなIDを生成
        },
    },
});