"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FunctionalitySelectorProps {
  functionalities: string[];
  selectedFunctionality: string | null;
  onFunctionalityChange: (value: string) => void;
  selectedTestType: string | null;
  onTestTypeChange: (value: 'e2e' | 'component') => void;
  isLoading: boolean;
  disabled: boolean;
}

export function FunctionalitySelector({
  functionalities,
  selectedFunctionality,
  onFunctionalityChange,
  selectedTestType,
  onTestTypeChange,
  isLoading,
  disabled,
}: FunctionalitySelectorProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Test Configuration</CardTitle>
        <CardDescription>Select functionality and test type.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="functionality">Functionality</Label>
          <Select
            value={selectedFunctionality || ""}
            onValueChange={onFunctionalityChange}
            disabled={isLoading || disabled || functionalities.length === 0}
          >
            <SelectTrigger id="functionality" className="bg-background">
              <SelectValue placeholder={isLoading ? "Loading functionalities..." : "Select a functionality"} />
            </SelectTrigger>
            <SelectContent>
              {functionalities.map((func, index) => (
                <SelectItem key={index} value={func}>
                  {func}
                </SelectItem>
              ))}
              {functionalities.length === 0 && !isLoading && (
                <SelectItem value="-" disabled>
                  No functionalities found or repo not analyzed.
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="testType">Test Type</Label>
          <Select
            value={selectedTestType || ""}
            onValueChange={(value) => onTestTypeChange(value as 'e2e' | 'component')}
            disabled={isLoading || disabled}
          >
            <SelectTrigger id="testType" className="bg-background">
              <SelectValue placeholder="Select test type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="e2e">End-to-End (E2E)</SelectItem>
              <SelectItem value="component">Component</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
