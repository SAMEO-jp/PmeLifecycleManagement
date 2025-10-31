/**
 * プロジェクトService層
 * ビジネスロジックを担当
 */

import { projectsRepository } from '../repositories';
import { validateCreateProject, validateUpdateProject } from './projects.validator';
import type {
  ProjectTable,
  CreateProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  FindProjectsParams,
  FindProjectByIdParams,
  CreateProjectResponse,
  DeleteProjectResponse,
  GetProjectsResponse,
  GetProjectResponse
} from '../types';

/**
 * プロジェクトServiceクラス
 */
export class ProjectsService {
  /**
   * 成功レスポンスを構築
   */
  private _buildSuccessResponse<T>(data: T, message?: string): { success: true; data: T; message?: string } {
    return {
      success: true,
      data: data,
      ...(message && { message }),
    };
  }

  /**
   * 既知のエラーレスポンス（バリデーション、Not Foundなど）を構築
   */
  private _buildErrorResponse(error: string): { success: false; error: string } {
    return {
      success: false,
      error: error,
    };
  }

  /**
   * 予期しないエラーをハンドリング（ロギング＋エラーレスポンス構築）
   */
  private _handleError(
    error: unknown,
    contextMessage: string,
    params: unknown = {}
  ): { success: false; error: string } {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error(`[ProjectsService] ${contextMessage}:`, {
      message: errorMessage,
      stack: errorStack,
      params,
      timestamp: new Date().toISOString(),
    });

    // ユーザーには汎用的なエラーメッセージを返す
    const userFacingError = contextMessage.replace('エラー', '') + 'に失敗しました';
    return this._buildErrorResponse(userFacingError);
  }

  /**
   * 全プロジェクトを取得
   */
  async getAllProjects(params: FindProjectsParams = {}): Promise<GetProjectsResponse> {
    try {
      const projects = await projectsRepository.findAll(params);
      return this._buildSuccessResponse(projects);
    } catch (error) {
      return this._handleError(error, 'プロジェクト一覧取得エラー', params);
    }
  }

  /**
   * IDでプロジェクトを取得
   */
  async getProjectById(params: FindProjectByIdParams): Promise<GetProjectResponse> {
    try {
      const project = await projectsRepository.findById(params);

      if (!project) {
        return this._buildErrorResponse('プロジェクトが見つかりません');
      }

      return this._buildSuccessResponse(project);
    } catch (error) {
      return this._handleError(error, 'プロジェクト取得エラー', params);
    }
  }

  /**
   * プロジェクトを作成
   */
  async createProject(params: CreateProjectParams): Promise<CreateProjectResponse> {
    // 1. バリデーション（外部からインポートした関数を呼び出す）
    const validationError = validateCreateProject(params);
    if (validationError) {
      return this._buildErrorResponse(validationError);
    }

    try {
      // 2. 実行
      const project = await projectsRepository.create(params);
      return this._buildSuccessResponse(project, 'プロジェクトが作成されました');
    } catch (error) {
      // 3. 予期しないエラーのハンドリング
      return this._handleError(error, 'プロジェクト作成エラー', params);
    }
  }

  /**
   * プロジェクトを更新
   */
  async updateProject(params: UpdateProjectParams): Promise<GetProjectResponse> {
    // 1. バリデーション（外部からインポートした関数を呼び出す）
    const validationError = validateUpdateProject(params);
    if (validationError) {
      return this._buildErrorResponse(validationError);
    }

    try {
      // 2. 実行
      const project = await projectsRepository.update(params);

      if (!project) {
        return this._buildErrorResponse('プロジェクトが見つかりません');
      }

      return this._buildSuccessResponse(project, 'プロジェクトが更新されました');
    } catch (error) {
      // 3. 予期しないエラーのハンドリング
      return this._handleError(error, 'プロジェクト更新エラー', params);
    }
  }

  /**
   * プロジェクトを論理削除
   */
  async softDeleteProject(params: DeleteProjectParams): Promise<DeleteProjectResponse> {
    try {
      const existingProject = await projectsRepository.findById({
        id: params.id,
        includeDeleted: false
      });

      if (!existingProject) {
        return this._buildErrorResponse('プロジェクトが見つかりません');
      }

      await projectsRepository.softDelete(params);

      return this._buildSuccessResponse({ id: params.id }, 'プロジェクトが削除されました');
    } catch (error) {
      return this._handleError(error, 'プロジェクト削除エラー', params);
    }
  }
}

// シングルトンインスタンス
export const projectsService = new ProjectsService();
