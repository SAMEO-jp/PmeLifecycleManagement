import { pgTable, text, timestamp, primaryKey, integer } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { equipmentMaster } from "./equipmentMaster";

export const taskEquipmentRelations = pgTable("task_equipment_relations", {
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "restrict" }),
  equipmentId: text("equipment_id")
    .notNull()
    .references(() => equipmentMaster.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  // 使用目的：'main'(主要設備), 'support'(支援設備), 'tool'(ツール) など
  usageType: text("usage_type").default("main"),
  // 使用予定時間（時間単位）
  plannedHours: integer("planned_hours"),
  // 実際の使用時間
  actualHours: integer("actual_hours"),
  // 使用数量
  quantity: integer("quantity").default(1),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.equipmentId] })
}));
