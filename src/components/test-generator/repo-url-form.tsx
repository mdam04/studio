
"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom"; 
import { useActionState } from "react"; 
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeRepositoryAction, type AnalyzeRepoState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface RepoUrlFormProps {
  onAnalysisSuccess: (data: { suggestions: string[]; repoUrl: string }) => void;
  onAnalysisStart: () => void;
  onAnalysisError: (error: string) => void;
}

const initialState: AnalyzeRepoState = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
      Analyze Repository
    </Button>
  );
}

export function RepoUrlForm({ onAnalysisSuccess, onAnalysisStart, onAnalysisError }: RepoUrlFormProps) {
  const [state, formAction] = useActionState(analyzeRepositoryAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success && state.suggestions && state.repoUrl) {
      onAnalysisSuccess({ suggestions: state.suggestions, repoUrl: state.repoUrl });
      toast({
        title: "Analysis Complete",
        description: `${state.suggestions.length} functionalities suggested.`,
      });
    } else if (!state.success && state.error) {
      onAnalysisError(state.error);
      toast({
        title: "Analysis Failed",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, onAnalysisSuccess, onAnalysisError, toast]);

  const handleFormAction = (formData: FormData) => {
    onAnalysisStart();
    formAction(formData);
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Repository Analysis</CardTitle>
        <CardDescription>Enter a GitHub repository URL to analyze.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleFormAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="repoUrl">GitHub Repository URL</Label>
            <Input
              id="repoUrl"
              name="repoUrl"
              type="url"
              placeholder="https://github.com/user/repo"
              required
              className="bg-background"
            />
            {state?.error && !state.success && <p className="text-xs text-destructive">{state.error}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
