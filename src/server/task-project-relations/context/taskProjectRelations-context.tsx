"use client"

/**
 * タスクプロジェクト関連機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  TaskProjectRelationTable,
  FindTaskProjectRelationsParams,
  CreateTaskProjectRelationParams,
  UpdateTaskProjectRelationParams,
  DeleteTaskProjectRelationParams,
} from '../types';

/**
 * タスクプロジェクト関連Contextの型定義
 */
export interface TaskProjectRelationsContextType {
  // タスクプロジェクト関連一覧関連
  taskProjectRelations: TaskProjectRelationTable[];
  isLoadingTaskProjectRelations: boolean;
  taskProjectRelationsError: string | null;
  refetchTaskProjectRelations: () => Promise<void>;
  setTaskProjectRelationsParams: (params: FindTaskProjectRelationsParams) => void;
  taskProjectRelationsParams: FindTaskProjectRelationsParams;

  // 選択中のタスクプロジェクト関連
  selectedTaskProjectRelationId: { taskId: string; projectId: string } | null;
  setSelectedTaskProjectRelationId: (id: { taskId: string; projectId: string } | null) => void;
  selectedTaskProjectRelation: TaskProjectRelationTable | null;

  // タスクプロジェクト関連作成
  createTaskProjectRelation: (params: CreateTaskProjectRelationParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdTaskProjectRelation: TaskProjectRelationTable | null;
  resetCreate: () => void;

  // タスクプロジェクト関連更新
  updateTaskProjectRelation: (params: UpdateTaskProjectRelationParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedTaskProjectRelation: TaskProjectRelationTable | null;
  resetUpdate: () => void;

  // タスクプロジェクト関連削除
  deleteTaskProjectRelation: (params: DeleteTaskProjectRelationParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedTaskProjectRelationId: { taskId: string; projectId: string } | null;
  resetDelete: () => void;

  // 同期処理
  syncTaskProjectRelations: (taskId: string, projectIds: string[]) => Promise<boolean>;
  isSyncing: boolean;
  syncError: string | null;
  resetSync: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const TaskProjectRelationsContext = createContext<TaskProjectRelationsContextType | undefined>(undefined);

/**
 * TaskProjectRelationsContextを使用するフック
 * @throws Error - TaskProjectRelationsProviderの外で使用した場合
 */
export function useTaskProjectRelationsContext(): TaskProjectRelationsContextType {
  const context = useContext(TaskProjectRelationsContext);
  if (context === undefined) {
    throw new Error('useTaskProjectRelationsContext must be used within a TaskProjectRelationsProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * タスクプロジェクト関連一覧を取得するフック
 */
export function useTaskProjectRelationsList() {
  const { taskProjectRelations, isLoadingTaskProjectRelations, taskProjectRelationsError, refetchTaskProjectRelations } =
    useTaskProjectRelationsContext();
  return { taskProjectRelations, isLoadingTaskProjectRelations, taskProjectRelationsError, refetchTaskProjectRelations };
}

/**
 * 選択中のタスクプロジェクト関連を取得するフック
 */
export function useSelectedTaskProjectRelation() {
  const { selectedTaskProjectRelation, selectedTaskProjectRelationId, setSelectedTaskProjectRelationId } = useTaskProjectRelationsContext();
  return { selectedTaskProjectRelation, selectedTaskProjectRelationId, setSelectedTaskProjectRelationId };
}

/**
 * タスクプロジェクト関連作成機能を取得するフック
 */
export function useCreateTaskProjectRelationAction() {
  const {
    createTaskProjectRelation,
    isCreating,
    createError,
    createdTaskProjectRelation,
    resetCreate,
  } = useTaskProjectRelationsContext();
  return { createTaskProjectRelation, isCreating, createError, createdTaskProjectRelation, resetCreate };
}

/**
 * タスクプロジェクト関連更新機能を取得するフック
 */
export function useUpdateTaskProjectRelationAction() {
  const {
    updateTaskProjectRelation,
    isUpdating,
    updateError,
    updatedTaskProjectRelation,
    resetUpdate,
  } = useTaskProjectRelationsContext();
  return { updateTaskProjectRelation, isUpdating, updateError, updatedTaskProjectRelation, resetUpdate };
}

/**
 * タスクプロジェクト関連削除機能を取得するフック
 */
export function useDeleteTaskProjectRelationAction() {
  const {
    deleteTaskProjectRelation,
    isDeleting,
    deleteError,
    deletedTaskProjectRelationId,
    resetDelete,
  } = useTaskProjectRelationsContext();
  return { deleteTaskProjectRelation, isDeleting, deleteError, deletedTaskProjectRelationId, resetDelete };
}

/**
 * タスクプロジェクト関連同期機能を取得するフック
 */
export function useSyncTaskProjectRelationsAction() {
  const {
    syncTaskProjectRelations,
    isSyncing,
    syncError,
    resetSync,
  } = useTaskProjectRelationsContext();
  return { syncTaskProjectRelations, isSyncing, syncError, resetSync };
}

/**
 * タスクプロジェクト関連検索パラメータを管理するフック
 */
export function useTaskProjectRelationsParams() {
  const { taskProjectRelationsParams, setTaskProjectRelationsParams } = useTaskProjectRelationsContext();
  return { taskProjectRelationsParams, setTaskProjectRelationsParams };
}
