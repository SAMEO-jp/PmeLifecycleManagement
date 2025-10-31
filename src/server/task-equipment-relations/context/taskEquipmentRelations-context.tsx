"use client"

/**
 * タスク設備関連機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  TaskEquipmentRelationTable,
  FindTaskEquipmentRelationsParams,
  CreateTaskEquipmentRelationParams,
  UpdateTaskEquipmentRelationParams,
  DeleteTaskEquipmentRelationParams,
} from '../types';

/**
 * タスク設備関連Contextの型定義
 */
export interface TaskEquipmentRelationsContextType {
  // タスク設備関連一覧関連
  taskEquipmentRelations: TaskEquipmentRelationTable[];
  isLoadingTaskEquipmentRelations: boolean;
  taskEquipmentRelationsError: string | null;
  refetchTaskEquipmentRelations: () => Promise<void>;
  setTaskEquipmentRelationsParams: (params: FindTaskEquipmentRelationsParams) => void;
  taskEquipmentRelationsParams: FindTaskEquipmentRelationsParams;

  // 選択中のタスク設備関連
  selectedTaskEquipmentRelationId: { taskId: string; equipmentId: string } | null;
  setSelectedTaskEquipmentRelationId: (id: { taskId: string; equipmentId: string } | null) => void;
  selectedTaskEquipmentRelation: TaskEquipmentRelationTable | null;

  // タスク設備関連作成
  createTaskEquipmentRelation: (params: CreateTaskEquipmentRelationParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdTaskEquipmentRelation: TaskEquipmentRelationTable | null;
  resetCreate: () => void;

  // タスク設備関連更新
  updateTaskEquipmentRelation: (params: UpdateTaskEquipmentRelationParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedTaskEquipmentRelation: TaskEquipmentRelationTable | null;
  resetUpdate: () => void;

  // タスク設備関連削除
  deleteTaskEquipmentRelation: (params: DeleteTaskEquipmentRelationParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedTaskEquipmentRelationId: { taskId: string; equipmentId: string } | null;
  resetDelete: () => void;

  // 同期処理
  syncTaskEquipmentRelations: (taskId: string, equipmentRelations: Array<{
    equipmentId: string;
    usageType?: string;
    plannedHours?: number;
    actualHours?: number;
    quantity?: number;
  }>) => Promise<boolean>;
  isSyncing: boolean;
  syncError: string | null;
  resetSync: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const TaskEquipmentRelationsContext = createContext<TaskEquipmentRelationsContextType | undefined>(undefined);

/**
 * TaskEquipmentRelationsContextを使用するフック
 * @throws Error - TaskEquipmentRelationsProviderの外で使用した場合
 */
export function useTaskEquipmentRelationsContext(): TaskEquipmentRelationsContextType {
  const context = useContext(TaskEquipmentRelationsContext);
  if (context === undefined) {
    throw new Error('useTaskEquipmentRelationsContext must be used within a TaskEquipmentRelationsProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * タスク設備関連一覧を取得するフック
 */
export function useTaskEquipmentRelationsList() {
  const { taskEquipmentRelations, isLoadingTaskEquipmentRelations, taskEquipmentRelationsError, refetchTaskEquipmentRelations } =
    useTaskEquipmentRelationsContext();
  return { taskEquipmentRelations, isLoadingTaskEquipmentRelations, taskEquipmentRelationsError, refetchTaskEquipmentRelations };
}

/**
 * 選択中のタスク設備関連を取得するフック
 */
export function useSelectedTaskEquipmentRelation() {
  const { selectedTaskEquipmentRelation, selectedTaskEquipmentRelationId, setSelectedTaskEquipmentRelationId } = useTaskEquipmentRelationsContext();
  return { selectedTaskEquipmentRelation, selectedTaskEquipmentRelationId, setSelectedTaskEquipmentRelationId };
}

/**
 * タスク設備関連作成機能を取得するフック
 */
export function useCreateTaskEquipmentRelationAction() {
  const {
    createTaskEquipmentRelation,
    isCreating,
    createError,
    createdTaskEquipmentRelation,
    resetCreate,
  } = useTaskEquipmentRelationsContext();
  return { createTaskEquipmentRelation, isCreating, createError, createdTaskEquipmentRelation, resetCreate };
}

/**
 * タスク設備関連更新機能を取得するフック
 */
export function useUpdateTaskEquipmentRelationAction() {
  const {
    updateTaskEquipmentRelation,
    isUpdating,
    updateError,
    updatedTaskEquipmentRelation,
    resetUpdate,
  } = useTaskEquipmentRelationsContext();
  return { updateTaskEquipmentRelation, isUpdating, updateError, updatedTaskEquipmentRelation, resetUpdate };
}

/**
 * タスク設備関連削除機能を取得するフック
 */
export function useDeleteTaskEquipmentRelationAction() {
  const {
    deleteTaskEquipmentRelation,
    isDeleting,
    deleteError,
    deletedTaskEquipmentRelationId,
    resetDelete,
  } = useTaskEquipmentRelationsContext();
  return { deleteTaskEquipmentRelation, isDeleting, deleteError, deletedTaskEquipmentRelationId, resetDelete };
}

/**
 * タスク設備関連同期機能を取得するフック
 */
export function useSyncTaskEquipmentRelationsAction() {
  const {
    syncTaskEquipmentRelations,
    isSyncing,
    syncError,
    resetSync,
  } = useTaskEquipmentRelationsContext();
  return { syncTaskEquipmentRelations, isSyncing, syncError, resetSync };
}

/**
 * タスク設備関連検索パラメータを管理するフック
 */
export function useTaskEquipmentRelationsParams() {
  const { taskEquipmentRelationsParams, setTaskEquipmentRelationsParams } = useTaskEquipmentRelationsContext();
  return { taskEquipmentRelationsParams, setTaskEquipmentRelationsParams };
}
