/**
 * タスクユーザー関連Repository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  taskUserRelations,
  type TaskUserRelationInsert
} from '@/db/schema/taskUserRelations';
import type {
  TaskUserRelationTable,
  CreateTaskUserRelationParams,
  UpdateTaskUserRelationParams,
  DeleteTaskUserRelationParams,
  FindTaskUserRelationsParams,
  FindTaskUserRelationByIdsParams,
  FindTaskUserRelationsByTaskParams,
  FindTaskUserRelationsByUserParams,
  BulkCreateTaskUserRelationsParams
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
 * タスクユーザー関連Repositoryクラス
 */
export class TaskUserRelationsRepository {
  /**
   * 全タスクユーザー関連を取得
   */
  async findAll(params: FindTaskUserRelationsParams = {}): Promise<TaskUserRelationTable[]> {
    const { includeDeleted = false, taskId, userId, roleType, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // taskIdパラメータに基づいて条件を構築
    if (taskId) {
      conditions.push(eq(taskUserRelations.taskId, taskId));
    }

    // userIdパラメータに基づいて条件を構築
    if (userId) {
      conditions.push(eq(taskUserRelations.userId, userId));
    }

    // roleTypeパラメータに基づいて条件を構築
    if (roleType) {
      conditions.push(eq(taskUserRelations.roleType, roleType));
    }

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskUserRelations));
    }

    // クエリ実行
    const query = db.select().from(taskUserRelations).where(buildWhereConditions(conditions));

    // ページネーション適用
    const result = await applyPagination(query, limit, offset);

    // 型変換（DrizzleのSelect型からカスタムTable型へ）
    return result.map(row => ({
      taskId: row.taskId,
      userId: row.userId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      roleType: row.roleType,
      estimatedHours: row.estimatedHours ? Number(row.estimatedHours) : undefined,
      actualHours: row.actualHours ? Number(row.actualHours) : undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * IDでタスクユーザー関連を取得
   */
  async findByIds(params: FindTaskUserRelationByIdsParams): Promise<TaskUserRelationTable | null> {
    const { taskId, userId, includeDeleted = false } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(userId)) {
      throw new Error('無効なIDです');
    }

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [
      eq(taskUserRelations.taskId, taskId),
      eq(taskUserRelations.userId, userId)
    ];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskUserRelations));
    }

    const result = await db
      .select()
      .from(taskUserRelations)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      taskId: row.taskId,
      userId: row.userId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      roleType: row.roleType,
      estimatedHours: row.estimatedHours ? Number(row.estimatedHours) : undefined,
      actualHours: row.actualHours ? Number(row.actualHours) : undefined,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * タスクIDで関連を取得
   */
  async findByTaskId(params: FindTaskUserRelationsByTaskParams): Promise<TaskUserRelationTable[]> {
    const { taskId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(taskUserRelations.taskId, taskId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskUserRelations));
    }

    const result = await db
      .select()
      .from(taskUserRelations)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      taskId: row.taskId,
      userId: row.userId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      roleType: row.roleType,
      estimatedHours: row.estimatedHours ? Number(row.estimatedHours) : undefined,
      actualHours: row.actualHours ? Number(row.actualHours) : undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * ユーザーIDで関連を取得
   */
  async findByUserId(params: FindTaskUserRelationsByUserParams): Promise<TaskUserRelationTable[]> {
    const { userId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(taskUserRelations.userId, userId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskUserRelations));
    }

    const result = await db
      .select()
      .from(taskUserRelations)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      taskId: row.taskId,
      userId: row.userId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      roleType: row.roleType,
      estimatedHours: row.estimatedHours ? Number(row.estimatedHours) : undefined,
      actualHours: row.actualHours ? Number(row.actualHours) : undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * タスクユーザー関連を作成
   */
  async create(params: CreateTaskUserRelationParams): Promise<TaskUserRelationTable> {
    const { taskId, userId, roleType = 'assignee', estimatedHours, actualHours } = params;

    const now = getCurrentTimestamp();

    const insertData: TaskUserRelationInsert = {
      taskId,
      userId,
      createdAt: now,
      roleType,
      estimatedHours: estimatedHours ? estimatedHours.toString() : null,
      actualHours: actualHours ? actualHours.toString() : null,
      updatedAt: now,
    };

    await db.insert(taskUserRelations).values(insertData);

    // 作成されたデータを取得
    const created = await this.findByIds({ taskId, userId });
    if (!created) {
      throw new Error('タスクユーザー関連の作成に失敗しました');
    }

    return created;
  }

  /**
   * タスクユーザー関連を更新
   */
  async update(params: UpdateTaskUserRelationParams): Promise<TaskUserRelationTable> {
    const { taskId, userId, roleType, estimatedHours, actualHours } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(userId)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    const updateData: Partial<TaskUserRelationInsert> = {
      updatedAt: now,
    };

    // 更新するフィールドを追加
    if (roleType !== undefined) updateData.roleType = roleType;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours ? estimatedHours.toString() : null;
    if (actualHours !== undefined) updateData.actualHours = actualHours ? actualHours.toString() : null;

    await db
      .update(taskUserRelations)
      .set(updateData)
      .where(and(
        eq(taskUserRelations.taskId, taskId),
        eq(taskUserRelations.userId, userId)
      ));

    // 更新されたデータを取得
    const updated = await this.findByIds({ taskId, userId });
    if (!updated) {
      throw new Error('タスクユーザー関連の更新に失敗しました');
    }

    return updated;
  }

  /**
   * タスクユーザー関連を論理削除
   */
  async softDelete(params: DeleteTaskUserRelationParams): Promise<void> {
    const { taskId, userId } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(userId)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    await db
      .update(taskUserRelations)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(
        eq(taskUserRelations.taskId, taskId),
        eq(taskUserRelations.userId, userId)
      ));
  }

  /**
   * タスクユーザー関連を完全に削除（物理削除）
   */
  async hardDelete(params: DeleteTaskUserRelationParams): Promise<void> {
    const { taskId, userId } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(userId)) {
      throw new Error('無効なIDです');
    }

    await db.delete(taskUserRelations).where(and(
      eq(taskUserRelations.taskId, taskId),
      eq(taskUserRelations.userId, userId)
    ));
  }

  /**
   * バルクリレーション作成
   */
  async bulkCreate(params: BulkCreateTaskUserRelationsParams): Promise<TaskUserRelationTable[]> {
    const { relations } = params;

    if (relations.length === 0) {
      return [];
    }

    const now = getCurrentTimestamp();

    const insertData: TaskUserRelationInsert[] = relations.map(relation => ({
      taskId: relation.taskId,
      userId: relation.userId,
      createdAt: now,
      roleType: relation.roleType || 'assignee',
      estimatedHours: relation.estimatedHours ? relation.estimatedHours.toString() : null,
      actualHours: relation.actualHours ? relation.actualHours.toString() : null,
      updatedAt: now,
    }));

    await db.insert(taskUserRelations).values(insertData);

    // 作成されたデータを取得
    const createdRelations: TaskUserRelationTable[] = [];
    for (const relation of relations) {
      const created = await this.findByIds({
        taskId: relation.taskId,
        userId: relation.userId
      });
      if (created) {
        createdRelations.push(created);
      }
    }

    return createdRelations;
  }

  /**
   * 条件に一致するタスクユーザー関連の数をカウント
   */
  async count(params: FindTaskUserRelationsParams = {}): Promise<number> {
    const { includeDeleted = false, taskId, userId, roleType } = params;

    const conditions: (SQL | null | undefined)[] = [];

    if (taskId) {
      conditions.push(eq(taskUserRelations.taskId, taskId));
    }

    if (userId) {
      conditions.push(eq(taskUserRelations.userId, userId));
    }

    if (roleType) {
      conditions.push(eq(taskUserRelations.roleType, roleType));
    }

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskUserRelations));
    }

    const result = await db
      .select({ count: count() })
      .from(taskUserRelations)
      .where(buildWhereConditions(conditions));

    return result[0].count;
  }
}
