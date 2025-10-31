/**
 * プロジェクト更新HOOK
 * プロジェクトを更新するための状態管理を行う
 */

import { useState, useCallback } from 'react';
import { projectsService } from '../services';
import type { UpdateProjectParams, ProjectTable } from '../types';

/**
 * useUpdateProjectの戻り値型
 */
export interface UseUpdateProjectReturn {
  /** 更新後のプロジェクト情報 */
  project: ProjectTable | null;
  /** 更新中かどうか */
  isUpdating: boolean;
  /** エラー情報 */
  error: string | null;
  /** プロジェクト更新関数 */
  updateProject: (params: UpdateProjectParams) => Promise<boolean>;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * プロジェクトを更新するHOOK
 *
 * @returns プロジェクト更新関数と状態管理用の値
 *
 * @example
 * ```tsx
 * const { updateProject, isUpdating, error, project, reset } = useUpdateProject();
 *
 * const handleUpdate = async () => {
 *   const success = await updateProject({
 *     id: 'project-id',
 *     name: '更新されたプロジェクト名'
 *   });
 *   if (success) {
 *     console.log('更新成功！');
 *   }
 * };
 * ```
 */
export function useUpdateProject(): UseUpdateProjectReturn {
  const [project, setProject] = useState<ProjectTable | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProject = useCallback(async (params: UpdateProjectParams): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      setProject(null);

      const response = await projectsService.updateProject(params);

      if (response.success) {
        setProject(response.data || null);
        return true;
      } else {
        setError(response.error || 'プロジェクトの更新に失敗しました');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの更新に失敗しました';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProject(null);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    project,
    isUpdating,
    error,
    updateProject,
    reset,
  };
}

