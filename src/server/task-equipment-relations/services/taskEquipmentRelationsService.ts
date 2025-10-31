/**
 * タスク設備関連Service層
 * ビジネスロジックを担当
 */

import { taskEquipmentRelationsRepository } from '../repositories';
import { validateCreateTaskEquipmentRelation, validateUpdateTaskEquipmentRelation } from './taskEquipmentRelations.validator';
import { tasksRepository } from '../../tasks/repositories';
import { equipmentMasterRepository } from '../../equipment-master/repositories';
import type {
  CreateTaskEquipmentRelationParams,
  UpdateTaskEquipmentRelationParams,
  DeleteTaskEquipmentRelationParams,
  FindTaskEquipmentRelationsParams,
  FindTaskEquipmentRelationsByTaskParams,
  FindTaskEquipmentRelationsByEquipmentParams,
  CreateTaskEquipmentRelationResponse,
  DeleteTaskEquipmentRelationResponse,
  GetTaskEquipmentRelationsResponse,
  GetTaskEquipmentRelationResponse
} from '../types';

/**
 * タスク設備関連Serviceクラス
 */
export class TaskEquipmentRelationsService {
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
    console.error(`タスク設備関連${operation}エラー:`, error);
    return this._buildErrorResponse(`タスク設備関連${operation}中に予期しないエラーが発生しました`);
  }

  /**
   * 全タスク設備関連を取得
   */
  async getAll(params: FindTaskEquipmentRelationsParams = {}): Promise<GetTaskEquipmentRelationsResponse> {
    try {
      const relations = await taskEquipmentRelationsRepository.findAll(params);
      return this._buildSuccessResponse(relations, 'タスク設備関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '一覧取得');
    }
  }

  /**
   * タスクで関連を取得
   */
  async getByTask(params: FindTaskEquipmentRelationsByTaskParams): Promise<GetTaskEquipmentRelationsResponse> {
    try {
      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: params.taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      const relations = await taskEquipmentRelationsRepository.findByTaskId(params);
      return this._buildSuccessResponse(relations, 'タスク設備関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, 'タスク別取得');
    }
  }

  /**
   * 設備で関連を取得
   */
  async getByEquipment(params: FindTaskEquipmentRelationsByEquipmentParams): Promise<GetTaskEquipmentRelationsResponse> {
    try {
      // 設備が存在するかチェック
      const equipment = await equipmentMasterRepository.findById({ id: params.equipmentId });
      if (!equipment) {
        return this._buildErrorResponse('指定された設備が見つかりません');
      }

      const relations = await taskEquipmentRelationsRepository.findByEquipmentId(params);
      return this._buildSuccessResponse(relations, 'タスク設備関連一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '設備別取得');
    }
  }

  /**
   * タスク設備関連を作成
   */
  async create(params: CreateTaskEquipmentRelationParams): Promise<CreateTaskEquipmentRelationResponse> {
    try {
      // バリデーション
      const validationError = validateCreateTaskEquipmentRelation(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: params.taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // 設備が存在するかチェック
      const equipment = await equipmentMasterRepository.findById({ id: params.equipmentId });
      if (!equipment) {
        return this._buildErrorResponse('指定された設備が見つかりません');
      }

      // 重複チェック
      const existing = await taskEquipmentRelationsRepository.findByIds({
        taskId: params.taskId,
        equipmentId: params.equipmentId
      });
      if (existing) {
        return this._buildErrorResponse('同じタスクと設備の関連が既に存在します');
      }

      // 作成
      const relation = await taskEquipmentRelationsRepository.create(params);
      return this._buildSuccessResponse(relation, 'タスク設備関連を作成しました');
    } catch (error) {
      return this._handleError(error, '作成');
    }
  }

  /**
   * タスク設備関連を更新
   */
  async update(params: UpdateTaskEquipmentRelationParams): Promise<GetTaskEquipmentRelationResponse> {
    try {
      // バリデーション
      const validationError = validateUpdateTaskEquipmentRelation(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 存在チェック
      const existing = await taskEquipmentRelationsRepository.findByIds({
        taskId: params.taskId,
        equipmentId: params.equipmentId
      });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスク設備関連が見つかりません');
      }

      // 更新
      const relation = await taskEquipmentRelationsRepository.update(params);
      return this._buildSuccessResponse(relation, 'タスク設備関連を更新しました');
    } catch (error) {
      return this._handleError(error, '更新');
    }
  }

  /**
   * タスク設備関連を論理削除
   */
  async softDelete(params: DeleteTaskEquipmentRelationParams): Promise<DeleteTaskEquipmentRelationResponse> {
    try {
      // 存在チェック
      const existing = await taskEquipmentRelationsRepository.findByIds({
        taskId: params.taskId,
        equipmentId: params.equipmentId
      });
      if (!existing) {
        return this._buildErrorResponse('指定されたタスク設備関連が見つかりません');
      }

      // 削除
      await taskEquipmentRelationsRepository.softDelete(params);
      return this._buildSuccessResponse({
        taskId: params.taskId,
        equipmentId: params.equipmentId
      }, 'タスク設備関連を削除しました');
    } catch (error) {
      return this._handleError(error, '削除');
    }
  }

  /**
   * タスクの設備関連を同期（バルク作成・削除）
   */
  async syncRelations(taskId: string, equipmentRelations: Array<{
    equipmentId: string;
    usageType?: string;
    plannedHours?: number;
    actualHours?: number;
    quantity?: number;
  }>): Promise<GetTaskEquipmentRelationsResponse> {
    try {
      // タスクが存在するかチェック
      const task = await tasksRepository.findById({ id: taskId });
      if (!task) {
        return this._buildErrorResponse('指定されたタスクが見つかりません');
      }

      // 既存の関連を取得
      const existingRelations = await taskEquipmentRelationsRepository.findByTaskId({
        taskId,
        includeDeleted: false
      });

      const existingEquipmentIds = existingRelations.map(r => r.equipmentId);
      const newEquipmentIds = equipmentRelations.map(r => r.equipmentId);

      // 追加が必要な設備
      const toAdd = equipmentRelations.filter(r => !existingEquipmentIds.includes(r.equipmentId));

      // 削除が必要な設備
      const toRemove = existingEquipmentIds.filter(id => !newEquipmentIds.includes(id));

      // 設備の存在チェック
      for (const relation of toAdd) {
        const equipment = await equipmentMasterRepository.findById({ id: relation.equipmentId });
        if (!equipment) {
          return this._buildErrorResponse(`設備ID ${relation.equipmentId} が見つかりません`);
        }
      }

      // 削除実行
      for (const equipmentId of toRemove) {
        await taskEquipmentRelationsRepository.softDelete({ taskId, equipmentId });
      }

      // 追加実行
      if (toAdd.length > 0) {
        await taskEquipmentRelationsRepository.bulkCreate({
          relations: toAdd.map(relation => ({
            taskId,
            equipmentId: relation.equipmentId,
            usageType: relation.usageType || 'main',
            plannedHours: relation.plannedHours,
            actualHours: relation.actualHours,
            quantity: relation.quantity || 1,
          }))
        });
      }

      // 更新実行（既存のものを更新）
      const toUpdate = equipmentRelations.filter(r => existingEquipmentIds.includes(r.equipmentId));
      for (const relation of toUpdate) {
        await taskEquipmentRelationsRepository.update({
          taskId,
          equipmentId: relation.equipmentId,
          usageType: relation.usageType,
          plannedHours: relation.plannedHours,
          actualHours: relation.actualHours,
          quantity: relation.quantity,
        });
      }

      // 更新後の関連を取得
      const updatedRelations = await taskEquipmentRelationsRepository.findByTaskId({ taskId });

      return this._buildSuccessResponse(updatedRelations, 'タスク設備関連を同期しました');
    } catch (error) {
      return this._handleError(error, '同期');
    }
  }
}
