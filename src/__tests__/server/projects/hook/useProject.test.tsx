import { renderHook, waitFor, act } from '@testing-library/react'
import { useProject } from '@/server/projects/hook/useProject'
import { projectsService } from '@/server/projects/services/index'
import { createMockProject } from '@/__tests__/utils/test-utils'

// Serviceのモック
jest.mock('@/server/projects/services/index', () => ({
  projectsService: {
    getProjectById: jest.fn(),
  },
}))

describe('useProject', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() =>
      useProject({ id: 'test-project-id', includeDeleted: false })
    )

    expect(result.current.project).toBeNull()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.refetch).toBe('function')
  })

  it('正常にプロジェクトを取得できる', async () => {
    const mockProject = createMockProject()
    const mockResponse = { success: true, data: mockProject }

    ;(projectsService.getProjectById as jest.Mock).mockResolvedValue(mockResponse)

    const { result } = renderHook(() =>
      useProject({ id: 'test-project-id', includeDeleted: false })
    )

    // 初期状態
    expect(result.current.isLoading).toBe(true)

    // データ取得完了まで待つ
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.project).toEqual(mockProject)
    expect(result.current.error).toBeNull()
    expect(projectsService.getProjectById).toHaveBeenCalledWith({
      id: 'test-project-id',
      includeDeleted: false,
    })
  })

  it('プロジェクトが存在しない場合、エラーが設定される', async () => {
    const mockResponse = { success: false, error: 'Project not found' }

    ;(projectsService.getProjectById as jest.Mock).mockResolvedValue(mockResponse)

    const { result } = renderHook(() =>
      useProject({ id: 'non-existent-id', includeDeleted: false })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.project).toBeNull()
    expect(result.current.error).toBe('Project not found')
  })

  it('IDが指定されていない場合、エラーが設定される', async () => {
    const { result } = renderHook(() =>
      useProject({ id: '', includeDeleted: false })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.project).toBeNull()
    expect(result.current.error).toBe('プロジェクトIDが指定されていません')
    expect(projectsService.getProjectById).not.toHaveBeenCalled()
  })

  it('サービスでエラーが発生した場合、エラーが設定される', async () => {
    const mockResponse = { success: false, error: 'Internal server error' }

    ;(projectsService.getProjectById as jest.Mock).mockResolvedValue(mockResponse)

    const { result } = renderHook(() =>
      useProject({ id: 'test-project-id', includeDeleted: false })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.project).toBeNull()
    expect(result.current.error).toBe('Internal server error')
  })

  it('refetch関数でデータを再取得できる', async () => {
    const mockProject = createMockProject({ name: 'Project 1' })

    ;(projectsService.getProjectById as jest.Mock)
      .mockResolvedValue({ success: true, data: mockProject })

    const { result } = renderHook(() =>
      useProject({ id: 'test-project-id', includeDeleted: false })
    )

    // 最初のデータ取得
    await waitFor(() => {
      expect(result.current.project?.name).toBe('Project 1')
    })

    // refetch実行
    await act(async () => {
      await result.current.refetch()
    })

    // refetchが実行されたことを確認
    await waitFor(() => {
      expect(result.current.project?.name).toBe('Project 1')
    })

    // サービスが複数回呼ばれていることを確認（useEffectの依存関係により）
    expect(projectsService.getProjectById).toHaveBeenCalledTimes(3)
  })

  it('パラメータが変更された場合、再取得が実行される', async () => {
    const mockProject1 = createMockProject({ name: 'Project 1' })
    const mockProject2 = createMockProject({ name: 'Project 2' })

    ;(projectsService.getProjectById as jest.Mock)
      .mockImplementation((params) => {
        if (params.id === 'project-1') {
          return Promise.resolve({ success: true, data: mockProject1 })
        } else {
          return Promise.resolve({ success: true, data: mockProject2 })
        }
      })

    let params = { id: 'project-1', includeDeleted: false }
    const { result, rerender } = renderHook(() =>
      useProject(params)
    )

    // 最初のデータ取得
    await waitFor(() => {
      expect(result.current.project?.name).toBe('Project 1')
    })

    // パラメータ変更
    params = { id: 'project-2', includeDeleted: false }
    await act(async () => {
      rerender()
    })

    // 新しいデータが取得されていることを確認
    await waitFor(() => {
      expect(result.current.project?.name).toBe('Project 2')
    })

    expect(projectsService.getProjectById).toHaveBeenCalledTimes(2)
  })

  it('サービス呼び出し中にエラーが発生した場合、エラーが設定される', async () => {
    ;(projectsService.getProjectById as jest.Mock).mockRejectedValue(
      new Error('Network error')
    )

    const { result } = renderHook(() =>
      useProject({ id: 'test-project-id', includeDeleted: false })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.project).toBeNull()
    expect(result.current.error).toBe('Network error')
  })
})
