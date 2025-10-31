import { pgTable, text, timestamp, primaryKey, numeric } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { users } from "./auth";

export const taskUserRelations = pgTable("task_user_relations", {
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "restrict" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  // 担当者種別：'owner'(責任者), 'assignee'(担当者), 'reviewer'(レビュアー) など
  roleType: text("role_type").default("assignee"),
  // 作業時間（時間単位）
  estimatedHours: numeric("estimated_hours", { precision: 10, scale: 2 }),
  // 実際の作業時間
  actualHours: numeric("actual_hours", { precision: 10, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.userId] })
}));
