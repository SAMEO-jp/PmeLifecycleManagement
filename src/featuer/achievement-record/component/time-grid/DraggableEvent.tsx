import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Task, calculateEventHeight } from "../../constants";
import { Trash2, Copy } from "lucide-react";
import { useState } from "react";

interface DraggableEventProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (taskId: string) => void;
  onDuplicate: (task: Task) => void;
}

export function DraggableEvent({
  task,
  _dayIndex,
  isSelected,
  onClick,
  _onResize,
  onDelete,
  onDuplicate,
  _onChangeUrgency,
  _onChangeProgress,
  _onChangeProject,
}: DraggableEventProps) {
  const [showActions, setShowActions] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EVENT",
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getUrgencyColor = (urgency: "high" | "medium" | "low") => {
    switch (urgency) {
      case "high":
        return "bg-red-100 border-red-200 text-red-900";
      case "medium":
        return "bg-blue-100 border-blue-200 text-blue-900";
      case "low":
        return "bg-green-100 border-green-200 text-green-900";
    }
  };

  const eventHeight = calculateEventHeight(task.startTime, task.endTime);

  return (
    <div
      ref={drag}
      className={`
        absolute left-0 right-0 bg-white border rounded-md p-2 shadow-sm cursor-pointer
        hover:shadow-md transition-all duration-200 z-20
        ${isSelected ? "ring-2 ring-primary" : ""}
        ${isDragging ? "opacity-50" : ""}
        ${getUrgencyColor(task.urgency)}
      `}
      style={{
        height: `${Math.max(eventHeight - 4, 30)}px`, // 最小高さを設定
        top: "2px",
      }}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="font-medium text-sm truncate">{task.title}</div>
        <div className="text-xs opacity-75 truncate">
          {task.startTime} - {task.endTime}
        </div>
        {task.project && (
          <div className="text-xs opacity-75 truncate">{task.project}</div>
        )}

        {/* アクションボタン */}
        {showActions && (
          <div className="absolute top-1 right-1 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(task);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 hover:bg-white/20 text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* 進捗バー */}
        <div className="absolute bottom-1 left-1 right-1">
          <div className="w-full bg-black/20 rounded-full h-1">
            <div
              className="bg-current rounded-full h-1 transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
