/**
 * ユーザーRepository層
 * データベースアクセスを担当
 */

// Drizzleの関数をインポート
import { eq, count } from 'drizzle-orm';
import { db } from '@/db/index';
// Drizzleの型推論 (Select/Insert) をインポート
import {
  users,
  type UserInsert
} from '@/db/schema/auth';
import type {
  UserTable,
  CreateUserParams,
  UpdateUserParams,
  DeleteUserParams,
  FindUsersParams,
  FindUserByIdParams,
  FindUserByEmailParams
} from '../types';
// 共通ユーティリティ関数をインポート
import {
  buildWhereConditions,
  applyPagination,
  validateId,
  generateId,
  getCurrentTimestamp
} from '@/lib/repository-utils';
import type { SQL } from 'drizzle-orm';

/**
 * ユーザーRepositoryクラス
 */
export class UsersRepository {
  /**
   * 全ユーザーを取得
   */
  async findAll(params: FindUsersParams = {}): Promise<UserTable[]> {
    const { emailVerified, limit, offset } = params;

    // 条件を構築（共通ユーティリティ関数を使用）
    const conditions: (SQL | null | undefined)[] = [];

    // emailVerifiedパラメータに基づいて条件を構築
    if (emailVerified !== undefined) {
      conditions.push(eq(users.emailVerified, emailVerified));
    }

    // クエリ実行
    const query = db.select().from(users).where(buildWhereConditions(conditions));

    // ページネーション適用
    const result = await applyPagination(query, limit, offset);

    // 型変換（DrizzleのSelect型からカスタムTable型へ）
    return result.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  /**
   * IDでユーザーを取得
   */
  async findById(params: FindUserByIdParams): Promise<UserTable | null> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * メールアドレスでユーザーを取得
   */
  async findByEmail(params: FindUserByEmailParams): Promise<UserTable | null> {
    const { email } = params;

    // メールアドレスの基本的なバリデーション
    if (!email || !email.includes('@')) {
      throw new Error('無効なメールアドレスです');
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    // 型変換
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  /**
   * ユーザーを作成
   */
  async create(params: CreateUserParams): Promise<UserTable> {
    const { name, email, emailVerified = false, image } = params;

    const now = getCurrentTimestamp();
    const newId = generateId();

    const insertData: UserInsert = {
      id: newId,
      name,
      email,
      emailVerified,
      image: image || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(users).values(insertData);

    // 作成されたデータを取得
    const created = await this.findById({ id: newId });
    if (!created) {
      throw new Error('ユーザーの作成に失敗しました');
    }

    return created;
  }

  /**
   * ユーザーを更新
   */
  async update(params: UpdateUserParams): Promise<UserTable> {
    const { id, name, email, emailVerified, image } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    const now = getCurrentTimestamp();

    const updateData: Partial<UserInsert> = {
      updatedAt: now,
    };

    // 更新するフィールドを追加
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (emailVerified !== undefined) updateData.emailVerified = emailVerified;
    if (image !== undefined) updateData.image = image || null;

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id));

    // 更新されたデータを取得
    const updated = await this.findById({ id });
    if (!updated) {
      throw new Error('ユーザーの更新に失敗しました');
    }

    return updated;
  }

  /**
   * ユーザーを削除
   */
  async delete(params: DeleteUserParams): Promise<void> {
    const { id } = params;

    // IDバリデーション
    if (!validateId(id)) {
      throw new Error('無効なIDです');
    }

    await db.delete(users).where(eq(users.id, id));
  }

  /**
   * 条件に一致するユーザーの数をカウント
   */
  async count(params: FindUsersParams = {}): Promise<number> {
    const { emailVerified } = params;

    const conditions: (SQL | null | undefined)[] = [];

    if (emailVerified !== undefined) {
      conditions.push(eq(users.emailVerified, emailVerified));
    }

    const result = await db
      .select({ count: count() })
      .from(users)
      .where(buildWhereConditions(conditions));

    return result[0].count;
  }
}
