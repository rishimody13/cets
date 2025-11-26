"use client";

import { useState, useRef } from 'react';
import { ConceptBubble } from '@/types';

interface ConceptMapProps {
  concepts: ConceptBubble[];
  onUpdateConcepts: (concepts: ConceptBubble[]) => void;
}

export default function ConceptMap({ concepts, onUpdateConcepts }: ConceptMapProps) {
  const [draggedBubble, setDraggedBubble] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, bubbleId: string) => {
    const bubble = concepts.find(b => b.id === bubbleId);
    if (!bubble || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setDraggedBubble(bubbleId);

    // Calculate offset from mouse position to bubble position
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragOffset({
      x: mouseX - bubble.x,
      y: mouseY - bubble.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedBubble || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Calculate new position relative to container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = Math.max(0, Math.min(mouseX - dragOffset.x, rect.width - 120));
    const y = Math.max(0, Math.min(mouseY - dragOffset.y, rect.height - 60));

    const updatedConcepts = concepts.map(bubble =>
      bubble.id === draggedBubble ? { ...bubble, x, y } : bubble
    );
    onUpdateConcepts(updatedConcepts);
  };

  const handleMouseUp = () => {
    setDraggedBubble(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {concepts.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
          Concept bubbles will appear here as you speak
        </div>
      ) : (
        concepts.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg cursor-move hover:bg-blue-600 transition-colors select-none"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, bubble.id)}
          >
            {bubble.text}
          </div>
        ))
      )}
    </div>
  );
}
