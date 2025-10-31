/**
 * タスク関連の型定義
 */

// データベースのtasksテーブル型
export interface TaskTable {
  id: string;
  taskName: string;
  taskTypeId: string;
  planId?: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

// タスク作成時のリクエスト型
export interface CreateTaskRequest {
  taskName: string;
  taskTypeId: string;
  planId?: string;
}

// タスク更新時のリクエスト型
export interface UpdateTaskRequest {
  taskName?: string;
  taskTypeId?: string;
  planId?: string;
}

// タスク削除時のリクエスト型
export interface DeleteTaskRequest {
  id: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// タスク作成APIレスポンス
export type CreateTaskResponse = ApiResponse<TaskTable>

// タスク削除APIレスポンス
export type DeleteTaskResponse = ApiResponse<{ id: string }>

// タスク一覧取得APIレスポンス
export type GetTasksResponse = ApiResponse<TaskTable[]>

// 単一タスク取得APIレスポンス
export type GetTaskResponse = ApiResponse<TaskTable>

// Service層のメソッドパラメータ型
export interface CreateTaskParams {
  taskName: string;
  taskTypeId: string;
  planId?: string;
}

export interface UpdateTaskParams extends UpdateTaskRequest {
  id: string;
}

export interface DeleteTaskParams {
  id: string;
}

// Repository層の検索パラメータ型
export interface FindTasksParams {
  includeDeleted?: boolean;
  taskTypeId?: string;
  planId?: string;
  limit?: number;
  offset?: number;
}

export interface FindTaskByIdParams {
  id: string;
  includeDeleted?: boolean;
}

export interface FindTasksByTaskTypeParams {
  taskTypeId: string;
  includeDeleted?: boolean;
}
