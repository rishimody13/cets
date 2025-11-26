# Customization Guide

This guide shows you how to customize various aspects of the AI Assessment Platform.

## Adding New Assignments

**File:** [lib/mockData.ts](lib/mockData.ts)

```typescript
export const mockAssignments: Assignment[] = [
  // Add your new assignment here
  {
    id: '5', // Unique ID
    subject: 'History',
    question: 'Explain the causes and effects of the Industrial Revolution.',
    createdAt: '2024-01-20',
    status: 'pending'
  }
];
```

## Modifying Assessment Objectives

### Change Number of Objectives

**File:** [app/api/generate-feedback/route.ts](app/api/generate-feedback/route.ts:23)

Find the prompt section and modify the `assessmentObjectives` array:

```typescript
{
  "assessmentObjectives": [
    {
      "id": "ao1",
      "name": "Your Custom Objective 1",
      "score": <number 0-100>,
      "feedback": "<feedback>"
    },
    // Add or remove objectives as needed
  ]
}
```

### Change Objective Names

Update the names in the same file to match your assessment criteria.

## Customizing Color Schemes

### Progress Bar Colors

**File:** [app/student/feedback/[id]/page.tsx](app/student/feedback/[id]/page.tsx:54)

```typescript
className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
  ao.score >= 80
    ? 'bg-green-500'    // High score color
    : ao.score >= 60
    ? 'bg-yellow-500'   // Medium score color
    : 'bg-red-500'      // Low score color
}`}
```

### Landing Page Gradient

**File:** [app/page.tsx](app/page.tsx:7)

```typescript
<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
//                                                                         ^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^
//                                                                         Change these colors
```

### Dashboard Colors

**Student Dashboard:** [app/student/dashboard/page.tsx](app/student/dashboard/page.tsx:9)
**Teacher Dashboard:** [app/teacher/dashboard/page.tsx](app/teacher/dashboard/page.tsx:9)

Change the gradient colors in the main container div.

## Modifying Recording Button States

**File:** [app/student/assignment/[id]/page.tsx](app/student/assignment/[id]/page.tsx:125)

```typescript
const getButtonText = () => {
  switch (recordingState) {
    case 'idle': return 'Your Custom Start Text';
    case 'recording': return 'Your Custom Recording Text';
    case 'paused': return 'Your Custom Paused Text';
  }
};

const getButtonColor = () => {
  switch (recordingState) {
    case 'idle': return 'bg-green-500 hover:bg-green-600';
    case 'recording': return 'bg-red-500 hover:bg-red-600';
    case 'paused': return 'bg-yellow-500 hover:bg-yellow-600';
  }
};
```

## Changing Concept Bubble Appearance

**File:** [components/ConceptMap.tsx](components/ConceptMap.tsx:64)

```typescript
<div
  className="absolute px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg cursor-move hover:bg-blue-600 transition-colors select-none"
  //                          ^^^^^^^^^^                     ^^^^^^^^^^^
  //                          Bubble color                   Hover color
```

### Bubble Size
Modify the padding: `px-4 py-2` (horizontal and vertical padding)

### Bubble Shape
Change `rounded-full` to:
- `rounded-lg` for rounded squares
- `rounded-md` for slightly rounded
- `rounded` for more rounded

## Customizing Concept Map Size

**File:** [components/ConceptMap.tsx](components/ConceptMap.tsx:35)

```typescript
<div
  className="relative w-full h-96 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
  //                        ^^^^
  //                        Height (h-96 = 384px)
```

Change to:
- `h-64` for smaller (256px)
- `h-96` for medium (384px)
- `h-[500px]` for custom height

## Adjusting Keyword Extraction Frequency

**File:** [app/student/assignment/[id]/page.tsx](app/student/assignment/[id]/page.tsx:58)

Currently extracts keywords on every final transcript segment. To change frequency, add debouncing:

```typescript
const [extractionTimeout, setExtractionTimeout] = useState<NodeJS.Timeout | null>(null);

