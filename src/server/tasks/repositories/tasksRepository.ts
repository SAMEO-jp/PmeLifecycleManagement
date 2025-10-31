/**
 * タスクRepository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  tasks,
  type TaskInsert
} from '@/db/schema/tasks';
import type {
  TaskTable,
  CreateTaskParams,
  UpdateTaskParams,
  DeleteTaskParams,
  FindTasksParams,
  FindTaskByIdParams,
  FindTasksByTaskTypeParams
} from '../types';
// 共通ユーティリティ関数をインポート
import {
  buildSoftDeleteCondition,
  buildWhereConditions,
  applyPagination,
  validateId,
  generateId,
  getCurrentTimestamp
} from '@/lib/repository-utils';
import type { SQL } from 'drizzle-orm';

/**
 * タスクRepositoryクラス
 */
export class TasksRepository {
  /**
   * 全タスクを取得
   */
  async findAll(params: FindTasksParams = {}): Promise<TaskTable[]> {
    const { includeDeleted = false, taskTypeId, planId, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // taskTypeIdパラメータに基づいて条件を構築
    if (taskTypeId) {
      conditions.push(eq(tasks.taskTypeId, taskTypeId));
    }

    // planIdパラメータに基づいて条件を構築
    if (planId !== undefined) {
      if (planId === null) {
        conditions.push(isNull(tasks.planId));
      } else {
        conditions.push(eq(tasks.planId, planId));
      }
    }

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(tasks));
    }

    // クエリ実行
    const query = db.select().from(tasks).where(buildWhereConditions(conditions));

    // ページネーション適用
    const result = await applyPagination(query, limit, offset);

    // 型変換（DrizzleのSelect型からカスタムTable型へ）
    return result.map(row => ({
      id: row.id,
      taskName: row.taskName,
      taskTypeId: row.taskTypeId,
      planId: row.planId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * IDでタスクを取得
   */
  async findById(params: FindTaskByIdParams): Promise<TaskTable | null> {
    const { id, includeDeleted = false } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(tasks.id, id)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(tasks));
    }

    const result = await db
      .select()
      .from(tasks)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      id: row.id,
      taskName: row.taskName,
      taskTypeId: row.taskTypeId,
      planId: row.planId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * タスクタイプIDでタスクを取得
   */
  async findByTaskTypeId(params: FindTasksByTaskTypeParams): Promise<TaskTable[]> {
    const { taskTypeId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(tasks.taskTypeId, taskTypeId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(tasks));
    }

    const result = await db
      .select()
      .from(tasks)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      id: row.id,
      taskName: row.taskName,
      taskTypeId: row.taskTypeId,
      planId: row.planId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * タスクを作成
   */
  async create(params: CreateTaskParams): Promise<TaskTable> {
    const { taskName, taskTypeId, planId } = params;

    const now = getCurrentTimestamp();
    const newId = generateId();

    const insertData: TaskInsert = {
      id: newId,
      taskName,
      taskTypeId,
      planId: planId || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(tasks).values(insertData);

    // 作成されたデータを取得
    const created = await this.findById({ id: newId });
    if (!created) {
      throw new Error('タスクの作成に失敗しました');
    }

    return created;
  }

  /**
   * タスクを更新
   */
  async update(params: UpdateTaskParams): Promise<TaskTable> {
    const { id, taskName, taskTypeId, planId } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    const updateData: Partial<TaskInsert> = {
      updatedAt: now,
    };

    // 更新するフィールドを追加
    if (taskName !== undefined) updateData.taskName = taskName;
    if (taskTypeId !== undefined) updateData.taskTypeId = taskTypeId;
    if (planId !== undefined) updateData.planId = planId || null;

    await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id));

    // 更新されたデータを取得
    const updated = await this.findById({ id });
    if (!updated) {
      throw new Error('タスクの更新に失敗しました');
    }

    return updated;
  }

  /**
   * タスクを論理削除
   */
  async softDelete(params: DeleteTaskParams): Promise<void> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    await db
      .update(tasks)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(tasks.id, id));
  }

  /**
   * タスクを完全に削除（物理削除）
   */
  async hardDelete(params: DeleteTaskParams): Promise<void> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    await db.delete(tasks).where(eq(tasks.id, id));
  }

  /**
   * 条件に一致するタスクの数をカウント
   */
  async count(params: FindTasksParams = {}): Promise<number> {
    const { includeDeleted = false, taskTypeId, planId } = params;

    const conditions: (SQL | null | undefined)[] = [];

    if (taskTypeId) {
      conditions.push(eq(tasks.taskTypeId, taskTypeId));
    }

    if (planId !== undefined) {
      if (planId === null) {
        conditions.push(isNull(tasks.planId));
      } else {
        conditions.push(eq(tasks.planId, planId));
      }
    }

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(tasks));
    }

    const result = await db
      .select({ count: count() })
      .from(tasks)
      .where(buildWhereConditions(conditions));

    return result[0].count;
  }

  /**
   * taskNameでタスクを検索
   */
  async findByTaskName(taskName: string, includeDeleted = false): Promise<TaskTable | null> {
    const conditions: (SQL | null | undefined)[] = [eq(tasks.taskName, taskName)];

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(tasks));
    }

    const result = await db
      .select()
      .from(tasks)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return {
      id: row.id,
      taskName: row.taskName,
      taskTypeId: row.taskTypeId,
      planId: row.planId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    };
  }
}
