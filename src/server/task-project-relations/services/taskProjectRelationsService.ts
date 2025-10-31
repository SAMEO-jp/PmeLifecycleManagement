/**
 * タスクプロジェクト関連Service層
 * ビジネスロジックを担当
 */

import { taskProjectRelationsRepository } from '../repositories';
import { validateCreateTaskProjectRelation, validateUpdateTaskProjectRelation } from './taskProjectRelations.validator';
import { tasksRepository } from '../../tasks/repositories';
import { projectsRepository } from '../../projects/repositories';
import type {
  CreateTaskProjectRelationParams,
  UpdateTaskProjectRelationParams,
  DeleteTaskProjectRelationParams,
  FindTaskProjectRelationsParams,
  FindTaskProjectRelationsByTaskParams,
  FindTaskProjectRelationsByProjectParams,
  CreateTaskProjectRelationResponse,
  DeleteTaskProjectRelationResponse,
  GetTaskProjectRelationsResponse,
  GetTaskProjectRelationResponse
} from '../types';

/**
 * タスクプロジェクト関連Serviceクラス
 */
export class TaskProjectRelationsService {
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
    console.error(`タスクプロジェクト関連${operation}エラー:`, error);
    return this._buildErrorResponse(`タスクプロジェクト関連${operation}中に予期しないエラーが発生しました`);
  }

  /**
   * 全タスクプロジェクト関連を取得
   */
  async getAll(params: FindTaskProjectRelationsParams = {}): Promise<GetTaskProjectRelationsResponse> {
    try {
      const relations = await taskProjectRelationsRepository.findAll(params);
      return this._buildSuccessResponse(relations, 'タスクプロジェクト関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '一覧取得');
    }
  }

  /**
   * タスクで関連を取得
   */
  async getByTask(params: FindTaskProjectRelationsByTaskParams): Promise<GetTaskProjectRelationsResponse> {
    try {
      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: params.taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      const relations = await taskProjectRelationsRepository.findByTaskId(params);
      return this._buildSuccessResponse(relations, 'タスクプロジェクト関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, 'タスク別取得');
    }
  }

  /**
   * プロジェクトで関連を取得
   */
  async getByProject(params: FindTaskProjectRelationsByProjectParams): Promise<GetTaskProjectRelationsResponse> {
    try {
      // プロジェクトが存在するかチェック
      const project = await projectsRepository.findById({ id: params.projectId });
      if (!project) {
        return this._buildErrorResponse('指定されたプロジェクトが見つかりません');
      }

      const relations = await taskProjectRelationsRepository.findByProjectId(params);
      return this._buildSuccessResponse(relations, 'タスクプロジェクト関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, 'プロジェクト別取得');
    }
  }

  /**
   * タスクプロジェクト関連を作成
   */
  async create(params: CreateTaskProjectRelationParams): Promise<CreateTaskProjectRelationResponse> {
    try {
      // バリデーション
      const validationError = validateCreateTaskProjectRelation(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: params.taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // プロジェクトが存在するかチェック
      const project = await projectsRepository.findById({ id: params.projectId });
      if (!project) {
        return this._buildErrorResponse('指定されたプロジェクトが見つかりません');
      }

      // 重複チェック
      const existing = await taskProjectRelationsRepository.findByIds({
        taskId: params.taskId,
        projectId: params.projectId
      });
      if (existing) {
        return this._buildErrorResponse('同じタスクとプロジェクトの関連が既に存在します');
      }

      // 作成
      const relation = await taskProjectRelationsRepository.create(params);
      return this._buildSuccessResponse(relation, 'タスクプロジェクト関連を作成しました');
    } catch (error) {
      return this._handleError(error, '作成');
    }
  }

  /**
   * タスクプロジェクト関連を更新
   */
  async update(params: UpdateTaskProjectRelationParams): Promise<GetTaskProjectRelationResponse> {
    try {
      // バリデーション
      const validationError = validateUpdateTaskProjectRelation(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 存在チェック
      const existing = await taskProjectRelationsRepository.findByIds({
        taskId: params.taskId,
        projectId: params.projectId
      });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクプロジェクト関連が見つかりません');
      }

      // 更新
      const relation = await taskProjectRelationsRepository.update(params);
      return this._buildSuccessResponse(relation, 'タスクプロジェクト関連を更新しました');
    } catch (error) {
      return this._handleError(error, '更新');
    }
  }

  /**
   * タスクプロジェクト関連を論理削除
   */
  async softDelete(params: DeleteTaskProjectRelationParams): Promise<DeleteTaskProjectRelationResponse> {
    try {
      // 存在チェック
      const existing = await taskProjectRelationsRepository.findByIds({
        taskId: params.taskId,
        projectId: params.projectId
      });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスクプロジェクト関連が見つかりません');
      }

      // 削除
      await taskProjectRelationsRepository.softDelete(params);
      return this._buildSuccessResponse({
        taskId: params.taskId,
        projectId: params.projectId
      }, 'タスクプロジェクト関連を削除しました');
    } catch (error) {
      return this._handleError(error, '削除');
    }
  }

  /**
   * タスクのプロジェクト関連を同期（バルク作成・削除）
   */
  async syncRelations(taskId: string, projectIds: string[]): Promise<GetTaskProjectRelationsResponse> {
    try {
      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // 既存の関連を取得
      const existingRelations = await taskProjectRelationsRepository.findByTaskId({
        taskId,
        includeDeleted: false
      });

      const existingProjectIds = existingRelations.map(r => r.projectId);

      // 追加が必要なプロジェクト
      const toAdd = projectIds.filter(id => !existingProjectIds.includes(id));

      // 削除が必要なプロジェクト
      const toRemove = existingProjectIds.filter(id => !projectIds.includes(id));

      // プロジェクトの存在チェック
      for (const projectId of toAdd) {
        const project = await projectsRepository.findById({ id: projectId });
        if (!project) {
          return this._buildErrorResponse(`プロジェクトID ${projectId} が見つかりません`);
        }
      }

      // 削除実行
      for (const projectId of toRemove) {
        await taskProjectRelationsRepository.softDelete({ taskId, projectId });
      }

      // 追加実行
      if (toAdd.length > 0) {
        await taskProjectRelationsRepository.bulkCreate({
          relations: toAdd.map(projectId => ({
            taskId,
            projectId,
            relationType: 'default'
          }))
        });
      }

      // 更新後の関連を取得
      const updatedRelations = await taskProjectRelationsRepository.findByTaskId({ taskId });

      return this._buildSuccessResponse(updatedRelations, 'タスクプロジェクト関連を同期しました');
    } catch (error) {
      return this._handleError(error, '同期');
    }
  }
}
