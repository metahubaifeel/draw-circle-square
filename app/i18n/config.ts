export type Language = 'zh' | 'en';

export const defaultLanguage: Language = 'zh';

export interface TranslationType {
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  waiting: string;
  startGame: string;
  playAgain: string;
  endEarly: string;
  timeLeft: string;
  startDrawing: string;
  drawSquare: string;
  drawCircle: string;
  mobileTouch: string;
  desktopKeyboard: string;
  desktopMouse: string;
  score: string;
  totalScore: string;
  highScore: string;
  squareScore: string;
  circleScore: string;
  excellent: string;
  veryGood: string;
  good: string;
  pass: string;
  needPractice: string;
  tryAgain: string;
  perfectCircle: string;
  goodCircle: string;
  okCircle: string;
  badCircle: string;
  notCircle: string;
  perfectSquare: string;
  goodSquare: string;
  okSquare: string;
  badSquare: string;
  notSquare: string;
  incomplete: string;
  tooShort: string;
  share: string;
  shareTitle: string;
  shareText: (square: number, circle: number, total: number) => string;
  copied: string;
  copyFailed: string;
  screenshot: string;
  screenshotFilename: (score: number) => string;
  howToPlay: string;
  mobileTip: string;
  desktopTip: string;
  timeTip: string;
  scoreTip: string;
  switchLang: string;
  langName: string;
}

export const translations: Record<Language, TranslationType> = {
  zh: {
    title: '左手画方右手画圆',
    subtitle: '同时画方和圆，挑战你的左右脑协调！',
    metaTitle: '左手画方右手画圆 - 挑战你的左右脑',
    metaDescription: '同时画方和圆，挑战你的左右脑协调能力！限时30秒，看看你有多厉害。',
    waiting: '等待开始...',
    startGame: '开始挑战',
    playAgain: '再玩一次',
    endEarly: '提前结束',
    timeLeft: '时间还剩不多，抓紧完成！',
    startDrawing: '开始画吧！可以多次重画取最高分',
    drawSquare: '⬜ 画方',
    drawCircle: '⭕ 画圆',
    mobileTouch: '手机: 触摸绘制',
    desktopKeyboard: '电脑: WASD或方向键',
    desktopMouse: '电脑: 鼠标绘制',
    score: '分',
    totalScore: '总分',
    highScore: '历史最高',
    squareScore: '方形得分',
    circleScore: '圆形得分',
    excellent: '🏆 神乎其技！',
    veryGood: '⭐ 非常出色！',
    good: '👍 做得很好！',
    pass: '✅ 及格啦！',
    needPractice: '💪 还需努力',
    tryAgain: '😅 再试一次吧',
    perfectCircle: '完美的圆！',
    goodCircle: '很好的圆',
    okCircle: '合格的圆',
    badCircle: '继续练习',
    notCircle: '不太像圆哦',
    perfectSquare: '完美的方！',
    goodSquare: '很好的方',
    okSquare: '合格的方',
    badSquare: '继续练习',
    notSquare: '不太像方哦',
    incomplete: '未完成',
    tooShort: '画的太短了',
    share: '分享成绩',
    shareTitle: '🎮 左手画方右手画圆',
    shareText: (square: number, circle: number, total: number) =>
      `🎮 左手画方右手画圆\n\n⬜ 方形得分: ${square}/100\n⭕ 圆形得分: ${circle}/100\n\n🏆 总分: ${total}/100\n\n来挑战我吧！👇`,
    copied: '成绩已复制到剪贴板！',
    copyFailed: '复制失败，请手动复制',
    screenshot: '保存截图',
    screenshotFilename: (score: number) => `画圆画方_${score}分.png`,
    howToPlay: '游戏说明',
    mobileTip: '📱 手机/平板：左右手同时触摸两边画布绘制',
    desktopTip: '💻 电脑：左侧用 WASD 或方向键画方，右侧用鼠标画圆',
    timeTip: '⏱️ 限时：30秒内完成，可以多次重画',
    scoreTip: '🎯 评分：根据形状标准度自动评分，60分及格',
    switchLang: 'Switch to English',
    langName: '中文',
  },

  en: {
    title: 'Left Square Right Circle',
    subtitle: 'Draw square and circle simultaneously, challenge your brain coordination!',
    metaTitle: 'Left Square Right Circle - Challenge Your Brain',
    metaDescription: 'Draw square and circle at the same time, challenge your brain coordination! 30 seconds limit, show me what you got.',
    waiting: 'Waiting to start...',
    startGame: 'Start Challenge',
    playAgain: 'Play Again',
    endEarly: 'End Early',
    timeLeft: 'Time is running out, hurry up!',
    startDrawing: 'Start drawing! You can redraw multiple times for the best score',
    drawSquare: '⬜ Draw Square',
    drawCircle: '⭕ Draw Circle',
    mobileTouch: 'Mobile: Touch to draw',
    desktopKeyboard: 'Desktop: WASD or Arrow keys',
    desktopMouse: 'Desktop: Mouse',
    score: 'pts',
    totalScore: 'Total Score',
    highScore: 'High Score',
    squareScore: 'Square Score',
    circleScore: 'Circle Score',
    excellent: '🏆 Legendary!',
    veryGood: '⭐ Excellent!',
    good: '👍 Well done!',
    pass: '✅ Passed!',
    needPractice: '💪 Keep practicing',
    tryAgain: '😅 Try again',
    perfectCircle: 'Perfect circle!',
    goodCircle: 'Good circle',
    okCircle: 'Passable circle',
    badCircle: 'Keep practicing',
    notCircle: 'Not quite a circle',
    perfectSquare: 'Perfect square!',
    goodSquare: 'Good square',
    okSquare: 'Passable square',
    badSquare: 'Keep practicing',
    notSquare: 'Not quite a square',
    incomplete: 'Incomplete',
    tooShort: 'Too short',
    share: 'Share Score',
    shareTitle: '🎮 Left Square Right Circle',
    shareText: (square: number, circle: number, total: number) =>
      `🎮 Left Square Right Circle\n\n⬜ Square: ${square}/100\n⭕ Circle: ${circle}/100\n\n🏆 Total: ${total}/100\n\nCome challenge me!👇`,
    copied: 'Score copied to clipboard!',
    copyFailed: 'Copy failed, please copy manually',
    screenshot: 'Save Screenshot',
    screenshotFilename: (score: number) => `square_circle_${score}pts.png`,
    howToPlay: 'How to Play',
    mobileTip: '📱 Mobile/Tablet: Touch both sides to draw simultaneously',
    desktopTip: '💻 Desktop: WASD/Arrow keys for square (left), Mouse for circle (right)',
    timeTip: '⏱️ Time Limit: Complete within 30 seconds, can redraw multiple times',
    scoreTip: '🎯 Scoring: Auto-scoring based on shape accuracy, 60 to pass',
    switchLang: '切换到中文',
    langName: 'English',
  },
};
