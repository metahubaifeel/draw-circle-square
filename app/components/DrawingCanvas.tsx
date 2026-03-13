'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Point, DetectionResult } from '../utils/shapeDetection';
import { TranslationType } from '../i18n/config';

interface DrawingCanvasProps {
  width: number;
  height: number;
  side: 'left' | 'right';
  isActive: boolean;
  onDrawingComplete: (points: Point[]) => void;
  detectionResult?: DetectionResult;
  label: string;
  t: TranslationType;
}

export default function DrawingCanvas({
  width,
  height,
  side,
  isActive,
  onDrawingComplete,
  detectionResult,
  label,
  t
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const pointsRef = useRef<Point[]>([]);

  // 键盘控制状态（仅左侧画布）
  const keysPressed = useRef<Set<string>>(new Set());
  const keyboardPos = useRef<Point>({ x: width / 2, y: height / 2 });
  const animationFrameRef = useRef<number | null>(null);

  // 获取 canvas 上下文
  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  // 清空画布
  const clearCanvas = useCallback(() => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [getContext]);

  // 绘制所有点
  const drawPoints = useCallback((pointsToDraw: Point[]) => {
    const ctx = getContext();
    if (!ctx || pointsToDraw.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y);

    for (let i = 1; i < pointsToDraw.length; i++) {
      ctx.lineTo(pointsToDraw[i].x, pointsToDraw[i].y);
    }

    ctx.strokeStyle = side === 'left' ? '#3b82f6' : '#10b981';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [getContext, side]);

  // 开始绘制
  const startDrawing = useCallback((point: Point) => {
    if (!isActive) return;

    setIsDrawing(true);
    const newPoints = [point];
    setPoints(newPoints);
    pointsRef.current = newPoints;
    clearCanvas();
  }, [isActive, clearCanvas]);

  // 继续绘制
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !isActive) return;

    const newPoints = [...pointsRef.current, point];
    setPoints(newPoints);
    pointsRef.current = newPoints;
    drawPoints(newPoints);
  }, [isDrawing, isActive, drawPoints]);

  // 结束绘制
  const endDrawing = useCallback(() => {
    if (!isDrawing) return;

    setIsDrawing(false);
    onDrawingComplete(pointsRef.current);
  }, [isDrawing, onDrawingComplete]);

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    startDrawing({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [startDrawing]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    continueDrawing({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [continueDrawing]);

  const handleMouseUp = useCallback(() => {
    endDrawing();
  }, [endDrawing]);

  const handleMouseLeave = useCallback(() => {
    endDrawing();
  }, [endDrawing]);

  // 触摸事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    startDrawing({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  }, [startDrawing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    continueDrawing({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  }, [continueDrawing]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    endDrawing();
  }, [endDrawing]);

  // 键盘控制（仅左侧画布 - 画方）
  useEffect(() => {
    if (side !== 'left') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      keysPressed.current.add(e.key.toLowerCase());

      // 开始新的绘制
      if (!isDrawing && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        setIsDrawing(true);
        keyboardPos.current = { x: width / 2, y: height / 2 };
        const newPoints = [{ ...keyboardPos.current }];
        setPoints(newPoints);
        pointsRef.current = newPoints;
        clearCanvas();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());

      // 检查是否所有方向键都松开了
      const hasDirectionKey = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']
        .some(key => keysPressed.current.has(key));

      if (!hasDirectionKey && isDrawing) {
        endDrawing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [side, isActive, isDrawing, width, height, clearCanvas, endDrawing]);

  // 键盘移动动画循环
  useEffect(() => {
    if (side !== 'left') return;

    const moveSpeed = 3;

    const gameLoop = () => {
      if (isDrawing && isActive) {
        let moved = false;

        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
          keyboardPos.current.y -= moveSpeed;
          moved = true;
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
          keyboardPos.current.y += moveSpeed;
          moved = true;
        }
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
          keyboardPos.current.x -= moveSpeed;
          moved = true;
        }
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
          keyboardPos.current.x += moveSpeed;
          moved = true;
        }

        // 边界检查
        keyboardPos.current.x = Math.max(10, Math.min(width - 10, keyboardPos.current.x));
        keyboardPos.current.y = Math.max(10, Math.min(height - 10, keyboardPos.current.y));

        if (moved) {
          const newPoint = { ...keyboardPos.current };
          const newPoints = [...pointsRef.current, newPoint];
          setPoints(newPoints);
          pointsRef.current = newPoints;
          drawPoints(newPoints);
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [side, isDrawing, isActive, width, height, drawPoints]);

  // 重置画布
  useEffect(() => {
    if (!isActive) {
      clearCanvas();
      setPoints([]);
      pointsRef.current = [];
      setIsDrawing(false);
    }
  }, [isActive, clearCanvas]);

  // 显示检测结果
  useEffect(() => {
    if (detectionResult && pointsRef.current.length > 0) {
      const ctx = getContext();
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      // 在画布上显示分数
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 背景
      ctx.fillStyle = detectionResult.isValid ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 分数
      ctx.fillStyle = detectionResult.isValid ? '#16a34a' : '#dc2626';
      ctx.fillText(`${detectionResult.score}`, canvas.width / 2, canvas.height / 2 - 20);

      // 评价
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(detectionResult.message, canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [detectionResult, getContext]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2">
      <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
        {label}
      </div>

      {side === 'left' && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {t.mobileTouch} | {t.desktopKeyboard}
        </div>
      )}
      {side === 'right' && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {t.mobileTouch} | {t.desktopMouse}
        </div>
      )}

      <div
        className={`relative border-4 rounded-lg overflow-hidden cursor-crosshair transition-all duration-300 ${
          isActive
            ? side === 'left'
              ? 'border-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900'
              : 'border-green-500 shadow-lg shadow-green-200 dark:shadow-green-900'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        style={{ width, height }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="bg-white dark:bg-gray-800 touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-900/80">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {t.waiting}
            </span>
          </div>
        )}
      </div>

      {detectionResult && (
        <div className={`text-center mt-2 ${detectionResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
          <div className="text-2xl font-bold">{detectionResult.score}{t.score}</div>
          <div className="text-sm">{detectionResult.message}</div>
        </div>
      )}
    </div>
  );
}
