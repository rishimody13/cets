import { NextResponse } from 'next/server';
import { submissionStore } from '@/lib/store';

export async function POST() {
  try {
    submissionStore.clearAll();
    return NextResponse.json({ success: true, message: 'All data cleared' });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}
