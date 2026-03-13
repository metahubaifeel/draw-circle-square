'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitch() {
  const { lang, toggleLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // 防止水合不匹配 - 只在客户端渲染后显示
  useEffect(() => {
    setMounted(true);
  }, []);

  // 未挂载时返回占位符，避免水合错误
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2
                 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                 border border-gray-200 dark:border-gray-700
                 rounded-full shadow-lg hover:shadow-xl
                 transition-all duration-300 ease-out
                 hover:scale-105 active:scale-95
                 group"
      title={t.switchLang}
    >
      {/* 地球图标 */}
      <svg
        className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-180 transition-transform duration-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" d="M2 12h20" />
        <path strokeWidth="2" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      {/* 语言代码 */}
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200 min-w-[2rem]">
        {t.langName}
      </span>

      {/* 切换箭头 */}
      <svg
        className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </button>
  );
}
