"use client"

/**
 * タスクユーザー関連機能のProvider
 * タスクユーザー関連関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindTaskUserRelationsParams, CreateTaskUserRelationParams, UpdateTaskUserRelationParams, DeleteTaskUserRelationParams } from '../types';
import {
  useTaskUserRelations,
  useCreateTaskUserRelation,
  useUpdateTaskUserRelation,
  useDeleteTaskUserRelation,
  useSyncTaskUserRelations,
} from '../hook';
import { TaskUserRelationsContext, type TaskUserRelationsContextType } from './taskUserRelations-context';

/**
 * Provider Props
 */
export interface TaskUserRelationsProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindTaskUserRelationsParams;
}

/**
 * タスクユーザー関連Providerコンポーネント
 * タスクユーザー関連関連の状態を管理し、グローバルに提供する
 */
export function TaskUserRelationsProvider({
  children,
  initialParams = {},
}: TaskUserRelationsProviderProps) {
  // 検索パラメータの状態管理
  const [taskUserRelationsParams, setTaskUserRelationsParamsState] = useState<FindTaskUserRelationsParams>(initialParams);
  const [selectedTaskUserRelationId, setSelectedTaskUserRelationId] = useState<{ taskId: string; userId: string } | null>(null);

  // タスクユーザー関連一覧取得HOOK
  const {
    taskUserRelations,
    isLoading: isLoadingTaskUserRelations,
    error: taskUserRelationsError,
    refetch: refetchTaskUserRelations,
  } = useTaskUserRelations(taskUserRelationsParams);

  // タスクユーザー関連作成HOOK
  const {
    createTaskUserRelation: createTaskUserRelationHook,
    isCreating,
    error: createError,
    taskUserRelation: createdTaskUserRelation,
    reset: resetCreate,
  } = useCreateTaskUserRelation();

  // タスクユーザー関連更新HOOK
  const {
    updateTaskUserRelation: updateTaskUserRelationHook,
    isUpdating,
    error: updateError,
    taskUserRelation: updatedTaskUserRelation,
    reset: resetUpdate,
  } = useUpdateTaskUserRelation();

  // タスクユーザー関連削除HOOK
  const {
    deleteTaskUserRelation: deleteTaskUserRelationHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedTaskUserRelationId,
    reset: resetDelete,
  } = useDeleteTaskUserRelation();

  // 同期処理HOOK
  const {
    syncTaskUserRelations: syncTaskUserRelationsHook,
    isSyncing,
    error: syncError,
    reset: resetSync,
  } = useSyncTaskUserRelations();

  // 選択中のタスクユーザー関連を取得
  const selectedTaskUserRelation =
    selectedTaskUserRelationId ? taskUserRelations.find((r) =>
      r.taskId === selectedTaskUserRelationId.taskId &&
      r.userId === selectedTaskUserRelationId.userId
    ) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setTaskUserRelationsParams = useCallback((params: FindTaskUserRelationsParams) => {
    setTaskUserRelationsParamsState(params);
  }, []);

  // タスクユーザー関連作成（成功時に一覧を再取得）
  const createTaskUserRelation = useCallback(
    async (params: CreateTaskUserRelationParams): Promise<boolean> => {
      const success = await createTaskUserRelationHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchTaskUserRelations();
      }
      return success;
    },
    [createTaskUserRelationHook, refetchTaskUserRelations]
  );

  // タスクユーザー関連更新（成功時に一覧を再取得）
  const updateTaskUserRelation = useCallback(
    async (params: UpdateTaskUserRelationParams): Promise<boolean> => {
      const success = await updateTaskUserRelationHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchTaskUserRelations();
        // 選択中のタスクユーザー関連も更新
        if (selectedTaskUserRelationId &&
            selectedTaskUserRelationId.taskId === params.taskId &&
            selectedTaskUserRelationId.userId === params.userId) {
          // 選択中のタスクユーザー関連が更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateTaskUserRelationHook, refetchTaskUserRelations, selectedTaskUserRelationId]
  );

  // タスクユーザー関連削除（成功時に一覧を再取得）
  const deleteTaskUserRelation = useCallback(
    async (params: DeleteTaskUserRelationParams): Promise<boolean> => {
      const success = await deleteTaskUserRelationHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchTaskUserRelations();
        // 削除されたタスクユーザー関連が選択中の場合は選択を解除
        if (selectedTaskUserRelationId &&
            selectedTaskUserRelationId.taskId === params.taskId &&
            selectedTaskUserRelationId.userId === params.userId) {
          setSelectedTaskUserRelationId(null);
        }
      }
      return success;
    },
    [deleteTaskUserRelationHook, refetchTaskUserRelations, selectedTaskUserRelationId]
  );

  // 同期処理（成功時に一覧を再取得）
  const syncTaskUserRelations = useCallback(
    async (taskId: string, userIds: string[]): Promise<boolean> => {
      const success = await syncTaskUserRelationsHook(taskId, userIds);
      if (success) {
        // 同期成功後、一覧を再取得
        await refetchTaskUserRelations();
      }
      return success;
    },
    [syncTaskUserRelationsHook, refetchTaskUserRelations]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    resetSync();
    setSelectedTaskUserRelationId(null);
  }, [resetCreate, resetUpdate, resetDelete, resetSync]);

  const contextValue: TaskUserRelationsContextType = {
    // タスクユーザー関連一覧関連
    taskUserRelations,
    isLoadingTaskUserRelations,
    taskUserRelationsError,
    refetchTaskUserRelations,
    setTaskUserRelationsParams,
    taskUserRelationsParams,

    // 選択中のタスクユーザー関連
    selectedTaskUserRelationId,
    setSelectedTaskUserRelationId,
    selectedTaskUserRelation,

    // タスクユーザー関連作成
    createTaskUserRelation,
    isCreating,
    createError,
    createdTaskUserRelation,
    resetCreate,

    // タスクユーザー関連更新
    updateTaskUserRelation,
    isUpdating,
    updateError,
    updatedTaskUserRelation,
    resetUpdate,

    // タスクユーザー関連削除
    deleteTaskUserRelation,
    isDeleting,
    deleteError,
    deletedTaskUserRelationId,
    resetDelete,

    // 同期処理
    syncTaskUserRelations,
    isSyncing,
    syncError,
    resetSync,

    // 全体のリセット
    reset,
  };

  return (
    <TaskUserRelationsContext.Provider value={contextValue}>
      {children}
    </TaskUserRelationsContext.Provider>
  );
}
