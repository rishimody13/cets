"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockAssignments } from '@/lib/mockData';
import ConceptMap from '@/components/ConceptMap';
import { ConceptBubble } from '@/types';

type RecordingState = 'idle' | 'recording' | 'paused';

export default function AssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;

  const assignment = mockAssignments.find(a => a.id === assignmentId);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [concepts, setConcepts] = useState<ConceptBubble[]>([]);
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const pendingTextRef = useRef<string>('');
  const extractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);

          // Add to pending text
          pendingTextRef.current += finalTranscript;

          // Debounce keyword extraction - extract after 1.5 seconds of no new text
          if (extractionTimeoutRef.current) {
            clearTimeout(extractionTimeoutRef.current);
          }

          extractionTimeoutRef.current = setTimeout(() => {
            if (pendingTextRef.current.trim().length > 0) {
              extractKeywords(pendingTextRef.current);
              pendingTextRef.current = '';
            }
          }, 1500); // Reduced from default to 1.5 seconds
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (extractionTimeoutRef.current) {
        clearTimeout(extractionTimeoutRef.current);
      }
    };
  }, []);

  const extractKeywords = async (text: string) => {
    try {
      const response = await fetch('/api/extract-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.keywords && data.keywords.length > 0) {
          setConcepts(prev => {
            // Create set of existing texts for duplicate checking (case-insensitive)
            const existingTexts = new Set(prev.map(c => c.text.toLowerCase().trim()));

            // Filter out duplicates and create new concepts with better positioning
            const uniqueKeywords = data.keywords.filter((keyword: string) =>
              !existingTexts.has(keyword.toLowerCase().trim())
            );

            // Generate new concept bubbles with spread-out random positions
            const newConcepts: ConceptBubble[] = uniqueKeywords.map((keyword: string, index: number) => {
              // Calculate available space accounting for bubble size (~120px width, ~60px height)
              const maxX = 750; // Approximate container width minus bubble width
              const maxY = 320; // Container height (384px) minus bubble height

              // Add some offset to avoid clustering in the same spot
              const baseX = (index % 3) * 250; // Distribute across 3 columns
              const baseY = Math.floor(index / 3) * 80; // Stack in rows

              // Add random offset for natural distribution
              const randomX = Math.random() * 150;
              const randomY = Math.random() * 60;

              return {
                id: `${Date.now()}-${index}`,
                text: keyword,
                x: Math.min(baseX + randomX, maxX),
                y: Math.min(baseY + randomY, maxY)
              };
            });

            return [...prev, ...newConcepts];
          });
        }
      }
    } catch (error) {
      console.error('Error extracting keywords:', error);
    }
  };

  const handleRecordingToggle = async () => {
    if (recordingState === 'idle') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.start();
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
        setRecordingState('recording');
      } catch (error) {
        console.error('Error starting recording:', error);
        alert('Could not access microphone. Please check permissions.');
      }
    } else if (recordingState === 'recording') {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.pause();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setRecordingState('paused');
    } else if (recordingState === 'paused') {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.resume();
      }
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setRecordingState('recording');
    }
  };

  const handleFinishSubmit = async () => {
    if (mediaRecorderRef.current && recordingState !== 'idle') {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);

        try {
          const response = await fetch('/api/generate-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assignmentId,
              transcript,
              concepts: concepts.map(c => c.text)
            })
          });

          if (response.ok) {
            const data = await response.json();
            router.push(`/student/feedback/${assignmentId}?data=${encodeURIComponent(JSON.stringify(data))}`);
          } else {
            alert('Error generating feedback. Please try again.');
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('Error submitting assignment:', error);
          alert('Error submitting assignment. Please try again.');
          setIsProcessing(false);
        }
      };
    }
  };

  const getButtonText = () => {
    switch (recordingState) {
      case 'idle': return 'Start Recording';
      case 'recording': return 'Stop Recording';
      case 'paused': return 'Continue Speaking';
    }
  };

  const getButtonColor = () => {
    switch (recordingState) {
      case 'idle': return 'bg-green-500 hover:bg-green-600';
      case 'recording': return 'bg-red-500 hover:bg-red-600';
      case 'paused': return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Assignment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {assignment.subject}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            {assignment.question}
          </p>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleRecordingToggle}
              disabled={isProcessing}
              className={`${getButtonColor()} text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3`}
            >
              {recordingState === 'recording' && (
                <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              )}
              {getButtonText()}
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Concept Map
            </h2>
            <ConceptMap concepts={concepts} onUpdateConcepts={setConcepts} />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleFinishSubmit}
              disabled={recordingState === 'idle' || transcript.length === 0 || isProcessing}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
            >
              {isProcessing ? 'Processing...' : 'Finish and Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
