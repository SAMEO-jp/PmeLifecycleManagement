"use client"

/**
 * タスク設備関連機能のProvider
 * タスク設備関連関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindTaskEquipmentRelationsParams, CreateTaskEquipmentRelationParams, UpdateTaskEquipmentRelationParams, DeleteTaskEquipmentRelationParams } from '../types';
import {
  useTaskEquipmentRelations,
  useCreateTaskEquipmentRelation,
  useUpdateTaskEquipmentRelation,
  useDeleteTaskEquipmentRelation,
  useSyncTaskEquipmentRelations,
} from '../hook';
import { TaskEquipmentRelationsContext, type TaskEquipmentRelationsContextType } from './taskEquipmentRelations-context';

/**
 * Provider Props
 */
export interface TaskEquipmentRelationsProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindTaskEquipmentRelationsParams;
}

/**
 * タスク設備関連Providerコンポーネント
 * タスク設備関連関連の状態を管理し、グローバルに提供する
 */
export function TaskEquipmentRelationsProvider({
  children,
  initialParams = {},
}: TaskEquipmentRelationsProviderProps) {
  // 検索パラメータの状態管理
  const [taskEquipmentRelationsParams, setTaskEquipmentRelationsParamsState] = useState<FindTaskEquipmentRelationsParams>(initialParams);
  const [selectedTaskEquipmentRelationId, setSelectedTaskEquipmentRelationId] = useState<{ taskId: string; equipmentId: string } | null>(null);

  // タスク設備関連一覧取得HOOK
  const {
    taskEquipmentRelations,
    isLoading: isLoadingTaskEquipmentRelations,
    error: taskEquipmentRelationsError,
    refetch: refetchTaskEquipmentRelations,
  } = useTaskEquipmentRelations(taskEquipmentRelationsParams);

  // タスク設備関連作成HOOK
  const {
    createTaskEquipmentRelation: createTaskEquipmentRelationHook,
    isCreating,
    error: createError,
    taskEquipmentRelation: createdTaskEquipmentRelation,
    reset: resetCreate,
  } = useCreateTaskEquipmentRelation();

  // タスク設備関連更新HOOK
  const {
    updateTaskEquipmentRelation: updateTaskEquipmentRelationHook,
    isUpdating,
    error: updateError,
    taskEquipmentRelation: updatedTaskEquipmentRelation,
    reset: resetUpdate,
  } = useUpdateTaskEquipmentRelation();

  // タスク設備関連削除HOOK
  const {
    deleteTaskEquipmentRelation: deleteTaskEquipmentRelationHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedTaskEquipmentRelationId,
    reset: resetDelete,
  } = useDeleteTaskEquipmentRelation();

  // 同期処理HOOK
  const {
    syncTaskEquipmentRelations: syncTaskEquipmentRelationsHook,
    isSyncing,
    error: syncError,
    reset: resetSync,
  } = useSyncTaskEquipmentRelations();

  // 選択中のタスク設備関連を取得
  const selectedTaskEquipmentRelation =
    selectedTaskEquipmentRelationId ? taskEquipmentRelations.find((r) =>
      r.taskId === selectedTaskEquipmentRelationId.taskId &&
      r.equipmentId === selectedTaskEquipmentRelationId.equipmentId
    ) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setTaskEquipmentRelationsParams = useCallback((params: FindTaskEquipmentRelationsParams) => {
    setTaskEquipmentRelationsParamsState(params);
  }, []);

  // タスク設備関連作成（成功時に一覧を再取得）
  const createTaskEquipmentRelation = useCallback(
    async (params: CreateTaskEquipmentRelationParams): Promise<boolean> => {
      const success = await createTaskEquipmentRelationHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchTaskEquipmentRelations();
      }
      return success;
    },
    [createTaskEquipmentRelationHook, refetchTaskEquipmentRelations]
  );

  // タスク設備関連更新（成功時に一覧を再取得）
  const updateTaskEquipmentRelation = useCallback(
    async (params: UpdateTaskEquipmentRelationParams): Promise<boolean> => {
      const success = await updateTaskEquipmentRelationHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchTaskEquipmentRelations();
        // 選択中のタスク設備関連も更新
        if (selectedTaskEquipmentRelationId &&
            selectedTaskEquipmentRelationId.taskId === params.taskId &&
            selectedTaskEquipmentRelationId.equipmentId === params.equipmentId) {
          // 選択中のタスク設備関連が更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateTaskEquipmentRelationHook, refetchTaskEquipmentRelations, selectedTaskEquipmentRelationId]
  );

  // タスク設備関連削除（成功時に一覧を再取得）
  const deleteTaskEquipmentRelation = useCallback(
    async (params: DeleteTaskEquipmentRelationParams): Promise<boolean> => {
      const success = await deleteTaskEquipmentRelationHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchTaskEquipmentRelations();
        // 削除されたタスク設備関連が選択中の場合は選択を解除
        if (selectedTaskEquipmentRelationId &&
            selectedTaskEquipmentRelationId.taskId === params.taskId &&
            selectedTaskEquipmentRelationId.equipmentId === params.equipmentId) {
          setSelectedTaskEquipmentRelationId(null);
        }
      }
      return success;
    },
    [deleteTaskEquipmentRelationHook, refetchTaskEquipmentRelations, selectedTaskEquipmentRelationId]
  );

  // 同期処理（成功時に一覧を再取得）
  const syncTaskEquipmentRelations = useCallback(
    async (taskId: string, equipmentRelations: Array<{
      equipmentId: string;
      usageType?: string;
      plannedHours?: number;
      actualHours?: number;
      quantity?: number;
    }>): Promise<boolean> => {
      const success = await syncTaskEquipmentRelationsHook(taskId, equipmentRelations);
      if (success) {
        // 同期成功後、一覧を再取得
        await refetchTaskEquipmentRelations();
      }
      return success;
    },
    [syncTaskEquipmentRelationsHook, refetchTaskEquipmentRelations]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    resetSync();
    setSelectedTaskEquipmentRelationId(null);
  }, [resetCreate, resetUpdate, resetDelete, resetSync]);

  const contextValue: TaskEquipmentRelationsContextType = {
    // タスク設備関連一覧関連
    taskEquipmentRelations,
    isLoadingTaskEquipmentRelations,
    taskEquipmentRelationsError,
    refetchTaskEquipmentRelations,
    setTaskEquipmentRelationsParams,
    taskEquipmentRelationsParams,

    // 選択中のタスク設備関連
    selectedTaskEquipmentRelationId,
    setSelectedTaskEquipmentRelationId,
    selectedTaskEquipmentRelation,

    // タスク設備関連作成
    createTaskEquipmentRelation,
    isCreating,
    createError,
    createdTaskEquipmentRelation,
    resetCreate,

    // タスク設備関連更新
    updateTaskEquipmentRelation,
    isUpdating,
    updateError,
    updatedTaskEquipmentRelation,
    resetUpdate,

    // タスク設備関連削除
    deleteTaskEquipmentRelation,
    isDeleting,
    deleteError,
    deletedTaskEquipmentRelationId,
    resetDelete,

    // 同期処理
    syncTaskEquipmentRelations,
    isSyncing,
    syncError,
    resetSync,

    // 全体のリセット
    reset,
  };

  return (
    <TaskEquipmentRelationsContext.Provider value={contextValue}>
      {children}
    </TaskEquipmentRelationsContext.Provider>
  );
}
