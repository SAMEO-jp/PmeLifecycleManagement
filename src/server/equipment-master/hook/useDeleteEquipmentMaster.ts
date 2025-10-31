/**
 * 設備マスタ削除HOOK
 * 設備マスタを論理削除するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { equipmentMasterService } from '../services';
import type { DeleteEquipmentMasterParams } from '../types';

/**
 * useDeleteEquipmentMasterの戻り値型
 */
export interface UseDeleteEquipmentMasterReturn {
  /** 削除された設備マスタID */
  deletedId: string | null;
  /** 削除中かどうか */
  isDeleting: boolean;
  /** エラー情報 */
  error: string | null;
  /** 設備マスタ削除関数 */
  deleteEquipmentMaster: (params: DeleteEquipmentMasterParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * 設備マスタを論理削除するHOOK
 *
 * @returns 設備マスタ削除関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { deleteEquipmentMaster, isDeleting, error, deletedId, reset } = useDeleteEquipmentMaster();
 *
 * const handleDelete = async () => {
 *   const success = await deleteEquipmentMaster({ id: 'equipment-master-id' });
 *   if (success) {
 *     console.log('削除成功！');
 *   }
 * };
 * ```
 */
export function useDeleteEquipmentMaster(): UseDeleteEquipmentMasterReturn {
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEquipmentMaster = useCallback(async (params: DeleteEquipmentMasterParams): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      setDeletedId(null);

      const response = await equipmentMasterService.softDelete(params);

      if (response.success) {
        setDeletedId(params.id);
        return true;
      } else {
        setError(response.error || '設備マスタの削除に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '設備マスタの削除に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDeletedId(null);
    setError(null);
    setIsDeleting(false);
  }, []);

  return {
    deletedId,
    isDeleting,
    error,
    deleteEquipmentMaster,
    reset,
  };
}
