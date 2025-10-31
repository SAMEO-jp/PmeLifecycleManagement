"use client"

/**
 * ユーザー機能のProvider
 * ユーザー関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindUsersParams, CreateUserParams, UpdateUserParams, DeleteUserParams } from '../types';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../hook';
import { UsersContext, type UsersContextType } from './users-context';

/**
 * Provider Props
 */
export interface UsersProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindUsersParams;
}

/**
 * ユーザーProviderコンポーネント
 * ユーザー関連の状態を管理し、グローバルに提供する
 */
export function UsersProvider({
  children,
  initialParams = {},
}: UsersProviderProps) {
  // 検索パラメータの状態管理
  const [usersParams, setUsersParamsState] = useState<FindUsersParams>(initialParams);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // ユーザー一覧取得HOOK
  const {
    users,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers(usersParams);

  // ユーザー作成HOOK
  const {
    createUser: createUserHook,
    isCreating,
    error: createError,
    user: createdUser,
    reset: resetCreate,
  } = useCreateUser();

  // ユーザー更新HOOK
  const {
    updateUser: updateUserHook,
    isUpdating,
    error: updateError,
    user: updatedUser,
    reset: resetUpdate,
  } = useUpdateUser();

  // ユーザー削除HOOK
  const {
    deleteUser: deleteUserHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedUserId,
    reset: resetDelete,
  } = useDeleteUser();

  // 選択中のユーザーを取得
  const selectedUser =
    selectedUserId ? users.find((u) => u.id === selectedUserId) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setUsersParams = useCallback((params: FindUsersParams) => {
    setUsersParamsState(params);
  }, []);

  // ユーザー作成（成功時に一覧を再取得）
  const createUser = useCallback(
    async (params: CreateUserParams): Promise<boolean> => {
      const success = await createUserHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchUsers();
      }
      return success;
    },
    [createUserHook, refetchUsers]
  );

  // ユーザー更新（成功時に一覧を再取得）
  const updateUser = useCallback(
    async (params: UpdateUserParams): Promise<boolean> => {
      const success = await updateUserHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchUsers();
        // 選択中のユーザーを更新
        if (selectedUserId === params.id) {
          // 選択中のユーザーが更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateUserHook, refetchUsers, selectedUserId]
  );

  // ユーザー削除（成功時に一覧を再取得）
  const deleteUser = useCallback(
    async (params: DeleteUserParams): Promise<boolean> => {
      const success = await deleteUserHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchUsers();
        // 削除されたユーザーが選択中の場合は選択を解除
        if (selectedUserId === params.id) {
          setSelectedUserId(null);
        }
      }
      return success;
    },
    [deleteUserHook, refetchUsers, selectedUserId]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    setSelectedUserId(null);
  }, [resetCreate, resetUpdate, resetDelete]);

  const contextValue: UsersContextType = {
    // ユーザー一覧関連
    users,
    isLoadingUsers,
    usersError,
    refetchUsers,
    setUsersParams,
    usersParams,

    // 選択中のユーザー
    selectedUserId,
    setSelectedUserId,
    selectedUser,

    // ユーザー作成
    createUser,
    isCreating,
    createError,
    createdUser,
    resetCreate,

    // ユーザー更新
    updateUser,
    isUpdating,
    updateError,
    updatedUser,
    resetUpdate,

    // ユーザー削除
    deleteUser,
    isDeleting,
    deleteError,
    deletedUserId,
    resetDelete,

    // 全体のリセット
    reset,
  };

  return (
    <UsersContext.Provider value={contextValue}>{children}</UsersContext.Provider>
  );
}
