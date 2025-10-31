"use client"

/**
 * プロジェクト機能のProvider
 * プロジェクト関連の状態を管理し、グローバルに提供する
 */

import React, { useState, useCallback, ReactNode } from 'react';
import type { FindProjectsParams, CreateProjectParams, UpdateProjectParams, DeleteProjectParams } from '../types';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../hook';
import { ProjectsContext, type ProjectsContextType } from './projects-context';

/**
 * Provider Props
 */
export interface ProjectsProviderProps {
  children: ReactNode;
  /** 初期の検索パラメータ */
  initialParams?: FindProjectsParams;
}

/**
 * プロジェクトProviderコンポーネント
 * プロジェクト関連の状態を管理し、グローバルに提供する
 */
export function ProjectsProvider({
  children,
  initialParams = {},
}: ProjectsProviderProps) {
  // 検索パラメータの状態管理
  const [projectsParams, setProjectsParamsState] = useState<FindProjectsParams>(initialParams);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // プロジェクト一覧取得HOOK
  const {
    projects,
    isLoading: isLoadingProjects,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects(projectsParams);

  // プロジェクト作成HOOK
  const {
    createProject: createProjectHook,
    isCreating,
    error: createError,
    project: createdProject,
    reset: resetCreate,
  } = useCreateProject();

  // プロジェクト更新HOOK
  const {
    updateProject: updateProjectHook,
    isUpdating,
    error: updateError,
    project: updatedProject,
    reset: resetUpdate,
  } = useUpdateProject();

  // プロジェクト削除HOOK
  const {
    deleteProject: deleteProjectHook,
    isDeleting,
    error: deleteError,
    deletedId: deletedProjectId,
    reset: resetDelete,
  } = useDeleteProject();

  // 選択中のプロジェクトを取得
  const selectedProject =
    selectedProjectId ? projects.find((p) => p.id === selectedProjectId) || null : null;

  // 検索パラメータを設定（設定後、自動的に再取得される）
  const setProjectsParams = useCallback((params: FindProjectsParams) => {
    setProjectsParamsState(params);
  }, []);

  // プロジェクト作成（成功時に一覧を再取得）
  const createProject = useCallback(
    async (params: CreateProjectParams): Promise<boolean> => {
      const success = await createProjectHook(params);
      if (success) {
        // 作成成功後、一覧を再取得
        await refetchProjects();
      }
      return success;
    },
    [createProjectHook, refetchProjects]
  );

  // プロジェクト更新（成功時に一覧を再取得）
  const updateProject = useCallback(
    async (params: UpdateProjectParams): Promise<boolean> => {
      const success = await updateProjectHook(params);
      if (success) {
        // 更新成功後、一覧を再取得
        await refetchProjects();
        // 選択中のプロジェクトも更新
        if (selectedProjectId === params.id) {
          // 選択中のプロジェクトが更新された場合、選択状態を維持
        }
      }
      return success;
    },
    [updateProjectHook, refetchProjects, selectedProjectId]
  );

  // プロジェクト削除（成功時に一覧を再取得）
  const deleteProject = useCallback(
    async (params: DeleteProjectParams): Promise<boolean> => {
      const success = await deleteProjectHook(params);
      if (success) {
        // 削除成功後、一覧を再取得
        await refetchProjects();
        // 削除されたプロジェクトが選択中の場合は選択を解除
        if (selectedProjectId === params.id) {
          setSelectedProjectId(null);
        }
      }
      return success;
    },
    [deleteProjectHook, refetchProjects, selectedProjectId]
  );

  // 全体のリセット
  const reset = useCallback(() => {
    resetCreate();
    resetUpdate();
    resetDelete();
    setSelectedProjectId(null);
  }, [resetCreate, resetUpdate, resetDelete]);

  const contextValue: ProjectsContextType = {
    // プロジェクト一覧関連
    projects,
    isLoadingProjects,
    projectsError,
    refetchProjects,
    setProjectsParams,
    projectsParams,

    // 選択中のプロジェクト
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,

    // プロジェクト作成
    createProject,
    isCreating,
    createError,
    createdProject,
    resetCreate,

    // プロジェクト更新
    updateProject,
    isUpdating,
    updateError,
    updatedProject,
    resetUpdate,

    // プロジェクト削除
    deleteProject,
    isDeleting,
    deleteError,
    deletedProjectId,
    resetDelete,

    // 全体のリセット
    reset,
  };

  return (
    <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>
  );
}

