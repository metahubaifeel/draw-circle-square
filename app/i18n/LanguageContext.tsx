'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, defaultLanguage, translations, TranslationType } from './config';

interface LanguageContextType {
  lang: Language;
  t: TranslationType;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'drawCircleSquare_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 读取语言偏好（只在客户端执行）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && (saved === 'zh' || saved === 'en')) {
        setLangState(saved);
        // 更新 html lang 属性
        document.documentElement.lang = saved === 'zh' ? 'zh-CN' : 'en';
      }
    } catch (e) {
      // localStorage 不可用（如隐私模式）
      console.warn('localStorage not available:', e);
    }
    setMounted(true);
  }, []);

  // 保存语言偏好
  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en';
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  }, []);

  // 切换语言
  const toggleLang = useCallback(() => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
  }, [lang, setLang]);

  // 获取当前语言的翻译
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, toggleLang, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
