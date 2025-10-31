/**
 * プロジェクトService層
 * ビジネスロジックを担当
 */

import { projectsRepository } from '../repositories';
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
   * 全プロジェクトを取得
   */
  async getAllProjects(params: FindProjectsParams = {}): Promise<GetProjectsResponse> {
    try {
      const projects = await projectsRepository.findAll(params);
      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[ProjectsService] プロジェクト一覧取得エラー:', {
        message: errorMessage,
        stack: errorStack,
        params,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        error: 'プロジェクト一覧の取得に失敗しました',
      };
    }
  }

  /**
   * IDでプロジェクトを取得
   */
  async getProjectById(params: FindProjectByIdParams): Promise<GetProjectResponse> {
    try {
      const project = await projectsRepository.findById(params);

      if (!project) {
        return {
          success: false,
          error: 'プロジェクトが見つかりません',
        };
      }

      return {
        success: true,
        data: project,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[ProjectsService] プロジェクト取得エラー:', {
        message: errorMessage,
        stack: errorStack,
        params,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        error: 'プロジェクトの取得に失敗しました',
      };
    }
  }

  /**
   * プロジェクトを作成
   */
  async createProject(params: CreateProjectParams): Promise<CreateProjectResponse> {
    try {
      // バリデーション
      const validationError = this.validateCreateProjectParams(params);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      const project = await projectsRepository.create(params);
      return {
        success: true,
        data: project,
        message: 'プロジェクトが作成されました',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[ProjectsService] プロジェクト作成エラー:', {
        message: errorMessage,
        stack: errorStack,
        params,
        timestamp: new Date().toISOString(),
      });
      // Repository層のバリデーションエラーをそのまま返す
      if (error instanceof Error && (error.message.includes('必須') || error.message.includes('文字以内'))) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: 'プロジェクトの作成に失敗しました',
      };
    }
  }

  /**
   * プロジェクトを更新
   */
  async updateProject(params: UpdateProjectParams): Promise<GetProjectResponse> {
    try {
      // バリデーション
      const validationError = this.validateUpdateProjectParams(params);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      const project = await projectsRepository.update(params);

      if (!project) {
        return {
          success: false,
          error: 'プロジェクトが見つかりません',
        };
      }

      return {
        success: true,
        data: project,
        message: 'プロジェクトが更新されました',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[ProjectsService] プロジェクト更新エラー:', {
        message: errorMessage,
        stack: errorStack,
        params,
        timestamp: new Date().toISOString(),
      });
      // Repository層のバリデーションエラーをそのまま返す
      if (error instanceof Error && (error.message.includes('必須') || error.message.includes('文字以内'))) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: 'プロジェクトの更新に失敗しました',
      };
    }
  }

  /**
   * プロジェクトを論理削除
   */
  async softDeleteProject(params: DeleteProjectParams): Promise<DeleteProjectResponse> {
    try {
      // プロジェクトが存在するか確認
      const existingProject = await projectsRepository.findById({
        id: params.id,
        includeDeleted: false
      });

      if (!existingProject) {
        return {
          success: false,
          error: 'プロジェクトが見つかりません',
        };
      }

      const project = await projectsRepository.softDelete(params);

      if (!project) {
        return {
          success: false,
          error: 'プロジェクトの削除に失敗しました',
        };
      }

      return {
        success: true,
        data: { id: params.id },
        message: 'プロジェクトが削除されました',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[ProjectsService] プロジェクト削除エラー:', {
        message: errorMessage,
        stack: errorStack,
        params,
        timestamp: new Date().toISOString(),
      });
      // Repository層のバリデーションエラーをそのまま返す
      if (error instanceof Error && error.message.includes('必須')) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: 'プロジェクトの削除に失敗しました',
      };
    }
  }

  /**
   * プロジェクト作成パラメータのバリデーション
   */
  private validateCreateProjectParams(params: CreateProjectParams): string | null {
    if (!params.name || params.name.trim().length === 0) {
      return 'プロジェクト名は必須です';
    }

    if (params.name.length > 255) {
      return 'プロジェクト名は255文字以内で入力してください';
    }

    return null;
  }

  /**
   * プロジェクト更新パラメータのバリデーション
   */
  private validateUpdateProjectParams(params: UpdateProjectParams): string | null {
    if (!params.id || params.id.trim().length === 0) {
      return 'プロジェクトIDは必須です';
    }

    if (params.name !== undefined) {
      if (params.name.trim().length === 0) {
        return 'プロジェクト名は必須です';
      }
      if (params.name.length > 255) {
        return 'プロジェクト名は255文字以内で入力してください';
      }
    }

    return null;
  }
}

// シングルトンインスタンス
export const projectsService = new ProjectsService();
