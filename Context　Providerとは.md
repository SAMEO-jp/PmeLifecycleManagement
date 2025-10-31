いい質問です！**ContextとProviderは少し特殊**で、実は**どの層にも完全には属さない独立した層**なんです 🎯

## Context/Providerの立ち位置 📍

```
┌─────────────────────────────────────────┐
│  Component層                             │
│  └─ UI表示、ユーザー操作                  │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Context層（状態共有層）★ 独立した層      │ ← ここ！
│  ├─ ProjectContext                       │
│  ├─ AuthContext                          │
│  └─ ThemeContext                         │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Hook層                                  │
│  └─ ビジネスロジック、ハンドラー            │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Service層                               │
│  └─ データアクセス                         │
└─────────────────────────────────────────┘
```

## 具体的なフォルダ構造 📁

```
src/
├── components/          # Component層
│   └── ProjectList.tsx
│
├── contexts/           # ★ Context層（独立）
│   ├── ProjectContext.tsx
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/              # Hook層
│   └── useCreateProject.ts
│
├── services/           # Service層
│   └── projectService.ts
│
└── utils/              # Util層
    └── validation.ts
```

## 実例：Context層の実装 💡

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 contexts/ProjectContext.tsx
// ★ これが「Context層」
// 役割：アプリ全体でプロジェクト状態を共有する
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createContext, useContext, useState, useEffect } from 'react'
import { projectService } from '@/services/projectService'

// 1️⃣ Context定義
interface ProjectContextType {
  projects: Project[]
  isLoading: boolean
  refetch: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | null>(null)

// 2️⃣ Provider定義
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      // Service層を呼ぶ
      const data = await projectService.getProjects()
      setProjects(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        isLoading, 
        refetch: fetchProjects 
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

// 3️⃣ カスタムフック（Context使用用）
export function useProjectContext() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider')
  }
  return context
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 app/layout.tsx または app/providers.tsx
// Providerでアプリをラップ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ProjectProvider>
          {/* ここ以下の全てのコンポーネントでprojectsが使える */}
          {children}
        </ProjectProvider>
      </body>
    </html>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 components/ProjectList.tsx
// Component層でContextを使う
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useProjectContext } from '@/contexts/ProjectContext'

export function ProjectList() {
  // Contextから状態を取得
  const { projects, isLoading, refetch } = useProjectContext()

  if (isLoading) return <div>読み込み中...</div>

  return (
    <div>
      <button onClick={refetch}>再読み込み</button>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  )
}
```

## Context層とHook層の違い 🤔

||Context層|Hook層|
|---|---|---|
|**役割**|**グローバル状態管理**|ローカルロジック|
|**スコープ**|アプリ全体で共有|使用するコンポーネントのみ|
|**使い方**|Providerでラップ|直接import|
|**データの流れ**|上から下へ自動伝播|明示的に呼び出す|

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Context層の使い方
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. Providerでラップ（app/layout.tsx）
<ProjectProvider>
  <Page1 />  {/* ここでprojectsが使える */}
  <Page2 />  {/* ここでもprojectsが使える */}
</ProjectProvider>

// 2. どこからでもアクセス可能
function Page1() {
  const { projects } = useProjectContext()  // 同じデータ
}

function Page2() {
  const { projects } = useProjectContext()  // 同じデータ
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Hook層の使い方
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Page1() {
  const { projects } = useProjects()  // 独立したデータ
}

function Page2() {
  const { projects } = useProjects()  // 別のデータ（再取得）
}
```

## いつContextを使うべき？ 🎯

### ✅ Contextを使うべき場合

