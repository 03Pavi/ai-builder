import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { instructions } = await req.json();
    console.log(instructions, 'hello')
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          {
            role: 'system',
            content: 'You are a full-stack AI project generator. When given app instructions, you return a full folder structure and code for key files.'
          },
          {
            role: 'user',
            content: `${instructions}

      Now, return the full project as a JavaScript object using this format:
      {
        name: string,
        type: "folder" | "file",
        content?: string,
        children?: array
      }

      - The entire project should be nested under a top-level folder.
      - Do not wrap the output in markdown backticks or explanations.
      - Only return the JavaScript object directly.
      - Use template literals (\`) for content field values.
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