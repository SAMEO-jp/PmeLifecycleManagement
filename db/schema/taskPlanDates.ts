import { pgTable, text, timestamp, date, boolean } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";

export const taskPlanDates = pgTable("task_plan_dates", {
  id: text("id").primaryKey(),
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "restrict" }), // tasks.id を参照
  plannedStartDate: date("planned_start_date").notNull(), // 計画開始日
  plannedEndDate: date("planned_end_date").notNull(), // 計画終了日
  planTypeName: text("plan_type_name").notNull(), // 計画種類名（例：メインプラン、サブプラン、フェーズ1など）
  description: text("description"), // 計画の説明
  isActive: boolean("is_active").default(true), // 有効/無効フラグ
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
