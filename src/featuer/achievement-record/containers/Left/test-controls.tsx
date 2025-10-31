"use client"

import { useLeftSection } from './context'

export function LeftSectionTestControls() {
  const { leftSectionData, updateLeftSectionData, isVisible, toggleVisibility } = useLeftSection()

  const updateTitle = () => {
    updateLeftSectionData({
      title: "更新されたタイトル",
      subtitle: "テストで更新されたサブタイトル",
      content: (
        <div className="text-center">
          <p className="text-sm text-green-600 mb-2">✅ コンテンツが更新されました！</p>
          <p className="text-xs text-gray-500">コンテキスト経由でデータを変更中...</p>
        </div>
      )
    })
  }

  const resetData = () => {
    updateLeftSectionData({
      title: "実績サマリー",
      subtitle: "最新の実績情報",
      content: (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">データをリセットしました</p>
          <p className="text-xs text-gray-500">デフォルトのコンテンツに戻りました</p>
        </div>
      )
    })
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <h4 className="text-sm font-semibold mb-2">LeftSection テストコントロール</h4>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={updateTitle}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          データを更新
        </button>
        <button
          onClick={resetData}
          className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
        >
          リセット
        </button>
        <button
          onClick={toggleVisibility}
          className={`px-3 py-1 text-white text-xs rounded hover:opacity-80 ${
            isVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isVisible ? '非表示' : '表示'}
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <p>現在のタイトル: {leftSectionData.title}</p>
        <p>現在のサブタイトル: {leftSectionData.subtitle}</p>
      </div>
    </div>
  )
}
