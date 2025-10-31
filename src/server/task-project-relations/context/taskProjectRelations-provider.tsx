"use client"

/**
 * タスクプロジェクト関連機能のProvider
 * タスクプロジェクト関連関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindTaskProjectRelationsParams, CreateTaskProjectRelationParams, UpdateTaskProjectRelationParams, DeleteTaskProjectRelationParams } from '../types';
import {
  useTaskProjectRelations,
  useCreateTaskProjectRelation,
  useUpdateTaskProjectRelation,
  useDeleteTaskProjectRelation,
  useSyncTaskProjectRelations,
} from '../hook';
import { TaskProjectRelationsContext, type TaskProjectRelationsContextType } from './taskProjectRelations-context';

/**
 * Provider Props
 */
export interface TaskProjectRelationsProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindTaskProjectRelationsParams;
}

/**
 * タスクプロジェクト関連Providerコンポーネント
 * タスクプロジェクト関連関連の状態を管理し、グローバルに提供する
 */
export function TaskProjectRelationsProvider({
  children,
  initialParams = {},
}: TaskProjectRelationsProviderProps) {
  // 検索パラメータの状態管理
  const [taskProjectRelationsParams, setTaskProjectRelationsParamsState] = useState<FindTaskProjectRelationsParams>(initialParams);
  const [selectedTaskProjectRelationId, setSelectedTaskProjectRelationId] = useState<{ taskId: string; projectId: string } | null>(null);

  // タスクプロジェクト関連一覧取得HOOK
  const {
    taskProjectRelations,
    isLoading: isLoadingTaskProjectRelations,
    error: taskProjectRelationsError,
    refetch: refetchTaskProjectRelations,
  } = useTaskProjectRelations(taskProjectRelationsParams);

  // タスクプロジェクト関連作成HOOK
  const {
    createTaskProjectRelation: createTaskProjectRelationHook,
    isCreating,
    error: createError,
    taskProjectRelation: createdTaskProjectRelation,
    reset: resetCreate,
  } = useCreateTaskProjectRelation();

  // タスクプロジェクト関連更新HOOK
  const {
    updateTaskProjectRelation: updateTaskProjectRelationHook,
    isUpdating,
    error: updateError,
    taskProjectRelation: updatedTaskProjectRelation,
    reset: resetUpdate,
  } = useUpdateTaskProjectRelation();

  // タスクプロジェクト関連削除HOOK
  const {
    deleteTaskProjectRelation: deleteTaskProjectRelationHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedTaskProjectRelationId,
    reset: resetDelete,
  } = useDeleteTaskProjectRelation();

  // 同期処理HOOK
  const {
    syncTaskProjectRelations: syncTaskProjectRelationsHook,
    isSyncing,
    error: syncError,
    reset: resetSync,
  } = useSyncTaskProjectRelations();

  // 選択中のタスクプロジェクト関連を取得
  const selectedTaskProjectRelation =
    selectedTaskProjectRelationId ? taskProjectRelations.find((r) =>
      r.taskId === selectedTaskProjectRelationId.taskId &&
      r.projectId === selectedTaskProjectRelationId.projectId
    ) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setTaskProjectRelationsParams = useCallback((params: FindTaskProjectRelationsParams) => {
    setTaskProjectRelationsParamsState(params);
  }, []);

  // タスクプロジェクト関連作成（成功時に一覧を再取得）
  const createTaskProjectRelation = useCallback(
    async (params: CreateTaskProjectRelationParams): Promise<boolean> => {
      const success = await createTaskProjectRelationHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchTaskProjectRelations();
      }
      return success;
    },
    [createTaskProjectRelationHook, refetchTaskProjectRelations]
  );

  // タスクプロジェクト関連更新（成功時に一覧を再取得）
  const updateTaskProjectRelation = useCallback(
    async (params: UpdateTaskProjectRelationParams): Promise<boolean> => {
      const success = await updateTaskProjectRelationHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchTaskProjectRelations();
        // 選択中のタスクプロジェクト関連も更新
        if (selectedTaskProjectRelationId &&
            selectedTaskProjectRelationId.taskId === params.taskId &&
            selectedTaskProjectRelationId.projectId === params.projectId) {
          // 選択中のタスクプロジェクト関連が更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateTaskProjectRelationHook, refetchTaskProjectRelations, selectedTaskProjectRelationId]
  );

  // タスクプロジェクト関連削除（成功時に一覧を再取得）
  const deleteTaskProjectRelation = useCallback(
    async (params: DeleteTaskProjectRelationParams): Promise<boolean> => {
      const success = await deleteTaskProjectRelationHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchTaskProjectRelations();
        // 削除されたタスクプロジェクト関連が選択中の場合は選択を解除
        if (selectedTaskProjectRelationId &&
            selectedTaskProjectRelationId.taskId === params.taskId &&
            selectedTaskProjectRelationId.projectId === params.projectId) {
          setSelectedTaskProjectRelationId(null);
        }
      }
      return success;
    },
    [deleteTaskProjectRelationHook, refetchTaskProjectRelations, selectedTaskProjectRelationId]
  );

  // 同期処理（成功時に一覧を再取得）
  const syncTaskProjectRelations = useCallback(
    async (taskId: string, projectIds: string[]): Promise<boolean> => {
      const success = await syncTaskProjectRelationsHook(taskId, projectIds);
      if (success) {
        // 同期成功後、一覧を再取得
        await refetchTaskProjectRelations();
      }
      return success;
    },
    [syncTaskProjectRelationsHook, refetchTaskProjectRelations]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    resetSync();
    setSelectedTaskProjectRelationId(null);
  }, [resetCreate, resetUpdate, resetDelete, resetSync]);

  const contextValue: TaskProjectRelationsContextType = {
    // タスクプロジェクト関連一覧関連
    taskProjectRelations,
    isLoadingTaskProjectRelations,
    taskProjectRelationsError,
    refetchTaskProjectRelations,
    setTaskProjectRelationsParams,
    taskProjectRelationsParams,

    // 選択中のタスクプロジェクト関連
    selectedTaskProjectRelationId,
    setSelectedTaskProjectRelationId,
    selectedTaskProjectRelation,

    // タスクプロジェクト関連作成
    createTaskProjectRelation,
    isCreating,
    createError,
    createdTaskProjectRelation,
    resetCreate,

    // タスクプロジェクト関連更新
    updateTaskProjectRelation,
    isUpdating,
    updateError,
    updatedTaskProjectRelation,
    resetUpdate,

    // タスクプロジェクト関連削除
    deleteTaskProjectRelation,
    isDeleting,
    deleteError,
    deletedTaskProjectRelationId,
    resetDelete,

    // 同期処理
    syncTaskProjectRelations,
    isSyncing,
    syncError,
    resetSync,

    // 全体のリセット
    reset,
  };

  return (
    <TaskProjectRelationsContext.Provider value={contextValue}>
      {children}
    </TaskProjectRelationsContext.Provider>
  );
}
