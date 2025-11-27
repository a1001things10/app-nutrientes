'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, getTranslation } from '@/lib/i18n';
import ChatBox from '@/components/ChatBox';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="container mx-auto p-4">
      {/* Logo and Tagline */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t('appTitle')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 italic">
          {t('tagline')}
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {t('selectLanguage')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                language === lang.code
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-102'
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="font-semibold text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/meals">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-green-800">{t('dailyMeals')}</h2>
            <p className="text-muted-foreground">{t('dailyMealsDesc')}</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {t('addMeal')}
            </button>
          </div>
        </Link>
        <Link href="/medications">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">{t('medications')}</h2>
            <p className="text-muted-foreground">{t('medicationsDesc')}</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {t('viewMedications')}
            </button>
          </div>
        </Link>
        <Link href="/symptoms">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-red-800">{t('symptoms')}</h2>
            <p className="text-muted-foreground">{t('symptomsDesc')}</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              {t('recordSymptom')}
            </button>
          </div>
        </Link>
      </div>

      {/* Chat Box */}
      <ChatBox />
    </div>
  );
}