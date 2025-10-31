/**
 * タスクService層
 * ビジネスロジックを担当
 */

import { tasksRepository } from '../repositories';
import { validateCreateTask, validateUpdateTask } from './tasks.validator';
import { taskTypesRepository } from '../../task-types/repositories';
import type {
  CreateTaskParams,
  UpdateTaskParams,
  DeleteTaskParams,
  FindTasksParams,
  FindTaskByIdParams,
  FindTasksByTaskTypeParams,
  CreateTaskResponse,
  DeleteTaskResponse,
  GetTasksResponse,
  GetTaskResponse
} from '../types';

/**
 * タスクServiceクラス
 */
export class TasksService {
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
    console.error(`タスク${operation}エラー:`, error);
    return this._buildErrorResponse(`タスク${operation}中に予期しないエラーが発生しました`);
  }

  /**
   * 全タスクを取得
   */
  async getAll(params: FindTasksParams = {}): Promise<GetTasksResponse> {
    try {
      const tasks = await tasksRepository.findAll(params);
      return this._buildSuccessResponse(tasks, 'タスク一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '一覧取得');
    }
  }

  /**
   * IDでタスクを取得
   */
  async getById(params: FindTaskByIdParams): Promise<GetTaskResponse> {
    try {
      const task = await tasksRepository.findById(params);

      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      return this._buildSuccessResponse(task, 'タスクを取得しました');
    } catch (error) {
      return this._handleError(error, '取得');
    }
  }

  /**
   * タスクタイプでタスクを取得
   */
  async getByTaskType(params: FindTasksByTaskTypeParams): Promise<GetTasksResponse> {
    try {
      // タスクタイプが存在するかチェック
      const taskType = await taskTypesRepository.findById({ id: params.taskTypeId });
      if (!taskType) {
        return this._buildErrorResponse('指定されたタスク種類が見つかりません');
      }

      const tasks = await tasksRepository.findByTaskTypeId(params);
      return this._buildSuccessResponse(tasks, 'タスク一覧を取得しました');
    } catch (error) {
      return this._handleError(error, 'タスクタイプ別取得');
    }
  }

  /**
   * タスクを作成
   */
  async create(params: CreateTaskParams): Promise<CreateTaskResponse> {
    try {
      // バリデーション
      const validationError = validateCreateTask(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // タスクタイプが存在するかチェック
      const taskType = await taskTypesRepository.findById({ id: params.taskTypeId });
      if (!taskType) {
        return this._buildErrorResponse('指定されたタスク種類が見つかりません');
      }

      // 重複チェック
      const existing = await tasksRepository.findByTaskName(params.taskName);
      if (existing) {
        return this._buildErrorResponse('同じ名前のタスクが既に存在します');
      }

      // 作成
      const task = await tasksRepository.create(params);
      return this._buildSuccessResponse(task, 'タスクを作成しました');
    } catch (error) {
      return this._handleError(error, '作成');
    }
  }

  /**
   * タスクを更新
   */
  async update(params: UpdateTaskParams): Promise<GetTaskResponse> {
    try {
      // バリデーション
      const validationError = validateUpdateTask(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 存在チェック
      const existing = await tasksRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // タスクタイプが存在するかチェック（taskTypeIdが変更される場合）
      if (params.taskTypeId && params.taskTypeId !== existing.taskTypeId) {
        const taskType = await taskTypesRepository.findById({ id: params.taskTypeId });
        if (!taskType) {
          return this._buildErrorResponse('指定されたタスク種類が見つかりません');
        }
      }

      // 重複チェック（taskNameが変更される場合のみ）
      if (params.taskName && params.taskName !== existing.taskName) {
        const duplicate = await tasksRepository.findByTaskName(params.taskName);
        if (duplicate) {
          return this._buildErrorResponse('同じ名前のタスクが既に存在します');
        }
      }

      // 更新
      const task = await tasksRepository.update(params);
      return this._buildSuccessResponse(task, 'タスクを更新しました');
    } catch (error) {
      return this._handleError(error, '更新');
    }
  }

  /**
   * タスクを論理削除
   */
  async softDelete(params: DeleteTaskParams): Promise<DeleteTaskResponse> {
    try {
      // 存在チェック
      const existing = await tasksRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // 削除
      await tasksRepository.softDelete(params);
      return this._buildSuccessResponse({ id: params.id }, 'タスクを削除しました');
    } catch (error) {
      return this._handleError(error, '削除');
    }
  }
}
