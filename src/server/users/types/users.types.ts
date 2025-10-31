/**
 * ユーザー関連の型定義
 */

// データベースのusersテーブル型
export interface UserTable {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ユーザー作成時のリクエスト型
export interface CreateUserRequest {
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
}

// ユーザー更新時のリクエスト型
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string;
}

// ユーザー削除時のリクエスト型
export interface DeleteUserRequest {
  id: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ユーザー作成APIレスポンス
export type CreateUserResponse = ApiResponse<UserTable>

// ユーザー削除APIレスポンス
export type DeleteUserResponse = ApiResponse<{ id: string }>

// ユーザー一覧取得APIレスポンス
export type GetUsersResponse = ApiResponse<UserTable[]>

// 単一ユーザー取得APIレスポンス
export type GetUserResponse = ApiResponse<UserTable>

// Service層のメソッドパラメータ型
export interface CreateUserParams {
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
}

export interface UpdateUserParams extends UpdateUserRequest {
  id: string;
}

export interface DeleteUserParams {
  id: string;
}

// Repository層の検索パラメータ型
export interface FindUsersParams {
  includeDeleted?: boolean;
  emailVerified?: boolean;
  limit?: number;
  offset?: number;
}

export interface FindUserByIdParams {
  id: string;
  includeDeleted?: boolean;
}

export interface FindUserByEmailParams {
  email: string;
  includeDeleted?: boolean;
}
