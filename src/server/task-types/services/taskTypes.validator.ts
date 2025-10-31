/**
 * タスクタイプバリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateTaskTypeParams, UpdateTaskTypeParams } from '../types';

/**
 * タスクタイプ作成パラメータのバリデーション
 */
export function validateCreateTaskType(params: CreateTaskTypeParams): string | null {
  if (!params.typeName || params.typeName.trim().length === 0) {
    return 'タスク種類名は必須です';
  }

  if (params.typeName.length > 255) {
    return 'タスク種類名は255文字以内で入力してください';
  }

  if (params.description && params.description.length > 1000) {
    return '説明は1000文字以内で入力してください';
  }

  if (params.colorCode && !/^#[0-9A-Fa-f]{6}$/.test(params.colorCode)) {
    return 'カラーコードは#RRGGBB形式で入力してください';
  }

  if (params.sortOrder !== undefined && (params.sortOrder < 0 || params.sortOrder > 999999)) {
    return '表示順は0〜999999の範囲で入力してください';
  }

  return null; // エラーなし
}

/**
 * タスクタイプ更新パラメータのバリデーション
 */
export function validateUpdateTaskType(params: UpdateTaskTypeParams): string | null {
  if (!params.id || params.id.trim().length === 0) {
    return 'タスクタイプIDは必須です';
  }

  if (params.typeName !== undefined) {
    if (params.typeName.trim().length === 0) {
      return 'タスク種類名は必須です';
    }
    if (params.typeName.length > 255) {
      return 'タスク種類名は255文字以内で入力してください';
    }
  }

  if (params.description !== undefined && params.description.length > 1000) {
    return '説明は1000文字以内で入力してください';
  }

  if (params.colorCode !== undefined && params.colorCode !== null && !/^#[0-9A-Fa-f]{6}$/.test(params.colorCode)) {
    return 'カラーコードは#RRGGBB形式で入力してください';
  }

  if (params.sortOrder !== undefined && (params.sortOrder < 0 || params.sortOrder > 999999)) {
    return '表示順は0〜999999の範囲で入力してください';
  }

  return null; // エラーなし
}
