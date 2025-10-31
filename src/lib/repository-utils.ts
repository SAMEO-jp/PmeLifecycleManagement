/**
 * Repository層の共通ユーティリティ関数
 * すべてのRepositoryで使用可能な汎用的な関数を提供
 */

import { and, isNull, SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

/**
 * 論理削除の条件を構築するヘルパー関数
 * 
 * @param deletedAtColumn - deletedAtカラム（PgColumn型）
 * @param includeDeleted - 論理削除済みを含めるか
 * @returns SQL条件（含める場合はnull、含めない場合はisNull条件）
 * 
 * @example
 * ```typescript
 * const conditions = [];
 * const deletedAtCondition = buildSoftDeleteCondition(projects.deletedAt, includeDeleted);
 * if (deletedAtCondition) {
 *   conditions.push(deletedAtCondition);
 * }
 * ```
 */
export function buildSoftDeleteCondition(
  deletedAtColumn: PgColumn,
  includeDeleted: boolean = false
): SQL | null {
  if (!includeDeleted) {
    return isNull(deletedAtColumn);
  }
  return null;
}

/**
 * 複数の条件を結合するヘルパー関数
 * 
 * @param conditions - SQL条件の配列（nullやundefinedは除外される）
 * @returns 結合された条件、またはundefined（条件がない場合）
 * 
 * @example
 * ```typescript
 * const conditions = [
 *   eq(projects.id, id),
 *   buildSoftDeleteCondition(projects.deletedAt, includeDeleted)
 * ].filter((c): c is SQL => c !== null);
 * 
 * const whereClause = buildWhereConditions(conditions);
 * if (whereClause) {
 *   query = query.where(whereClause);
 * }
 * ```
 */
export function buildWhereConditions(
  conditions: (SQL | null | undefined)[]
): SQL | undefined {
  const validConditions = conditions.filter((c): c is SQL => c !== null && c !== undefined);
  if (validConditions.length === 0) {
    return undefined;
  }
  if (validConditions.length === 1) {
    return validConditions[0];
  }
  return and(...validConditions);
}

/**
 * ページネーション条件を適用するヘルパー関数
 * Drizzleの型システムの制約を回避するためのヘルパー
 * 
 * @param query - Drizzleクエリビルダー
 * @param limit - 取得件数の上限
 * @param offset - 取得開始位置
 * @returns ページネーション条件が適用されたクエリ
 * 
 * @example
 * ```typescript
 * let query: any = db.select().from(projects);
 * query = applyPagination(query, limit, offset);
 * ```
 */
export function applyPagination<T extends { limit: (n: number) => any; offset: (n: number) => any }>(
  query: T,
  limit?: number,
  offset?: number
): T {
  let result = query;
  if (limit !== undefined) {
    result = result.limit(limit) as T;
  }
  if (offset !== undefined) {
    result = result.offset(offset) as T;
  }
  return result;
}

/**
 * 文字列のバリデーション関数
 * 
 * @param value - 検証する文字列
 * @param fieldName - フィールド名（エラーメッセージ用）
 * @param maxLength - 最大文字数（デフォルト: 255）
 * @throws Error - バリデーションエラー時
 */
export function validateString(
  value: string | undefined | null,
  fieldName: string,
  maxLength: number = 255
): void {
  if (!value || value.trim().length === 0) {
    throw new Error(`${fieldName}は必須です`);
  }
  if (value.length > maxLength) {
    throw new Error(`${fieldName}は${maxLength}文字以内で入力してください`);
  }
}

/**
 * IDのバリデーション関数
 * 
 * @param id - 検証するID
 * @param fieldName - フィールド名（エラーメッセージ用、デフォルト: "ID"）
 * @throws Error - バリデーションエラー時
 */
export function validateId(
  id: string | undefined | null,
  fieldName: string = 'ID'
): void {
  if (!id || id.trim().length === 0) {
    throw new Error(`${fieldName}は必須です`);
  }
}

/**
 * UUIDを生成するヘルパー関数
 * 
 * @returns 生成されたUUID文字列
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 現在の日時を取得するヘルパー関数
 * 
 * @returns 現在のDateオブジェクト
 */
export function getCurrentTimestamp(): Date {
  return new Date();
}

