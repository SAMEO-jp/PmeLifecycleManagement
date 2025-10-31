import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { taskTypes } from "./taskTypes";
import { taskPlanDates } from "./taskPlanDates";

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  taskName: text("task_name").notNull(),
  taskTypeId: text("task_type_id").notNull().references(() => taskTypes.id, { onDelete: "restrict" }),
  planId: text("plan_id").references(() => taskPlanDates.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
