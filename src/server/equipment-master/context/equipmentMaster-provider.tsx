"use client"

/**
 * 設備マスタ機能のProvider
 * 設備マスタ関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindEquipmentMastersParams, CreateEquipmentMasterParams, UpdateEquipmentMasterParams, DeleteEquipmentMasterParams } from '../types';
import {
  useEquipmentMasters,
  useCreateEquipmentMaster,
  useUpdateEquipmentMaster,
  useDeleteEquipmentMaster,
} from '../hook';
import { EquipmentMasterContext, type EquipmentMasterContextType } from './equipmentMaster-context';

/**
 * Provider Props
 */
export interface EquipmentMasterProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindEquipmentMastersParams;
}

/**
 * 設備マスタProviderコンポーネント
 * 設備マスタ関連の状態を管理し、グローバルに提供する
 */
export function EquipmentMasterProvider({
  children,
  initialParams = {},
}: EquipmentMasterProviderProps) {
  // 検索パラメータの状態管理
  const [equipmentMastersParams, setEquipmentMastersParamsState] = useState<FindEquipmentMastersParams>(initialParams);
  const [selectedEquipmentMasterId, setSelectedEquipmentMasterId] = useState<string | null>(null);

  // 設備マスタ一覧取得HOOK
  const {
    equipmentMasters,
    isLoading: isLoadingEquipmentMasters,
    error: equipmentMastersError,
    refetch: refetchEquipmentMasters,
  } = useEquipmentMasters(equipmentMastersParams);

  // 設備マスタ作成HOOK
  const {
    createEquipmentMaster: createEquipmentMasterHook,
    isCreating,
    error: createError,
    equipmentMaster: createdEquipmentMaster,
    reset: resetCreate,
  } = useCreateEquipmentMaster();

  // 設備マスタ更新HOOK
  const {
    updateEquipmentMaster: updateEquipmentMasterHook,
    isUpdating,
    error: updateError,
    equipmentMaster: updatedEquipmentMaster,
    reset: resetUpdate,
  } = useUpdateEquipmentMaster();

  // 設備マスタ削除HOOK
  const {
    deleteEquipmentMaster: deleteEquipmentMasterHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedEquipmentMasterId,
    reset: resetDelete,
  } = useDeleteEquipmentMaster();

  // 選択中の設備マスタを取得
  const selectedEquipmentMaster =
    selectedEquipmentMasterId ? equipmentMasters.find((e) => e.id === selectedEquipmentMasterId) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setEquipmentMastersParams = useCallback((params: FindEquipmentMastersParams) => {
    setEquipmentMastersParamsState(params);
  }, []);

  // 設備マスタ作成（成功時に一覧を再取得）
  const createEquipmentMaster = useCallback(
    async (params: CreateEquipmentMasterParams): Promise<boolean> => {
      const success = await createEquipmentMasterHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchEquipmentMasters();
      }
      return success;
    },
    [createEquipmentMasterHook, refetchEquipmentMasters]
  );

  // 設備マスタ更新（成功時に一覧を再取得）
  const updateEquipmentMaster = useCallback(
    async (params: UpdateEquipmentMasterParams): Promise<boolean> => {
      const success = await updateEquipmentMasterHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchEquipmentMasters();
        // 選択中の設備マスタも更新
        if (selectedEquipmentMasterId === params.id) {
          // 選択中の設備マスタが更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateEquipmentMasterHook, refetchEquipmentMasters, selectedEquipmentMasterId]
  );

  // 設備マスタ削除（成功時に一覧を再取得）
  const deleteEquipmentMaster = useCallback(
    async (params: DeleteEquipmentMasterParams): Promise<boolean> => {
      const success = await deleteEquipmentMasterHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchEquipmentMasters();
        // 削除された設備マスタが選択中の場合は選択を解除
        if (selectedEquipmentMasterId === params.id) {
          setSelectedEquipmentMasterId(null);
        }
      }
      return success;
    },
    [deleteEquipmentMasterHook, refetchEquipmentMasters, selectedEquipmentMasterId]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    setSelectedEquipmentMasterId(null);
  }, [resetCreate, resetUpdate, resetDelete]);

  const contextValue: EquipmentMasterContextType = {
    // 設備マスタ一覧関連
    equipmentMasters,
    isLoadingEquipmentMasters,
    equipmentMastersError,
    refetchEquipmentMasters,
    setEquipmentMastersParams,
    equipmentMastersParams,

    // 選択中の設備マスタ
    selectedEquipmentMasterId,
    setSelectedEquipmentMasterId,
    selectedEquipmentMaster,

    // 設備マスタ作成
    createEquipmentMaster,
    isCreating,
    createError,
    createdEquipmentMaster,
    resetCreate,

    // 設備マスタ更新
    updateEquipmentMaster,
    isUpdating,
    updateError,
    updatedEquipmentMaster,
    resetUpdate,

    // 設備マスタ削除
    deleteEquipmentMaster,
    isDeleting,
    deleteError,
    deletedEquipmentMasterId,
    resetDelete,

    // 全体のリセット
    reset,
  };

  return (
    <EquipmentMasterContext.Provider value={contextValue}>{children}</EquipmentMasterContext.Provider>
  );
}
