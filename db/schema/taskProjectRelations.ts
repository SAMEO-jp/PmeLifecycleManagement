import { pgTable, text, timestamp, primaryKey, integer } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { projects } from "./projects";

export const taskProjectRelations = pgTable("task_project_relations", {
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "restrict" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  // 必要に応じて追加のフィールド（関係の種類、順序など）
  relationType: text("relation_type").default("default"), // 'main', 'sub', 'related' など
  sortOrder: integer("sort_order"), // 並び順
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // 複合主キー：同じタスク-プロジェクトの組み合わせを重複させない
  pk: primaryKey({ columns: [table.taskId, table.projectId] })
}));
