/**
 * タスクプロジェクト関連の型定義
 */

// データベースのtask_project_relationsテーブル型
export interface TaskProjectRelationTable {
  taskId: string;
  projectId: string;
  createdAt: Date;
  deletedAt?: Date;
  relationType: string;
  sortOrder?: number;
  updatedAt: Date;
}

// タスクプロジェクト関連作成時のリクエスト型
export interface CreateTaskProjectRelationRequest {
  taskId: string;
  projectId: string;
  relationType?: string;
  sortOrder?: number;
}

// タスクプロジェクト関連更新時のリクエスト型
export interface UpdateTaskProjectRelationRequest {
  relationType?: string;
  sortOrder?: number;
}

// タスクプロジェクト関連削除時のリクエスト型
export interface DeleteTaskProjectRelationRequest {
  taskId: string;
  projectId: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// タスクプロジェクト関連作成APIレスポンス
export type CreateTaskProjectRelationResponse = ApiResponse<TaskProjectRelationTable>

// タスクプロジェクト関連削除APIレスポンス
export type DeleteTaskProjectRelationResponse = ApiResponse<{ taskId: string; projectId: string }>

// タスクプロジェクト関連一覧取得APIレスポンス
export type GetTaskProjectRelationsResponse = ApiResponse<TaskProjectRelationTable[]>

// 単一タスクプロジェクト関連取得APIレスポンス
export type GetTaskProjectRelationResponse = ApiResponse<TaskProjectRelationTable>

// Service層のメソッドパラメータ型
export interface CreateTaskProjectRelationParams {
  taskId: string;
  projectId: string;
  relationType?: string;
  sortOrder?: number;
}

export interface UpdateTaskProjectRelationParams extends UpdateTaskProjectRelationRequest {
  taskId: string;
  projectId: string;
}

export interface DeleteTaskProjectRelationParams {
  taskId: string;
  projectId: string;
}

// Repository層の検索パラメータ型
export interface FindTaskProjectRelationsParams {
  includeDeleted?: boolean;
  taskId?: string;
  projectId?: string;
  relationType?: string;
  limit?: number;
  offset?: number;
}

export interface FindTaskProjectRelationByIdsParams {
  taskId: string;
  projectId: string;
  includeDeleted?: boolean;
}

export interface FindTaskProjectRelationsByTaskParams {
  taskId: string;
  includeDeleted?: boolean;
}

export interface FindTaskProjectRelationsByProjectParams {
  projectId: string;
  includeDeleted?: boolean;
}

// バルクリレーション作成パラメータ型
export interface BulkCreateTaskProjectRelationsParams {
  relations: Array<{
    taskId: string;
    projectId: string;
    relationType?: string;
    sortOrder?: number;
  }>;
}
