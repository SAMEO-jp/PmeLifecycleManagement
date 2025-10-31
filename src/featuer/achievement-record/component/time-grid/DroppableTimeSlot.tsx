import { useDrop } from "react-dnd";
import { TIME_GRID_CONFIG } from "../../constants";
import { useRef } from "react";

interface DroppableTimeSlotProps {
  dayIndex: number;
  slotIndex: number;
  onDrop: (dayIndex: number, timeInMinutes: number, taskId: string) => void;
  children?: React.ReactNode;
}

export function DroppableTimeSlot({
  dayIndex,
  slotIndex,
  onDrop,
  children
}: DroppableTimeSlotProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "EVENT",
    drop: (item: { task: { id: string } }, monitor) => {
      const offset = monitor.getClientOffset();

      if (offset && dropRef.current) {
        const rect = dropRef.current.getBoundingClientRect();
        const relativeY = offset.y - rect.top;

        // スロット内の相対位置から時間を計算
        const slotStartMinutes = slotIndex * 60;
        const additionalMinutes = Math.round((relativeY / TIME_GRID_CONFIG.HOUR_HEIGHT_PX) * 60);
        const totalMinutes = slotStartMinutes + additionalMinutes;

        // 15分単位にスナップ
        const snappedMinutes = Math.round(totalMinutes / 15) * 15;

        onDrop(dayIndex, snappedMinutes, item.task.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [dayIndex, slotIndex, onDrop]);

  return (
    <div
      ref={(node) => {
        dropRef.current = node;
        drop(node);
      }}
      className={`border-b hover:bg-muted/50 cursor-pointer relative transition-colors ${
        isOver ? "bg-primary/10" : ""
      }`}
      style={{ height: `${TIME_GRID_CONFIG.HOUR_HEIGHT_PX}px` }}
    >
      {/* 30-minute mark */}
      <div className="absolute top-1/2 left-0 right-0 border-t border-border/50"></div>
      {children}
    </div>
  );
}
