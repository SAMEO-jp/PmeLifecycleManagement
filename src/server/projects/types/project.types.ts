/**
 * プロジェクト関連の型定義
 */

// プロジェクトの状態
export type ProjectStatus = 'active' | 'inactive' | 'completed';

// データベースのプロジェクトテーブル型
export interface ProjectTable {
  id: string; // text型のためstring
  name: string;
  projectNumber: string; // PME番号
  status: ProjectStatus; // deletedAtの有無で判定（DBスキーマにはstatusカラムなし）
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

// プロジェクト作成時のリクエスト型
export interface CreateProjectRequest {
  name: string;
  description?: string;
}

// プロジェクト更新時のリクエスト型
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

// プロジェクト削除時のリクエスト型
export interface DeleteProjectRequest {
  id: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// プロジェクト作成APIレスポンス
export type CreateProjectResponse = ApiResponse<ProjectTable>

// プロジェクト削除APIレスポンス
export type DeleteProjectResponse = ApiResponse<{ id: string }>

// プロジェクト一覧取得APIレスポンス
export type GetProjectsResponse = ApiResponse<ProjectTable[]>

// 単一プロジェクト取得APIレスポンス
export type GetProjectResponse = ApiResponse<ProjectTable>

// Service層のメソッドパラメータ型
export interface CreateProjectParams {
  name: string;
  // descriptionはDBスキーマに存在しないため削除
}

export interface UpdateProjectParams extends UpdateProjectRequest {
  id: string;
}

export interface DeleteProjectParams {
  id: string;
}

// Repository層の検索パラメータ型
export interface FindProjectsParams {
  includeDeleted?: boolean;
  status?: ProjectStatus;
  limit?: number;
  offset?: number;
}

export interface FindProjectByIdParams {
  id: string;
  includeDeleted?: boolean;
}
