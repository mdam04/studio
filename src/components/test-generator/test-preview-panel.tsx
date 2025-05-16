"use client";

import { FileCode, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestPreviewPanelProps {
  generatedCode: string;
  onGenerateTest: () => void;
  onRunTest: () => void;
  isGenerating: boolean;
  isTestRunning: boolean;
  canGenerate: boolean;
  canRun: boolean;
}

export function TestPreviewPanel({
  generatedCode,
  onGenerateTest,
  onRunTest,
  isGenerating,
  isTestRunning,
  canGenerate,
  canRun,
}: TestPreviewPanelProps) {
  return (
    <Card className="shadow-lg flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <FileCode className="mr-2 h-5 w-5 text-primary" />
            Generated Test Code
          </CardTitle>
          <CardDescription>
            Preview the generated Cypress test. Edit if needed (editing not implemented).
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button onClick={onGenerateTest} disabled={isGenerating || isTestRunning || !canGenerate} size="sm">
            <Zap className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Test"}
          </Button>
          <Button onClick={onRunTest} disabled={isTestRunning || !canRun} size="sm" variant="default">
            <Play className="mr-2 h-4 w-4" />
            {isTestRunning ? "Running..." : "Run Test"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 rounded-md border bg-muted/30">
          <Textarea
            value={generatedCode}
            readOnly
            placeholder="Select functionality and test type, then click 'Generate Test' to see code here..."
            className="h-full min-h-[300px] resize-none border-0 bg-transparent font-mono text-sm p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Generated Cypress test code"
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
