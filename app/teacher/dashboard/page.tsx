"use client";

import { mockAssignments } from '@/lib/mockData';
import AssignmentCard from '@/components/AssignmentCard';
import Link from 'next/link';

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View assignments and student submissions
            </p>
          </div>
          <Link href="/">
            <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
              Back to Home
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {mockAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              userType="teacher"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
