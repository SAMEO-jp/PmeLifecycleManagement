"use client"

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDisplayHeight, useHeaderHeight, useMainSidebarWidth } from "@/components/app/providers/display-size-context";
import { TimeGridTable } from "../component/time-grid";
import { Task, Achievement } from "../constants";

// サンプルデータ
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "要件定義",
    description: "システム要件の定義と整理",
    date: "2025-12-17",
    startTime: "09:00",
    endTime: "12:00",
    urgency: "high",
    progress: 75,
    project: "プロジェクトA",
    userId: "u001"
  },
  {
    id: "task-2",
    title: "設計レビュー",
    description: "設計書のレビュー",
    date: "2025-12-18",
    startTime: "14:00",
    endTime: "16:30",
    urgency: "medium",
    progress: 50,
    project: "プロジェクトB",
    userId: "u002"
  },
  {
    id: "task-3",
    title: "テスト実施",
    description: "単体テストの実行",
    date: "2025-12-19",
    startTime: "10:00",
    endTime: "15:00",
    urgency: "low",
    progress: 30,
    project: "プロジェクトA",
    userId: "u001"
  }
];

const sampleAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "コードレビュー完了",
    description: "プルリクエストのレビュー完了",
    date: "2025-12-17",
    startTime: "13:00",
    endTime: "14:00",
    userId: "u001"
  },
  {
    id: "ach-2",
    title: "バグ修正",
    description: "ログイン画面のバグ修正",
    date: "2025-12-18",
    startTime: "11:00",
    endTime: "12:30",
    userId: "u002"
  }
];


interface CenterSectionProps {
  isExpanded?: boolean;
}

export function CenterSection({ isExpanded = false }: CenterSectionProps) {
  const displayHeight = useDisplayHeight();
  const headerHeight = useHeaderHeight();
  const mainSidebarWidth = useMainSidebarWidth();

  const sectionHeight = displayHeight - headerHeight;
  // 左セクションが非表示の場合はより広い幅を使用
  const sectionWidth = isExpanded ? mainSidebarWidth * 4.5 : mainSidebarWidth * 3.5;

  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [achievements] = useState<Achievement[]>(sampleAchievements);
  const [viewMode] = useState<string>("week");

  // タスク更新ハンドラー
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  // イベント作成ハンドラー
  const handleCreateEvent = (date: string, startTime: string, endTime: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "新規タスク",
      description: "",
      date,
      startTime,
      endTime,
      urgency: "medium",
      progress: 0,
      project: "",
      userId: "u001"
    };
    setTasks(prev => [...prev, newTask]);
  };

  // タスク削除ハンドラー
  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // タスク複製ハンドラー
  const handleTaskDuplicate = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (コピー)`,
    };
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="bg-gray-100 border-2 border-gray-300"
        style={{
          width: `${sectionWidth}px`,
          height: `${sectionHeight}px`
        }}
      >
        <div className="h-full bg-background">
          <TimeGridTable
            viewMode={viewMode}
            tasks={tasks}
            achievements={achievements}
            onTaskClick={undefined}
            onTaskUpdate={handleTaskUpdate}
            onCreateEvent={handleCreateEvent}
            onTaskDelete={handleTaskDelete}
            onTaskDuplicate={handleTaskDuplicate}
          />
        </div>
      </div>
    </DndProvider>
  );
}
