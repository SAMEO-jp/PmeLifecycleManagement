/**
 * タスクタイプService層
 * ビジネスロジックを担当
 */

import { taskTypesRepository } from '../repositories';
import { validateCreateTaskType, validateUpdateTaskType } from './taskTypes.validator';
import type {
  CreateTaskTypeParams,
  UpdateTaskTypeParams,
  DeleteTaskTypeParams,
  FindTaskTypesParams,
  FindTaskTypeByIdParams,
  CreateTaskTypeResponse,
  DeleteTaskTypeResponse,
  GetTaskTypesResponse,
  GetTaskTypeResponse
} from '../types';

/**
 * タスクタイプServiceクラス
 */
export class TaskTypesService {
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
    console.error(`タスクタイプ${operation}エラー:`, error);
    return this._buildErrorResponse(`タスクタイプ${operation}中に予期しないエラーが発生しました`);
  }

  /**
   * 全タスクタイプを取得
   */
  async getAll(params: FindTaskTypesParams = {}): Promise<GetTaskTypesResponse> {
    try {
      const taskTypes = await taskTypesRepository.findAll(params);
      return this._buildSuccessResponse(taskTypes, 'タスクタイプ一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '一覧取得');
    }
  }

  /**
   * IDでタスクタイプを取得
   */
  async getById(params: FindTaskTypeByIdParams): Promise<GetTaskTypeResponse> {
    try {
      const taskType = await taskTypesRepository.findById(params);

      if (!taskType) {
        return this._buildErrorResponse('指定されたタスクタイプが見つかりません');
      }

      return this._buildSuccessResponse(taskType, 'タスクタイプを取得しました');
    } catch (error) {
      return this._handleError(error, '取得');
    }
  }

  /**
   * タスクタイプを作成
   */
  async create(params: CreateTaskTypeParams): Promise<CreateTaskTypeResponse> {
    try {
      // バリデーション
      const validationError = validateCreateTaskType(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 重複チェック
      const existing = await taskTypesRepository.findByTypeName(params.typeName);
      if (existing) {
        return this._buildErrorResponse('同じ名前のタスク種類が既に存在します');
      }

      // 作成
      const taskType = await taskTypesRepository.create(params);
      return this._buildSuccessResponse(taskType, 'タスクタイプを作成しました');
    } catch (error) {
      return this._handleError(error, '作成');
    }
  }

  /**
   * タスクタイプを更新
   */
  async update(params: UpdateTaskTypeParams): Promise<GetTaskTypeResponse> {
    try {
      // バリデーション
      const validationError = validateUpdateTaskType(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 存在チェック
      const existing = await taskTypesRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクタイプが見つかりません');
      }

      // 重複チェック（typeNameが変更される場合のみ）
      if (params.typeName && params.typeName !== existing.typeName) {
        const duplicate = await taskTypesRepository.findByTypeName(params.typeName);
        if (duplicate) {
          return this._buildErrorResponse('同じ名前のタスク種類が既に存在します');
        }
      }

      // 更新
      const taskType = await taskTypesRepository.update(params);
      return this._buildSuccessResponse(taskType, 'タスクタイプを更新しました');
    } catch (error) {
      return this._handleError(error, '更新');
    }
  }

  /**
   * タスクタイプを論理削除
   */
  async softDelete(params: DeleteTaskTypeParams): Promise<DeleteTaskTypeResponse> {
    try {
      // 存在チェック
      const existing = await taskTypesRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクタイプが見つかりません');
      }

      // 削除
      await taskTypesRepository.softDelete(params);
      return this._buildSuccessResponse({ id: params.id }, 'タスクタイプを削除しました');
    } catch (error) {
      return this._handleError(error, '削除');
    }
  }
}
