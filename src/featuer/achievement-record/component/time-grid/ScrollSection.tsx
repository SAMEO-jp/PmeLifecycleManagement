import { useRef, useEffect, useState } from "react";

interface ScrollSectionProps {
  className?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  isHovered?: boolean;
}

export function ScrollSection({
  className = "",
  scrollContainerRef,
  isHovered = false,
}: ScrollSectionProps) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);

  // ドラッグ中にカーソルスタイルを変更
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  // スクロール位置とサムの位置を同期
  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;

    const updateThumb = () => {
      const { scrollHeight, clientHeight, scrollTop } =
        container;

      if (scrollHeight <= clientHeight) {
        setThumbHeight(0);
        return;
      }

      // サムの高さを計算（スクロール可能領域に対する表示領域の割合）
      // 最小サイズを設定して、小さすぎるサムを防ぐ
      const ratio = clientHeight / scrollHeight;
      const thumbHeightPercent = Math.max(ratio * 100, 10); // 最小10%
      setThumbHeight(thumbHeightPercent);

      // サムの位置を計算
      const scrollPercent =
        scrollTop / (scrollHeight - clientHeight);
      const maxThumbTop = 100 - thumbHeightPercent;
      setThumbTop(scrollPercent * maxThumbTop);
    };

    updateThumb();
    container.addEventListener("scroll", updateThumb);

    // ResizeObserverでコンテンツサイズの変更を監視
    const resizeObserver = new ResizeObserver(() => {
      updateThumb();
    });

    resizeObserver.observe(container);
    if (container.firstElementChild) {
      resizeObserver.observe(container.firstElementChild);
    }

    return () => {
      container.removeEventListener("scroll", updateThumb);
      resizeObserver.disconnect();
    };
  }, [scrollContainerRef]);

  // ドラッグ処理
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault(); // デフォルト動作を防ぐ
      const container = scrollContainerRef?.current;
      if (!container) return;

      const trackRect = trackRef.current?.getBoundingClientRect();
      if (!trackRect) return;

      const mouseY = e.clientY - trackRect.top;
      const trackHeight = trackRect.height;

      // クリック位置からスクロール位置を計算
      const scrollPercent = Math.max(
        0,
        Math.min(1, mouseY / trackHeight),
      );
      const { scrollHeight, clientHeight } = container;
      container.scrollTop =
        scrollPercent * (scrollHeight - clientHeight);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // イベント伝播を止める
      setIsDragging(false);
    };

    // より確実なイベント処理
    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scrollContainerRef]);

  const handleTrackClick = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const container = scrollContainerRef?.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const trackRect = track.getBoundingClientRect();
    const mouseY = e.clientY - trackRect.top;
    const trackHeight = trackRect.height;

    const scrollPercent = Math.max(
      0,
      Math.min(1, mouseY / trackHeight),
    );
    const { scrollHeight, clientHeight } = container;
    const scrollTop = scrollPercent * (scrollHeight - clientHeight);
    // Use requestAnimationFrame to avoid direct mutation in render
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = scrollTop;
      }
    });
  };

  return (
    <div
      className={`bg-muted/30 flex items-center justify-center p-0 relative z-9999 ${className}`}
    >
      {/* カスタムスクロールバートラック - hover時に表示 */}
      <div
        ref={trackRef}
        className={`absolute inset-0 transition-opacity duration-200 cursor-pointer ${
          isHovered && thumbHeight > 0 ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleTrackClick}
      >
        {/* スクロールバーのつまみ */}
        <div
          ref={thumbRef}
          className="absolute left-0 right-0 bg-border hover:bg-foreground/20 rounded-full transition-colors cursor-grab active:cursor-grabbing mx-0.5"
          style={{
            height: `${thumbHeight}%`,
            top: `${thumbTop}%`,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
        />
      </div>
    </div>
  );
}
