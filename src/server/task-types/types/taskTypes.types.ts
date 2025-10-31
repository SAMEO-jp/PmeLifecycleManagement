/**
 * タスクタイプ関連の型定義
 */

// データベースのtask_typesテーブル型
export interface TaskTypeTable {
  id: string;
  typeName: string;
  description?: string;
  colorCode?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// タスクタイプ作成時のリクエスト型
export interface CreateTaskTypeRequest {
  typeName: string;
  description?: string;
  colorCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// タスクタイプ更新時のリクエスト型
export interface UpdateTaskTypeRequest {
  typeName?: string;
  description?: string;
  colorCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// タスクタイプ削除時のリクエスト型
export interface DeleteTaskTypeRequest {
  id: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// タスクタイプ作成APIレスポンス
export type CreateTaskTypeResponse = ApiResponse<TaskTypeTable>

// タスクタイプ削除APIレスポンス
export type DeleteTaskTypeResponse = ApiResponse<{ id: string }>

// タスクタイプ一覧取得APIレスポンス
export type GetTaskTypesResponse = ApiResponse<TaskTypeTable[]>

// 単一タスクタイプ取得APIレスポンス
export type GetTaskTypeResponse = ApiResponse<TaskTypeTable>

// Service層のメソッドパラメータ型
export interface CreateTaskTypeParams {
  typeName: string;
  description?: string;
  colorCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateTaskTypeParams extends UpdateTaskTypeRequest {
  id: string;
}

export interface DeleteTaskTypeParams {
  id: string;
}

// Repository層の検索パラメータ型
export interface FindTaskTypesParams {
  includeDeleted?: boolean;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface FindTaskTypeByIdParams {
  id: string;
  includeDeleted?: boolean;
}
