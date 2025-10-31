"use client"

/**
 * タスクタイプ機能のProvider
 * タスクタイプ関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindTaskTypesParams, CreateTaskTypeParams, UpdateTaskTypeParams, DeleteTaskTypeParams } from '../types';
import {
  useTaskTypes,
  useCreateTaskType,
  useUpdateTaskType,
  useDeleteTaskType,
} from '../hook';
import { TaskTypesContext, type TaskTypesContextType } from './taskTypes-context';

/**
 * Provider Props
 */
export interface TaskTypesProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindTaskTypesParams;
}

/**
 * タスクタイプProviderコンポーネント
 * タスクタイプ関連の状態を管理し、グローバルに提供する
 */
export function TaskTypesProvider({
  children,
  initialParams = {},
}: TaskTypesProviderProps) {
  // 検索パラメータの状態管理
  const [taskTypesParams, setTaskTypesParamsState] = useState<FindTaskTypesParams>(initialParams);
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState<string | null>(null);

  // タスクタイプ一覧取得HOOK
  const {
    taskTypes,
    isLoading: isLoadingTaskTypes,
    error: taskTypesError,
    refetch: refetchTaskTypes,
  } = useTaskTypes(taskTypesParams);

  // タスクタイプ作成HOOK
  const {
    createTaskType: createTaskTypeHook,
    isCreating,
    error: createError,
    taskType: createdTaskType,
    reset: resetCreate,
  } = useCreateTaskType();

  // タスクタイプ更新HOOK
  const {
    updateTaskType: updateTaskTypeHook,
    isUpdating,
    error: updateError,
    taskType: updatedTaskType,
    reset: resetUpdate,
  } = useUpdateTaskType();

  // タスクタイプ削除HOOK
  const {
    deleteTaskType: deleteTaskTypeHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedTaskTypeId,
    reset: resetDelete,
  } = useDeleteTaskType();

  // 選択中のタスクタイプを取得
  const selectedTaskType =
    selectedTaskTypeId ? taskTypes.find((t) => t.id === selectedTaskTypeId) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setTaskTypesParams = useCallback((params: FindTaskTypesParams) => {
    setTaskTypesParamsState(params);
  }, []);

  // タスクタイプ作成（成功時に一覧を再取得）
  const createTaskType = useCallback(
    async (params: CreateTaskTypeParams): Promise<boolean> => {
      const success = await createTaskTypeHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchTaskTypes();
      }
      return success;
    },
    [createTaskTypeHook, refetchTaskTypes]
  );

  // タスクタイプ更新（成功時に一覧を再取得）
  const updateTaskType = useCallback(
    async (params: UpdateTaskTypeParams): Promise<boolean> => {
      const success = await updateTaskTypeHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchTaskTypes();
        // 選択中のタスクタイプも更新
        if (selectedTaskTypeId === params.id) {
          // 選択中のタスクタイプが更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateTaskTypeHook, refetchTaskTypes, selectedTaskTypeId]
  );

  // タスクタイプ削除（成功時に一覧を再取得）
  const deleteTaskType = useCallback(
    async (params: DeleteTaskTypeParams): Promise<boolean> => {
      const success = await deleteTaskTypeHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchTaskTypes();
        // 削除されたタスクタイプが選択中の場合は選択を解除
        if (selectedTaskTypeId === params.id) {
          setSelectedTaskTypeId(null);
        }
      }
      return success;
    },
    [deleteTaskTypeHook, refetchTaskTypes, selectedTaskTypeId]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    setSelectedTaskTypeId(null);
  }, [resetCreate, resetUpdate, resetDelete]);

  const contextValue: TaskTypesContextType = {
    // タスクタイプ一覧関連
    taskTypes,
    isLoadingTaskTypes,
    taskTypesError,
    refetchTaskTypes,
    setTaskTypesParams,
    taskTypesParams,

    // 選択中のタスクタイプ
    selectedTaskTypeId,
    setSelectedTaskTypeId,
    selectedTaskType,

    // タスクタイプ作成
    createTaskType,
    isCreating,
    createError,
    createdTaskType,
    resetCreate,

    // タスクタイプ更新
    updateTaskType,
    isUpdating,
    updateError,
    updatedTaskType,
    resetUpdate,

    // タスクタイプ削除
    deleteTaskType,
    isDeleting,
    deleteError,
    deletedTaskTypeId,
    resetDelete,

    // 全体のリセット
    reset,
  };

  return (
    <TaskTypesContext.Provider value={contextValue}>{children}</TaskTypesContext.Provider>
  );
}
