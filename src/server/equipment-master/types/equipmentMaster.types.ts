/**
 * 設備マスタ関連の型定義
 */

// データベースのequipment_masterテーブル型
export interface EquipmentMasterTable {
  id: string;
  equipmentName: string;
  parentId?: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

// 設備マスタ作成時のリクエスト型
export interface CreateEquipmentMasterRequest {
  equipmentName: string;
  parentId?: string;
}

// 設備マスタ更新時のリクエスト型
export interface UpdateEquipmentMasterRequest {
  equipmentName?: string;
  parentId?: string;
}

// 設備マスタ削除時のリクエスト型
export interface DeleteEquipmentMasterRequest {
  id: string;
}

// APIレスポンスの共通型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 設備マスタ作成APIレスポンス
export type CreateEquipmentMasterResponse = ApiResponse<EquipmentMasterTable>

// 設備マスタ削除APIレスポンス
export type DeleteEquipmentMasterResponse = ApiResponse<{ id: string }>

// 設備マスタ一覧取得APIレスポンス
export type GetEquipmentMastersResponse = ApiResponse<EquipmentMasterTable[]>

// 単一設備マスタ取得APIレスポンス
export type GetEquipmentMasterResponse = ApiResponse<EquipmentMasterTable>

// 子設備一覧取得APIレスポンス
export type GetEquipmentChildrenResponse = ApiResponse<EquipmentMasterTable[]>

// Service層のメソッドパラメータ型
export interface CreateEquipmentMasterParams {
  equipmentName: string;
  parentId?: string;
}

export interface UpdateEquipmentMasterParams extends UpdateEquipmentMasterRequest {
  id: string;
}

export interface DeleteEquipmentMasterParams {
  id: string;
}

// Repository層の検索パラメータ型
export interface FindEquipmentMastersParams {
  includeDeleted?: boolean;
  parentId?: string;
  limit?: number;
  offset?: number;
}

export interface FindEquipmentMasterByIdParams {
  id: string;
  includeDeleted?: boolean;
}

export interface FindEquipmentChildrenParams {
  parentId: string;
  includeDeleted?: boolean;
}
