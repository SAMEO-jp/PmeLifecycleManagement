/**
 * 設備マスタService層
 * ビジネスロジックを担当
 */

import { equipmentMasterRepository } from '../repositories';
import { validateCreateEquipmentMaster, validateUpdateEquipmentMaster } from './equipmentMaster.validator';
import type {
  CreateEquipmentMasterParams,
  UpdateEquipmentMasterParams,
  DeleteEquipmentMasterParams,
  FindEquipmentMastersParams,
  FindEquipmentMasterByIdParams,
  FindEquipmentChildrenParams,
  CreateEquipmentMasterResponse,
  DeleteEquipmentMasterResponse,
  GetEquipmentMastersResponse,
  GetEquipmentMasterResponse,
  GetEquipmentChildrenResponse
} from '../types';

/**
 * 設備マスタServiceクラス
 */
export class EquipmentMasterService {
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
    console.error(`設備マスタ${operation}エラー:`, error);
    return this._buildErrorResponse(`設備マスタ${operation}中に予期しないエラーが発生しました`);
  }

  /**
   * 全設備マスタを取得
   */
  async getAll(params: FindEquipmentMastersParams = {}): Promise<GetEquipmentMastersResponse> {
    try {
      const equipmentMasters = await equipmentMasterRepository.findAll(params);
      return this._buildSuccessResponse(equipmentMasters, '設備マスタ一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '一覧取得');
    }
  }

  /**
   * IDで設備マスタを取得
   */
  async getById(params: FindEquipmentMasterByIdParams): Promise<GetEquipmentMasterResponse> {
    try {
      const equipmentMaster = await equipmentMasterRepository.findById(params);

      if (!equipmentMaster) {
        return this._buildErrorResponse('指定された設備マスタが見つかりません');
      }

      return this._buildSuccessResponse(equipmentMaster, '設備マスタを取得しました');
    } catch (error) {
      return this._handleError(error, '取得');
    }
  }

  /**
   * 子設備を取得
   */
  async getChildren(params: FindEquipmentChildrenParams): Promise<GetEquipmentChildrenResponse> {
    try {
      // 親が存在するかチェック
      const parent = await equipmentMasterRepository.findById({
        id: params.parentId,
        includeDeleted: params.includeDeleted
      });

      if (!parent) {
        return this._buildErrorResponse('指定された親設備が見つかりません');
      }

      const children = await equipmentMasterRepository.findChildren(params);
      return this._buildSuccessResponse(children, '子設備一覧を取得しました');
    } catch (error) {
      return this._handleError(error, '子設備取得');
    }
  }

  /**
   * 設備マスタを作成
   */
  async create(params: CreateEquipmentMasterParams): Promise<CreateEquipmentMasterResponse> {
    try {
      // バリデーション
      const validationError = validateCreateEquipmentMaster(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 親設備が存在するかチェック（parentIdが指定されている場合）
      if (params.parentId) {
        const parent = await equipmentMasterRepository.findById({ id: params.parentId });
        if (!parent) {
          return this._buildErrorResponse('指定された親設備が見つかりません');
        }
      }

      // 重複チェック
      const existing = await equipmentMasterRepository.findByEquipmentName(params.equipmentName);
      if (existing) {
        return this._buildErrorResponse('同じ名前の設備が既に存在します');
      }

      // 作成
      const equipmentMaster = await equipmentMasterRepository.create(params);
      return this._buildSuccessResponse(equipmentMaster, '設備マスタを作成しました');
    } catch (error) {
      return this._handleError(error, '作成');
    }
  }

  /**
   * 設備マスタを更新
   */
  async update(params: UpdateEquipmentMasterParams): Promise<GetEquipmentMasterResponse> {
    try {
      // バリデーション
      const validationError = validateUpdateEquipmentMaster(params);
      if (validationError) {
        return this._buildErrorResponse(validationError);
      }

      // 存在チェック
      const existing = await equipmentMasterRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定された設備マスタが見つかりません');
      }

      // 親設備が存在するかチェック（parentIdが変更される場合）
      if (params.parentId !== undefined && params.parentId !== existing.parentId) {
        if (params.parentId) {
          const parent = await equipmentMasterRepository.findById({ id: params.parentId });
          if (!parent) {
            return this._buildErrorResponse('指定された親設備が見つかりません');
          }
        }
      }

      // 重複チェック（equipmentNameが変更される場合のみ）
      if (params.equipmentName && params.equipmentName !== existing.equipmentName) {
        const duplicate = await equipmentMasterRepository.findByEquipmentName(params.equipmentName);
        if (duplicate) {
          return this._buildErrorResponse('同じ名前の設備が既に存在します');
        }
      }

      // 更新
      const equipmentMaster = await equipmentMasterRepository.update(params);
      return this._buildSuccessResponse(equipmentMaster, '設備マスタを更新しました');
    } catch (error) {
      return this._handleError(error, '更新');
    }
  }

  /**
   * 設備マスタを論理削除
   */
  async softDelete(params: DeleteEquipmentMasterParams): Promise<DeleteEquipmentMasterResponse> {
    try {
      // 存在チェック
      const existing = await equipmentMasterRepository.findById({ id: params.id });
      if (!existing) {
        return this._buildErrorResponse('指定された設備マスタが見つかりません');
      }

      // 子設備が存在するかチェック
      const children = await equipmentMasterRepository.findChildren({
        parentId: params.id,
        includeDeleted: false
      });

      if (children.length > 0) {
        return this._buildErrorResponse('子設備が存在するため削除できません');
      }

      // 削除
      await equipmentMasterRepository.softDelete(params);
      return this._buildSuccessResponse({ id: params.id }, '設備マスタを削除しました');
    } catch (error) {
      return this._handleError(error, '削除');
    }
  }
}
