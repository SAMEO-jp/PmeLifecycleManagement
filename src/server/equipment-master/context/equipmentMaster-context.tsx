"use client"

/**
 * 設備マスタ機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  EquipmentMasterTable,
  FindEquipmentMastersParams,
  CreateEquipmentMasterParams,
  UpdateEquipmentMasterParams,
  DeleteEquipmentMasterParams,
} from '../types';

/**
 * 設備マスタContextの型定義
 */
export interface EquipmentMasterContextType {
  // 設備マスタ一覧関連
  equipmentMasters: EquipmentMasterTable[];
  isLoadingEquipmentMasters: boolean;
  equipmentMastersError: string | null;
  refetchEquipmentMasters: () => Promise<void>;
  setEquipmentMastersParams: (params: FindEquipmentMastersParams) => void;
  equipmentMastersParams: FindEquipmentMastersParams;

  // 選択中の設備マスタ
  selectedEquipmentMasterId: string | null;
  setSelectedEquipmentMasterId: (id: string | null) => void;
  selectedEquipmentMaster: EquipmentMasterTable | null;

  // 設備マスタ作成
  createEquipmentMaster: (params: CreateEquipmentMasterParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdEquipmentMaster: EquipmentMasterTable | null;
  resetCreate: () => void;

  // 設備マスタ更新
  updateEquipmentMaster: (params: UpdateEquipmentMasterParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedEquipmentMaster: EquipmentMasterTable | null;
  resetUpdate: () => void;

  // 設備マスタ削除
  deleteEquipmentMaster: (params: DeleteEquipmentMasterParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedEquipmentMasterId: string | null;
  resetDelete: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const EquipmentMasterContext = createContext<EquipmentMasterContextType | undefined>(undefined);

/**
 * EquipmentMasterContextを使用するフック
 * @throws Error - EquipmentMasterProviderの外で使用した場合
 */
export function useEquipmentMasterContext(): EquipmentMasterContextType {
  const context = useContext(EquipmentMasterContext);
  if (context === undefined) {
    throw new Error('useEquipmentMasterContext must be used within a EquipmentMasterProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * 設備マスタ一覧を取得するフック
 */
export function useEquipmentMastersList() {
  const { equipmentMasters, isLoadingEquipmentMasters, equipmentMastersError, refetchEquipmentMasters } =
    useEquipmentMasterContext();
  return { equipmentMasters, isLoadingEquipmentMasters, equipmentMastersError, refetchEquipmentMasters };
}

/**
 * 選択中の設備マスタを取得するフック
 */
export function useSelectedEquipmentMaster() {
  const { selectedEquipmentMaster, selectedEquipmentMasterId, setSelectedEquipmentMasterId } = useEquipmentMasterContext();
  return { selectedEquipmentMaster, selectedEquipmentMasterId, setSelectedEquipmentMasterId };
}

/**
 * 設備マスタ作成機能を取得するフック
 */
export function useCreateEquipmentMasterAction() {
  const {
    createEquipmentMaster,
    isCreating,
    createError,
    createdEquipmentMaster,
    resetCreate,
  } = useEquipmentMasterContext();
  return { createEquipmentMaster, isCreating, createError, createdEquipmentMaster, resetCreate };
}

/**
 * 設備マスタ更新機能を取得するフック
 */
export function useUpdateEquipmentMasterAction() {
  const {
    updateEquipmentMaster,
    isUpdating,
    updateError,
    updatedEquipmentMaster,
    resetUpdate,
  } = useEquipmentMasterContext();
  return { updateEquipmentMaster, isUpdating, updateError, updatedEquipmentMaster, resetUpdate };
}

/**
 * 設備マスタ削除機能を取得するフック
 */
export function useDeleteEquipmentMasterAction() {
  const {
    deleteEquipmentMaster,
    isDeleting,
    deleteError,
    deletedEquipmentMasterId,
    resetDelete,
  } = useEquipmentMasterContext();
  return { deleteEquipmentMaster, isDeleting, deleteError, deletedEquipmentMasterId, resetDelete };
}

/**
 * 設備マスタ検索パラメータを管理するフック
 */
export function useEquipmentMastersParams() {
  const { equipmentMastersParams, setEquipmentMastersParams } = useEquipmentMasterContext();
  return { equipmentMastersParams, setEquipmentMastersParams };
}
