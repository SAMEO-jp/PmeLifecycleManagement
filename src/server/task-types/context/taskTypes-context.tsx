"use client"

/**
 * タスクタイプ機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  TaskTypeTable,
  FindTaskTypesParams,
  CreateTaskTypeParams,
  UpdateTaskTypeParams,
  DeleteTaskTypeParams,
} from '../types';

/**
 * タスクタイプContextの型定義
 */
export interface TaskTypesContextType {
  // タスクタイプ一覧関連
  taskTypes: TaskTypeTable[];
  isLoadingTaskTypes: boolean;
  taskTypesError: string | null;
  refetchTaskTypes: () => Promise<void>;
  setTaskTypesParams: (params: FindTaskTypesParams) => void;
  taskTypesParams: FindTaskTypesParams;

  // 選択中のタスクタイプ
  selectedTaskTypeId: string | null;
  setSelectedTaskTypeId: (id: string | null) => void;
  selectedTaskType: TaskTypeTable | null;

  // タスクタイプ作成
  createTaskType: (params: CreateTaskTypeParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdTaskType: TaskTypeTable | null;
  resetCreate: () => void;

  // タスクタイプ更新
  updateTaskType: (params: UpdateTaskTypeParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedTaskType: TaskTypeTable | null;
  resetUpdate: () => void;

  // タスクタイプ削除
  deleteTaskType: (params: DeleteTaskTypeParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedTaskTypeId: string | null;
  resetDelete: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const TaskTypesContext = createContext<TaskTypesContextType | undefined>(undefined);

/**
 * TaskTypesContextを使用するフック
 * @throws Error - TaskTypesProviderの外で使用した場合
 */
export function useTaskTypesContext(): TaskTypesContextType {
  const context = useContext(TaskTypesContext);
  if (context === undefined) {
    throw new Error('useTaskTypesContext must be used within a TaskTypesProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * タスクタイプ一覧を取得するフック
 */
export function useTaskTypesList() {
  const { taskTypes, isLoadingTaskTypes, taskTypesError, refetchTaskTypes } =
    useTaskTypesContext();
  return { taskTypes, isLoadingTaskTypes, taskTypesError, refetchTaskTypes };
}

/**
 * 選択中のタスクタイプを取得するフック
 */
export function useSelectedTaskType() {
  const { selectedTaskType, selectedTaskTypeId, setSelectedTaskTypeId } = useTaskTypesContext();
  return { selectedTaskType, selectedTaskTypeId, setSelectedTaskTypeId };
}

/**
 * タスクタイプ作成機能を取得するフック
 */
export function useCreateTaskTypeAction() {
  const {
    createTaskType,
    isCreating,
    createError,
    createdTaskType,
    resetCreate,
  } = useTaskTypesContext();
  return { createTaskType, isCreating, createError, createdTaskType, resetCreate };
}

/**
 * タスクタイプ更新機能を取得するフック
 */
export function useUpdateTaskTypeAction() {
  const {
    updateTaskType,
    isUpdating,
    updateError,
    updatedTaskType,
    resetUpdate,
  } = useTaskTypesContext();
  return { updateTaskType, isUpdating, updateError, updatedTaskType, resetUpdate };
}

/**
 * タスクタイプ削除機能を取得するフック
 */
export function useDeleteTaskTypeAction() {
  const {
    deleteTaskType,
    isDeleting,
    deleteError,
    deletedTaskTypeId,
    resetDelete,
  } = useTaskTypesContext();
  return { deleteTaskType, isDeleting, deleteError, deletedTaskTypeId, resetDelete };
}

/**
 * タスクタイプ検索パラメータを管理するフック
 */
export function useTaskTypesParams() {
  const { taskTypesParams, setTaskTypesParams } = useTaskTypesContext();
  return { taskTypesParams, setTaskTypesParams };
}
