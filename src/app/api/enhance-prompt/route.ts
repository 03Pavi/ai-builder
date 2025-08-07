import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { instructions } = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [
          {
            role: 'system',
            content: `You are a professional full-stack AI project prompt generator. 
When given a short or vague project idea, you expand it into a comprehensive, technically detailed, and professional prompt. 
The prompt should describe the project in a single, well-written paragraph including:
- Main functionality and purpose
- Key features (e.g., CRUD, authentication, filtering)
- Suggested tech stack (frontend, backend, database)
- UI/UX expectations (responsive design, modern styling)
- Optional enhancements (like deployment, testing, search)

Do not use bullet points in the output. Your response must be clear, concise, and suitable for guiding a developer or another AI model to begin building the full application.`
          },
          {
            role: 'user',
            content: instructions // e.g., "Create todo app"
          }
        ]
      })
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      result: data.choices?.[0]?.message?.content ?? JSON.stringify(data, null, 2)
    });

  } catch (error) {
    console.error('Horizon API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to call Horizon' }, { status: 500 });
  }
}
