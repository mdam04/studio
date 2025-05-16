"use client";

import { CheckCircle2, XCircle, Loader2, Terminal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TestOutputConsoleProps {
  logs: string[];
  result: "pass" | "fail" | "running" | null;
}

const resultConfig = {
  pass: { icon: CheckCircle2, text: "Passed", color: "bg-green-500 dark:bg-green-600 text-white" },
  fail: { icon: XCircle, text: "Failed", color: "bg-red-500 dark:bg-red-600 text-white" },
  running: { icon: Loader2, text: "Running...", color: "bg-blue-500 dark:bg-blue-600 text-white animate-spin" },
};

export function TestOutputConsole({ logs, result }: TestOutputConsoleProps) {
  const currentResult = result ? resultConfig[result] : null;

  return (
    <Card className="shadow-lg flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <Terminal className="mr-2 h-5 w-5 text-primary" />
            Test Output
          </CardTitle>
          <CardDescription>
            Real-time logs and results from test execution.
          </CardDescription>
        </div>
        {currentResult && (
          <Badge className={cn("text-sm px-3 py-1", currentResult.color)}>
            <currentResult.icon className={cn("mr-1.5 h-4 w-4", result !== "running" && "animate-none")} />
            {currentResult.text}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 rounded-md border bg-muted/30 p-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No test output yet. Click "Run Test" to see logs.</p>
          ) : (
            <pre className="text-sm whitespace-pre-wrap break-all">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-xs leading-relaxed">{log}</div>
              ))}
            </pre>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
