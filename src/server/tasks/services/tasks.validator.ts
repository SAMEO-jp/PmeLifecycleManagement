/**
 * タスクバリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateTaskParams, UpdateTaskParams } from '../types';

/**
 * タスク作成パラメータのバリデーション
 */
export function validateCreateTask(params: CreateTaskParams): string | null {
  if (!params.taskName || params.taskName.trim().length === 0) {
    return 'タスク名は必須です';
  }

  if (params.taskName.length > 255) {
    return 'タスク名は255文字以内で入力してください';
  }

  if (!params.taskTypeId || params.taskTypeId.trim().length === 0) {
    return 'タスク種類IDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.taskTypeId)) {
    return 'タスク種類IDの形式が無効です';
  }

  if (params.planId && !/^[a-zA-Z0-9_-]+$/.test(params.planId)) {
    return '計画IDの形式が無効です';
  }

  return null; // エラーなし
}

/**
 * タスク更新パラメータのバリデーション
 */
export function validateUpdateTask(params: UpdateTaskParams): string | null {
  if (!params.id || params.id.trim().length === 0) {
    return 'タスクIDは必須です';
  }

  if (params.taskName !== undefined) {
    if (params.taskName.trim().length === 0) {
      return 'タスク名は必須です';
    }
    if (params.taskName.length > 255) {
      return 'タスク名は255文字以内で入力してください';
    }
  }

  if (params.taskTypeId !== undefined) {
    if (params.taskTypeId.trim().length === 0) {
      return 'タスク種類IDは必須です';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(params.taskTypeId)) {
      return 'タスク種類IDの形式が無効です';
    }
  }

  if (params.planId !== undefined && params.planId !== null && !/^[a-zA-Z0-9_-]+$/.test(params.planId)) {
    return '計画IDの形式が無効です';
  }

  return null; // エラーなし
}
