import { ProjectsService } from '@/server/projects/services/projectsService'
import { projectsRepository } from '@/server/projects/repositories/index'
import { createMockProject } from '@/__tests__/utils/test-utils'
import { validateCreateProject, validateUpdateProject } from '@/server/projects/services/projects.validator'

// Repositoryのモック
jest.mock('@/server/projects/repositories/index', () => ({
  projectsRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

// Validatorのモック
jest.mock('@/server/projects/services/projects.validator', () => ({
  validateCreateProject: jest.fn(),
  validateUpdateProject: jest.fn(),
}))

describe('ProjectsService', () => {
  let service: ProjectsService

  beforeEach(() => {
    service = new ProjectsService()
    jest.clearAllMocks()
  })

  describe('getAllProjects', () => {
    it('正常にプロジェクト一覧を取得できる', async () => {
      const mockProjects = [createMockProject(), createMockProject({ id: 'test-id-2' })]
      const mockParams = { includeDeleted: false }

      ;(projectsRepository.findAll as jest.Mock).mockResolvedValue(mockProjects)

      const result = await service.getAllProjects(mockParams)

      expect(projectsRepository.findAll).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual({
        success: true,
        data: mockProjects,
      })
    })

    it('リポジトリでエラーが発生した場合、エラーレスポンスを返す', async () => {
      const error = new Error('Database connection failed')
      ;(projectsRepository.findAll as jest.Mock).mockRejectedValue(error)

      const result = await service.getAllProjects()

      expect(result).toEqual({
        success: false,
        error: 'プロジェクト一覧取得に失敗しました',
      })
    })
  })

  describe('getProjectById', () => {
    it('正常に単一プロジェクトを取得できる', async () => {
      const mockProject = createMockProject()
      const mockParams = { id: 'test-project-id', includeDeleted: false }

      ;(projectsRepository.findById as jest.Mock).mockResolvedValue(mockProject)

      const result = await service.getProjectById(mockParams)

      expect(projectsRepository.findById).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual({
        success: true,
        data: mockProject,
      })
    })

    it('プロジェクトが存在しない場合、Not Foundエラーを返す', async () => {
      const mockParams = { id: 'non-existent-id', includeDeleted: false }

      ;(projectsRepository.findById as jest.Mock).mockResolvedValue(null)

      const result = await service.getProjectById(mockParams)

      expect(result).toEqual({
        success: false,
        error: 'プロジェクトが見つかりません',
      })
    })

    it('リポジトリでエラーが発生した場合、エラーレスポンスを返す', async () => {
      const error = new Error('Database connection failed')
      const mockParams = { id: 'test-project-id', includeDeleted: false }

      ;(projectsRepository.findById as jest.Mock).mockRejectedValue(error)

      const result = await service.getProjectById(mockParams)

      expect(result).toEqual({
        success: false,
        error: 'プロジェクト取得に失敗しました',
      })
    })
  })

  describe('createProject', () => {
    it('正常にプロジェクトを作成できる', async () => {
      const mockParams = { name: 'New Project' }
      const createdProject = createMockProject(mockParams)

      // Validatorが成功する場合
      ;(validateCreateProject as jest.Mock).mockReturnValue(null)
      ;(projectsRepository.create as jest.Mock).mockResolvedValue(createdProject)

      const result = await service.createProject(mockParams)

      expect(validateCreateProject).toHaveBeenCalledWith(mockParams)
      expect(projectsRepository.create).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual({
        success: true,
        data: createdProject,
        message: 'プロジェクトが作成されました',
      })
    })

    it('バリデーションエラーの場合、エラーレスポンスを返す', async () => {
      const mockParams = { name: '' } // 無効なデータ

      ;(validateCreateProject as jest.Mock).mockReturnValue('Name is required')

      const result = await service.createProject(mockParams)

      expect(result).toEqual({
        success: false,
        error: 'Name is required',
      })
      expect(projectsRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('updateProject', () => {
    it('正常にプロジェクトを更新できる', async () => {
      const mockParams = { id: 'test-project-id', name: 'Updated Project' }
      const existingProject = createMockProject({ id: mockParams.id })
      const updatedProject = createMockProject({ ...existingProject, name: mockParams.name })

      // Validatorが成功する場合
      ;(validateUpdateProject as jest.Mock).mockReturnValue(null)
      ;(projectsRepository.update as jest.Mock).mockResolvedValue(updatedProject)

      const result = await service.updateProject(mockParams)

      expect(validateUpdateProject).toHaveBeenCalledWith(mockParams)
      expect(projectsRepository.update).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual({
        success: true,
        data: updatedProject,
        message: 'プロジェクトが更新されました',
      })
    })

    it('更新対象のプロジェクトが存在しない場合、エラーを返す', async () => {
      const mockParams = { id: 'non-existent-id', name: 'Updated Project' }

      const { validateUpdateProject } = require('@/server/projects/services/projects.validator')
      ;(validateUpdateProject as jest.Mock).mockReturnValue(null)
      ;(projectsRepository.update as jest.Mock).mockResolvedValue(null)

      const result = await service.updateProject(mockParams)

      expect(result).toEqual({
        success: false,
        error: 'プロジェクトが見つかりません',
      })
    })
  })

})
