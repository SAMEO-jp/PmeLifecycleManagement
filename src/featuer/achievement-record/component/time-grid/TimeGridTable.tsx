import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Task, Achievement, User, TIME_GRID_CONFIG, calculateTopPosition, parseTimeToMinutes } from "../../constants";
import { DraggableEvent } from "./DraggableEvent";
import { DroppableTimeSlot } from "./DroppableTimeSlot";
import { ScrollSection } from "./ScrollSection";
import { useState, useRef } from "react";

interface TimeGridTableProps {
  tasks: Task[];
  achievements: Achievement[];
  onTaskClick?: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onCreateEvent?: (date: string, startTime: string, endTime: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskDuplicate?: (task: Task) => void;
  selectedTaskId?: string;
}

interface SelectionRange {
  dayIndex: number;
  startY: number;
  endY: number;
  isActive: boolean;
}

interface TimeSlot {
  hour: string;
}

interface DayColumn {
  date: string;
  day: string;
  dayOfWeek: string;
}

const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}時`,
}));

const days: DayColumn[] = [
  { date: "12/17", day: "日", dayOfWeek: "日" },
  { date: "12/18", day: "月", dayOfWeek: "" },
  { date: "12/19", day: "火", dayOfWeek: "火" },
  { date: "12/20", day: "水", dayOfWeek: "水" },
  { date: "12/21", day: "木", dayOfWeek: "木" },
  { date: "12/22", day: "金", dayOfWeek: "金" },
  { date: "12/23", day: "土", dayOfWeek: "土" },
];


// ヘルパー関数：日付とdayIndexをマッチング（実績データ用）
const getAchievementsForDay = (dayIndex: number, allAchievements: Achievement[]) => {
  const dayDate = days[dayIndex].date;
  const [month, day] = dayDate.split("/");

  const filteredAchievements = allAchievements.filter((achievement) => {
    const achievementDate = new Date(achievement.date);
    return (
      achievementDate.getMonth() + 1 === parseInt(month) &&
      achievementDate.getDate() === parseInt(day)
    );
  });

  return filteredAchievements;
};


// イベントのレイアウト情報インターフェース
interface EventLayout {
  task: Task;
  column: number;      // このイベントが表示される列（0から始まる）
  totalColumns: number; // 重複するイベント群の総列数
}

// 2つのイベントが時間的に重複しているかチェック
const eventsOverlap = (event1: Task, event2: Task): boolean => {
  const start1 = parseTimeToMinutes(event1.startTime);
  const end1 = parseTimeToMinutes(event1.endTime);
  const start2 = parseTimeToMinutes(event2.startTime);
  const end2 = parseTimeToMinutes(event2.endTime);

  return start1 < end2 && start2 < end1;
};

// 重複するイベントのレイアウトを計算
const calculateEventLayouts = (tasks: Task[]): EventLayout[] => {
  if (tasks.length === 0) return [];

  // 開始時刻でソート
  const sortedTasks = [...tasks].sort((a, b) => {
    const timeA = parseTimeToMinutes(a.startTime);
    const timeB = parseTimeToMinutes(b.startTime);
    return timeA - timeB;
  });

  const layouts: EventLayout[] = [];
  const columns: Task[][] = []; // 各列に配置されたイベントのリスト

  sortedTasks.forEach((task) => {
    // このイベントを配置できる列を探す
    let placed = false;

    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const column = columns[colIndex];
      // この列の最後のイベントと重複しているかチェック
      const lastEventInColumn = column[column.length - 1];

      if (!eventsOverlap(task, lastEventInColumn)) {
        // 重複していないので、この列に配置できる
        column.push(task);
        placed = true;
        break;
      }
    }

    if (!placed) {
      // 既存の列には配置できないので、新しい列を作成
      columns.push([task]);
    }
  });

  // 各イベントに対して、列番号と総列数を計算
  sortedTasks.forEach((task) => {
    let columnIndex = -1;

    // このイベントがどの列にあるか探す
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].includes(task)) {
        columnIndex = i;
        break;
      }
    }

    // このイベントと重複する他のイベントを見つけて、総列数を計算
    const overlappingEvents = sortedTasks.filter((other) =>
      eventsOverlap(task, other)
    );

    // 重複するイベントの中で使用されている最大列数を計算
    let maxColumns = 1;
    overlappingEvents.forEach((overlapping) => {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].includes(overlapping)) {
          maxColumns = Math.max(maxColumns, i + 1);
        }
      }
    });

    layouts.push({
      task,
      column: columnIndex,
      totalColumns: maxColumns,
    });
  });

  return layouts;
};

export function TimeGridTable({ tasks, achievements, onTaskClick, onTaskUpdate, onCreateEvent, onTaskDelete, onTaskDuplicate, selectedTaskId, _viewMode }: TimeGridTableProps) {
  // ドロップ時のハンドラー
  const handleDrop = (dayIndex: number, timeInMinutes: number, taskId: string) => {
    const [month, day] = days[dayIndex].date.split("/");
    const newDate = `2025-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const newStartTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    // 元のタスクの長さを計算
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const startMinutes = parseTimeToMinutes(task.startTime);
    const endMinutes = parseTimeToMinutes(task.endTime);
    const duration = endMinutes - startMinutes;

    const newEndMinutes = timeInMinutes + duration;
    const newEndHours = Math.floor(newEndMinutes / 60);
    const newEndMins = newEndMinutes % 60;
    const newEndTime = `${String(newEndHours).padStart(2, "0")}:${String(newEndMins).padStart(2, "0")}`;

    onTaskUpdate(taskId, {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime
    });
  };

  // リサイズハンドラー
  const handleResize = (taskId: string, newStartTime: string, newEndTime: string) => {
    onTaskUpdate(taskId, { startTime: newStartTime, endTime: newEndTime });
  };

  // タスク削除ハンドラー
  const handleDelete = (taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  // タスク複製ハンドラー
  const handleDuplicate = (task: Task) => {
    if (onTaskDuplicate) {
      onTaskDuplicate(task);
    }
  };

  // 緊急度変更ハンドラー
  const handleChangeUrgency = (taskId: string, urgency: "high" | "medium" | "low") => {
    onTaskUpdate(taskId, { urgency });
  };

  // 進捗度変更ハンドラー
  const handleChangeProgress = (taskId: string, progress: number) => {
    onTaskUpdate(taskId, { progress });
  };

  // プロジェクト変更ハンドラー
  const handleChangeProject = (taskId: string, project: string) => {
    onTaskUpdate(taskId, { project });
  };

  // 選択範囲の管理
  const dayColumnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectionRange, setSelectionRange] = useState<SelectionRange | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollbarHovered, setIsScrollbarHovered] = useState(false);

  // マウスダウンで選択開始
  const handleMouseDown = (e: React.MouseEvent, dayIndex: number) => {
    // イベントカードのクリックは無視
    if ((e.target as HTMLElement).closest('.event-card')) {
      return;
    }

    const column = dayColumnRefs.current[dayIndex];
    if (!column) return;

    const rect = column.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // 15分単位にスナップ
    const snappedY = Math.round(y / (TIME_GRID_CONFIG.HOUR_HEIGHT_PX / 4)) * (TIME_GRID_CONFIG.HOUR_HEIGHT_PX / 4);

    setSelectionRange({
      dayIndex,
      startY: snappedY,
      endY: snappedY,
      isActive: true,
    });
  };

  // マウス移動で選択範囲更新
  const handleMouseMove = (e: React.MouseEvent, dayIndex: number) => {
    if (!selectionRange || !selectionRange.isActive || selectionRange.dayIndex !== dayIndex) {
      return;
    }

    const column = dayColumnRefs.current[dayIndex];
    if (!column) return;

    const rect = column.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // 15分単位にスナップ
    const snappedY = Math.round(y / (TIME_GRID_CONFIG.HOUR_HEIGHT_PX / 4)) * (TIME_GRID_CONFIG.HOUR_HEIGHT_PX / 4);

    setSelectionRange(prev => prev ? { ...prev, endY: snappedY } : null);
  };

  // マウスアプで選択終了
  const handleMouseUp = () => {
    if (!selectionRange || !onCreateEvent) {
      setSelectionRange(null);
      return;
    }

    const { dayIndex, startY, endY } = selectionRange;

    // 最小30分の選択が必要
    const minHeight = TIME_GRID_CONFIG.HOUR_HEIGHT_PX / 2;
    if (Math.abs(endY - startY) < minHeight) {
      setSelectionRange(null);
      return;
    }

    // 開始と終了を正しい順序に
    const actualStartY = Math.min(startY, endY);
    const actualEndY = Math.max(startY, endY);

    // Y座標から時間を計算
    const startMinutes = Math.floor((actualStartY / TIME_GRID_CONFIG.HOUR_HEIGHT_PX) * 60);
    const endMinutes = Math.ceil((actualEndY / TIME_GRID_CONFIG.HOUR_HEIGHT_PX) * 60);

    const startHours = Math.floor(startMinutes / 60);
    const startMins = startMinutes % 60;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;

    const startTime = `${String(startHours).padStart(2, '0')}:${String(startMins).padStart(2, '0')}`;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    const [month, day] = days[dayIndex].date.split('/');
    const date = `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    onCreateEvent(date, startTime, endTime);
    setSelectionRange(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header section with date and all-day events */}
      <div className="bg-white pr-2">
        {/* Date header row */}
        <div className="flex border-b shadow-sm">
          <div className="w-12 shrink-0 border-r flex items-center justify-center p-2">
            <ToggleGroup type="single" defaultValue="week" className="flex flex-col gap-1">
              <ToggleGroupItem value="day" size="sm" className="h-7 px-2">
              </ToggleGroupItem>
              <ToggleGroupItem value="week" size="sm" className="h-7 px-2">
              </ToggleGroupItem>
              <ToggleGroupItem value="month" size="sm" className="h-7 px-2">
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {days.map((day, index) => (
            <div
              key={index}
              className="flex-1 border-r p-3 text-center min-w-[100px]"
            >
              <div className="text-muted-foreground">{day.date}</div>
              <div
                className={
                  day.dayOfWeek === "土"
                    ? "text-blue-600"
                    : day.dayOfWeek === "日"
                    ? "text-red-600"
                    : "text-foreground"
                }
              >
                {day.day}
              </div>
            </div>
          ))}
        </div>

        {/* All-day events row */}
        <div className="flex border-b shadow-sm">
          <div className="w-12 shrink-0 border-r bg-muted/30 flex items-center justify-center p-2">
            <span className="text-muted-foreground text-xs">終日</span>
          </div>
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="flex-1 border-r p-2 min-w-[100px] hover:bg-muted/50 cursor-pointer transition-colors relative"
              style={{ minHeight: `${TIME_GRID_CONFIG.ALL_DAY_ROW_HEIGHT_PX}px` }}
            >
              {/* Sample all-day events */}
              {dayIndex === 1 && (
                <div className="bg-amber-100 border border-amber-200 rounded-md px-2 py-1 mb-1">
                  <div className="text-amber-900 text-xs">祝日</div>
                </div>
              )}
              {dayIndex === 4 && (
                <div className="bg-indigo-100 border border-indigo-200 rounded-md px-2 py-1 mb-1">
                  <div className="text-indigo-900 text-xs">出張</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time grid block - スクロール可能エリアとスクロールバーを分離 */}
      <div className="border-t bg-background flex-1 relative overflow-hidden">
        {/* スクロールコンテナ - 右側にスクロールバーのスペースを確保 */}
        <div
          className="absolute inset-y-0 left-0 right-2 overflow-auto hide-scrollbar"
          ref={scrollContainerRef}
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          <div className="flex">
            <div className="w-12 border-r bg-muted/30">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="border-b flex items-start justify-start px-2 text-muted-foreground pt-0.5 relative"
                  style={{ height: `${TIME_GRID_CONFIG.HOUR_HEIGHT_PX}px` }}
                >
                  <span className="text-sm">{index}:00</span>
                  {/* 30-minute mark */}
                  <div className="absolute top-1/2 left-0 right-0 border-t border-border/50"></div>
                </div>
              ))}
            </div>

            {days.map((day, dayIndex) => {
              const dayAchievements = getAchievementsForDay(dayIndex, achievements);
              // AchievementをTaskとして扱えるように変換（urgencyプロパティを追加）
              const dayTasks: Task[] = dayAchievements.map(achievement => ({
                ...achievement,
                urgency: "low" as const, // 実績には緊急度がないのでデフォルト値
              }));
              const eventLayouts = calculateEventLayouts(dayTasks);

              return (
                <div
                  key={dayIndex}
                  ref={(el) => (dayColumnRefs.current[dayIndex] = el)}
                  className="flex-1 border-r relative min-w-[100px]"
                  onMouseDown={(e) => handleMouseDown(e, dayIndex)}
                  onMouseMove={(e) => handleMouseMove(e, dayIndex)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {timeSlots.map((_, slotIndex) => (
                    <DroppableTimeSlot
                      key={slotIndex}
                      dayIndex={dayIndex}
                      slotIndex={slotIndex}
                      onDrop={handleDrop}
                    />
                  ))}

                  {/* タスクを絶対配置で表示 */}
                  {eventLayouts.map((layout) => {
                    const topPosition = calculateTopPosition(layout.task.startTime);
                    const isSelected = layout.task.id === selectedTaskId;

                    return (
                      <div
                        key={layout.task.id}
                        className="event-card"
                        style={{
                          position: 'absolute',
                          top: `${topPosition}px`,
                          left: `${(layout.column / layout.totalColumns) * 100}%`,
                          right: `${((layout.totalColumns - layout.column - 1) / layout.totalColumns) * 100}%`,
                          zIndex: 10,
                        }}
                      >
                        <DraggableEvent
                          task={layout.task}
                          dayIndex={dayIndex}
                          isSelected={isSelected}
                          onClick={() => onTaskClick?.(layout.task)}
                          onResize={handleResize}
                          onDelete={handleDelete}
                          onDuplicate={handleDuplicate}
                          onChangeUrgency={handleChangeUrgency}
                          onChangeProgress={handleChangeProgress}
                          onChangeProject={handleChangeProject}
                        />
                      </div>
                    );
                  })}

                  {/* 選択範囲の表示 */}
                  {selectionRange && selectionRange.isActive && selectionRange.dayIndex === dayIndex && (
                    <div
                      className="absolute left-0 right-0 bg-primary/20 border-2 border-primary pointer-events-none rounded-sm"
                      style={{
                        top: `${Math.min(selectionRange.startY, selectionRange.endY)}px`,
                        height: `${Math.abs(selectionRange.endY - selectionRange.startY)}px`,
                        zIndex: 5,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* カスタムスクロールバー - hover時に表示 */}
        <div
          className="absolute right-0 inset-y-0 w-4 z-9999"
          onMouseEnter={() => setIsScrollbarHovered(true)}
          onMouseLeave={() => setIsScrollbarHovered(false)}
        >
          <ScrollSection
            className="w-full h-full"
            scrollContainerRef={scrollContainerRef}
            isHovered={isScrollbarHovered}
          />
        </div>
      </div>
    </div>
  );
}
