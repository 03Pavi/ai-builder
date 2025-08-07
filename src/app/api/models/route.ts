import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await axios.get('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const models = response.data?.data ?? [];
        return NextResponse.json(models);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
