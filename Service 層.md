Service = **層（レイヤー）** または **グループ**

- その中に複数の「メソッド」「API関数」「データアクセス関数」がある

```typescript
// 📁 services/projectService.ts
// ↑ これが「Service層」または「Serviceグループ」

export const projectService = {
  // ↓ 以下は全部「メソッド」「データアクセス関数」
  
  createProject: async (data) => { /* ... */ },
  getProjects: async () => { /* ... */ },
  updateProject: async (id, data) => { /* ... */ },
  deleteProject: async (id) => { /* ... */ },
  getProjectById: async (id) => { /* ... */ },
}
```

## 具体的なイメージ 🏗️

```
services/ ← これが「Service層」という大きなグループ
├── projectService.ts ← プロジェクト関連のデータアクセス
│   ├── createProject()    ← メソッド
│   ├── getProjects()      ← メソッド
│   ├── updateProject()    ← メソッド
│   └── deleteProject()    ← メソッド
│
├── taskService.ts ← タスク関連のデータアクセス
│   ├── createTask()       ← メソッド
│   ├── getTasks()         ← メソッド
│   └── updateTask()       ← メソッド
│
└── userService.ts ← ユーザー関連のデータアクセス
    ├── getUser()          ← メソッド
    ├── updateUser()       ← メソッド
    └── getUserProjects()  ← メソッド
```

## 同じ構造が他の層にも適用される 📚

```
hooks/ ← これが「Hook層」という大きなグループ
├── useCreateProject.ts
│   └── handleCreateProject()  ← ハンドラー
│
├── useProjects.ts
│   ├── handleRefresh()        ← ハンドラー
│   └── handleFilter()         ← ハンドラー
│
└── useJoinProject.ts
    └── handleJoinProject()    ← ハンドラー

utils/ ← これが「Util層」という大きなグループ
├── validation.ts
│   ├── validateEmail()        ← ヘルパー関数
│   └── validateProjectName()  ← ヘルパー関数
│
└── format.ts
    ├── formatDate()           ← ヘルパー関数
    └── formatCurrency()       ← ヘルパー関数

components/ ← これが「Component層」という大きなグループ
├── ProjectCreateForm.tsx
│   └── onSubmit()             ← イベントハンドラー
│
└── ProjectList.tsx
    ├── onRefresh()            ← イベントハンドラー
    └── onSelectProject()      ← イベントハンドラー
```

## もう少し詳しく：Service層の実例 💡

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 services/projectService.ts
// 「projectService」というグループの中に
// データベース操作の「メソッド」を集約
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const projectService = {
  // プロジェクト作成
  createProject: async (input: CreateProjectInput) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(input)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // プロジェクト一覧取得
  getProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // プロジェクト更新
  updateProject: async (id: string, input: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(input)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // プロジェクト削除（論理削除）
  deleteProject: async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  },

  // 単一プロジェクト取得
  getProjectById: async (id: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // ルートタスク取得
  getProjectRootTask: async (projectId: string) => {
    const { data, error } = await supabase
      .from('task_project_relations')
      .select(`
        task_id,
        tasks (*)
      `)
      .eq('project_id', projectId)
      .eq('relation_type', 'main')
      .single()
    
    if (error) throw error
    return data
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 使い方（Hook層から呼び出す）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// hooks/useProjects.ts
export function useProjects() {
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    const fetch = async () => {
      // projectService の getProjects メソッドを呼ぶ
      const data = await projectService.getProjects()
      setProjects(data)
    }
    fetch()
  }, [])
  
  return { projects }
}
```

## 別の例：複数のServiceファイル 📂

大規模なアプリでは、関連ごとにServiceを分ける：

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 services/projectService.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const projectService = {
  createProject: async () => { /* ... */ },
  getProjects: async () => { /* ... */ },
  updateProject: async () => { /* ... */ },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 services/taskService.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const taskService = {
  createTask: async () => { /* ... */ },
  getTasks: async () => { /* ... */ },
  assignUser: async () => { /* ... */ },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 services/userService.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const userService = {
  getUser: async () => { /* ... */ },
  updateUser: async () => { /* ... */ },
  getUserProjects: async () => { /* ... */ },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 services/index.ts（まとめてエクスポート）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export { projectService } from './projectService'
export { taskService } from './taskService'
export { userService } from './userService'

// こうすると他のファイルから使いやすい：
// import { projectService, taskService } from '@/services'
```

## 用語の整理（最終版） 📖

|用語|意味|例|
|---|---|---|
|**Service層**|データアクセスを担当する**レイヤー全体**|`services/`フォルダ全体|
|**projectService**|プロジェクト関連のデータアクセスを集めた**グループ**|1つのファイル|
|**createProject()**|実際のデータベース操作を行う**メソッド/関数**|グループ内の1つの関数|

```
Service層（レイヤー）
  └─ projectService（グループ）
       ├─ createProject()（メソッド）
       ├─ getProjects()（メソッド）
       └─ updateProject()（メソッド）
```

## まとめ 🎯

> サービスは、完全に層とかグループみたいな感じで、層の中にいろんな「メソッド」「API関数」「データアクセス関数」がある感じかな？

**YES! その理解で完璧です！**

- **Service = 層/グループ** ← 箱のイメージ
- **メソッド = 中身の関数** ← 箱の中に入っている道具

同じ構造が他の層にも当てはまります：

- **Hook層** = 層、その中に複数のカスタムフックがあり、各フックの中にハンドラーがある
- **Util層** = 層、その中に複数のヘルパー関数がある
- **Component層** = 層、その中に複数のコンポーネントがある

完璧に理解できてますね！🎉