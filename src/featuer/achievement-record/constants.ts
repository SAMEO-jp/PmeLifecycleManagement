// タイムグリッド設定
export const TIME_GRID_CONFIG = {
  HOUR_HEIGHT_PX: 60, // 1時間のピクセル高
  ALL_DAY_ROW_HEIGHT_PX: 40, // 終日イベント行の高さ
};

// タスクの型定義
export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  urgency: "high" | "medium" | "low";
  progress: number;
  project?: string;
  userId?: string;
}

// 実績の型定義
export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  userId: string;
  projectId?: string;
}

// ユーザーの型定義
export interface User {
  id: string;
  employee_no: string;
  name: string;
}

// 時間を分に変換するヘルパー関数
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Y座標から時間を計算するヘルパー関数
export function calculateTopPosition(startTime: string): number {
  const minutes = parseTimeToMinutes(startTime);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours * TIME_GRID_CONFIG.HOUR_HEIGHT_PX + (remainingMinutes / 60) * TIME_GRID_CONFIG.HOUR_HEIGHT_PX;
}

// イベントの高さを計算するヘルパー関数
export function calculateEventHeight(startTime: string, endTime: string): number {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  return (durationMinutes / 60) * TIME_GRID_CONFIG.HOUR_HEIGHT_PX;
}
