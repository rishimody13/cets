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

############################################################
### ECONOMICS – ORAL CRITICAL THINKING AOs (4)
############################################################

Econ AO1 – Conceptual & Contextual Understanding (Bloom 2–3)
Does the student accurately identify and explain the key economic concepts, variables and contextual factors that matter for this scenario?

What “Yes” looks like
- Correctly defines / uses relevant concepts (e.g. externality, elasticity, fiscal stimulus, opportunity cost).
- Picks out the relevant actors, markets, constraints (e.g. “This is a labour market issue with minimum wage implications…”).
- Distinguishes clearly between short run / long run, micro / macro, nominal / real when relevant.

What you should look for
- Verbs: define, describe, explain, distinguish, identify, clarify.
- Patterns: “The key concept here is…”, “In the short run… whereas in the long run…”, “We’re dealing with a negative externality because…”.

Bloom focus: Mainly Understand / Apply (2–3) as a base for higher AOs.

---

Econ AO2 – Analytical Causal Reasoning (Bloom 4)
Does the student analyse cause–effect chains, mechanisms and interactions between variables rather than just naming them?

What “Yes” looks like
- Builds multi-step chains: policy → incentive → behaviour → market outcome → welfare impact.
- Compares alternative mechanisms (e.g. demand-side vs supply-side explanations).
- Identifies and groups factors (e.g. “On the one hand, costs; on the other, expectations…”).

What you should look for
- Verbs: analyse, compare, contrast, examine, trace, explore, break down, link.
- Patterns: “If the central bank raises rates, then… which in turn leads to…”, “A second channel is…”, “Compared with a subsidy, a tax would…”.

Bloom focus: Solid Analyse (4), supported by AO1.

---

Econ AO3 – Evaluation of Policies & Arguments (Bloom 5)
Does the student evaluate policies/arguments by weighing trade-offs, assumptions and constraints, and then justify a position?

What “Yes” looks like
- Identifies assumptions/conditions (“This only works if labour is mobile…”).
- Weighs benefits vs costs for different stakeholders (“Good for exporters, harmful to debtors…”).
- Uses language of uncertainty and dependence: “It depends on…”, “Most significant factor is…”.
- Arrives at a defensible judgement: what is more effective / appropriate and why.

What you should look for
- Verbs: evaluate, judge, appraise, weigh, critique, prioritise, justify, defend, qualify.
- Patterns: “However…”, “On balance…”, “The main limitation is…”, “This argument is weak because…”.

Bloom focus: Evaluate (5) is the core; draws on AO1–2.

---

Econ AO4 – Structured Problem-Solving & Recommendation (Bloom 4–5)
Does the student organise their reasoning into a coherent plan or recommendation that addresses the problem posed?

What “Yes” looks like
- Clearly frames the problem: “The core issue is unemployment due to…”.
- Proposes one or more plausible policy options, not just describing theory.
- Links recommendation to earlier analysis (“Because inflation expectations are anchored, the better approach is…”).

What you should look for
- Verbs: propose, recommend, design, outline, prioritise, justify.
- Patterns: “My recommendation would be… because…”, “A two-step approach is… first…, then…”.

Bloom focus: Mix of Analyse/Evaluate, some Create-lite (designing a solution) but still within A-level scope.

---

############################################################
### ENGLISH LITERATURE – ORAL CRITICAL THINKING AOs (4)
############################################################

EngLit AO1 – Interpretation & Conceptual Framing (Bloom 2–3)
Does the student articulate a clear, text-based interpretation of the focus in the question (theme, character, symbol, viewpoint)?

What “Yes” looks like
- States a clear central claim about the text (or extract).
- Supports it with accurately recalled details (not necessarily verbatim quotes in an oral setting).
- Uses appropriate critical / literary terms (e.g. narrative voice, dramatic irony, Gothic, unreliable narrator).

What you should look for
- Verbs: interpret, describe, explain, characterise, identify.
- Patterns: “In The Great Gatsby, Fitzgerald presents wealth as…”, “Gatsby is portrayed as… because…”.

Bloom focus: Understand / Apply, foundation for higher-order AOs.

---

EngLit AO2 – Analytical Reading of Methods & Patterns (Bloom 4)
Does the student analyse how form, structure, and language choices create meaning and effects?

What “Yes” looks like
- Links specific features (imagery, narrative perspective, stage directions, symbolism, setting) to effects.
- Makes comparisons within or between texts (e.g. Gatsby vs The Age of Innocence view of class).
- Organises points into patterns (e.g. repeated motifs, structural arcs, parallel scenes).

What you should look for
- Verbs: analyse, compare, contrast, trace, examine, connect, organise.
- Patterns: “This recurring green light symbolises…”, “By shifting from first-person to third-person, the text…”.

Bloom focus: Analyse (4) as main target.

---

EngLit AO3 – Context, Perspectives & Connections (Bloom 4–5)
Does the student bring in context and alternative perspectives in a way that deepens their interpretation?

What “Yes” looks like
- Uses contextual information to explain interpretations (e.g. Jazz Age, patriarchal norms, post-war anxiety).
- Explores different readings (feminist, Marxist, post-colonial, etc.) without just name-dropping labels.
- Makes comparative links across texts and genres in a purposeful way, not random.

