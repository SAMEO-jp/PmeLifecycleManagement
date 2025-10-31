/**
 * タスクタイプRepository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  taskTypes,
  type TaskTypeInsert
} from '@/db/schema/taskTypes';
import type {
  TaskTypeTable,
  CreateTaskTypeParams,
  UpdateTaskTypeParams,
  DeleteTaskTypeParams,
  FindTaskTypesParams,
  FindTaskTypeByIdParams
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
 * タスクタイプRepositoryクラス
 */
export class TaskTypesRepository {
  /**
   * 全タスクタイプを取得
   */
  async findAll(params: FindTaskTypesParams = {}): Promise<TaskTypeTable[]> {
    const { includeDeleted = false, isActive, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // isActiveパラメータに基づいて条件を構築
    if (isActive !== undefined) {
      conditions.push(eq(taskTypes.isActive, isActive));
    }

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskTypes));
    }

    // クエリ実行
    const query = db.select().from(taskTypes).where(buildWhereConditions(conditions));

    // ページネーション適用
    const result = await applyPagination(query, limit, offset);

    // 型変換（DrizzleのSelect型からカスタムTable型へ）
    return result.map(row => ({
      id: row.id,
      typeName: row.typeName,
      description: row.description || undefined,
      colorCode: row.colorCode || undefined,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * IDでタスクタイプを取得
   */
  async findById(params: FindTaskTypeByIdParams): Promise<TaskTypeTable | null> {
    const { id, includeDeleted = false } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(taskTypes.id, id)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskTypes));
    }

    const result = await db
      .select()
      .from(taskTypes)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      id: row.id,
      typeName: row.typeName,
      description: row.description || undefined,
      colorCode: row.colorCode || undefined,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * タスクタイプを作成
   */
  async create(params: CreateTaskTypeParams): Promise<TaskTypeTable> {
    const { typeName, description, colorCode, sortOrder = 0, isActive = true } = params;

    const now = getCurrentTimestamp();
    const newId = generateId();

    const insertData: TaskTypeInsert = {
      id: newId,
      typeName,
      description: description || null,
      colorCode: colorCode || null,
      sortOrder,
      isActive,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(taskTypes).values(insertData);

    // 作成されたデータを取得
    const created = await this.findById({ id: newId });
    if (!created) {
      throw new Error('タスクタイプの作成に失敗しました');
    }

    return created;
  }

  /**
   * タスクタイプを更新
   */
  async update(params: UpdateTaskTypeParams): Promise<TaskTypeTable> {
    const { id, typeName, description, colorCode, sortOrder, isActive } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    const updateData: Partial<TaskTypeInsert> = {
      updatedAt: now,
    };

    // 更新するフィールドを追加
    if (typeName !== undefined) updateData.typeName = typeName;
    if (description !== undefined) updateData.description = description || null;
    if (colorCode !== undefined) updateData.colorCode = colorCode || null;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await db
      .update(taskTypes)
      .set(updateData)
      .where(eq(taskTypes.id, id));

    // 更新されたデータを取得
    const updated = await this.findById({ id });
    if (!updated) {
      throw new Error('タスクタイプの更新に失敗しました');
    }

    return updated;
  }

  /**
   * タスクタイプを論理削除
   */
  async softDelete(params: DeleteTaskTypeParams): Promise<void> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    await db
      .update(taskTypes)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(taskTypes.id, id));
  }

  /**
   * タスクタイプを完全に削除（物理削除）
   */
  async hardDelete(params: DeleteTaskTypeParams): Promise<void> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    await db.delete(taskTypes).where(eq(taskTypes.id, id));
  }

  /**
   * 条件に一致するタスクタイプの数をカウント
   */
  async count(params: FindTaskTypesParams = {}): Promise<number> {
    const { includeDeleted = false, isActive } = params;

    const conditions: (SQL | null | undefined)[] = [];

    if (isActive !== undefined) {
      conditions.push(eq(taskTypes.isActive, isActive));
    }

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskTypes));
    }

    const result = await db
      .select({ count: count() })
      .from(taskTypes)
      .where(buildWhereConditions(conditions));

    return result[0].count;
  }

  /**
   * typeNameでタスクタイプを検索
   */
  async findByTypeName(typeName: string, includeDeleted = false): Promise<TaskTypeTable | null> {
    const conditions: (SQL | null | undefined)[] = [eq(taskTypes.typeName, typeName)];

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(taskTypes));
    }

    const result = await db
      .select()
      .from(taskTypes)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return {
      id: row.id,
      typeName: row.typeName,
      description: row.description || undefined,
      colorCode: row.colorCode || undefined,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