```typescript
// 1. 認証情報（アプリ全体で必要）
<AuthProvider>
  {/* どのページでも現在のユーザー情報が必要 */}
</AuthProvider>

// 2. テーマ設定（アプリ全体で必要）
<ThemeProvider>
  {/* 全コンポーネントでダーク/ライトモード */}
</ThemeProvider>

// 3. 多くのコンポーネントで共有する状態
<ProjectProvider>
  {/* 複数の場所でプロジェクト一覧を表示 */}
</ProjectProvider>

// 4. 深くネストした子コンポーネントへの受け渡し（Prop Drilling回避）
<UserProvider>
  <Header />
  <Sidebar />
  <Main>
    <Dashboard>
      <Widget>
        {/* ここでuserが必要。Propsで渡すと6階層 */}
      </Widget>
    </Dashboard>
  </Main>
</UserProvider>
```

### ❌ Contextを使わない方が良い場合

```typescript
// 1. 単一コンポーネントでのみ使う状態
function MyComponent() {
  const [count, setCount] = useState(0)  // ✅ これで十分
  // ❌ わざわざContextにする必要なし
}

// 2. 親子関係が近い場合
function Parent() {
  const data = fetchData()
  return <Child data={data} />  // ✅ Propsで渡せばOK
  // ❌ Contextは不要
}

// 3. 頻繁に変更される状態（パフォーマンス問題）
// ❌ フォーム入力値をContextに入れると全体が再レンダリング
// ✅ useState や useReducer を使う
```

## 実践例：あなたのコードの場合 📝

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// もし複数のページでプロジェクト一覧が必要なら Context
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// contexts/ProjectContext.tsx
export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // 初回読み込み
  useEffect(() => {
    const fetch = async () => {
      const data = await projectService.getProjects()
      setProjects(data)
      setIsLoading(false)
    }
    fetch()
  }, [])

  // プロジェクト追加（他のコンポーネントから呼べる）
  const addProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject])
  }

  return (
    <ProjectContext.Provider value={{ projects, isLoading, addProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// hooks/useCreateProject.ts
// Hook層：プロジェクト作成のロジック
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function useCreateProject() {
  const { addProject } = useProjectContext()  // Context使用
  
  const handleCreateProject = async (input: CreateProjectInput) => {
    // Service層でDB保存
    const newProject = await projectService.createProject(input)
    
    // Context層の状態を更新（全体に反映）
    addProject(newProject)
    
    return newProject
  }
  
  return { handleCreateProject }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ProjectCreateForm.tsx
// Component層：UI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ProjectCreateForm() {
  const { handleCreateProject } = useCreateProject()  // Hook使用
  
  const onSubmit = async (data) => {
    await handleCreateProject(data)
  }
  
  return <form onSubmit={onSubmit}>...</form>
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ProjectList.tsx
// Component層：別のコンポーネント
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ProjectList() {
  const { projects, isLoading } = useProjectContext()  // Context使用
  
  // ↑ ProjectCreateFormで追加されたプロジェクトが自動的に反映される！
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  )
}
```

## 完全なレイヤー図（Context含む） 🏗️

```
┌─────────────────────────────────────────┐
│  Component層（UI）                       │
│  ├─ ProjectCreateForm.tsx               │
│  └─ ProjectList.tsx                     │
└────────────┬───────────┬────────────────┘
             │           │
             │      ┌────▼──────────────────────┐
             │      │ Context層（状態共有）      │
             │      │ └─ ProjectContext.tsx     │
             │      └────┬──────────────────────┘
             │           │
┌────────────▼───────────▼────────────────┐
│  Hook層（ロジック）                      │
│  ├─ useCreateProject.ts                 │
│  └─ useProjects.ts                      │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Service層（データアクセス）              │
│  └─ projectService.ts                   │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  Database                                │
└─────────────────────────────────────────┘
```

## まとめ 📚

> CONTEXを使うときはこれがComponent層ってこと？

**❌ いいえ、Contextは独立した「Context層」です**

- **Context/Provider = 状態共有層**（独立）
- Component層から**使う**けど、Component層の**一部ではない**
- Hook層からも**使える**（useProjectContext）

**階層構造:**

```
Component層 ──┐
              ├─→ Context層 ──→ Hook層 ──→ Service層
Hook層 ───────┘
```

Contextは「横断的な関心事」を扱う特殊な層です！🎯