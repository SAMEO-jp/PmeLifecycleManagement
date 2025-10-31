/**
 * 設備マスタRepository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count, isNull } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  equipmentMaster,
  type EquipmentMasterInsert
} from '@/db/schema/equipmentMaster';
import type {
  EquipmentMasterTable,
  CreateEquipmentMasterParams,
  UpdateEquipmentMasterParams,
  DeleteEquipmentMasterParams,
  FindEquipmentMastersParams,
  FindEquipmentMasterByIdParams,
  FindEquipmentChildrenParams
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
 * 設備マスタRepositoryクラス
 */
export class EquipmentMasterRepository {
  /**
   * 全設備マスタを取得
   */
  async findAll(params: FindEquipmentMastersParams = {}): Promise<EquipmentMasterTable[]> {
    const { includeDeleted = false, parentId, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // parentIdパラメータに基づいて条件を構築
    if (parentId !== undefined) {
      if (parentId === null) {
        conditions.push(isNull(equipmentMaster.parentId));
      } else {
        conditions.push(eq(equipmentMaster.parentId, parentId));
      }
    }

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(equipmentMaster));
    }

    // クエリ実行
    const query = db.select().from(equipmentMaster).where(buildWhereConditions(conditions));

    // ページネーション適用
    const result = await applyPagination(query, limit, offset);

    // 型変換（DrizzleのSelect型からカスタムTable型へ）
    return result.map(row => ({
      id: row.id,
      equipmentName: row.equipmentName,
      parentId: row.parentId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * IDで設備マスタを取得
   */
  async findById(params: FindEquipmentMasterByIdParams): Promise<EquipmentMasterTable | null> {
    const { id, includeDeleted = false } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(equipmentMaster.id, id)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(equipmentMaster));
    }

    const result = await db
      .select()
      .from(equipmentMaster)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      id: row.id,
      equipmentName: row.equipmentName,
      parentId: row.parentId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * 子設備を取得
   */
  async findChildren(params: FindEquipmentChildrenParams): Promise<EquipmentMasterTable[]> {
    const { parentId, includeDeleted = false } = params;

    // 条件を構築
    const conditions: (SQL | null | undefined)[] = [eq(equipmentMaster.parentId, parentId)];

    // 論理削除の条件を追加
    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(equipmentMaster));
    }

    const result = await db
      .select()
      .from(equipmentMaster)
      .where(buildWhereConditions(conditions));

    // 型変換
    return result.map(row => ({
      id: row.id,
      equipmentName: row.equipmentName,
      parentId: row.parentId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * 設備マスタを作成
   */
  async create(params: CreateEquipmentMasterParams): Promise<EquipmentMasterTable> {
    const { equipmentName, parentId } = params;

    const now = getCurrentTimestamp();
    const newId = generateId();

    const insertData: EquipmentMasterInsert = {
      id: newId,
      equipmentName,
      parentId: parentId || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(equipmentMaster).values(insertData);

    // 作成されたデータを取得
    const created = await this.findById({ id: newId });
    if (!created) {
      throw new Error('設備マスタの作成に失敗しました');
    }

    return created;
  }

  /**
   * 設備マスタを更新
   */
  async update(params: UpdateEquipmentMasterParams): Promise<EquipmentMasterTable> {
    const { id, equipmentName, parentId } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    // 循環参照チェック（parentIdが自分自身や子孫でないか）
    if (parentId) {
      await this._validateNoCircularReference(id, parentId);
    }

    const now = getCurrentTimestamp();

    const updateData: Partial<EquipmentMasterInsert> = {
      updatedAt: now,
    };

    // 更新するフィールドを追加
    if (equipmentName !== undefined) updateData.equipmentName = equipmentName;
    if (parentId !== undefined) updateData.parentId = parentId || null;

    await db
      .update(equipmentMaster)
      .set(updateData)
      .where(eq(equipmentMaster.id, id));

    // 更新されたデータを取得
    const updated = await this.findById({ id });
    if (!updated) {
      throw new Error('設備マスタの更新に失敗しました');
    }

    return updated;
  }

  /**
   * 設備マスタを論理削除
   */
  async softDelete(params: DeleteEquipmentMasterParams): Promise<void> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    await db
      .update(equipmentMaster)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(equipmentMaster.id, id));
  }

  /**
   * 設備マスタを完全に削除（物理削除）
   */
  async hardDelete(params: DeleteEquipmentMasterParams): Promise<void> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    await db.delete(equipmentMaster).where(eq(equipmentMaster.id, id));
  }

  /**
   * 条件に一致する設備マスタの数をカウント
   */
  async count(params: FindEquipmentMastersParams = {}): Promise<number> {
    const { includeDeleted = false, parentId } = params;

    const conditions: (SQL | null | undefined)[] = [];

    if (parentId !== undefined) {
      if (parentId === null) {
        conditions.push(isNull(equipmentMaster.parentId));
      } else {
        conditions.push(eq(equipmentMaster.parentId, parentId));
      }
    }

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(equipmentMaster));
    }

    const result = await db
      .select({ count: count() })
      .from(equipmentMaster)
      .where(buildWhereConditions(conditions));

    return result[0].count;
  }

  /**
   * equipmentNameで設備マスタを検索
   */
  async findByEquipmentName(equipmentName: string, includeDeleted = false): Promise<EquipmentMasterTable | null> {
    const conditions: (SQL | null | undefined)[] = [eq(equipmentMaster.equipmentName, equipmentName)];

    if (!includeDeleted) {
      conditions.push(buildSoftDeleteCondition(equipmentMaster));
    }

    const result = await db
      .select()
      .from(equipmentMaster)
      .where(buildWhereConditions(conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return {
      id: row.id,
      equipmentName: row.equipmentName,
      parentId: row.parentId || undefined,
      createdAt: row.createdAt,
      deletedAt: row.deletedAt || undefined,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * 循環参照チェック（自分自身や子孫を親に設定しようとしていないか）
   */
  private async _validateNoCircularReference(currentId: string, newParentId: string): Promise<void> {
    // 親IDが自分自身でないかチェック
    if (currentId === newParentId) {
      throw new Error('自分自身を親に設定することはできません');
    }

    // 親IDが子孫でないか再帰的にチェック
    const visited = new Set<string>();
    let currentParentId = newParentId;

    while (currentParentId) {
      if (visited.has(currentParentId)) {
        throw new Error('循環参照が発生します');
      }

      if (currentParentId === currentId) {
        throw new Error('子孫を親に設定することはできません');
      }

      visited.add(currentParentId);

      const parent = await this.findById({ id: currentParentId, includeDeleted: true });
      currentParentId = parent?.parentId || '';
    }
  }
}
