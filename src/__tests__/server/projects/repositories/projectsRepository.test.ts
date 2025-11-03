import { ProjectsRepository } from '@/server/projects/repositories/projectsRepository'
import { db } from '../../../../../db'
import { createMockProject } from '@/__tests__/utils/test-utils'

// Drizzleのモック
jest.mock('../../../../../db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

// ユーティリティ関数のモック
jest.mock('@/lib/repository-utils', () => ({
  buildSoftDeleteCondition: jest.fn(),
  buildWhereConditions: jest.fn(),
  applyPagination: jest.fn(),
  validateString: jest.fn(),
  validateId: jest.fn(),
  generateId: jest.fn(),
  getCurrentTimestamp: jest.fn(),
}))

describe('ProjectsRepository', () => {
  let repository: ProjectsRepository

  beforeEach(() => {
    repository = new ProjectsRepository()
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('デフォルトパラメータで全プロジェクトを取得できる', async () => {
      // モックの設定
      const mockProjects = [createMockProject(), createMockProject({ id: 'test-id-2' })]

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockProjects),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockQuery)

      const result = await repository.findAll()

      expect(db.select).toHaveBeenCalled()
      expect(mockQuery.from).toHaveBeenCalled()
      expect(result).toEqual(mockProjects)
    })

    it('includeDeleted=trueで論理削除されたプロジェクトも取得できる', async () => {
      const mockProjects = [
        createMockProject(),
        createMockProject({ deleted_at: new Date() })
      ]

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockProjects),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockQuery)

      const result = await repository.findAll({ includeDeleted: true })

      expect(result).toEqual(mockProjects)
    })

    it('status=activeでアクティブなプロジェクトのみ取得できる', async () => {
      const activeProject = createMockProject()

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue([activeProject]),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockQuery)

      const result = await repository.findAll({ status: 'active' })

      expect(result).toEqual([activeProject])
    })

    it('ページネーションが正しく適用される', async () => {
      const mockProjects = [createMockProject()]

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockProjects),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockQuery)

      await repository.findAll({ limit: 10, offset: 20 })

      expect(mockQuery.limit).toHaveBeenCalledWith(10)
      expect(mockQuery.offset).toHaveBeenCalledWith(20)
    })
  })

  describe('findById', () => {
    it('指定したIDのプロジェクトを取得できる', async () => {
      const mockProject = createMockProject()

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockProject]),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockQuery)

      const result = await repository.findById('test-project-id')

      expect(result).toEqual(mockProject)
    })

    it('プロジェクトが存在しない場合はnullを返す', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockQuery)

      const result = await repository.findById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('新しいプロジェクトを作成できる', async () => {
      const newProjectData = {
        name: 'New Project',
        projectNumber: 'PME002',
      }

      const createdProject = createMockProject(newProjectData)

      const mockInsertQuery = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([createdProject]),
      }

      ;(db.insert as jest.Mock).mockReturnValue(mockInsertQuery)

      const result = await repository.create(newProjectData)

      expect(db.insert).toHaveBeenCalled()
      expect(mockInsertQuery.values).toHaveBeenCalled()
      expect(result).toEqual(createdProject)
    })
  })

  describe('update', () => {
    it('プロジェクトを更新できる', async () => {
      const updateData = { name: 'Updated Project' }
      const updatedProject = createMockProject(updateData)

      const mockUpdateQuery = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([updatedProject]),
      }

      ;(db.update as jest.Mock).mockReturnValue(mockUpdateQuery)

      const result = await repository.update('test-project-id', updateData)

      expect(db.update).toHaveBeenCalled()
      expect(mockUpdateQuery.set).toHaveBeenCalled()
      expect(result).toEqual(updatedProject)
    })
  })

  describe('delete', () => {
    it('プロジェクトを論理削除できる', async () => {
      const deletedProject = createMockProject({
        deleted_at: new Date(),
      })

      const mockUpdateQuery = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([deletedProject]),
      }

      ;(db.update as jest.Mock).mockReturnValue(mockUpdateQuery)

      const result = await repository.delete('test-project-id')

      expect(db.update).toHaveBeenCalled()
      expect(mockUpdateQuery.set).toHaveBeenCalledWith(
        expect.objectContaining({ deleted_at: expect.any(Date) })
      )
      expect(result).toEqual(deletedProject)
    })
  })
})
