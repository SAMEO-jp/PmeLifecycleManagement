/**
 * プロジェクトRepository層
 * データベースアクセスを担当
 */

import { eq, and, isNull, sql } from 'drizzle-orm';
import { db } from '@/db/index';
import { projects } from '@/db/schema/projects';
import type {
  ProjectTable,
  CreateProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  FindProjectsParams,
  FindProjectByIdParams
} from '../types';

/**
 * プロジェクトRepositoryクラス
 */
export class ProjectsRepository {
  /**
   * 全プロジェクトを取得（論理削除されていないもの）
   */
  async findAll(params: FindProjectsParams = {}): Promise<ProjectTable[]> {
    const { includeDeleted = false, limit, offset } = params;

    let query = db.select().from(projects);

    // 論理削除されていないもののみ取得（デフォルト）
    if (!includeDeleted) {
      query = query.where(isNull(projects.deletedAt));
    }

    // ページネーション
    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.offset(offset);
    }

    const result = await query;
    return result.map(this.mapToProjectTable);
  }

  /**
   * IDでプロジェクトを取得
   */
  async findById(params: FindProjectByIdParams): Promise<ProjectTable | null> {
    const { id, includeDeleted = false } = params;

    let query = db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    // 論理削除されていないもののみ取得（デフォルト）
    if (!includeDeleted) {
      query = query.where(isNull(projects.deletedAt));
    }

    const result = await query;
    return result.length > 0 ? this.mapToProjectTable(result[0]) : null;
  }

  /**
   * プロジェクトを作成
   */
  async create(params: CreateProjectParams): Promise<ProjectTable> {
    const { name } = params;

    // Repository層でのバリデーション（防御的プログラミング）
    if (!name || name.trim().length === 0) {
      throw new Error('プロジェクト名は必須です');
    }
    if (name.length > 255) {
      throw new Error('プロジェクト名は255文字以内で入力してください');
    }

    // PME番号を自動生成（例: PME-20241231-001）
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.getNextProjectNumber();
    const projectNumber = `PME-${dateStr}-${count.toString().padStart(3, '0')}`;

    const result = await db
      .insert(projects)
      .values({
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

    // Repository層でのバリデーション（防御的プログラミング）
    if (!id || id.trim().length === 0) {
      throw new Error('プロジェクトIDは必須です');
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (name.trim().length === 0) {
        throw new Error('プロジェクト名は必須です');
      }
      if (name.length > 255) {
        throw new Error('プロジェクト名は255文字以内で入力してください');
      }
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

    // Repository層でのバリデーション（防御的プログラミング）
    if (!id || id.trim().length === 0) {
      throw new Error('プロジェクトIDは必須です');
    }

    const result = await db
      .update(projects)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
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

    return result.rowCount > 0;
  }

  /**
   * 次のプロジェクト番号を取得
   */
  private async getNextProjectNumber(): Promise<number> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

    // 今日作成されたプロジェクトの数をカウント
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(sql`${projects.projectNumber} LIKE ${`PME-${dateStr}-%`}`);

    return (result[0]?.count || 0) + 1;
  }

  /**
   * データベース行をProjectTable型にマッピング
   */
  private mapToProjectTable(row: any): ProjectTable {
    return {
      id: row.id,
      name: row.projectName,
      projectNumber: row.projectNumber,
      status: row.deletedAt ? 'inactive' : 'active',
      created_at: row.createdAt,
      updated_at: row.updatedAt,
      deleted_at: row.deletedAt,
    };
  }
}

// シングルトンインスタンス
export const projectsRepository = new ProjectsRepository();
