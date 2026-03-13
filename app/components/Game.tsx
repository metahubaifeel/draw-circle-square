'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import DrawingCanvas from './DrawingCanvas';
import { detectCircle, detectSquare, calculateTotalScore, DetectionResult, Point } from '../utils/shapeDetection';
import { useLanguage } from '../i18n/LanguageContext';

type GameState = 'idle' | 'playing' | 'finished';

const GAME_DURATION = 30; // 游戏时长（秒）

export default function Game() {
  const { t, lang, mounted } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [circlePoints, setCirclePoints] = useState<Point[]>([]);
  const [squarePoints, setSquarePoints] = useState<Point[]>([]);
  const [circleResult, setCircleResult] = useState<DetectionResult | undefined>();
  const [squareResult, setSquareResult] = useState<DetectionResult | undefined>();
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 从 localStorage 读取最高分
  useEffect(() => {
    const saved = localStorage.getItem('drawCircleSquare_highScore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
    const savedAttempts = localStorage.getItem('drawCircleSquare_attempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts, 10));
    }
  }, []);

  // 保存最高分
  useEffect(() => {
    if (totalScore > 0) {
      localStorage.setItem('drawCircleSquare_attempts', attempts.toString());
      if (totalScore > highScore) {
        setHighScore(totalScore);
        localStorage.setItem('drawCircleSquare_highScore', totalScore.toString());
      }
    }
  }, [totalScore, highScore, attempts]);

  // 开始游戏
  const startGame = useCallback(() => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setCirclePoints([]);
    setSquarePoints([]);
    setCircleResult(undefined);
    setSquareResult(undefined);
    setTotalScore(0);
    setAttempts(prev => prev + 1);

    // 清除之前的定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 启动倒计时
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // 游戏结束
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 结束游戏（清理定时器）
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 处理圆形绘制完成
  const handleCircleComplete = useCallback((points: Point[]) => {
    if (gameState !== 'playing') return;
    setCirclePoints(points);
    const result = detectCircle(points);
    setCircleResult(result);
  }, [gameState]);

  // 处理方形绘制完成
  const handleSquareComplete = useCallback((points: Point[]) => {
    if (gameState !== 'playing') return;
    setSquarePoints(points);
    const result = detectSquare(points);
    setSquareResult(result);
  }, [gameState]);

  // 计算总分
  useEffect(() => {
    if (circleResult && squareResult) {
      const score = calculateTotalScore(circleResult, squareResult);
      setTotalScore(score);
    }
  }, [circleResult, squareResult]);

  // 分享功能
  const handleShare = useCallback(async () => {
    const shareText = t.shareText(
      squareResult?.score || 0,
      circleResult?.score || 0,
      totalScore
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.shareTitle,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // 用户取消分享
      }
    } else {
      // 复制到剪贴板
      try {
        await navigator.clipboard.writeText(shareText + '\n' + window.location.href);
        alert(t.copied);
      } catch {
        alert(t.copyFailed);
      }
    }
  }, [circleResult, squareResult, totalScore, t]);

  // 截图功能
  const handleScreenshot = useCallback(() => {
    // 创建一个临时的 canvas 来合并两个画布
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    tempCanvas.width = 800;
    tempCanvas.height = 450;

    // 背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 标题
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.title, tempCanvas.width / 2, 40);

    // 分数
    ctx.font = 'bold 48px sans-serif';
    ctx.fillStyle = totalScore >= 60 ? '#16a34a' : '#dc2626';
    ctx.fillText(`${t.totalScore}: ${totalScore}`, tempCanvas.width / 2, 100);

    // 尝试获取画布内容并绘制
    const leftCanvas = document.querySelector('[data-canvas="left"] canvas') as HTMLCanvasElement;
    const rightCanvas = document.querySelector('[data-canvas="right"] canvas') as HTMLCanvasElement;

    if (leftCanvas) {
      ctx.drawImage(leftCanvas, 50, 140, 300, 250);
    }
    if (rightCanvas) {
      ctx.drawImage(rightCanvas, 450, 140, 300, 250);
    }

    // 标签
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(lang === 'zh' ? '方形' : 'Square', 200, 410);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(lang === 'zh' ? '圆形' : 'Circle', 600, 410);

    // 下载
    const link = document.createElement('a');
    link.download = t.screenshotFilename(totalScore);
    link.href = tempCanvas.toDataURL();
    link.click();
  }, [totalScore, t, lang]);

  // 获取评价
  const getEvaluation = (score: number): string => {
    if (score >= 95) return t.excellent;
    if (score >= 85) return t.veryGood;
    if (score >= 75) return t.good;
    if (score >= 60) return t.pass;
    if (score >= 40) return t.needPractice;
    return t.tryAgain;
  };

  // 获取检测结果文本
  const getDetectionMessage = (result: DetectionResult | undefined, type: 'circle' | 'square'): string => {
    if (!result) return t.incomplete;
    if (result.message === '画的太短了' || result.message === 'Too short') return t.tooShort;

    const score = result.score;
    if (type === 'circle') {
      if (score >= 90) return t.perfectCircle;
      if (score >= 80) return t.goodCircle;
      if (score >= 60) return t.okCircle;
      if (score >= 40) return t.badCircle;
      return t.notCircle;
    } else {
      if (score >= 90) return t.perfectSquare;
      if (score >= 80) return t.goodSquare;
      if (score >= 60) return t.okSquare;
      if (score >= 40) return t.badSquare;
      return t.notSquare;
    }
  };

  // 防止水合不匹配 - 等待客户端挂载
  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* 头部信息 */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.subtitle}
        </p>
      </div>

      {/* 游戏状态栏 */}
      <div className="flex justify-center items-center gap-6 mb-6">
        {gameState === 'playing' && (
          <div className="text-4xl font-bold text-orange-500 animate-pulse">
            {timeLeft}s
          </div>
        )}

        {gameState !== 'idle' && (
          <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            {t.highScore}: <span className="text-purple-600 dark:text-purple-400">{highScore}{t.score}</span>
          </div>
        )}
      </div>

      {/* 游戏区域 */}
      <div className={`flex flex-col md:flex-row justify-center items-start gap-4 md:gap-8 mb-6 ${
        gameState === 'idle' ? 'opacity-50' : ''
      }`}>
        <div data-canvas="left">
          <DrawingCanvas
            width={350}
            height={350}
            side="left"
            isActive={gameState === 'playing'}
            onDrawingComplete={handleSquareComplete}
            detectionResult={gameState === 'finished' ? squareResult : undefined}
            label={t.drawSquare}
            t={t}
          />
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="text-4xl font-bold text-gray-300 dark:text-gray-600">VS</div>
        </div>

        <div data-canvas="right">
          <DrawingCanvas
            width={350}
            height={350}
            side="right"
            isActive={gameState === 'playing'}
            onDrawingComplete={handleCircleComplete}
            detectionResult={gameState === 'finished' ? circleResult : undefined}
            label={t.drawCircle}
            t={t}
          />
        </div>
      </div>

      {/* 控制区域 */}
      <div className="flex flex-col items-center gap-4">
        {gameState === 'idle' && (
          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {t.startGame}
          </button>
        )}

        {gameState === 'playing' && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {timeLeft > 25 ? t.startDrawing : t.timeLeft}
            </p>
            <button
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                setGameState('finished');
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t.endEarly}
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center w-full max-w-md">
            {/* 结果展示 */}
            <div className={`text-5xl font-bold mb-2 ${
              totalScore >= 60 ? 'text-green-500' : 'text-red-500'
            }`}>
              {totalScore}{t.score}
            </div>
            <div className="text-xl text-gray-700 dark:text-gray-300 mb-4">
              {getEvaluation(totalScore)}
            </div>

            {/* 详细分数 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="text-green-600 dark:text-green-400 font-bold">{lang === 'zh' ? '方形' : 'Square'}</div>
                <div className="text-2xl font-bold">{squareResult?.score || 0}</div>
                <div className="text-sm text-gray-500">{getDetectionMessage(squareResult, 'square')}</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="text-blue-600 dark:text-blue-400 font-bold">{lang === 'zh' ? '圆形' : 'Circle'}</div>
                <div className="text-2xl font-bold">{circleResult?.score || 0}</div>
                <div className="text-sm text-gray-500">{getDetectionMessage(circleResult, 'circle')}</div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {t.playAgain}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-purple-500 text-white font-bold rounded-full shadow-lg hover:bg-purple-600 transition-all duration-200"
              >
                {t.share}
              </button>
              <button
                onClick={handleScreenshot}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200"
              >
                {t.screenshot}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 游戏说明 */}
      {gameState === 'idle' && (
        <div className="mt-8 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">{t.howToPlay}</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li>{t.mobileTip}</li>
            <li>{t.desktopTip}</li>
            <li>{t.timeTip}</li>
            <li>{t.scoreTip}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