What you should look for
- Verbs: situate, connect, contrast, relate, re-frame, reinterpret.
- Patterns: “Given inter-war American consumerism…”, “From a feminist perspective…”, “Compared with Dracula, The Bloody Chamber…”.

Bloom focus: High Analyse, low-to-mid Evaluate (using context to weigh interpretations).

---

EngLit AO4 – Evaluation of Interpretations & Argument Coherence (Bloom 5)
Does the student evaluate interpretations (their own and others’) and sustain a justified, nuanced argument?

What “Yes” looks like
- Explicitly weighs interpretations: “To some extent… but…”.
- Evaluates strengths and limits of a reading: what it illuminates vs what it misses.
- Ends with a clear, defended position that follows from their analysis.

What you should look for
- Verbs: evaluate, argue, defend, qualify, critique, justify, weigh.
- Patterns: “Some critics argue that… however…”, “This reading ignores…”, “Overall, the most convincing view is… because…”.

Bloom focus: Clear Evaluate (5), dependent on AO1–3.

---

############################################################
### PHYSICS – ORAL CRITICAL THINKING AOs (3)
############################################################

Physics AO1 – Conceptual Modelling & Representation (Bloom 2–3)
Does the student select and verbally construct an appropriate physical model for the situation?

What “Yes” looks like
- Identifies the relevant principles (e.g. conservation of energy, Newton’s laws, wave superposition).
- States the core relationships in words (they don’t need to recite formulas, but they must implicitly use them correctly).
- Chooses appropriate idealisations (e.g. treating air resistance as negligible, modelling masses as points).

What you should look for
- Verbs: describe, model, represent, classify, identify.
- Patterns: “We can treat this as uniform acceleration…”, “This is essentially SHM because…”.

Bloom focus: Understand / Apply, sets up the higher AOs.

---

Physics AO2 – Analytical Reasoning Within the Model (Bloom 4)
Does the student analyse the situation through the model, tracing relationships and exploring variations?

What “Yes” looks like
- Follows a logical reasoning chain (e.g. “If force doubles, then acceleration… so velocity after t… so kinetic energy…”).
- Compares different possible approaches/models and explains why one is preferable.
- Explores parameter changes: “If we increase the mass… this will…”.

What you should look for
- Verbs: analyse, compare, examine, test, trace, explore.
- Patterns: “First consider the forces… then…”, “Alternatively, if we use energy instead of forces…”.

Bloom focus: Analyse (4).

---

Physics AO3 – Evaluation of Assumptions, Limitations & Reliability (Bloom 5)
Does the student evaluate the model’s assumptions, limitations of methods, and reliability of conclusions?

What “Yes” looks like
- Identifies key assumptions and simplifications (e.g. “Assume frictionless surface…”).
- Explains how violating assumptions would change the result.
- Comments on experimental limitations and error sources (systematic vs random) when relevant.
- Judges validity range (e.g. “Only valid for small angles”, “Breaks down at relativistic speeds”).

What you should look for
- Verbs: evaluate, question, challenge, qualify, critique, justify.
- Patterns: “This result is only approximate because…”, “A major limitation is…”, “If air resistance isn’t negligible, then…”.

Bloom focus: Evaluate (5).

---

### ASSESSMENT WORKFLOW #### 

STEP 1: IDENTIFY THE SUBJECT 
- Determine whether the response pertains to English Literature, Economics, or Physics.
 - If unclear, infer from the content (e.g., references to texts suggest English Literature; discussions of market dynamics suggest Economics). 
 
 #### STEP 2: EVALUATE EACH RELEVANT AO For each AO (typically 4 per subject): 
 1. Assess the student's performance (score 0-100) 
 2. Provide specific, actionable feedback highlighting strengths and areas for improvement 
 3. Reference concrete examples from the response where possible 
 
 #### STEP 3: CHECK AO FULFILMENT 
 For each AO, determine: - Status: "Yes" (clearly addressed), "Partially" (some evidence), or "No" (not addressed) 
 - Evidence: List 2-3 specific examples from the response that demonstrate fulfilment (or lack thereof)
 
 #### STEP 4: IDENTIFY INSIGHTS Extract 3-5 notable insights from the response. 
 For each insight: - text: The insight itself (e.g., "Links Gatsby's pursuit of Daisy to the American Dream") 
 - classification: "Novel" (original/creative), "Standard" (common but accurate), or "Incorrect" (flawed) - rarity: 1 (very common) to 5 (highly original) - relevance: "Relevant" (on-topic), "Marginal" (tangentially related), or "Off-topic"
 
 #### STEP 5: PROVIDE OVERALL FEEDBACK 
 - Summarise the student's strengths (e.g., "Strong grasp of AO2, with clear articulation of how Dickens uses repetition")
  - Highlight areas for improvement (e.g., "AO3 could be strengthened by more explicit discussion of Victorian attitudes to poverty")
  - Offer actionable advice (e.g., "Consider exploring how Scrooge's transformation reflects broader social critiques")

---

### OUTPUT FORMAT

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
    }
  ],
  "overallFeedback": "<Comprehensive summary>"
}

---

### INPUT

Assignment Subject: ${assignment.subject}
Assignment Question: ${assignment.question}

Student's Response Transcript:
${transcript}

Key Concepts Identified: ${concepts.join(', ')}

---

Provide your assessment in the JSON format specified above. Be constructive and specific.
`
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
