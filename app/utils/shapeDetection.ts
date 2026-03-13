export interface Point {
  x: number;
  y: number;
}

export interface DetectionResult {
  isValid: boolean;
  score: number;
  message: string;
}

/**
 * 检测是否是一个合格的圆形
 * 计算所有点到圆心的距离标准差
 */
export function detectCircle(points: Point[]): DetectionResult {
  if (points.length < 20) {
    return { isValid: false, score: 0, message: '画的太短了' };
  }

  // 计算圆心（所有点的平均值）
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // 计算平均半径
  const distances = points.map(p =>
    Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
  );
  const avgRadius = distances.reduce((sum, d) => sum + d, 0) / distances.length;

  // 计算半径的标准差
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgRadius, 2), 0) / distances.length;
  const stdDev = Math.sqrt(variance);

  // 变异系数 (CV) = 标准差 / 平均值
  const cv = stdDev / avgRadius;

  // 检测是否闭合（起点和终点距离）
  const startEndDistance = Math.sqrt(
    Math.pow(points[0].x - points[points.length - 1].x, 2) +
    Math.pow(points[0].y - points[points.length - 1].y, 2)
  );
  const isClosed = startEndDistance < avgRadius * 0.5;

  // 检测是否是一个完整的圆（通过角度范围）
  const angles = points.map(p => Math.atan2(p.y - centerY, p.x - centerX));
  const angleRange = calculateAngleRange(angles);

  // 评分计算
  let score = Math.max(0, 100 - cv * 200);

  if (!isClosed) {
    score *= 0.7;
  }

  if (angleRange < Math.PI * 1.5) {
    score *= (angleRange / (Math.PI * 2));
  }

  score = Math.min(100, Math.round(score));

  const isValid = score >= 60;

  let message = '';
  if (score >= 90) message = '完美的圆！';
  else if (score >= 80) message = '很好的圆';
  else if (score >= 60) message = '合格的圆';
  else if (score >= 40) message = '继续练习';
  else message = '不太像圆哦';

  return { isValid, score, message };
}

/**
 * 检测是否是一个合格的正方形
 */
export function detectSquare(points: Point[]): DetectionResult {
  if (points.length < 20) {
    return { isValid: false, score: 0, message: '画的太短了' };
  }

  // 找到边界框
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const width = maxX - minX;
  const height = maxY - minY;

  // 检查是否接近正方形（宽高比接近1）
  const aspectRatio = Math.min(width, height) / Math.max(width, height);

  // 检测四个角（通过分析转折点）
  const corners = detectCorners(points);

  // 检测边是否直
  const edgeStraightness = calculateEdgeStraightness(points, corners);

  // 检测是否闭合
  const startEndDistance = Math.sqrt(
    Math.pow(points[0].x - points[points.length - 1].x, 2) +
    Math.pow(points[0].y - points[points.length - 1].y, 2)
  );
  const isClosed = startEndDistance < Math.min(width, height) * 0.3;

  // 计算得分
  let score = aspectRatio * 50 + edgeStraightness * 50;

  if (!isClosed) {
    score *= 0.8;
  }

  if (corners.length < 3 || corners.length > 5) {
    score *= 0.7;
  }

  score = Math.min(100, Math.round(score));

  const isValid = score >= 60;

  let message = '';
  if (score >= 90) message = '完美的方！';
  else if (score >= 80) message = '很好的方';
  else if (score >= 60) message = '合格的方';
  else if (score >= 40) message = '继续练习';
  else message = '不太像方哦';

  return { isValid, score, message };
}

/**
 * 计算角度范围（处理角度环绕）
 */
function calculateAngleRange(angles: number[]): number {
  const sorted = [...angles].sort((a, b) => a - b);
  let maxGap = 0;

  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i] - sorted[i - 1];
    if (gap > maxGap) maxGap = gap;
  }

  // 检查首尾之间的间隙
  const wrapGap = sorted[0] + 2 * Math.PI - sorted[sorted.length - 1];
  if (wrapGap > maxGap) maxGap = wrapGap;

  return 2 * Math.PI - maxGap;
}

/**
 * 检测角点（简化版）
 */
function detectCorners(points: Point[]): Point[] {
  if (points.length < 10) return [];

  const corners: Point[] = [];
  const windowSize = Math.floor(points.length / 10);

  for (let i = windowSize; i < points.length - windowSize; i += windowSize) {
    const prev = points[i - windowSize];
    const curr = points[i];
    const next = points[i + windowSize];

    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);

    let angleDiff = Math.abs(angle2 - angle1);
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

    // 如果角度变化大于 45 度，认为是一个角
    if (angleDiff > Math.PI / 4) {
      corners.push(curr);
    }
  }

  return corners;
}

/**
 * 计算边的直度
 */
function calculateEdgeStraightness(points: Point[], corners: Point[]): number {
  if (corners.length < 2) return 0.5;

  let totalStraightness = 0;
  let segmentCount = 0;

  for (let i = 0; i < corners.length; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % corners.length];

    // 找到起点和终点之间的点
    const startIdx = points.findIndex(p => p === start);
    const endIdx = points.findIndex(p => p === end);

    if (startIdx === -1 || endIdx === -1 || startIdx === endIdx) continue;

    const segmentPoints = startIdx < endIdx
      ? points.slice(startIdx, endIdx + 1)
      : [...points.slice(startIdx), ...points.slice(0, endIdx + 1)];

    if (segmentPoints.length < 2) continue;

    // 计算点到直线的距离
    const lineLength = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    if (lineLength === 0) continue;

    let maxDeviation = 0;
    for (const p of segmentPoints) {
      const distance = Math.abs(
        (end.y - start.y) * p.x - (end.x - start.x) * p.y + end.x * start.y - end.y * start.x
      ) / lineLength;
      maxDeviation = Math.max(maxDeviation, distance);
    }

    const straightness = Math.max(0, 1 - maxDeviation / (lineLength * 0.2));
    totalStraightness += straightness;
    segmentCount++;
  }

  return segmentCount > 0 ? totalStraightness / segmentCount : 0.5;
}

/**
 * 计算总分
 */
export function calculateTotalScore(circleResult: DetectionResult, squareResult: DetectionResult): number {
  return Math.round((circleResult.score + squareResult.score) / 2);
}
