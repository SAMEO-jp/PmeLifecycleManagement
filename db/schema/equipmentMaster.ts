import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const equipmentMaster = pgTable("equipment_master", {
  id: text("id").primaryKey(),
  equipmentName: text("equipment_name").notNull(),
  parentId: text("parent_id").references(() => equipmentMaster.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
