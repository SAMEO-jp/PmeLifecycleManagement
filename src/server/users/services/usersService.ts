/**
 * ユーザーService層
 * ビジネスロジックを担当
 */

import { usersRepository } from '../repositories';
import { validateCreateUser, validateUpdateUser } from './users.validator';
import type {
  CreateUserParams,
  UpdateUserParams,
  DeleteUserParams,
  FindUsersParams,
  FindUserByIdParams,
  FindUserByEmailParams,
  CreateUserResponse,
  DeleteUserResponse,
  GetUsersResponse,
  GetUserResponse
} from '../types';

/**
 * ユーザーServiceクラス
 */
export class UsersService {
  /**
   * 成功レスポンスを構築
   */
  private _buildSuccessResponse<T>(data: T, message?: string): { success: true; data: T; message?: string } {
    return {
      success: true,
      data: data,
      ...(message && { message }),
    };
  }

  /**
   * 既知のエラーレスポンス（バリデーション、Not Foundなど）を構築
   */
  private _buildErrorResponse(error: string): { success: false; error: string } {
    return {
      success: false,
      error: error,
    };
  }

  /**
   * 予期しないエラーをハンドリング（ロギング＋エラーレスポンス構築）
   */
  private _handleError(
    error: unknown,
    operation: string
  ): { success: false; error: string } {
    console.error(`ユーザー${operation}エラー:`, error);
    return this._buildErrorResponse(`ユーザー${operation}中に予期しないエラーが発生しました`);
  }

  /**
   * 全ユーザーを取得
   */
  async getAll(params: FindUsersParams = {}): Promise<GetUsersResponse> {
    try {
      const users = await usersRepository.findAll(params);
      return this._buildSuccessResponse(users, 'ユーザー一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '一覧取得');
    }
  }

  /**
   * IDでユーザーを取得
   */
  async getById(params: FindUserByIdParams): Promise<GetUserResponse> {
    try {
      const user = await usersRepository.findById(params);

      if (!user) {
        return this._buildErrorResponse('指定されたユーザーが見つかりません');
      }

      return this._buildSuccessResponse(user, 'ユーザーを取得しました');
    } catch (error) {
      return this._handleError(error, '取得');
    }
  }

  /**
   * メールアドレスでユーザーを取得
   */
  async getByEmail(params: FindUserByEmailParams): Promise<GetUserResponse> {
    try {
      const user = await usersRepository.findByEmail(params);

      if (!user) {
        return this._buildErrorResponse('指定されたユーザーが見つかりません');
      }

      return this._buildSuccessResponse(user, 'ユーザーを取得しました');
    } catch (error) {
      return this._handleError(error, '取得');
    }
  }

  /**
   * ユーザーを作成
   */
  async create(params: CreateUserParams): Promise<CreateUserResponse> {
    try {
      // バリデーション
      const validationError = validateCreateUser(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 重複チェック
      const existing = await usersRepository.findByEmail({ email: params.email });
      if (existing) {
        return this._buildErrorResponse('同じメールアドレスのユーザーが既に存在します');
      }

      // 作成
      const user = await usersRepository.create(params);
      return this._buildSuccessResponse(user, 'ユーザーを作成しました');
    } catch (error) {
      return this._handleError(error, '作成');
    }
  }

  /**
   * ユーザーを更新
   */
  async update(params: UpdateUserParams): Promise<GetUserResponse> {
    try {
      // バリデーション
      const validationError = validateUpdateUser(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 存在チェック
      const existing = await usersRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定されたユーザーが見つかりません');
      }

      // 重複チェック（emailが変更される場合のみ）
      if (params.email && params.email !== existing.email) {
        const duplicate = await usersRepository.findByEmail({ email: params.email });
        if (duplicate) {
          return this._buildErrorResponse('同じメールアドレスのユーザーが既に存在します');
        }
      }

      // 更新
      const user = await usersRepository.update(params);
      return this._buildSuccessResponse(user, 'ユーザーを更新しました');
    } catch (error) {
      return this._handleError(error, '更新');
    }
  }

  /**
   * ユーザーを削除
   */
  async delete(params: DeleteUserParams): Promise<DeleteUserResponse> {
    try {
      // 存在チェック
      const existing = await usersRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定されたユーザーが見つかりません');
      }

      // 削除
      await usersRepository.delete(params);
      return this._buildSuccessResponse({ id: params.id }, 'ユーザーを削除しました');
    } catch (error) {
      return this._handleError(error, '削除');
    }
  }
}
