"use client"

/**
 * タスク機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  TaskTable,
  FindTasksParams,
  CreateTaskParams,
  UpdateTaskParams,
  DeleteTaskParams,
} from '../types';

/**
 * タスクContextの型定義
 */
export interface TasksContextType {
  // タスク一覧関連
  tasks: TaskTable[];
  isLoadingTasks: boolean;
  tasksError: string | null;
  refetchTasks: () => Promise<void>;
  setTasksParams: (params: FindTasksParams) => void;
  tasksParams: FindTasksParams;

  // 選択中のタスク
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedTask: TaskTable | null;

  // タスク作成
  createTask: (params: CreateTaskParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdTask: TaskTable | null;
  resetCreate: () => void;

  // タスク更新
  updateTask: (params: UpdateTaskParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedTask: TaskTable | null;
  resetUpdate: () => void;

  // タスク削除
  deleteTask: (params: DeleteTaskParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedTaskId: string | null;
  resetDelete: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const TasksContext = createContext<TasksContextType | undefined>(undefined);

/**
 * TasksContextを使用するフック
 * @throws Error - TasksProviderの外で使用した場合
 */
export function useTasksContext(): TasksContextType {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * タスク一覧を取得するフック
 */
export function useTasksList() {
  const { tasks, isLoadingTasks, tasksError, refetchTasks } = useTasksContext();
  return { tasks, isLoadingTasks, tasksError, refetchTasks };
}

/**
 * 選択中のタスクを取得するフック
 */
export function useSelectedTask() {
  const { selectedTask, selectedTaskId, setSelectedTaskId } = useTasksContext();
  return { selectedTask, selectedTaskId, setSelectedTaskId };
}

/**
 * タスク作成機能を取得するフック
 */
export function useCreateTaskAction() {
  const {
    createTask,
    isCreating,
    createError,
    createdTask,
    resetCreate,
  } = useTasksContext();
  return { createTask, isCreating, createError, createdTask, resetCreate };
}

/**
 * タスク更新機能を取得するフック
 */
export function useUpdateTaskAction() {
  const {
    updateTask,
    isUpdating,
    updateError,
    updatedTask,
    resetUpdate,
  } = useTasksContext();
  return { updateTask, isUpdating, updateError, updatedTask, resetUpdate };
}

/**
 * タスク削除機能を取得するフック
 */
export function useDeleteTaskAction() {
  const {
    deleteTask,
    isDeleting,
    deleteError,
    deletedTaskId,
    resetDelete,
  } = useTasksContext();
  return { deleteTask, isDeleting, deleteError, deletedTaskId, resetDelete };
}

/**
 * タスク検索パラメータを管理するフック
 */
export function useTasksParams() {
  const { tasksParams, setTasksParams } = useTasksContext();
  return { tasksParams, setTasksParams };
}
