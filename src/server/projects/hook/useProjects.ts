/**
 * プロジェクト一覧取得HOOK
 * 全プロジェクトを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '../services';
import type { FindProjectsParams, ProjectTable } from '../types';

/**
 * useProjectsの戻り値型
 */
export interface UseProjectsReturn {
  /** プロジェクト一覧 */
  projects: ProjectTable[];
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * プロジェクト一覧を取得するHOOK
 *
 * @param params - 検索パラメータ（オプション）
 * @returns プロジェクト一覧と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { projects, isLoading, error, refetch } = useProjects({
 *   status: 'active',
 *   limit: 10
 * });
 * ```
 */
export function useProjects(params: FindProjectsParams = {}): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await projectsService.getAllProjects(params);

      if (response.success) {
        setProjects(response.data || []);
      } else {
        setError(response.error || 'プロジェクトの取得に失敗しました');
        setProjects([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました';
      setError(errorMessage);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}

