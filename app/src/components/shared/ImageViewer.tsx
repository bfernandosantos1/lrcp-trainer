import { useState, useRef, useCallback } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function ImageViewer({ src, alt, className = '' }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.max(0.5, Math.min(4, s + delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - lastPos.current.x,
      y: e.clientY - lastPos.current.y,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden border border-monitor-border ${className}`}>
      <div
        ref={containerRef}
        className="ioc-viewer w-full h-full flex items-center justify-center"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        <button
          onClick={() => setScale(s => Math.min(4, s + 0.25))}
          className="bg-monitor-panel/80 text-vital-cyan rounded px-2 py-1 text-xs hover:bg-monitor-panel border border-monitor-border/50"
        >
          +
        </button>
        <button
          onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
          className="bg-monitor-panel/80 text-vital-cyan rounded px-2 py-1 text-xs hover:bg-monitor-panel border border-monitor-border/50"
        >
          -
        </button>
        <button
          onClick={resetView}
          className="bg-monitor-panel/80 text-vital-cyan rounded px-2 py-1 text-xs hover:bg-monitor-panel border border-monitor-border/50"
        >
          Reset
        </button>
      </div>
      <div className="absolute top-2 left-2 text-[10px] text-monitor-text/60 bg-monitor-panel/70 rounded px-2 py-0.5 font-clinical border border-monitor-border/30">
        {Math.round(scale * 100)}% | Scroll to zoom, drag to pan
      </div>
    </div>
  );
}