const extractKeywords = async (text: string) => {
  // Clear previous timeout
  if (extractionTimeout) {
    clearTimeout(extractionTimeout);
  }

  // Wait 2 seconds before extracting
  const timeout = setTimeout(async () => {
    // ... existing extraction code
  }, 2000); // Adjust delay here

  setExtractionTimeout(timeout);
};
```

## Modifying Number of Keywords Extracted

**File:** [app/api/extract-keywords/route.ts](app/api/extract-keywords/route.ts:16)

```typescript
content: `Extract 2-4 key concepts or important keywords from the following text.`
//                ^^^
//                Change this number
```

And in the same file:

```typescript
.slice(0, 4);  // Maximum keywords returned
//        ^
//        Change this limit
```

## Customizing Feedback Prompt

**File:** [app/api/generate-feedback/route.ts](app/api/generate-feedback/route.ts:26)

Modify the prompt to change how Claude analyzes responses:

```typescript
content: `You are an educational assessment AI with expertise in [YOUR SUBJECT].

Focus on:
- [Your custom criteria 1]
- [Your custom criteria 2]
- [Your custom criteria 3]

Be particularly strict/lenient about [YOUR PREFERENCES].`
```

## Adding Custom Animations

### Button Pulse Animation

**File:** [app/student/assignment/[id]/page.tsx](app/student/assignment/[id]/page.tsx:167)

```typescript
{recordingState === 'recording' && (
  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
  //                                              ^^^^^^^^^^^^^
  //                                              Animation class
)}
```

Tailwind provides: `animate-pulse`, `animate-bounce`, `animate-spin`

### Progress Bar Animation

**File:** [app/student/feedback/[id]/page.tsx](app/student/feedback/[id]/page.tsx:55)

```typescript
style={{ width: `${ao.score}%` }}
className="... transition-all duration-1000 ease-out"
//                         ^^^^
//                         Animation duration (ms)
```

## Modifying Layout Spacing

### Card Grid Layout

**Files:**
- [app/student/dashboard/page.tsx](app/student/dashboard/page.tsx:24)
- [app/teacher/dashboard/page.tsx](app/teacher/dashboard/page.tsx:24)

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  //                            ^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^  ^^^^
  //                            Medium screens  Large screens   Gap size
```

Change to:
- `lg:grid-cols-3` for 3 columns on large screens
- `gap-8` for more spacing
- `gap-4` for less spacing

## Changing Font Family

**File:** [app/globals.css](app/globals.css:14)

```css
body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
  /*           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
               Change this */
}
```

Or add custom fonts to [app/layout.tsx](app/layout.tsx)

## Modifying Claude Model

**Files:** All API routes in `app/api/*/route.ts`

```typescript
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  //     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //     Change to different model
  max_tokens: 1024,
  //          ^^^^
  //          Adjust response length
```

Available models:
- `claude-3-5-sonnet-20241022` (Recommended)
- `claude-3-opus-20240229` (Most capable, slower)
- `claude-3-haiku-20240307` (Fastest, cheaper)

## Adding Dark Mode Toggle

Create a new component:

```typescript
// components/ThemeToggle.tsx
"use client";
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}
```

Then add to your pages.

## Custom Mock Data for Teacher View

**File:** [app/api/submissions/[id]/route.ts](app/api/submissions/[id]/route.ts:8)

```typescript
const mockSubmissionsData: { [key: string]: any[] } = {
  '1': [
    {
      studentName: 'Your Student Name',
      transcript: 'Custom transcript...',
      submittedAt: new Date().toISOString(),
    }
  ],
  // Add more assignments
  '2': [
    // More submissions
  ]
};
```

## Tips for Customization

1. **Test changes locally**: Always run `npm run dev` and test in browser
2. **Keep backups**: Create git commits before major changes
3. **Check TypeScript**: Run `npm run build` to check for type errors
4. **Mobile responsiveness**: Test on different screen sizes
5. **Dark mode**: Check both light and dark modes for color changes
6. **API costs**: More tokens = higher costs; adjust `max_tokens` accordingly

## Need Help?

- Check [README.md](README.md) for general information
- See [SETUP.md](SETUP.md) for installation steps
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Refer to [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for feature details
