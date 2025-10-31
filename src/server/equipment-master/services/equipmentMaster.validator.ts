/**
 * 設備マスタバリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateEquipmentMasterParams, UpdateEquipmentMasterParams } from '../types';

/**
 * 設備マスタ作成パラメータのバリデーション
 */
export function validateCreateEquipmentMaster(params: CreateEquipmentMasterParams): string | null {
  if (!params.equipmentName || params.equipmentName.trim().length === 0) {
    return '設備名は必須です';
  }

  if (params.equipmentName.length > 255) {
    return '設備名は255文字以内で入力してください';
  }

  if (params.parentId && !/^[a-zA-Z0-9_-]+$/.test(params.parentId)) {
    return '親設備IDの形式が無効です';
  }

  return null; // エラーなし
}

/**
 * 設備マスタ更新パラメータのバリデーション
 */
export function validateUpdateEquipmentMaster(params: UpdateEquipmentMasterParams): string | null {
  if (!params.id || params.id.trim().length === 0) {
    return '設備マスタIDは必須です';
  }

  if (params.equipmentName !== undefined) {
    if (params.equipmentName.trim().length === 0) {
      return '設備名は必須です';
    }
    if (params.equipmentName.length > 255) {
      return '設備名は255文字以内で入力してください';
    }
  }

  if (params.parentId !== undefined && params.parentId !== null && !/^[a-zA-Z0-9_-]+$/.test(params.parentId)) {
    return '親設備IDの形式が無効です';
  }

  return null; // エラーなし
}
