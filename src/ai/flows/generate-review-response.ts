'use server';

/**
 * @fileOverview A flow that generates responses or summaries based on user's work logs.
 *
 * - generateReviewResponse - A function that handles the generation of responses based on user's work logs.
 * - GenerateReviewResponseInput - The input type for the generateReviewResponse function.
 * - GenerateReviewResponseOutput - The return type for the generateReviewResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReviewResponseInputSchema = z.object({
  workLogs: z.string().describe('The user\u2019s work logs for a specified period.'),
  question: z.string().describe('The question the user wants to ask about their work logs.'),
});
export type GenerateReviewResponseInput = z.infer<typeof GenerateReviewResponseInputSchema>;

const GenerateReviewResponseOutputSchema = z.object({
  response: z.string().describe('The generated response or summary based on the work logs and question.'),
});
export type GenerateReviewResponseOutput = z.infer<typeof GenerateReviewResponseOutputSchema>;

export async function generateReviewResponse(input: GenerateReviewResponseInput): Promise<GenerateReviewResponseOutput> {
  return generateReviewResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReviewResponsePrompt',
  input: {schema: GenerateReviewResponseInputSchema},
  output: {schema: GenerateReviewResponseOutputSchema},
  prompt: `You are a helpful AI assistant. Your primary task is to analyze the provided work logs and answer the user's question. Your response must be based *only* on the information contained within these logs.

Here are the user's work logs for the specified period:
---
{{workLogs}}
---

Based on these logs, please answer the following question in a professional and helpful tone.

Question: {{question}}

Generated Response:`,
});

const generateReviewResponseFlow = ai.defineFlow(
  {
    name: 'generateReviewResponseFlow',
    inputSchema: GenerateReviewResponseInputSchema,
    outputSchema: GenerateReviewResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
