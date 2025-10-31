import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// カスタムレンダラー
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, {
    // wrapperをここで設定可能
    ...options,
  })
}

// テスト用のモックデータ生成ヘルパー
export const createMockEquipmentMaster = (overrides = {}) => ({
  id: 'test-equipment-id',
  equipmentName: 'Test Equipment',
  parentId: null,
  createdAt: new Date('2024-01-01'),
  deletedAt: null,
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

export const createMockProject = (overrides = {}) => ({
  id: 'test-project-id',
  name: 'Test Project',
  projectNumber: 'PME001',
  status: 'active' as const,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  deleted_at: null,
  ...overrides,
})

export const createMockTask = (overrides = {}) => ({
  id: 'test-task-id',
  taskName: 'Test Task',
  taskTypeId: 'test-task-type-id',
  createdAt: new Date('2024-01-01'),
  deletedAt: null,
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

// Drizzle ORMのモックヘルパー
export const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

// React QueryやContextのモック
export const createMockQueryClient = () => ({
  // React Queryのモック実装
})

// テストユーティリティのテスト
describe('test-utils', () => {
  it('should export test utilities', () => {
    expect(typeof createMockEquipmentMaster).toBe('function')
    expect(typeof createMockProject).toBe('function')
    expect(typeof createMockTask).toBe('function')
  })
})

// エクスポート
export * from '@testing-library/react'
export { customRender as render }

// リエクスポート
export { render as originalRender } from '@testing-library/react'
