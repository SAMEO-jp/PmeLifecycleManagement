"use client"

/**
 * プロジェクト機能のContext定義
 * Context型定義とフックを提供
 */

import { createContext, useContext } from 'react';
import type {
  ProjectTable,
  FindProjectsParams,
  CreateProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
} from '../types';

/**
 * プロジェクトContextの型定義
 */
export interface ProjectsContextType {
  // プロジェクト一覧関連
  projects: ProjectTable[];
  isLoadingProjects: boolean;
  projectsError: string | null;
  refetchProjects: () => Promise<void>;
  setProjectsParams: (params: FindProjectsParams) => void;
  projectsParams: FindProjectsParams;

  // 選択中のプロジェクト
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: ProjectTable | null;

  // プロジェクト作成
  createProject: (params: CreateProjectParams) => Promise<boolean>;
  isCreating: boolean;
  createError: string | null;
  createdProject: ProjectTable | null;
  resetCreate: () => void;

  // プロジェクト更新
  updateProject: (params: UpdateProjectParams) => Promise<boolean>;
  isUpdating: boolean;
  updateError: string | null;
  updatedProject: ProjectTable | null;
  resetUpdate: () => void;

  // プロジェクト削除
  deleteProject: (params: DeleteProjectParams) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string | null;
  deletedProjectId: string | null;
  resetDelete: () => void;

  // 全体のリセット
  reset: () => void;
}

// Context作成
export const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

/**
 * ProjectsContextを使用するフック
 * @throws Error - ProjectsProviderの外で使用した場合
 */
export function useProjectsContext(): ProjectsContextType {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
}

// ============================================
// 便利な個別フック
// ============================================

/**
 * プロジェクト一覧を取得するフック
 */
export function useProjectsList() {
  const { projects, isLoadingProjects, projectsError, refetchProjects } =
    useProjectsContext();
  return { projects, isLoadingProjects, projectsError, refetchProjects };
}

/**
 * 選択中のプロジェクトを取得するフック
 */
export function useSelectedProject() {
  const { selectedProject, selectedProjectId, setSelectedProjectId } = useProjectsContext();
  return { selectedProject, selectedProjectId, setSelectedProjectId };
}

/**
 * プロジェクト作成機能を取得するフック
 */
export function useCreateProjectAction() {
  const {
    createProject,
    isCreating,
    createError,
    createdProject,
    resetCreate,
  } = useProjectsContext();
  return { createProject, isCreating, createError, createdProject, resetCreate };
}

/**
 * プロジェクト更新機能を取得するフック
 */
export function useUpdateProjectAction() {
  const {
    updateProject,
    isUpdating,
    updateError,
    updatedProject,
    resetUpdate,
  } = useProjectsContext();
  return { updateProject, isUpdating, updateError, updatedProject, resetUpdate };
}

/**
 * プロジェクト削除機能を取得するフック
 */
export function useDeleteProjectAction() {
  const {
    deleteProject,
    isDeleting,
    deleteError,
    deletedProjectId,
    resetDelete,
  } = useProjectsContext();
  return { deleteProject, isDeleting, deleteError, deletedProjectId, resetDelete };
}

/**
 * プロジェクト検索パラメータを管理するフック
 */
export function useProjectsParams() {
  const { projectsParams, setProjectsParams } = useProjectsContext();
  return { projectsParams, setProjectsParams };
}
