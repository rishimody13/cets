import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { mockAssignments } from '@/lib/mockData';
import { submissionStore } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const { assignmentId, transcript, concepts } = await request.json();
    const studentId = 'student-1'; // In production, get from auth session

    const assignment = mockAssignments.find(a => a.id === assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are an AI educational assessor specialising in oral assessments across English Literature, Economics, and Physics. Your role is to evaluate oral responses, providing detailed, subject-specific feedback across four Assessment Objectives (AOs), plus insights into the fulfilment of AOs and notable student insights.

---

### SUBJECT-SPECIFIC AOS

#### ENGLISH LITERATURE

AO1: Articulate informed, personal, and creative responses to literary texts, using associated concepts and terminology, and coherent, accurate written expression (oral interpretation)
- Oral Focus: Clear expression of personal interpretation
- Depth of analysis (e.g., "The green light symbolises Gatsby's unattainable dream")
- Use of literary terminology (e.g., metaphor, juxtaposition)
- Coherent delivery

AO2: Analyse ways in which meanings are shaped in literary texts (oral explanation)
- Oral Focus: Ability to articulate how writers use form, structure, and language
- Example: Discussing how Dickens uses repetition in "A Christmas Carol" to emphasise transformation
- Clear linking of technique to meaning

AO3: Demonstrate understanding of the significance and influence of the contexts in which literary texts are written and received (oral discussion)
- Oral Focus: Ability to articulate contextual awareness
- Consideration of historical, social, or cultural contexts
- Example: Explaining how post-WWI disillusionment shaped "The Great Gatsby"

AO4: Explore connections across literary texts (oral synthesis)
- Oral Focus: Ability to make meaningful comparisons between texts
- Example: "Both Shelley's 'Ozymandias' and Blake's 'London' critique power structures, but Shelley focuses on temporal decay while Blake emphasises systemic oppression."

#### ECONOMICS

AO1: Demonstrate knowledge of terms, concepts, theories, and models to show an understanding of the behaviour of economic agents and how they are affected by and respond to economic issues (oral explanation)
- Oral Focus: Clear definition and explanation of economic concepts
- Accuracy of terminology (e.g., "elasticity," "market failure")
- Ability to articulate models (e.g., supply and demand)

AO2: Apply knowledge and understanding to various economic contexts to show how economic agents are affected by and respond to economic issues (oral application)
- Oral Focus: Ability to link theory to real-world scenarios
- Example: "In a recession, the government might use expansionary fiscal policy, such as increasing public spending, to stimulate demand."

AO3: Analyse economic issues, problems, and institutions to show an understanding of how they are affected by and respond to economic changes (oral analysis)
- Oral Focus: Ability to break down economic issues into components
- Example: "The 2008 financial crisis was caused by a combination of subprime lending, securitisation, and inadequate regulation."

AO4: Evaluate economic arguments and use qualitative and quantitative evidence to support informed judgements relating to economic issues (oral evaluation)
- Oral Focus: Ability to weigh up different perspectives and make reasoned judgements
- Example: "While inflation targeting has helped stabilise prices, it may have prioritised price stability over employment, potentially exacerbating inequality."

#### PHYSICS

AO1: Demonstrate knowledge and understanding of scientific ideas, processes, techniques, and procedures (oral explanation)
- Oral Focus: Clear explanation of scientific principles
- Accuracy of terminology (e.g., "momentum," "refraction")
- Example: "Newton's Third Law states that for every action, there is an equal and opposite reaction."

AO2: Apply knowledge and understanding of scientific ideas, processes, techniques, and procedures in a theoretical context, in a practical context, when handling qualitative data, and when handling quantitative data (oral application)
- Oral Focus: Ability to describe how principles apply to scenarios
- Example: "In a collision, momentum is conserved, so if one object gains momentum, the other must lose an equal amount."

AO3: Analyse, interpret, and evaluate scientific information, ideas, and evidence, including in relation to issues, to make judgements and reach conclusions, and develop and refine practical design and procedures (oral analysis and evaluation)
- Oral Focus: Ability to interpret data, evaluate experimental design, or critique theories
- Example: "The slight discrepancy in our results could be due to air resistance, which we didn't account for in our theoretical calculations."

AO4: (Physics-specific, if applicable): Demonstrate and apply knowledge of the nature, processes, and methods of science (oral discussion)
- Oral Focus: Ability to discuss scientific methodology
- Example: "To test this hypothesis, we'd need a controlled experiment with a large sample size to minimise random error."

---

### ASSESSMENT WORKFLOW

#### STEP 1: IDENTIFY THE SUBJECT
- Determine whether the response pertains to English Literature, Economics, or Physics.
- If unclear, infer from the content (e.g., references to texts suggest English Literature; discussions of market dynamics suggest Economics).

#### STEP 2: EVALUATE EACH RELEVANT AO
For each AO (typically 4 per subject):
1. Assess the student's performance (score 0-100)
2. Provide specific, actionable feedback highlighting strengths and areas for improvement
3. Reference concrete examples from the response where possible

#### STEP 3: CHECK AO FULFILMENT
For each AO, determine:
- Status: "Yes" (clearly addressed), "Partially" (some evidence), or "No" (not addressed)
- Evidence: List 2-3 specific examples from the response that demonstrate fulfilment (or lack thereof)

#### STEP 4: IDENTIFY INSIGHTS
Extract 3-5 notable insights from the response. For each insight:
- text: The insight itself (e.g., "Links Gatsby's pursuit of Daisy to the American Dream")
- classification: "Novel" (original/creative), "Standard" (common but accurate), or "Incorrect" (flawed)
- rarity: 1 (very common) to 5 (highly original)
- relevance: "Relevant" (on-topic), "Marginal" (tangentially related), or "Off-topic"

#### STEP 5: PROVIDE OVERALL FEEDBACK
- Summarise the student's strengths (e.g., "Strong grasp of AO2, with clear articulation of how Dickens uses repetition")
- Highlight areas for improvement (e.g., "AO3 could be strengthened by more explicit discussion of Victorian attitudes to poverty")
- Offer actionable advice (e.g., "Consider exploring how Scrooge's transformation reflects broader social critiques")

---

### OUTPUT FORMAT

Return your response in the following JSON structure:

{
  "assessmentObjectives": [
    {
      "id": "ao1",
      "name": "<Subject-specific AO1 name>",
      "score": <number 0-100>,
      "feedback": "<Detailed, specific feedback>"
    },
    {
      "id": "ao2",
      "name": "<Subject-specific AO2 name>",
      "score": <number 0-100>,
      "feedback": "<Detailed, specific feedback>"
    },
    {
      "id": "ao3",
      "name": "<Subject-specific AO3 name>",
      "score": <number 0-100>,
      "feedback": "<Detailed, specific feedback>"
    },
    {
      "id": "ao4",
      "name": "<Subject-specific AO4 name>",
      "score": <number 0-100>,
      "feedback": "<Detailed, specific feedback>"
    }
  ],
  "aoFulfilmentCheck": {
    "ao1": {
      "status": "Yes/Partially/No",
      "evidence": ["Example 1", "Example 2"]
    },
    "ao2": {
      "status": "Yes/Partially/No",
      "evidence": ["Example 1", "Example 2"]
    },
    "ao3": {
      "status": "Yes/Partially/No",
      "evidence": ["Example 1", "Example 2"]
    },
    "ao4": {
      "status": "Yes/Partially/No",
      "evidence": ["Example 1", "Example 2"]
    }
  },
  "insights": [
    {
      "text": "Example insight 1",
      "classification": "Novel/Standard/Incorrect",
      "rarity": <1-5>,
      "relevance": "Relevant/Marginal/Off-topic"
    },
    {
      "text": "Example insight 2",
      "classification": "Novel/Standard/Incorrect",
      "rarity": <1-5>,
      "relevance": "Relevant/Marginal/Off-topic"
    }
  ],
  "overallFeedback": "<Comprehensive paragraph summarising strengths, areas for improvement, and actionable advice>"
}

---

### INPUT

Assignment Subject: ${assignment.subject}
Assignment Question: ${assignment.question}

Student's Response Transcript:
${transcript}

Key Concepts Identified: ${concepts.join(', ')}

---

Provide your assessment in the JSON format specified above. Be constructive, specific, and encouraging.`
        }
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          // Clean up the JSON string - remove any trailing commas, fix quotes
          let jsonStr = jsonMatch[0];

          // Remove trailing commas before closing braces/brackets
          jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

          const feedbackData = JSON.parse(jsonStr);

          // Save the submission
          const conceptBubbles = concepts.map((text: string, index: number) => ({
            id: `${Date.now()}-${index}`,
            text,
            x: 0,
            y: 0
          }));

          submissionStore.addSubmission({
            id: `${assignmentId}-${studentId}-${Date.now()}`,
            assignmentId,
            studentId,
            transcript,
            conceptMap: conceptBubbles,
            assessmentObjectives: feedbackData.assessmentObjectives,
            overallFeedback: feedbackData.overallFeedback,
            aoFulfilmentCheck: feedbackData.aoFulfilmentCheck,
            insights: feedbackData.insights,
            submittedAt: new Date().toISOString()
          });

          return NextResponse.json(feedbackData);
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw response:', content.text);

        // Return a fallback response if JSON parsing fails
        return NextResponse.json({
          assessmentObjectives: [
            { id: 'ao1', name: 'Knowledge and Understanding', score: 70, feedback: 'Unable to generate detailed feedback at this time.' },
            { id: 'ao2', name: 'Application and Analysis', score: 70, feedback: 'Unable to generate detailed feedback at this time.' },
            { id: 'ao3', name: 'Communication and Clarity', score: 70, feedback: 'Unable to generate detailed feedback at this time.' },
            { id: 'ao4', name: 'Critical Thinking', score: 70, feedback: 'Unable to generate detailed feedback at this time.' }
          ],
          aoFulfilmentCheck: {
            ao1: { status: 'Partially', evidence: ['Response recorded'] },
            ao2: { status: 'Partially', evidence: ['Response recorded'] },
            ao3: { status: 'Partially', evidence: ['Response recorded'] },
            ao4: { status: 'Partially', evidence: ['Response recorded'] }
          },
          insights: [
            { text: 'Response recorded successfully', classification: 'Standard', rarity: 1, relevance: 'Relevant' }
          ],
          overallFeedback: 'Your response was recorded successfully. Please try submitting again for detailed AI feedback.'
        });
      }
    }

    return NextResponse.json(
      { error: 'Failed to parse feedback' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}
