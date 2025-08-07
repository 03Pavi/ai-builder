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
        model: 'openrouter/horizon-beta',
        messages: [
          {
            role: 'system',
            content: `You are a full-stack AI project generator. When provided with app requirements, you enhance and expand the instructions into a clear, detailed, and professional prompt for generating a full-stack project.`
          },
          {
            role: 'user',
            content: `
${instructions}

Enhance the above instructions to include:
- Clear project goals
- High-level technical stack (like framework, language, UI library, etc.)
- UI layout expectations (e.g., panels, editors, sidebars)
- Interaction flow if relevant
- Emphasis on best practices and maintainable folder structure

Then, return the full project structure and key code files as a JavaScript object using this format:

{
  name: string,
  type: "folder" | "file",
  content?: string,
  children?: array
}

Constraints:
- Nest everything under a top-level folder
- No markdown formatting or extra text
- Only return the JavaScript object
- Use template literals (\`) for content field values
`
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
