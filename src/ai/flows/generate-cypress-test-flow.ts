
'use server';
/**
 * @fileOverview Generates Cypress test code for a given functionality within a repository.
 *
 * - generateCypressTest - A function that generates Cypress test code.
 * - GenerateCypressTestInput - The input type for the generateCypressTest function.
 * - GenerateCypressTestOutput - The return type for the generateCypressTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCypressTestInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  functionalityDescription: z.string().describe('A description of the functionality to test (e.g., "User login", "Add item to cart").'),
  testType: z.enum(['e2e', 'component']).describe('The type of Cypress test to generate (End-to-End or Component).'),
});
export type GenerateCypressTestInput = z.infer<typeof GenerateCypressTestInputSchema>;

const GenerateCypressTestOutputSchema = z.object({
  generatedTestCode: z.string().describe('The generated Cypress test code.'),
});
export type GenerateCypressTestOutput = z.infer<typeof GenerateCypressTestOutputSchema>;

export async function generateCypressTest(input: GenerateCypressTestInput): Promise<GenerateCypressTestOutput> {
  return generateCypressTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCypressTestPrompt',
  input: {schema: GenerateCypressTestInputSchema},
  output: {schema: GenerateCypressTestOutputSchema},
  prompt: `You are an AI assistant specialized in writing Cypress tests.
  
  Repository URL: {{{repoUrl}}}
  Functionality to test: "{{{functionalityDescription}}}"
  Test type: {{{testType}}}

  Based on the provided information, generate a Cypress {{{testType}}} test script.
  
  Follow these guidelines:
  - If it's an 'e2e' test, include 'cy.visit()' to navigate to an appropriate page (make a sensible guess for the path based on the functionality).
  - If it's a 'component' test, include a placeholder for mounting the component, e.g., '// cy.mount(<MyComponent />);'.
  - Include a 'describe' block named after the functionality.
  - Include at least one 'it' block with a descriptive name for a key action.
  - Use common Cypress commands and assertions.
  - Make sure the generated code is valid JavaScript/TypeScript for a Cypress test file.
  - Provide only the code as a single string. Do not include any explanations or markdown formatting.

  Example for an E2E test for "User Login":
  describe('User Login', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should allow a user to log in with valid credentials', () => {
      cy.get('[data-cy="username-input"]').type('testuser');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome, testuser').should('be.visible');
    });
  });

  Example for a Component test for "Submit Button":
  describe('Submit Button Component', () => {
    beforeEach(() => {
      // cy.mount(<SubmitButton />);
    });

    it('should be visible and clickable', () => {
      cy.get('[data-cy="submit-button"]').should('be.visible').and('not.be.disabled');
      // cy.get('[data-cy="submit-button"]').click();
      // Add assertions for expected behavior after click
    });
  });

  Now, generate the test code for the requested functionality.
  `,
});

const generateCypressTestFlow = ai.defineFlow(
  {
    name: 'generateCypressTestFlow',
    inputSchema: GenerateCypressTestInputSchema,
    outputSchema: GenerateCypressTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Failed to generate test code. The AI model did not return an output.");
    }
    return output;
  }
);
