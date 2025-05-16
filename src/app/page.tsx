
"use client";

import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { RepoUrlForm } from "@/components/test-generator/repo-url-form";
import { FunctionalitySelector } from "@/components/test-generator/functionality-selector";
import { TestPreviewPanel } from "@/components/test-generator/test-preview-panel";
import { TestOutputConsole } from "@/components/test-generator/test-output-console";
import { useToast } from "@/hooks/use-toast";
import { generateCypressTest, type GenerateCypressTestOutput } from "@/ai/flows/generate-cypress-test-flow";

export default function Home() {
  const [currentRepoUrl, setCurrentRepoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [suggestedFunctionalities, setSuggestedFunctionalities] = useState<string[]>([]);
  
  const [selectedFunctionality, setSelectedFunctionality] = useState<string | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<'e2e' | 'component' | null>(null);
  
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [generatedTestCode, setGeneratedTestCode] = useState<string>("");
  
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<"pass" | "fail" | "running" | null>(null);

  const { toast } = useToast();

  const handleAnalysisStart = useCallback(() => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentRepoUrl(null);
    setSuggestedFunctionalities([]);
    setSelectedFunctionality(null);
    setSelectedTestType(null);
    setGeneratedTestCode("");
    setTestLogs([]);
    setTestResult(null);
  }, []);

  const handleAnalysisSuccess = useCallback((data: { suggestions: string[]; repoUrl: string }) => {
    setIsAnalyzing(false);
    setSuggestedFunctionalities(data.suggestions);
    setCurrentRepoUrl(data.repoUrl);
    if (data.suggestions.length === 0) {
      toast({
        title: "No Functionalities Found",
        description: "The AI could not identify specific functionalities to test.",
        variant: "default"
      });
    }
  }, [toast]);

  const handleAnalysisError = useCallback((error: string) => {
    setIsAnalyzing(false);
    setAnalysisError(error);
    setCurrentRepoUrl(null);
  }, []);

  const handleGenerateTest = useCallback(async () => {
    if (!selectedFunctionality || !selectedTestType) {
      toast({ title: "Missing Selections", description: "Please select a functionality and test type.", variant: "destructive" });
      return;
    }
    if (!currentRepoUrl) {
      toast({ title: "Repository Not Analyzed", description: "Please analyze a repository first.", variant: "destructive" });
      return;
    }

    setIsGeneratingTest(true);
    setGeneratedTestCode(""); 
    
    try {
      const result: GenerateCypressTestOutput = await generateCypressTest({
        repoUrl: currentRepoUrl,
        functionalityDescription: selectedFunctionality,
        testType: selectedTestType,
      });

      if (result && result.generatedTestCode) {
        setGeneratedTestCode(result.generatedTestCode);
        toast({ title: "Test Code Generated", description: "AI has generated the test code." });
      } else {
        setGeneratedTestCode("// AI failed to generate test code. Please try again.");
        toast({ title: "Generation Failed", description: "AI could not generate test code.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating test code:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during test generation.";
      setGeneratedTestCode(`// Error generating test code: ${errorMessage}`);
      toast({ title: "Generation Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsGeneratingTest(false);
    }
  }, [selectedFunctionality, selectedTestType, currentRepoUrl, toast]);

  const handleRunTest = useCallback(async () => {
    if (!generatedTestCode) {
      toast({ title: "No Test Code", description: "Please generate test code first.", variant: "destructive" });
      return;
    }
    setIsTestRunning(true);
    setTestResult("running");
    setTestLogs(["Starting test execution (simulation)..."]);

    // Simulate test execution and log streaming
    const mockLogs = [
      `Executing: ${selectedFunctionality || 'Test'} (${selectedTestType || 'N/A'})`,
      "Cypress version: 12.0.0 (simulated)",
      "Browser: Electron (headless, simulated)",
      "Specs: 1 found (generated_test.cy.js)",
      "Running: generated_test.cy.js (simulated)",
      "  ✓ Test for " + selectedFunctionality + " (500ms, simulated)",
      "All specs passed! (simulated)"
    ];
    
    for (let i = 0; i < mockLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Faster simulation
      setTestLogs(prev => [...prev, mockLogs[i]]);
    }

    const randomPass = Math.random() > 0.3; // 70% chance of passing
    setTestResult(randomPass ? "pass" : "fail");
    setTestLogs(prev => [...prev, `Test ${randomPass ? "Passed" : "Failed"} (simulated)`]);
    setIsTestRunning(false);
    toast({ title: "Test Execution Finished", description: `Simulated test ${randomPass ? "passed" : "failed"}.` });
  }, [generatedTestCode, selectedFunctionality, selectedTestType, toast]);

  const sidebar = (
    <div className="space-y-6">
      <RepoUrlForm 
        onAnalysisStart={handleAnalysisStart}
        onAnalysisSuccess={handleAnalysisSuccess}
        onAnalysisError={handleAnalysisError}
      />
      <FunctionalitySelector
        functionalities={suggestedFunctionalities}
        selectedFunctionality={selectedFunctionality}
        onFunctionalityChange={setSelectedFunctionality}
        selectedTestType={selectedTestType}
        onTestTypeChange={setSelectedTestType}
        isLoading={isAnalyzing}
        disabled={(suggestedFunctionalities.length === 0 && !isAnalyzing) || !currentRepoUrl}
      />
    </div>
  );

  return (
    <AppLayout sidebarContent={sidebar}>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 lg:w-3/5">
          <TestPreviewPanel
            generatedCode={generatedTestCode}
            onGenerateTest={handleGenerateTest}
            onRunTest={handleRunTest}
            isGenerating={isGeneratingTest}
            isTestRunning={isTestRunning}
            canGenerate={!!selectedFunctionality && !!selectedTestType && !!currentRepoUrl}
            canRun={!!generatedTestCode}
          />
        </div>
        <div className="flex-1 lg:w-2/5">
          <TestOutputConsole logs={testLogs} result={testResult} />
        </div>
      </div>
    </AppLayout>
  );
}
