/**
 * プロジェクト作成HOOK
 * プロジェクトを作成するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { projectsService } from '../services';
import type { CreateProjectParams, ProjectTable } from '../types';

/**
 * useCreateProjectの戻り値型
 */
export interface UseCreateProjectReturn {
  /** 作成中のプロジェクト情報 */
  project: ProjectTable | null;
  /** 作成中かどうか */
  isCreating: boolean;
  /** エラー情報 */
  error: string | null;
  /** プロジェクト作成関数 */
  createProject: (params: CreateProjectParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * プロジェクトを作成するHOOK
 *
 * @returns プロジェクト作成関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { createProject, isCreating, error, project, reset } = useCreateProject();
 *
 * const handleSubmit = async () => {
 *   const success = await createProject({ name: '新しいプロジェクト' });
 *   if (success) {
 *     console.log('作成成功！');
 *   }
 * };
 * ```
 */
export function useCreateProject(): UseCreateProjectReturn {
  const [project, setProject] = useState<ProjectTable | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(async (params: CreateProjectParams): Promise<boolean> => {
    try {
      setIsCreating(true);
      setError(null);
      setProject(null);

      const response = await projectsService.createProject(params);

      if (response.success) {
        setProject(response.data || null);
        return true;
      } else {
        setError(response.error || 'プロジェクトの作成に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの作成に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProject(null);
    setError(null);
    setIsCreating(false);
  }, []);

  return {
    project,
    isCreating,
    error,
    createProject,
    reset,
  };
}

