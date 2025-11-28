"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  // Clear all stored data only when browser is refreshed (F5/Cmd+R)
  useEffect(() => {
    // Check if page was loaded via browser refresh (not navigation)
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isPageRefresh = navEntry?.type === 'reload';

    if (isPageRefresh) {
      console.log('Browser refresh detected - clearing all data');
      fetch('/api/clear-data', { method: 'POST' })
        .then(() => console.log('Data cleared on page refresh'))
        .catch(err => console.error('Failed to clear data:', err));
    } else {
      console.log('Navigation detected - preserving data');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Voce AI Assessment Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Select your role to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Link href="/student/dashboard">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-blue-500">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Student
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Access your assignments and complete assessments
              </p>
            </div>
          </div>
        </Link>

        <Link href="/teacher/dashboard">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-green-500">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Teacher
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                View assignments and student feedback
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
