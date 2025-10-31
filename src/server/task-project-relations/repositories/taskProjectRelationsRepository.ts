/**
 * タスクプロジェクト関連Repository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  taskProjectRelations,
  type TaskProjectRelationInsert
} from '@/db/schema/taskProjectRelations';
import type {
  TaskProjectRelationTable,
  CreateTaskProjectRelationParams,
  UpdateTaskProjectRelationParams,
  DeleteTaskProjectRelationParams,
  FindTaskProjectRelationsParams,
  FindTaskProjectRelationByIdsParams,
  FindTaskProjectRelationsByTaskParams,
  FindTaskProjectRelationsByProjectParams,
  BulkCreateTaskProjectRelationsParams
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
 * タスクプロジェクト関連Repositoryクラス
 */
export class TaskProjectRelationsRepository {
  /**
   * 全タスクプロジェクト関連を取得
   */
  async findAll(params: FindTaskProjectRelationsParams = {}): Promise<TaskProjectRelationTable[]> {
    const { includeDeleted = false, taskId, projectId, relationType, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // taskIdパラメータに基づいて条件を構築
    if (taskId) {
      conditions.push(eq(taskProjectRelations.taskId, taskId));
    }

    // projectIdパラメータに基づいて条件を構築
    if (projectId) {
      conditions.push(eq(taskProjectRelations.projectId, projectId));
    }

    // relationTypeパラメータに基づいて条件を構築
    if (relationType) {
      conditions.push(eq(taskProjectRelations.relationType, relationType));
    }

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskProjectRelations));
    }

    // クエリ実行
    const query = db.select().from(taskProjectRelations).where(buildWhereConditions(conditions));

    // ページネーション適用
    const result = await applyPagination(query, limit, offset);

    // 型変換（DrizzleのSelect型からカスタムTable型へ）
    return result.map(row => ({
      taskId: row.taskId,
      projectId: row.projectId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      relationType: row.relationType,
      sortOrder: row.sortOrder || undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * IDでタスクプロジェクト関連を取得
   */
  async findByIds(params: FindTaskProjectRelationByIdsParams): Promise<TaskProjectRelationTable | null> {
    const { taskId, projectId, includeDeleted = false } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(projectId)) {
      throw new Error('無効なIDです');
    }

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [
      eq(taskProjectRelations.taskId, taskId),
      eq(taskProjectRelations.projectId, projectId)
    ];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskProjectRelations));
    }

    const result = await db
      .select()
      .from(taskProjectRelations)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      taskId: row.taskId,
      projectId: row.projectId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      relationType: row.relationType,
      sortOrder: row.sortOrder || undefined,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * タスクIDで関連を取得
   */
  async findByTaskId(params: FindTaskProjectRelationsByTaskParams): Promise<TaskProjectRelationTable[]> {
    const { taskId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(taskProjectRelations.taskId, taskId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskProjectRelations));
    }

    const result = await db
      .select()
      .from(taskProjectRelations)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      taskId: row.taskId,
      projectId: row.projectId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      relationType: row.relationType,
      sortOrder: row.sortOrder || undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * プロジェクトIDで関連を取得
   */
  async findByProjectId(params: FindTaskProjectRelationsByProjectParams): Promise<TaskProjectRelationTable[]> {
    const { projectId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(taskProjectRelations.projectId, projectId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskProjectRelations));
    }

    const result = await db
      .select()
      .from(taskProjectRelations)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      taskId: row.taskId,
      projectId: row.projectId,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      relationType: row.relationType,
      sortOrder: row.sortOrder || undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * タスクプロジェクト関連を作成
   */
  async create(params: CreateTaskProjectRelationParams): Promise<TaskProjectRelationTable> {
    const { taskId, projectId, relationType = 'default', sortOrder } = params;

    const now = getCurrentTimestamp();

    const insertData: TaskProjectRelationInsert = {
      taskId,
      projectId,
      createdAt: now,
      relationType,
      sortOrder: sortOrder || null,
      updatedAt: now,
    };

    await db.insert(taskProjectRelations).values(insertData);

    // 作成されたデータを取得
    const created = await this.findByIds({ taskId, projectId });
    if (!created) {
      throw new Error('タスクプロジェクト関連の作成に失敗しました');
    }

    return created;
  }

  /**
   * タスクプロジェクト関連を更新
   */
  async update(params: UpdateTaskProjectRelationParams): Promise<TaskProjectRelationTable> {
    const { taskId, projectId, relationType, sortOrder } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(projectId)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    const updateData: Partial<TaskProjectRelationInsert> = {
      updatedAt: now,
    };

    // 更新するフィールドを追加
    if (relationType !== undefined) updateData.relationType = relationType;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder || null;

    await db
      .update(taskProjectRelations)
      .set(updateData)
      .where(and(
        eq(taskProjectRelations.taskId, taskId),
        eq(taskProjectRelations.projectId, projectId)
      ));

    // 更新されたデータを取得
    const updated = await this.findByIds({ taskId, projectId });
    if (!updated) {
      throw new Error('タスクプロジェクト関連の更新に失敗しました');
    }

    return updated;
  }

  /**
   * タスクプロジェクト関連を論理削除
   */
  async softDelete(params: DeleteTaskProjectRelationParams): Promise<void> {
    const { taskId, projectId } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(projectId)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    await db
      .update(taskProjectRelations)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(
        eq(taskProjectRelations.taskId, taskId),
        eq(taskProjectRelations.projectId, projectId)
      ));
  }

  /**
   * タスクプロジェクト関連を完全に削除（物理削除）
   */
  async hardDelete(params: DeleteTaskProjectRelationParams): Promise<void> {
    const { taskId, projectId } = params;

    // IDバリデーション
    if (!validateId(taskId) || !validateId(projectId)) {
      throw new Error('無効なIDです');
    }

    await db.delete(taskProjectRelations).where(and(
      eq(taskProjectRelations.taskId, taskId),
      eq(taskProjectRelations.projectId, projectId)
    ));
  }

  /**
   * バルクリレーション作成
   */
  async bulkCreate(params: BulkCreateTaskProjectRelationsParams): Promise<TaskProjectRelationTable[]> {
    const { relations } = params;

    if (relations.length === 0) {
      return [];
    }

    const now = getCurrentTimestamp();

    const insertData: TaskProjectRelationInsert[] = relations.map(relation => ({
      taskId: relation.taskId,
      projectId: relation.projectId,
      createdAt: now,
      relationType: relation.relationType || 'default',
      sortOrder: relation.sortOrder || null,
      updatedAt: now,
    }));

    await db.insert(taskProjectRelations).values(insertData);

    // 作成されたデータを取得
    const createdRelations: TaskProjectRelationTable[] = [];
    for (const relation of relations) {
      const created = await this.findByIds({
        taskId: relation.taskId,
        projectId: relation.projectId
      });
      if (created) {
        createdRelations.push(created);
      }
    }

    return createdRelations;
  }

  /**
   * 条件に一致するタスクプロジェクト関連の数をカウント
   */
  async count(params: FindTaskProjectRelationsParams = {}): Promise<number> {
    const { includeDeleted = false, taskId, projectId, relationType } = params;

    const conditions: (SQL | null | undefined)[] = [];

    if (taskId) {
      conditions.push(eq(taskProjectRelations.taskId, taskId));
    }

    if (projectId) {
      conditions.push(eq(taskProjectRelations.projectId, projectId));
    }

    if (relationType) {
      conditions.push(eq(taskProjectRelations.relationType, relationType));
    }

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskProjectRelations));
    }

    const result = await db
      .select({ count: count() })
      .from(taskProjectRelations)
      .where(buildWhereConditions(conditions));

    return result[0].count;
  }
}
