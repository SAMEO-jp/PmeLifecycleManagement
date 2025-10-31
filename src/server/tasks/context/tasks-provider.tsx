"use client"

/**
 * タスク機能のProvider
 * タスク関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindTasksParams, CreateTaskParams, UpdateTaskParams, DeleteTaskParams } from '../types';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../hook';
import { TasksContext, type TasksContextType } from './tasks-context';

/**
 * Provider Props
 */
export interface TasksProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindTasksParams;
}

/**
 * タスクProviderコンポーネント
 * タスク関連の状態を管理し、グローバルに提供する
 */
export function TasksProvider({
  children,
  initialParams = {},
}: TasksProviderProps) {
  // 検索パラメータの状態管理
  const [tasksParams, setTasksParamsState] = useState<FindTasksParams>(initialParams);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // タスク一覧取得HOOK
  const {
    tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
    refetch: refetchTasks,
  } = useTasks(tasksParams);

  // タスク作成HOOK
  const {
    createTask: createTaskHook,
    isCreating,
    error: createError,
    task: createdTask,
    reset: resetCreate,
  } = useCreateTask();

  // タスク更新HOOK
  const {
    updateTask: updateTaskHook,
    isUpdating,
    error: updateError,
    task: updatedTask,
    reset: resetUpdate,
  } = useUpdateTask();

  // タスク削除HOOK
  const {
    deleteTask: deleteTaskHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedTaskId,
    reset: resetDelete,
  } = useDeleteTask();

  // 選択中のタスクを取得
  const selectedTask =
    selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setTasksParams = useCallback((params: FindTasksParams) => {
    setTasksParamsState(params);
  }, []);

  // タスク作成（成功時に一覧を再取得）
  const createTask = useCallback(
    async (params: CreateTaskParams): Promise<boolean> => {
      const success = await createTaskHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchTasks();
      }
      return success;
    },
    [createTaskHook, refetchTasks]
  );

  // タスク更新（成功時に一覧を再取得）
  const updateTask = useCallback(
    async (params: UpdateTaskParams): Promise<boolean> => {
      const success = await updateTaskHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchTasks();
        // 選択中のタスクも更新
        if (selectedTaskId === params.id) {
          // 選択中のタスクが更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateTaskHook, refetchTasks, selectedTaskId]
  );

  // タスク削除（成功時に一覧を再取得）
  const deleteTask = useCallback(
    async (params: DeleteTaskParams): Promise<boolean> => {
      const success = await deleteTaskHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchTasks();
        // 削除されたタスクが選択中の場合は選択を解除
        if (selectedTaskId === params.id) {
          setSelectedTaskId(null);
        }
      }
      return success;
    },
    [deleteTaskHook, refetchTasks, selectedTaskId]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    setSelectedTaskId(null);
  }, [resetCreate, resetUpdate, resetDelete]);

  const contextValue: TasksContextType = {
    // タスク一覧関連
    tasks,
    isLoadingTasks,
    tasksError,
    refetchTasks,
    setTasksParams,
    tasksParams,

    // 選択中のタスク
    selectedTaskId,
    setSelectedTaskId,
    selectedTask,

    // タスク作成
    createTask,
    isCreating,
    createError,
    createdTask,
    resetCreate,

    // タスク更新
    updateTask,
    isUpdating,
    updateError,
    updatedTask,
    resetUpdate,

    // タスク削除
    deleteTask,
    isDeleting,
    deleteError,
    deletedTaskId,
    resetDelete,

    // 全体のリセット
    reset,
  };

  return (
    <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>
  );
}
