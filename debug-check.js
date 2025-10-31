import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('環境変数が設定されていません')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkData() {
  try {
    console.log('=== プロジェクト確認 ===')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')

    if (projectsError) {
      console.error('プロジェクト取得エラー:', projectsError)
    } else {
      console.log('プロジェクト一覧:', projects)
    }

    console.log('\n=== タスク種類確認 ===')
    const { data: taskTypes, error: taskTypesError } = await supabase
      .from('task_types')
      .select('*')

    if (taskTypesError) {
      console.error('タスク種類取得エラー:', taskTypesError)
    } else {
      console.log('タスク種類一覧:', taskTypes)
    }

    console.log('\n=== タスク確認 ===')
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')

    if (tasksError) {
      console.error('タスク取得エラー:', tasksError)
    } else {
      console.log('タスク一覧:', tasks)
    }

    console.log('\n=== タスク・プロジェクト関連確認 ===')
    const { data: relations, error: relationsError } = await supabase
      .from('task_project_relations')
      .select('*')

    if (relationsError) {
      console.error('タスク・プロジェクト関連取得エラー:', relationsError)
    } else {
      console.log('タスク・プロジェクト関連一覧:', relations)
    }

  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

checkData()
