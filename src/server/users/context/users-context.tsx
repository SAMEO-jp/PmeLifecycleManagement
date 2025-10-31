"use client"

/**
 * ユーザー機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  UserTable,
  FindUsersParams,
  CreateUserParams,
  UpdateUserParams,
  DeleteUserParams,
} from '../types';

/**
 * ユーザーContextの型定義
 */
export interface UsersContextType {
  // ユーザー一覧関連
  users: UserTable[];
  isLoadingUsers: boolean;
  usersError: string | null;
  refetchUsers: () => Promise<void>;
  setUsersParams: (params: FindUsersParams) => void;
  usersParams: FindUsersParams;

  // 選択中のユーザー
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  selectedUser: UserTable | null;

  // ユーザー作成
  createUser: (params: CreateUserParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdUser: UserTable | null;
  resetCreate: () => void;

  // ユーザー更新
  updateUser: (params: UpdateUserParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedUser: UserTable | null;
  resetUpdate: () => void;

  // ユーザー削除
  deleteUser: (params: DeleteUserParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedUserId: string | null;
  resetDelete: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const UsersContext = createContext<UsersContextType | undefined>(undefined);

/**
 * UsersContextを使用するフック
 * @throws Error - UsersProviderの外で使用した場合
 */
export function useUsersContext(): UsersContextType {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsersContext must be used within a UsersProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * ユーザー一覧を取得するフック
 */
export function useUsersList() {
  const { users, isLoadingUsers, usersError, refetchUsers } = useUsersContext();
  return { users, isLoadingUsers, usersError, refetchUsers };
}

/**
 * 選択中のユーザーを取得するフック
 */
export function useSelectedUser() {
  const { selectedUser, selectedUserId, setSelectedUserId } = useUsersContext();
  return { selectedUser, selectedUserId, setSelectedUserId };
}

/**
 * ユーザー作成機能を取得するフック
 */
export function useCreateUserAction() {
  const {
    createUser,
    isCreating,
    createError,
    createdUser,
    resetCreate,
  } = useUsersContext();
  return { createUser, isCreating, createError, createdUser, resetCreate };
}

/**
 * ユーザー更新機能を取得するフック
 */
export function useUpdateUserAction() {
  const {
    updateUser,
    isUpdating,
    updateError,
    updatedUser,
    resetUpdate,
  } = useUsersContext();
  return { updateUser, isUpdating, updateError, updatedUser, resetUpdate };
}

/**
 * ユーザー削除機能を取得するフック
 */
export function useDeleteUserAction() {
  const {
    deleteUser,
    isDeleting,
    deleteError,
    deletedUserId,
    resetDelete,
  } = useUsersContext();
  return { deleteUser, isDeleting, deleteError, deletedUserId, resetDelete };
}

/**
 * ユーザー検索パラメータを管理するフック
 */
export function useUsersParams() {
  const { usersParams, setUsersParams } = useUsersContext();
  return { usersParams, setUsersParams };
}
