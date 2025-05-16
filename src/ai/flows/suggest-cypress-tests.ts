// src/ai/flows/suggest-cypress-tests.ts
'use server';

/**
 * @fileOverview Analyzes a GitHub repository and suggests potential Cypress tests based on user-facing functionalities.
 *
 * - suggestCypressTests - A function that suggests Cypress tests for a given repository URL.
 * - SuggestCypressTestsInput - The input type for the suggestCypressTests function.
 * - SuggestCypressTestsOutput - The return type for the suggestCypressTests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCypressTestsInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository to analyze.'),
});
export type SuggestCypressTestsInput = z.infer<typeof SuggestCypressTestsInputSchema>;

const SuggestCypressTestsOutputSchema = z.object({
  testSuggestions: z
    .array(z.string())
    .describe('An array of suggested Cypress tests based on the repository analysis.'),
});
export type SuggestCypressTestsOutput = z.infer<typeof SuggestCypressTestsOutputSchema>;

export async function suggestCypressTests(input: SuggestCypressTestsInput): Promise<SuggestCypressTestsOutput> {
  return suggestCypressTestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCypressTestsPrompt',
  input: {schema: SuggestCypressTestsInputSchema},
  output: {schema: SuggestCypressTestsOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing GitHub repositories and suggesting Cypress tests.

  Analyze the repository at the following URL: {{{repoUrl}}}

  Based on the repository's structure, common user flows, and potential functionalities, suggest a list of Cypress tests that would be valuable to implement.
  Focus on user-facing functionalities and provide test suggestions that cover a wide range of user interactions.

  Return the test suggestions as an array of strings.
  `,
});

const suggestCypressTestsFlow = ai.defineFlow(
  {
    name: 'suggestCypressTestsFlow',
    inputSchema: SuggestCypressTestsInputSchema,
    outputSchema: SuggestCypressTestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
