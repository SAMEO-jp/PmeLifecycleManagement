/**
 * プロジェクトバリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateProjectParams, UpdateProjectParams } from '../types';

/**
 * プロジェクト作成パラメータのバリデーション
 */
export function validateCreateProject(params: CreateProjectParams): string | null {
  if (!params.name || params.name.trim().length === 0) {
    return 'プロジェクト名は必須です';
  }

  if (params.name.length > 255) {
    return 'プロジェクト名は255文字以内で入力してください';
  }

  // 他の作成時バリデーションがあればここに追加...

  return null; // エラーなし
}

/**
 * プロジェクト更新パラメータのバリデーション
 */
export function validateUpdateProject(params: UpdateProjectParams): string | null {
  if (!params.id || params.id.trim().length === 0) {
    return 'プロジェクトIDは必須です';
  }

  if (params.name !== undefined) {
    if (params.name.trim().length === 0) {
      return 'プロジェクト名は必須です';
    }
    if (params.name.length > 255) {
      return 'プロジェクト名は255文字以内で入力してください';
    }
  }

  // 他の更新時バリデーションがあればここに追加...

  return null; // エラーなし
}

