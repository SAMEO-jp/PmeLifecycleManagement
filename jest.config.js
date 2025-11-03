import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Next.jsアプリのパスを指定
  dir: './',
})

// Jest設定を追加
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // パスエイリアスの設定（より具体的なものが先）
    '^@/db$': '<rootDir>/db/index',
    '^@/db/(.*)$': '<rootDir>/db/$1',
    '^@/(.*)$': '<rootDir>/src/$1',

    // CSSモジュールのモック
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // CSSファイルのモック
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // 画像ファイルのモック
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
}

// createJestConfigでNext.jsの設定をマージ
export default createJestConfig(customJestConfig)
