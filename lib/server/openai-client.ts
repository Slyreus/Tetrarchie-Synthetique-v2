import OpenAI from 'openai';

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4';

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing. Configure it in GitHub private environment variables.');
  }
  return new OpenAI({ apiKey });
}
