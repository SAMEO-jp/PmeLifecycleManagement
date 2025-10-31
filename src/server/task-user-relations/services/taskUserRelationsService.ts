/**
 * タスクユーザー関連Service層
 * ビジネスロジックを担当
 */

import { taskUserRelationsRepository } from '../repositories';
import { validateCreateTaskUserRelation, validateUpdateTaskUserRelation } from './taskUserRelations.validator';
import { tasksRepository } from '../../tasks/repositories';
import { usersRepository } from '../../users/repositories';
import type {
  CreateTaskUserRelationParams,
  UpdateTaskUserRelationParams,
  DeleteTaskUserRelationParams,
  FindTaskUserRelationsParams,
  FindTaskUserRelationsByTaskParams,
  FindTaskUserRelationsByUserParams,
  CreateTaskUserRelationResponse,
  DeleteTaskUserRelationResponse,
  GetTaskUserRelationsResponse,
  GetTaskUserRelationResponse
} from '../types';

/**
 * タスクユーザー関連Serviceクラス
 */
export class TaskUserRelationsService {
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
    console.error(`タスクユーザー関連${operation}エラー:`, error);
    return this._buildErrorResponse(`タスクユーザー関連${operation}中に予期しないエラーが発生しました`);
  }

  /**
   * 全タスクユーザー関連を取得
   */
  async getAll(params: FindTaskUserRelationsParams = {}): Promise<GetTaskUserRelationsResponse> {
    try {
      const relations = await taskUserRelationsRepository.findAll(params);
      return this._buildSuccessResponse(relations, 'タスクユーザー関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '一覧取得');
    }
  }

  /**
   * タスクで関連を取得
   */
  async getByTask(params: FindTaskUserRelationsByTaskParams): Promise<GetTaskUserRelationsResponse> {
    try {
      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: params.taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      const relations = await taskUserRelationsRepository.findByTaskId(params);
      return this._buildSuccessResponse(relations, 'タスクユーザー関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, 'タスク別取得');
    }
  }

  /**
   * ユーザーで関連を取得
   */
  async getByUser(params: FindTaskUserRelationsByUserParams): Promise<GetTaskUserRelationsResponse> {
    try {
      // ユーザーが存在するかチェック
      const user = await usersRepository.findById({ id: params.userId });
      if (!user) {
        return this._buildErrorResponse('指定されたユーザーが見つかりません');
      }

      const relations = await taskUserRelationsRepository.findByUserId(params);
      return this._buildSuccessResponse(relations, 'タスクユーザー関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, 'ユーザー別取得');
    }
  }

  /**
   * タスクユーザー関連を作成
   */
  async create(params: CreateTaskUserRelationParams): Promise<CreateTaskUserRelationResponse> {
    try {
      // バリデーション
      const validationError = validateCreateTaskUserRelation(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: params.taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // ユーザーが存在するかチェック
      const user = await usersRepository.findById({ id: params.userId });
      if (!user) {
        return this._buildErrorResponse('指定されたユーザーが見つかりません');
      }

      // 重複チェック
      const existing = await taskUserRelationsRepository.findByIds({
        taskId: params.taskId,
        userId: params.userId
      });
      if (existing) {
        return this._buildErrorResponse('同じタスクとユーザーの関連が既に存在します');
      }

      // 作成
      const relation = await taskUserRelationsRepository.create(params);
      return this._buildSuccessResponse(relation, 'タスクユーザー関連を作成しました');
    } catch (error) {
      return this._handleError(error, '作成');
    }
  }

  /**
   * タスクユーザー関連を更新
   */
  async update(params: UpdateTaskUserRelationParams): Promise<GetTaskUserRelationResponse> {
    try {
      // バリデーション
      const validationError = validateUpdateTaskUserRelation(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 存在チェック
      const existing = await taskUserRelationsRepository.findByIds({
        taskId: params.taskId,
        userId: params.userId
      });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクユーザー関連が見つかりません');
      }

      // 更新
      const relation = await taskUserRelationsRepository.update(params);
      return this._buildSuccessResponse(relation, 'タスクユーザー関連を更新しました');
    } catch (error) {
      return this._handleError(error, '更新');
    }
  }

  /**
   * タスクユーザー関連を論理削除
   */
  async softDelete(params: DeleteTaskUserRelationParams): Promise<DeleteTaskUserRelationResponse> {
    try {
      // 存在チェック
      const existing = await taskUserRelationsRepository.findByIds({
        taskId: params.taskId,
        userId: params.userId
      });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクユーザー関連が見つかりません');
      }

      // 削除
      await taskUserRelationsRepository.softDelete(params);
      return this._buildSuccessResponse({
        taskId: params.taskId,
        userId: params.userId
      }, 'タスクユーザー関連を削除しました');
    } catch (error) {
      return this._handleError(error, '削除');
    }
  }

  /**
   * タスクのユーザー関連を同期（バルク作成・削除）
   */
  async syncRelations(taskId: string, userRelations: Array<{
    userId: string;
    roleType?: string;
    estimatedHours?: number;
    actualHours?: number;
  }>): Promise<GetTaskUserRelationsResponse> {
    try {
      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // 既存の関連を取得
      const existingRelations = await taskUserRelationsRepository.findByTaskId({
        taskId,
        includeDeleted: false
      });

      const existingUserIds = existingRelations.map(r => r.userId);
      const newUserIds = userRelations.map(r => r.userId);

      // 追加が必要なユーザー
      const toAdd = userRelations.filter(r => !existingUserIds.includes(r.userId));

      // 削除が必要なユーザー
      const toRemove = existingUserIds.filter(id => !newUserIds.includes(id));

      // ユーザーの存在チェック
      for (const relation of toAdd) {
        const user = await usersRepository.findById({ id: relation.userId });
        if (!user) {
          return this._buildErrorResponse(`ユーザーID ${relation.userId} が見つかりません`);
        }
      }

      // 削除実行
      for (const userId of toRemove) {
        await taskUserRelationsRepository.softDelete({ taskId, userId });
      }

      // 追加実行
      if (toAdd.length > 0) {
        await taskUserRelationsRepository.bulkCreate({
          relations: toAdd.map(relation => ({
            taskId,
            userId: relation.userId,
            roleType: relation.roleType || 'assignee',
            estimatedHours: relation.estimatedHours,
            actualHours: relation.actualHours,
          }))
        });
      }

      // 更新実行（既存のものを更新）
      const toUpdate = userRelations.filter(r => existingUserIds.includes(r.userId));
      for (const relation of toUpdate) {
        await taskUserRelationsRepository.update({
          taskId,
          userId: relation.userId,
          roleType: relation.roleType,
          estimatedHours: relation.estimatedHours,
          actualHours: relation.actualHours,
        });
      }

      // 更新後の関連を取得
      const updatedRelations = await taskUserRelationsRepository.findByTaskId({ taskId });

      return this._buildSuccessResponse(updatedRelations, 'タスクユーザー関連を同期しました');
    } catch (error) {
      return this._handleError(error, '同期');
    }
  }
}
