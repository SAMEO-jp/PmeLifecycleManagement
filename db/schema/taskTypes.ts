import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const taskTypes = pgTable("task_types", {
  id: text("id").primaryKey(),
  typeName: text("type_name").notNull().unique(), // タスク種類名（例：開発、設計、テストなど）
  description: text("description"), // 説明
  colorCode: text("color_code"), // UIでの色分け用（例：#FF5733）
  sortOrder: integer("sort_order").default(0), // 表示順
  isActive: boolean("is_active").default(true), // 有効/無効フラグ
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
