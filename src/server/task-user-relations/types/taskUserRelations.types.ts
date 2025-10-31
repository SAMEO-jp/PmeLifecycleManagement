/**
 * タスクユーザー関連の型定義
 */

// データベースのtask_user_relationsテーブル型
export interface TaskUserRelationTable {
  taskId: string;
  userId: string;
  createdAt: Date;
  deletedAt?: Date;
  roleType: string;
  estimatedHours?: number;
  actualHours?: number;
  updatedAt: Date;
}

// タスクユーザー関連作成時のリクエスト型
export interface CreateTaskUserRelationRequest {
  taskId: string;
  userId: string;
  roleType?: string;
  estimatedHours?: number;
  actualHours?: number;
}

// タスクユーザー関連更新時のリクエスト型
export interface UpdateTaskUserRelationRequest {
  roleType?: string;
  estimatedHours?: number;
  actualHours?: number;
}

// タスクユーザー関連削除時のリクエスト型
export interface DeleteTaskUserRelationRequest {
  taskId: string;
  userId: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// タスクユーザー関連作成APIレスポンス
export type CreateTaskUserRelationResponse = ApiResponse<TaskUserRelationTable>

// タスクユーザー関連削除APIレスポンス
export type DeleteTaskUserRelationResponse = ApiResponse<{ taskId: string; userId: string }>

// タスクユーザー関連一覧取得APIレスポンス
export type GetTaskUserRelationsResponse = ApiResponse<TaskUserRelationTable[]>

// 単一タスクユーザー関連取得APIレスポンス
export type GetTaskUserRelationResponse = ApiResponse<TaskUserRelationTable>

// Service層のメソッドパラメータ型
export interface CreateTaskUserRelationParams {
  taskId: string;
  userId: string;
  roleType?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface UpdateTaskUserRelationParams extends UpdateTaskUserRelationRequest {
  taskId: string;
  userId: string;
}

export interface DeleteTaskUserRelationParams {
  taskId: string;
  userId: string;
}

// Repository層の検索パラメータ型
export interface FindTaskUserRelationsParams {
  includeDeleted?: boolean;
  taskId?: string;
  userId?: string;
  roleType?: string;
  limit?: number;
  offset?: number;
}

export interface FindTaskUserRelationByIdsParams {
  taskId: string;
  userId: string;
  includeDeleted?: boolean;
}

export interface FindTaskUserRelationsByTaskParams {
  taskId: string;
  includeDeleted?: boolean;
}

export interface FindTaskUserRelationsByUserParams {
  userId: string;
  includeDeleted?: boolean;
}

// バルクリレーション作成パラメータ型
export interface BulkCreateTaskUserRelationsParams {
  relations: Array<{
    taskId: string;
    userId: string;
    roleType?: string;
    estimatedHours?: number;
    actualHours?: number;
  }>;
}
