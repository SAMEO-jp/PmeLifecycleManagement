/**
 * タスクユーザー関連バリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateTaskUserRelationParams, UpdateTaskUserRelationParams } from '../types';

/**
 * 有効なロールタイプ
 */
const VALID_ROLE_TYPES = ['owner', 'assignee', 'reviewer'];

/**
 * タスクユーザー関連作成パラメータのバリデーション
 */
export function validateCreateTaskUserRelation(params: CreateTaskUserRelationParams): string | null {
  if (!params.taskId || params.taskId.trim().length === 0) {
    return 'タスクIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.taskId)) {
    return 'タスクIDの形式が無効です';
  }

  if (!params.userId || params.userId.trim().length === 0) {
    return 'ユーザーIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.userId)) {
    return 'ユーザーIDの形式が無効です';
  }

  if (params.roleType && !VALID_ROLE_TYPES.includes(params.roleType)) {
    return `ロールタイプは ${VALID_ROLE_TYPES.join(', ')} のいずれかである必要があります`;
  }

  if (params.estimatedHours !== undefined && (params.estimatedHours < 0 || params.estimatedHours > 9999.99)) {
    return '予定時間は0〜9999.99の範囲で入力してください';
  }

  if (params.actualHours !== undefined && (params.actualHours < 0 || params.actualHours > 9999.99)) {
    return '実績時間は0〜9999.99の範囲で入力してください';
  }

  return null; // エラーなし
}

/**
 * タスクユーザー関連更新パラメータのバリデーション
 */
export function validateUpdateTaskUserRelation(params: UpdateTaskUserRelationParams): string | null {
  if (!params.taskId || params.taskId.trim().length === 0) {
    return 'タスクIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.taskId)) {
    return 'タスクIDの形式が無効です';
  }

  if (!params.userId || params.userId.trim().length === 0) {
    return 'ユーザーIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.userId)) {
    return 'ユーザーIDの形式が無効です';
  }

  if (params.roleType !== undefined && !VALID_ROLE_TYPES.includes(params.roleType)) {
    return `ロールタイプは ${VALID_ROLE_TYPES.join(', ')} のいずれかである必要があります`;
  }

  if (params.estimatedHours !== undefined && (params.estimatedHours < 0 || params.estimatedHours > 9999.99)) {
    return '予定時間は0〜9999.99の範囲で入力してください';
  }

  if (params.actualHours !== undefined && (params.actualHours < 0 || params.actualHours > 9999.99)) {
    return '実績時間は0〜9999.99の範囲で入力してください';
  }

  return null; // エラーなし
}
