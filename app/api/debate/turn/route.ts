import { NextRequest, NextResponse } from 'next/server';
import { generateDebateTurn } from '@/lib/server/debate-orchestrator';
import { DebateTurnRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DebateTurnRequest;

    if (!body?.config?.topic) {
      return NextResponse.json({ error: 'Invalid payload: missing config/topic.' }, { status: 400 });
    }

    const result = await generateDebateTurn(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
