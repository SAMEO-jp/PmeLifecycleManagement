import { pgTable, text, timestamp, primaryKey, integer, decimal } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { purchaseItemMaster } from "./purchaseItemMaster";

export const taskPurchaseItemRelations = pgTable("task_purchase_item_relations", {
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "restrict" }),
  purchaseItemId: text("purchase_item_id")
    .notNull()
    .references(() => purchaseItemMaster.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  // 使用目的：'material'(材料), 'consumable'(消耗品), 'tool'(工具) など
  usageType: text("usage_type").default("material"),
  // 必要数量
  requiredQuantity: integer("required_quantity").default(1),
  // 実際の使用数量
  actualQuantity: integer("actual_quantity"),
  // 単価
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }),
  // 通貨単位
  currency: text("currency").default("JPY"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.purchaseItemId] })
}));
