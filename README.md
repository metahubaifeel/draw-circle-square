# 左手画方右手画圆 | Left Square Right Circle

一个挑战左右脑协调能力的小游戏。同时画方和圆，看看你有多厉害！

A challenging game that tests your brain coordination. Draw square and circle simultaneously!

🔗 **在线试玩 | Play Online**: [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

## 游戏玩法 | How to Play

- **手机/平板 | Mobile/Tablet**: 左右手同时触摸两边画布绘制 | Touch both sides to draw simultaneously
- **电脑 | Desktop**: 左侧用 WASD 或方向键画方，右侧用鼠标画圆 | WASD/Arrow keys for square (left), Mouse for circle (right)
- **限时 | Time Limit**: 30秒内完成，可以多次重画取最高分 | 30 seconds, can redraw for best score
- **评分 | Scoring**: 根据形状标准度自动评分，60分及格 | Auto-scoring based on shape accuracy, 60 to pass

## 功能特性 | Features

- 🌍 **中英文切换 | Bilingual**: 点击右上角语言按钮切换 | Click top-right button to switch language
- 💾 **本地存储 | Local Storage**: 自动保存最高分 | Automatically saves high score
- 📤 **分享功能 | Share**: 一键分享成绩到社交媒体 | Share your score to social media
- 📱 **响应式设计 | Responsive**: 完美适配手机和电脑 | Works perfectly on mobile and desktop

## 技术栈 | Tech Stack

- [Next.js](https://nextjs.org/) - React 框架 | React Framework
- [TypeScript](https://www.typescriptlang.org/) - 类型安全 | Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - 样式 | Styling
- 国际化 | i18n: Custom React Context

## 本地开发 | Local Development

```bash
# 克隆项目 | Clone the project
git clone <your-repo-url>
cd draw-circle-square

# 安装依赖 | Install dependencies
npm install

# 启动开发服务器 | Start dev server
npm run dev
```

访问 | Visit http://localhost:3000

## 部署到 Vercel | Deploy to Vercel

### 方式一：Vercel CLI | Option 1: Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 | Login
vercel login

# 部署 | Deploy
vercel --prod
```

### 方式二：Git 集成（推荐）| Option 2: Git Integration (Recommended)

1. 将代码推送到 GitHub/GitLab/Bitbucket | Push to GitHub/GitLab/Bitbucket
2. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "Add New Project"
4. 选择你的仓库 | Select your repository
5. 配置保持默认，点击 "Deploy" | Keep default settings, click "Deploy"

### 方式三：手动上传 | Option 3: Manual Upload

```bash
# 构建项目 | Build the project
npm run build

# 会生成 `dist` 目录 | This creates a `dist` folder
```

然后上传 `dist` 文件夹到 Vercel。

Then upload the `dist` folder to Vercel.

## 项目结构 | Project Structure

```
draw-circle-square/
├── app/
│   ├── components/              # React 组件 | Components
│   │   ├── Game.tsx            # 游戏主逻辑 | Main game logic
│   │   ├── DrawingCanvas.tsx   # 画布组件 | Canvas component
│   │   └── LanguageSwitch.tsx  # 语言切换按钮 | Language switcher
│   ├── i18n/                   # 国际化配置 | i18n configuration
│   │   ├── config.ts           # 翻译文本 | Translations
│   │   └── LanguageContext.tsx # 语言上下文 | Language context
│   ├── utils/                  # 工具函数 | Utilities
│   │   └── shapeDetection.ts   # 形状检测算法 | Shape detection
│   ├── page.tsx                # 主页面 | Main page
│   ├── layout.tsx              # 根布局 | Root layout
│   └── globals.css             # 全局样式 | Global styles
├── public/                     # 静态资源 | Static assets
├── next.config.ts              # Next.js 配置
└── package.json
```

## 国际化 | Internationalization

语言配置文件位于 `app/i18n/config.ts`，支持：

Language config is in `app/i18n/config.ts`, supporting:

- 🇨🇳 简体中文 (zh)
- 🇺🇸 English (en)

添加新语言：在 `config.ts` 中添加新的翻译对象即可。

To add a new language: Add a new translation object in `config.ts`.

## 形状检测算法 | Shape Detection Algorithm

- **圆形检测 | Circle Detection**: 计算所有点到圆心的距离标准差 | Calculates standard deviation of distances from points to center
- **方形检测 | Square Detection**: 分析边界框宽高比、角点数量和边的直度 | Analyzes aspect ratio, corner points, and edge straightness

## 许可证 | License

MIT License
