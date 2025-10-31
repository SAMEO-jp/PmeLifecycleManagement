/**
 * タスク設備関連の型定義
 */

// データベースのtask_equipment_relationsテーブル型
export interface TaskEquipmentRelationTable {
  taskId: string;
  equipmentId: string;
  createdAt: Date;
  deletedAt?: Date;
  usageType: string;
  plannedHours?: number;
  actualHours?: number;
  quantity: number;
  updatedAt: Date;
}

// タスク設備関連作成時のリクエスト型
export interface CreateTaskEquipmentRelationRequest {
  taskId: string;
  equipmentId: string;
  usageType?: string;
  plannedHours?: number;
  actualHours?: number;
  quantity?: number;
}

// タスク設備関連更新時のリクエスト型
export interface UpdateTaskEquipmentRelationRequest {
  usageType?: string;
  plannedHours?: number;
  actualHours?: number;
  quantity?: number;
}

// タスク設備関連削除時のリクエスト型
export interface DeleteTaskEquipmentRelationRequest {
  taskId: string;
  equipmentId: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// タスク設備関連作成APIレスポンス
export type CreateTaskEquipmentRelationResponse = ApiResponse<TaskEquipmentRelationTable>

// タスク設備関連削除APIレスポンス
export type DeleteTaskEquipmentRelationResponse = ApiResponse<{ taskId: string; equipmentId: string }>

// タスク設備関連一覧取得APIレスポンス
export type GetTaskEquipmentRelationsResponse = ApiResponse<TaskEquipmentRelationTable[]>

// 単一タスク設備関連取得APIレスポンス
export type GetTaskEquipmentRelationResponse = ApiResponse<TaskEquipmentRelationTable>

// Service層のメソッドパラメータ型
export interface CreateTaskEquipmentRelationParams {
  taskId: string;
  equipmentId: string;
  usageType?: string;
  plannedHours?: number;
  actualHours?: number;
  quantity?: number;
}

export interface UpdateTaskEquipmentRelationParams extends UpdateTaskEquipmentRelationRequest {
  taskId: string;
  equipmentId: string;
}

export interface DeleteTaskEquipmentRelationParams {
  taskId: string;
  equipmentId: string;
}

// Repository層の検索パラメータ型
export interface FindTaskEquipmentRelationsParams {
  includeDeleted?: boolean;
  taskId?: string;
  equipmentId?: string;
  usageType?: string;
  limit?: number;
  offset?: number;
}

export interface FindTaskEquipmentRelationByIdsParams {
  taskId: string;
  equipmentId: string;
  includeDeleted?: boolean;
}

export interface FindTaskEquipmentRelationsByTaskParams {
  taskId: string;
  includeDeleted?: boolean;
}

export interface FindTaskEquipmentRelationsByEquipmentParams {
  equipmentId: string;
  includeDeleted?: boolean;
}

// バルクリレーション作成パラメータ型
export interface BulkCreateTaskEquipmentRelationsParams {
  relations: Array<{
    taskId: string;
    equipmentId: string;
    usageType?: string;
    plannedHours?: number;
    actualHours?: number;
    quantity?: number;
  }>;
}
