/**
 * タスク設備関連バリデーション
 * 入力値の検証ロジックを担当
 */

import type { CreateTaskEquipmentRelationParams, UpdateTaskEquipmentRelationParams } from '../types';

/**
 * 有効な使用目的タイプ
 */
const VALID_USAGE_TYPES = ['main', 'support', 'tool'];

/**
 * タスク設備関連作成パラメータのバリデーション
 */
export function validateCreateTaskEquipmentRelation(params: CreateTaskEquipmentRelationParams): string | null {
  if (!params.taskId || params.taskId.trim().length === 0) {
    return 'タスクIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.taskId)) {
    return 'タスクIDの形式が無効です';
  }

  if (!params.equipmentId || params.equipmentId.trim().length === 0) {
    return '設備IDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.equipmentId)) {
    return '設備IDの形式が無効です';
  }

  if (params.usageType && !VALID_USAGE_TYPES.includes(params.usageType)) {
    return `使用目的は ${VALID_USAGE_TYPES.join(', ')} のいずれかである必要があります`;
  }

  if (params.plannedHours !== undefined && (params.plannedHours < 0 || params.plannedHours > 9999)) {
    return '予定使用時間は0〜9999の範囲で入力してください';
  }

  if (params.actualHours !== undefined && (params.actualHours < 0 || params.actualHours > 9999)) {
    return '実績使用時間は0〜9999の範囲で入力してください';
  }

  if (params.quantity !== undefined && (params.quantity < 1 || params.quantity > 999)) {
    return '使用数量は1〜999の範囲で入力してください';
  }

  return null; // エラーなし
}

/**
 * タスク設備関連更新パラメータのバリデーション
 */
export function validateUpdateTaskEquipmentRelation(params: UpdateTaskEquipmentRelationParams): string | null {
  if (!params.taskId || params.taskId.trim().length === 0) {
    return 'タスクIDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.taskId)) {
    return 'タスクIDの形式が無効です';
  }

  if (!params.equipmentId || params.equipmentId.trim().length === 0) {
    return '設備IDは必須です';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.equipmentId)) {
    return '設備IDの形式が無効です';
  }

  if (params.usageType !== undefined && !VALID_USAGE_TYPES.includes(params.usageType)) {
    return `使用目的は ${VALID_USAGE_TYPES.join(', ')} のいずれかである必要があります`;
  }

  if (params.plannedHours !== undefined && (params.plannedHours < 0 || params.plannedHours > 9999)) {
    return '予定使用時間は0〜9999の範囲で入力してください';
  }

  if (params.actualHours !== undefined && (params.actualHours < 0 || params.actualHours > 9999)) {
    return '実績使用時間は0〜9999の範囲で入力してください';
  }

  if (params.quantity !== undefined && (params.quantity < 1 || params.quantity > 999)) {
    return '使用数量は1〜999の範囲で入力してください';
  }

  return null; // エラーなし
}
