/**
 * タスク設備関連Repository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  taskEquipmentRelations,
  type TaskEquipmentRelationInsert
} from '@/db/schema/taskEquipmentRelations';
import type {
  TaskEquipmentRelationTable,
  CreateTaskEquipmentRelationParams,
  UpdateTaskEquipmentRelationParams,
  DeleteTaskEquipmentRelationParams,
  FindTaskEquipmentRelationsParams,
  FindTaskEquipmentRelationByIdsParams,
  FindTaskEquipmentRelationsByTaskParams,
  FindTaskEquipmentRelationsByEquipmentParams,
  BulkCreateTaskEquipmentRelationsParams
} from '../types';
// 共通ユーティリティ関数をインポート
import {
  buildSoftDeleteCondition,
  buildWhereConditions,
  applyPagination,
  validateId,
  getCurrentTimestamp
} from '@/lib/repository-utils';
import type { SQL } from 'drizzle-orm';

/**
 * タスク設備関連Repositoryクラス
 */
export class TaskEquipmentRelationsRepository {
  /**
   * 全タスク設備関連を取得
   */
  async findAll(params: FindTaskEquipmentRelationsParams = {}): Promise<TaskEquipmentRelationTable[]> {
    const { includeDeleted = false, taskId, equipmentId, usageType, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // taskIdパラメータに基づいて条件を構築
    if (taskId) {
      conditions.push(eq(taskEquipmentRelations.taskId, taskId));
    }

    // equipmentIdパラメータに基づいて条件を構築
    if (equipmentId) {
      conditions.push(eq(taskEquipmentRelations.equipmentId, equipmentId));
    }

    // usageTypeパラメータに基づいて条件を構築
    if (usageType) {
      conditions.push(eq(taskEquipmentRelations.usageType, usageType));
    }

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskEquipmentRelations));
    }

    // クエリ実行
    const query = db.select().from(taskEquipmentRelations).where(buildWhereConditions(conditions));

    // ページネーション適用
    const result = await applyPagination(query, limit, offset);

    // 型変換（DrizzleのSelect型からカスタムTable型へ）
    return result.map(row => ({
      taskId: row.taskId,
      equipmentId: row.equipmentId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      usageType: row.usageType,
      plannedHours: row.plannedHours || undefined,
      actualHours: row.actualHours || undefined,
      quantity: row.quantity,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * IDでタスク設備関連を取得
   */
  async findByIds(params: FindTaskEquipmentRelationByIdsParams): Promise<TaskEquipmentRelationTable | null> {
    const { taskId, equipmentId, includeDeleted = false } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(equipmentId)) {
      throw new Error('無効なIDです');
    }

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [
      eq(taskEquipmentRelations.taskId, taskId),
      eq(taskEquipmentRelations.equipmentId, equipmentId)
    ];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskEquipmentRelations));
    }

    const result = await db
      .select()
      .from(taskEquipmentRelations)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      taskId: row.taskId,
      equipmentId: row.equipmentId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      usageType: row.usageType,
      plannedHours: row.plannedHours || undefined,
      actualHours: row.actualHours || undefined,
      quantity: row.quantity,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * タスクIDで関連を取得
   */
  async findByTaskId(params: FindTaskEquipmentRelationsByTaskParams): Promise<TaskEquipmentRelationTable[]> {
    const { taskId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(taskEquipmentRelations.taskId, taskId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskEquipmentRelations));
    }

    const result = await db
      .select()
      .from(taskEquipmentRelations)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      taskId: row.taskId,
      equipmentId: row.equipmentId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      usageType: row.usageType,
      plannedHours: row.plannedHours || undefined,
      actualHours: row.actualHours || undefined,
      quantity: row.quantity,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * 設備IDで関連を取得
   */
  async findByEquipmentId(params: FindTaskEquipmentRelationsByEquipmentParams): Promise<TaskEquipmentRelationTable[]> {
    const { equipmentId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(taskEquipmentRelations.equipmentId, equipmentId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskEquipmentRelations));
    }

    const result = await db
      .select()
      .from(taskEquipmentRelations)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      taskId: row.taskId,
      equipmentId: row.equipmentId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      usageType: row.usageType,
      plannedHours: row.plannedHours || undefined,
      actualHours: row.actualHours || undefined,
      quantity: row.quantity,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * タスク設備関連を作成
   */
  async create(params: CreateTaskEquipmentRelationParams): Promise<TaskEquipmentRelationTable> {
    const { taskId, equipmentId, usageType = 'main', plannedHours, actualHours, quantity = 1 } = params;

    const now = getCurrentTimestamp();

    const insertData: TaskEquipmentRelationInsert = {
      taskId,
      equipmentId,
      createdAt: now,
      usageType,
      plannedHours: plannedHours || null,
      actualHours: actualHours || null,
      quantity,
      updatedAt: now,
    };

    await db.insert(taskEquipmentRelations).values(insertData);

    // 作成されたデータを取得
    const created = await this.findByIds({ taskId, equipmentId });
    if (!created) {
      throw new Error('タスク設備関連の作成に失敗しました');
    }

    return created;
  }

  /**
   * タスク設備関連を更新
   */
  async update(params: UpdateTaskEquipmentRelationParams): Promise<TaskEquipmentRelationTable> {
    const { taskId, equipmentId, usageType, plannedHours, actualHours, quantity } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(equipmentId)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    const updateData: Partial<TaskEquipmentRelationInsert> = {
      updatedAt: now,
    };

    // 更新するフィールドを追加
    if (usageType !== undefined) updateData.usageType = usageType;
    if (plannedHours !== undefined) updateData.plannedHours = plannedHours || null;
    if (actualHours !== undefined) updateData.actualHours = actualHours || null;
    if (quantity !== undefined) updateData.quantity = quantity;

    await db
      .update(taskEquipmentRelations)
      .set(updateData)
      .where(and(
        eq(taskEquipmentRelations.taskId, taskId),
        eq(taskEquipmentRelations.equipmentId, equipmentId)
      ));

    // 更新されたデータを取得
    const updated = await this.findByIds({ taskId, equipmentId });
    if (!updated) {
      throw new Error('タスク設備関連の更新に失敗しました');
    }

    return updated;
  }

  /**
   * タスク設備関連を論理削除
   */
  async softDelete(params: DeleteTaskEquipmentRelationParams): Promise<void> {
    const { taskId, equipmentId } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(equipmentId)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    await db
      .update(taskEquipmentRelations)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(
        eq(taskEquipmentRelations.taskId, taskId),
        eq(taskEquipmentRelations.equipmentId, equipmentId)
      ));
  }

  /**
   * タスク設備関連を完全に削除（物理削除）
   */
  async hardDelete(params: DeleteTaskEquipmentRelationParams): Promise<void> {
    const { taskId, equipmentId } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(equipmentId)) {
      throw new Error('無効なIDです');
    }

    await db.delete(taskEquipmentRelations).where(and(
      eq(taskEquipmentRelations.taskId, taskId),
      eq(taskEquipmentRelations.equipmentId, equipmentId)
    ));
  }

  /**
   * バルクリレーション作成
   */
  async bulkCreate(params: BulkCreateTaskEquipmentRelationsParams): Promise<TaskEquipmentRelationTable[]> {
    const { relations } = params;

    if (relations.length === 0) {
      return [];
    }

    const now = getCurrentTimestamp();

    const insertData: TaskEquipmentRelationInsert[] = relations.map(relation => ({
      taskId: relation.taskId,
      equipmentId: relation.equipmentId,
      createdAt: now,
      usageType: relation.usageType || 'main',
      plannedHours: relation.plannedHours || null,
      actualHours: relation.actualHours || null,
      quantity: relation.quantity || 1,
      updatedAt: now,
    }));

    await db.insert(taskEquipmentRelations).values(insertData);

    // 作成されたデータを取得
    const createdRelations: TaskEquipmentRelationTable[] = [];
    for (const relation of relations) {
      const created = await this.findByIds({
        taskId: relation.taskId,
        equipmentId: relation.equipmentId
      });
      if (created) {
        createdRelations.push(created);
      }
    }

    return createdRelations;
  }

  /**
   * 条件に一致するタスク設備関連の数をカウント
   */
  async count(params: FindTaskEquipmentRelationsParams = {}): Promise<number> {
    const { includeDeleted = false, taskId, equipmentId, usageType } = params;

    const conditions: (SQL | null | undefined)[] = [];

    if (taskId) {
      conditions.push(eq(taskEquipmentRelations.taskId, taskId));
    }

    if (equipmentId) {
      conditions.push(eq(taskEquipmentRelations.equipmentId, equipmentId));
    }

    if (usageType) {
      conditions.push(eq(taskEquipmentRelations.usageType, usageType));
    }

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskEquipmentRelations));
    }

    const result = await db
      .select({ count: count() })
      .from(taskEquipmentRelations)
      .where(buildWhereConditions(conditions));

    return result[0].count;
  }
}
