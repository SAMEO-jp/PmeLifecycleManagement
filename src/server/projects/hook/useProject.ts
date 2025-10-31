/**
 * プロジェクト詳細取得HOOK
 * IDでプロジェクトを取得し、状態管理を行う
 */

import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '../services';
import type { FindProjectByIdParams, ProjectTable } from '../types';

/**
 * useProjectの戻り値型
 */
export interface UseProjectReturn {
  /** プロジェクト情報 */
  project: ProjectTable | null;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: string | null;
  /** データ再取得 */
  refetch: () => Promise<void>;
}

/**
 * IDでプロジェクトを取得するHOOK
 *
 * @param params - 検索パラメータ（idは必須）
 * @returns プロジェクト情報と状態管理用の関数
 *
 * @example
 * ```tsx
 * const { project, isLoading, error, refetch } = useProject({
 *   id: 'project-id',
 *   includeDeleted: false
 * });
 * ```
 */
export function useProject(params: FindProjectByIdParams): UseProjectReturn {
  const [project, setProject] = useState<ProjectTable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!params.id) {
      setError('プロジェクトIDが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await projectsService.getProjectById(params);

      if (response.success) {
        setProject(response.data || null);
      } else {
        setError(response.error || 'プロジェクトの取得に失敗しました');
        setProject(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました';
      setError(errorMessage);
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    refetch: fetchProject,
  };
}

