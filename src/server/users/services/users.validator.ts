/**
 * ユーザーバリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateUserParams, UpdateUserParams } from '../types';

/**
 * メールアドレス形式の正規表現
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ユーザー作成パラメータのバリデーション
 */
export function validateCreateUser(params: CreateUserParams): string | null {
  if (!params.name || params.name.trim().length === 0) {
    return 'ユーザー名は必須です';
  }

  if (params.name.length > 255) {
    return 'ユーザー名は255文字以内で入力してください';
  }

  if (!params.email || params.email.trim().length === 0) {
    return 'メールアドレスは必須です';
  }

  if (!EMAIL_REGEX.test(params.email)) {
    return '有効なメールアドレスを入力してください';
  }

  if (params.email.length > 255) {
    return 'メールアドレスは255文字以内で入力してください';
  }

  if (params.image && params.image.length > 1000) {
    return '画像URLは1000文字以内で入力してください';
  }

  return null; // エラーなし
}

/**
 * ユーザー更新パラメータのバリデーション
 */
export function validateUpdateUser(params: UpdateUserParams): string | null {
  if (!params.id || params.id.trim().length === 0) {
    return 'ユーザーIDは必須です';
  }

  if (params.name !== undefined) {
    if (params.name.trim().length === 0) {
      return 'ユーザー名は必須です';
    }
    if (params.name.length > 255) {
      return 'ユーザー名は255文字以内で入力してください';
    }
  }

  if (params.email !== undefined) {
    if (params.email.trim().length === 0) {
      return 'メールアドレスは必須です';
    }
    if (!EMAIL_REGEX.test(params.email)) {
      return '有効なメールアドレスを入力してください';
    }
    if (params.email.length > 255) {
      return 'メールアドレスは255文字以内で入力してください';
    }
  }

  if (params.image !== undefined && params.image !== null && params.image.length > 1000) {
    return '画像URLは1000文字以内で入力してください';
  }

  return null; // エラーなし
}
