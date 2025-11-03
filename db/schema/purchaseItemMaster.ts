import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const purchaseItemMaster = pgTable("purchase_item_master", {
  id: text("id").primaryKey(),
  purchaseItemName: text("purchase_item_name").notNull(),
  parentId: text("parent_id").references(() => purchaseItemMaster.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
