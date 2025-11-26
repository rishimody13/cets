import { NextRequest, NextResponse } from 'next/server';
import { submissionStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assignmentId } = await params;
    const submissions = submissionStore.getSubmissionsByAssignment(assignmentId);

    // Format submissions for teacher view
    const formattedSubmissions = submissions.map(submission => ({
      studentName: `Student ${submission.studentId}`,
      transcript: submission.transcript,
      submittedAt: submission.submittedAt,
      assessmentObjectives: submission.assessmentObjectives,
      overallFeedback: submission.overallFeedback,
      aoFulfilmentCheck: submission.aoFulfilmentCheck,
      insights: submission.insights
    }));

    return NextResponse.json({ submissions: formattedSubmissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
