
// src/app/actions.ts
"use server";

import { z } from "zod";
import { suggestCypressTests } from "@/ai/flows/suggest-cypress-tests";
import type { SuggestCypressTestsOutput } from "@/ai/flows/suggest-cypress-tests";

const AnalyzeRepoSchema = z.object({
  repoUrl: z.string().url({ message: "Invalid GitHub repository URL." }),
});

export interface AnalyzeRepoState {
  suggestions?: string[];
  repoUrl?: string; // Added repoUrl
  error?: string;
  success: boolean;
}

export async function analyzeRepositoryAction(
  prevState: AnalyzeRepoState,
  formData: FormData
): Promise<AnalyzeRepoState> {
  const validatedFields = AnalyzeRepoSchema.safeParse({
    repoUrl: formData.get("repoUrl"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.repoUrl?.[0] || "Validation failed.",
      success: false,
    };
  }

  try {
    const result: SuggestCypressTestsOutput = await suggestCypressTests({
      repoUrl: validatedFields.data.repoUrl,
    });
    
    if (result && result.testSuggestions) {
      return { 
        suggestions: result.testSuggestions, 
        repoUrl: validatedFields.data.repoUrl, // Return repoUrl on success
        success: true 
      };
    } else {
      return { error: "No suggestions received from AI.", success: false };
    }
  } catch (error) {
    console.error("Error analyzing repository:", error);
    // Check if error is an instance of Error to access message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { 
        error: `Failed to analyze repository: ${errorMessage}. Please check the URL or try again later.`, 
        success: false 
    };
  }
}
