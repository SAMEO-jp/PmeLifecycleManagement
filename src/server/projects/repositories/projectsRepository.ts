/**
 * プロジェクトRepository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count, like, isNotNull, isNull } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  projects,
  type ProjectSelect,
  type ProjectInsert
} from '@/db/schema/projects';
import type {
  ProjectTable,
  CreateProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  FindProjectsParams,
  FindProjectByIdParams
} from '../types';
// 共通ユーティリティ関数をインポート
import {
  buildSoftDeleteCondition,
  buildWhereConditions,
  applyPagination,
  validateString,
  validateId,
  generateId,
  getCurrentTimestamp
} from '@/lib/repository-utils';
import type { SQL } from 'drizzle-orm';

/**
 * プロジェクトRepositoryクラス
 */
export class ProjectsRepository {
  /**
   * 全プロジェクトを取得
   */
  async findAll(params: FindProjectsParams = {}): Promise<ProjectTable[]> {
    const { includeDeleted = false, status, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // statusパラメータに基づいてdeletedAtの条件を構築
    if (status === 'active') {
      // active: deletedAtがnullのもののみ
      conditions.push(isNull(projects.deletedAt));
    } else if (status === 'inactive') {
      // inactive: deletedAtがnot nullのもののみ
      conditions.push(isNotNull(projects.deletedAt));
    } else {
      // statusが指定されていない場合は、includeDeletedパラメータに従う
      conditions.push(buildSoftDeleteCondition(projects.deletedAt, includeDeleted));
    }

    // クエリを構築（Drizzleの型システムの制約により、型アサーションを使用）
    let query = db.select().from(projects);
    const whereClause = buildWhereConditions(conditions);
    if (whereClause) {
      query = query.where(whereClause);
    }
    query = applyPagination(query, limit, offset);

    const result = await query;
    const mappedResults = result.map(this.mapToProjectTable);

    // statusが'completed'の場合は、マッピング後の結果をフィルタリング
    // （completedはDBに存在しないため、将来的な拡張のためにここでフィルタリング）
    if (status === 'completed') {
      return mappedResults.filter((p: ProjectTable) => p.status === 'completed');
    }

    return mappedResults;
  }

  /**
   * IDでプロジェクトを取得
   */
  async findById(params: FindProjectByIdParams): Promise<ProjectTable | null> {
    const { id, includeDeleted = false } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions = [
      eq(projects.id, id),
      buildSoftDeleteCondition(projects.deletedAt, includeDeleted)
    ];

    // クエリを構築（ID条件は常に存在するため、whereClauseはnullにならない）
    const whereClause = buildWhereConditions(conditions);
    if (!whereClause) {
      // 理論上は到達しないが、型安全性のため
      throw new Error('クエリ条件の構築に失敗しました');
    }

    const query = db.select().from(projects).where(whereClause);
    const result = await query;
    return result.length > 0 ? this.mapToProjectTable(result[0]) : null;
  }

  /**
   * プロジェクトを作成
   *
   * @Note
   * バリデーションとPME番号の生成ロジックは、本来Service層が担当すべき責務です。
   * また、PME番号の採番 (getNextProjectNumber) には競合状態のリスクがあります。
   * これらはService層でトランザクション管理を行うことで解決する必要があります。
   */
  async create(params: CreateProjectParams): Promise<ProjectTable> {
    const { name } = params;

    // Repository層でのバリデーション（防御的プログラミング）
    // (本来はService層の責務)
    validateString(name, 'プロジェクト名');

    // PME番号を自動生成
    const now = getCurrentTimestamp();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    // 競合状態のリスクあり
    const count = await this.getNextProjectNumber(dateStr);
    const projectNumber = `PME-${dateStr}-${count.toString().padStart(3, '0')}`;

    // IDを生成（UUID）
    const id = generateId();

    const result = await db
      .insert(projects)
      .values({
        id,
        projectName: name,
        projectNumber,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return this.mapToProjectTable(result[0]);
  }

  /**
   * プロジェクトを更新
   */
  async update(params: UpdateProjectParams): Promise<ProjectTable | null> {
    const { id, name } = params;

    // バリデーション (本来はService層の責務)
    validateId(id, 'プロジェクトID');

    // [Refactor] any型を排除し、Drizzleの推論型を使用
    const updateData: Partial<ProjectInsert> = {
      updatedAt: getCurrentTimestamp(),
    };

    if (name !== undefined) {
      validateString(name, 'プロジェクト名');
      updateData.projectName = name;
    }

    const result = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return result.length > 0 ? this.mapToProjectTable(result[0]) : null;
  }

  /**
   * プロジェクトを論理削除
   */
  async softDelete(params: DeleteProjectParams): Promise<ProjectTable | null> {
    const { id } = params;

    validateId(id, 'プロジェクトID');

    const now = getCurrentTimestamp();
    const result = await db
      .update(projects)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(eq(projects.id, id))
      .returning();

    return result.length > 0 ? this.mapToProjectTable(result[0]) : null;
  }

  /**
   * プロジェクトを物理削除（危険な操作）
   */
  async hardDelete(params: DeleteProjectParams): Promise<boolean> {
    const { id } = params;

    const result = await db
      .delete(projects)
      .where(eq(projects.id, id));

    // Drizzleの削除操作は削除された行数を返す
    return (result as unknown as { rowCount: number }).rowCount > 0;
  }

  /**
   * 指定された日付（YYYYMMDD）の次のプロジェクト番号を取得
   *
   * @Note
   * このメソッドは競合状態（Race Condition）の影響を受けやすいです。
   * Service層でトランザクションと行ロック（SELECT FOR UPDATEなど）を検討する必要があります。
   */
  private async getNextProjectNumber(dateStr: string): Promise<number> {
    const prefix = `PME-${dateStr}-%`;

    // [Refactor] Drizzleの count() と like() を使用
    const result = await db
      .select({ count: count() })
      .from(projects)
      .where(like(projects.projectNumber, prefix));

    return (result[0]?.count || 0) + 1;
  }

  /**
   * データベース行をProjectTable型にマッピング
   * [Refactor] any型を排除し、Drizzleの推論型を使用
   */
  private mapToProjectTable(row: ProjectSelect): ProjectTable {
    return {
      id: row.id,
      name: row.projectName, // カラム名とプロパティ名のマッピング
      projectNumber: row.projectNumber,
      status: row.deletedAt ? 'inactive' : 'active', // 状態のマッピング
      created_at: row.createdAt,
      updated_at: row.updatedAt,
      deleted_at: row.deletedAt ?? undefined, // nullをundefinedに変換
    };
  }
}

// シングルトンインスタンス
export const projectsRepository = new ProjectsRepository();