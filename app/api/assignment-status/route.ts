import { NextResponse } from 'next/server';
import { submissionStore } from '@/lib/store';
import { mockAssignments } from '@/lib/mockData';

export async function GET() {
  try {
    const studentId = 'student-1'; // In production, get from auth session
    const allSubmissions = submissionStore.getAllSubmissions();

    // Filter to show only assignments visible to students
    const visibleAssignments = mockAssignments.filter(
      assignment => assignment.visibleToStudents
    );

    // Create a map of assignment statuses
    const statusMap = visibleAssignments.map(assignment => {
      const submission = allSubmissions.find(
        s => s.assignmentId === assignment.id && s.studentId === studentId
      );

      return {
        ...assignment,
        status: submission ? 'completed' : 'pending'
      };
    });

    return NextResponse.json({ assignments: statusMap });
  } catch (error) {
    console.error('Error fetching assignment status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignment status' },
      { status: 500 }
    );
  }
}
