/**
 * 設備マスタ作成HOOK
 * 設備マスタを作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { equipmentMasterService } from '../services';
import type { CreateEquipmentMasterParams, EquipmentMasterTable } from '../types';

/**
 * useCreateEquipmentMasterの戻り値型
 */
export interface UseCreateEquipmentMasterReturn {
  /** 作成中の設備マスタ情報 */
  equipmentMaster: EquipmentMasterTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** 設備マスタ作成関数 */
  createEquipmentMaster: (params: CreateEquipmentMasterParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * 設備マスタを作成するHOOK
 *
 * @returns 設備マスタ作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createEquipmentMaster, isCreating, error, equipmentMaster, reset } = useCreateEquipmentMaster();
 *
 * const handleSubmit = async () => {
 *   const success = await createEquipmentMaster({ equipmentName: '新しい設備マスタ' });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateEquipmentMaster(): UseCreateEquipmentMasterReturn {
  const [equipmentMaster, setEquipmentMaster] = useState<EquipmentMasterTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createEquipmentMaster = useCallback(async (params: CreateEquipmentMasterParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setEquipmentMaster(null);

      const response = await equipmentMasterService.create(params);

      if (response.success) {
        setEquipmentMaster(response.data || null);
        return true;
      } else {
        setError(response.error || '設備マスタの作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '設備マスタの作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEquipmentMaster(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    equipmentMaster,
    isCreating,
    error,
    createEquipmentMaster,
    reset,
  };
}
