import '@testing-library/jest-dom'

// コンソール警告を抑制（必要に応じて）
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// グローバルなテストユーティリティ
global.testUtils = {
  // カスタムマッチャーやヘルパー関数をここに追加
}
