/**
 * タスクプロジェクト関連バリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateTaskProjectRelationParams, UpdateTaskProjectRelationParams } from '../types';

/**
 * タスクプロジェクト関連作成パラメータのバリデーション
 */
export function validateCreateTaskProjectRelation(params: CreateTaskProjectRelationParams): string | null {
  if (!params.taskId || params.taskId.trim().length === 0) {
    return 'タスクIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.taskId)) {
    return 'タスクIDの形式が無効です';
  }

  if (!params.projectId || params.projectId.trim().length === 0) {
    return 'プロジェクトIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.projectId)) {
    return 'プロジェクトIDの形式が無効です';
  }

  if (params.relationType && params.relationType.length > 50) {
    return '関連タイプは50文字以内で入力してください';
  }

  if (params.sortOrder !== undefined && (params.sortOrder < 0 || params.sortOrder > 999999)) {
    return '表示順は0〜999999の範囲で入力してください';
  }

  return null; // エラーなし
}

/**
 * タスクプロジェクト関連更新パラメータのバリデーション
 */
export function validateUpdateTaskProjectRelation(params: UpdateTaskProjectRelationParams): string | null {
  if (!params.taskId || params.taskId.trim().length === 0) {
    return 'タスクIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.taskId)) {
    return 'タスクIDの形式が無効です';
  }

  if (!params.projectId || params.projectId.trim().length === 0) {
    return 'プロジェクトIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.projectId)) {
    return 'プロジェクトIDの形式が無効です';
  }

  if (params.relationType !== undefined && params.relationType.length > 50) {
    return '関連タイプは50文字以内で入力してください';
  }

  if (params.sortOrder !== undefined && (params.sortOrder < 0 || params.sortOrder > 999999)) {
    return '表示順は0〜999999の範囲で入力してください';
  }

  return null; // エラーなし
}
