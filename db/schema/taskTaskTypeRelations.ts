import { pgTable, text, timestamp, primaryKey, integer } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { taskTypes } from "./taskTypes";

export const taskTaskTypeRelations = pgTable("task_task_type_relations", {
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "restrict" }),
  taskTypeId: text("task_type_id")
    .notNull()
    .references(() => taskTypes.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  // 優先度：'primary'(主要), 'secondary'(副次的)
  priority: text("priority").default("primary"),
  // 作業割合（パーセント）
  workRatio: integer("work_ratio"), // 例：70 (70%)
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.taskTypeId] })
}));
