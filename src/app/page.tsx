"use client";

import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { RepoUrlForm } from "@/components/test-generator/repo-url-form";
import { FunctionalitySelector } from "@/components/test-generator/functionality-selector";
import { TestPreviewPanel } from "@/components/test-generator/test-preview-panel";
import { TestOutputConsole } from "@/components/test-generator/test-output-console";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
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
    setSuggestedFunctionalities([]);
    setSelectedFunctionality(null);
    setSelectedTestType(null);
    setGeneratedTestCode("");
    setTestLogs([]);
    setTestResult(null);
  }, []);

  const handleAnalysisComplete = useCallback((suggestions: string[]) => {
    setIsAnalyzing(false);
    setSuggestedFunctionalities(suggestions);
    if (suggestions.length === 0) {
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
  }, []);

  const handleGenerateTest = useCallback(async () => {
    if (!selectedFunctionality || !selectedTestType) {
      toast({ title: "Missing Selections", description: "Please select a functionality and test type.", variant: "destructive" });
      return;
    }
    setIsGeneratingTest(true);
    setGeneratedTestCode(""); // Clear previous
    // Simulate AI test generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockCode = `// Cypress ${selectedTestType} test for "${selectedFunctionality}"
describe('${selectedFunctionality}', () => {
  beforeEach(() => {
    // Mock API calls or setup state
    cy.intercept('/api/data', { fixture: 'data.json' }).as('getData');
    ${selectedTestType === 'component' ? `// cy.mount(<MyComponent />);` : `cy.visit('/${selectedFunctionality.toLowerCase().replace(/\s+/g, '-')}');`}
  });

  it('should perform a key action related to ${selectedFunctionality}', () => {
    // Example assertion
    cy.get('[data-cy="submit-button"]').should('be.visible');
    cy.get('[data-cy="input-field"]').type('Test input');
    cy.get('[data-cy="submit-button"]').click();
    cy.contains('Success').should('be.visible');
  });
});`;
    setGeneratedTestCode(mockCode);
    setIsGeneratingTest(false);
    toast({ title: "Test Code Generated", description: "Mock test code has been populated." });
  }, [selectedFunctionality, selectedTestType, toast]);

  const handleRunTest = useCallback(async () => {
    if (!generatedTestCode) {
      toast({ title: "No Test Code", description: "Please generate test code first.", variant: "destructive" });
      return;
    }
    setIsTestRunning(true);
    setTestResult("running");
    setTestLogs(["Starting test execution..."]);

    // Simulate test execution and log streaming
    const mockLogs = [
      `Executing: ${selectedFunctionality || 'Test'} (${selectedTestType || 'N/A'})`,
      "Cypress version: 12.0.0",
      "Browser: Electron (headless)",
      "Specs: 1 found (generated_test.cy.js)",
      "Running: generated_test.cy.js",
      "  ✓ Test for " + selectedFunctionality + " (500ms)",
      "All specs passed!"
    ];
    
    for (let i = 0; i < mockLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTestLogs(prev => [...prev, mockLogs[i]]);
    }

    const randomPass = Math.random() > 0.3; // 70% chance of passing
    setTestResult(randomPass ? "pass" : "fail");
    setTestLogs(prev => [...prev, `Test ${randomPass ? "Passed" : "Failed"}`]);
    setIsTestRunning(false);
    toast({ title: "Test Execution Finished", description: `Test ${randomPass ? "passed" : "failed"}.` });
  }, [generatedTestCode, selectedFunctionality, selectedTestType, toast]);

  const sidebar = (
    <div className="space-y-6">
      <RepoUrlForm 
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
      />
      <FunctionalitySelector
        functionalities={suggestedFunctionalities}
        selectedFunctionality={selectedFunctionality}
        onFunctionalityChange={setSelectedFunctionality}
        selectedTestType={selectedTestType}
        onTestTypeChange={setSelectedTestType}
        isLoading={isAnalyzing}
        disabled={suggestedFunctionalities.length === 0 && !isAnalyzing}
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
            canGenerate={!!selectedFunctionality && !!selectedTestType}
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
