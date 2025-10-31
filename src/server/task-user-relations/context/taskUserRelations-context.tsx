"use client"

/**
 * タスクユーザー関連機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  TaskUserRelationTable,
  FindTaskUserRelationsParams,
  CreateTaskUserRelationParams,
  UpdateTaskUserRelationParams,
  DeleteTaskUserRelationParams,
} from '../types';

/**
 * タスクユーザー関連Contextの型定義
 */
export interface TaskUserRelationsContextType {
  // タスクユーザー関連一覧関連
  taskUserRelations: TaskUserRelationTable[];
  isLoadingTaskUserRelations: boolean;
  taskUserRelationsError: string | null;
  refetchTaskUserRelations: () => Promise<void>;
  setTaskUserRelationsParams: (params: FindTaskUserRelationsParams) => void;
  taskUserRelationsParams: FindTaskUserRelationsParams;

  // 選択中のタスクユーザー関連
  selectedTaskUserRelationId: { taskId: string; userId: string } | null;
  setSelectedTaskUserRelationId: (id: { taskId: string; userId: string } | null) => void;
  selectedTaskUserRelation: TaskUserRelationTable | null;

  // タスクユーザー関連作成
  createTaskUserRelation: (params: CreateTaskUserRelationParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdTaskUserRelation: TaskUserRelationTable | null;
  resetCreate: () => void;

  // タスクユーザー関連更新
  updateTaskUserRelation: (params: UpdateTaskUserRelationParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedTaskUserRelation: TaskUserRelationTable | null;
  resetUpdate: () => void;

  // タスクユーザー関連削除
  deleteTaskUserRelation: (params: DeleteTaskUserRelationParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedTaskUserRelationId: { taskId: string; userId: string } | null;
  resetDelete: () => void;

  // 同期処理
  syncTaskUserRelations: (taskId: string, userIds: string[]) => Promise<boolean>;
  isSyncing: boolean;
  syncError: string | null;
  resetSync: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const TaskUserRelationsContext = createContext<TaskUserRelationsContextType | undefined>(undefined);

/**
 * TaskUserRelationsContextを使用するフック
 * @throws Error - TaskUserRelationsProviderの外で使用した場合
 */
export function useTaskUserRelationsContext(): TaskUserRelationsContextType {
  const context = useContext(TaskUserRelationsContext);
  if (context === undefined) {
    throw new Error('useTaskUserRelationsContext must be used within a TaskUserRelationsProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * タスクユーザー関連一覧を取得するフック
 */
export function useTaskUserRelationsList() {
  const { taskUserRelations, isLoadingTaskUserRelations, taskUserRelationsError, refetchTaskUserRelations } =
    useTaskUserRelationsContext();
  return { taskUserRelations, isLoadingTaskUserRelations, taskUserRelationsError, refetchTaskUserRelations };
}

/**
 * 選択中のタスクユーザー関連を取得するフック
 */
export function useSelectedTaskUserRelation() {
  const { selectedTaskUserRelation, selectedTaskUserRelationId, setSelectedTaskUserRelationId } = useTaskUserRelationsContext();
  return { selectedTaskUserRelation, selectedTaskUserRelationId, setSelectedTaskUserRelationId };
}

/**
 * タスクユーザー関連作成機能を取得するフック
 */
export function useCreateTaskUserRelationAction() {
  const {
    createTaskUserRelation,
    isCreating,
    createError,
    createdTaskUserRelation,
    resetCreate,
  } = useTaskUserRelationsContext();
  return { createTaskUserRelation, isCreating, createError, createdTaskUserRelation, resetCreate };
}

/**
 * タスクユーザー関連更新機能を取得するフック
 */
export function useUpdateTaskUserRelationAction() {
  const {
    updateTaskUserRelation,
    isUpdating,
    updateError,
    updatedTaskUserRelation,
    resetUpdate,
  } = useTaskUserRelationsContext();
  return { updateTaskUserRelation, isUpdating, updateError, updatedTaskUserRelation, resetUpdate };
}

/**
 * タスクユーザー関連削除機能を取得するフック
 */
export function useDeleteTaskUserRelationAction() {
  const {
    deleteTaskUserRelation,
    isDeleting,
    deleteError,
    deletedTaskUserRelationId,
    resetDelete,
  } = useTaskUserRelationsContext();
  return { deleteTaskUserRelation, isDeleting, deleteError, deletedTaskUserRelationId, resetDelete };
}

/**
 * タスクユーザー関連同期機能を取得するフック
 */
export function useSyncTaskUserRelationsAction() {
  const {
    syncTaskUserRelations,
    isSyncing,
    syncError,
    resetSync,
  } = useTaskUserRelationsContext();
  return { syncTaskUserRelations, isSyncing, syncError, resetSync };
}

/**
 * タスクユーザー関連検索パラメータを管理するフック
 */
export function useTaskUserRelationsParams() {
  const { taskUserRelationsParams, setTaskUserRelationsParams } = useTaskUserRelationsContext();
  return { taskUserRelationsParams, setTaskUserRelationsParams };
}
