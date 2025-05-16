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
      return { suggestions: result.testSuggestions, success: true };
    } else {
      return { error: "No suggestions received from AI.", success: false };
    }
  } catch (error) {
    console.error("Error analyzing repository:", error);
    return { error: "Failed to analyze repository. Please check the URL or try again later.", success: false };
  }
}
