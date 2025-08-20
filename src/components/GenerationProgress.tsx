"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface GenerationProgressProps {
  isGenerating: boolean;
  progress: number;
}

export function GenerationProgress({ isGenerating, progress }: GenerationProgressProps) {
  if (!isGenerating) return null;

  const getStatusMessage = (progress: number) => {
    if (progress < 20) return "Initializing generation...";
    if (progress < 40) return "Processing prompt...";
    if (progress < 60) return "Creating image composition...";
    if (progress < 80) return "Refining details...";
    if (progress < 95) return "Finalizing image...";
    return "Almost ready!";
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Generating Your Image
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getStatusMessage(progress)}
            </p>
          </div>

          <Progress value={progress} className="w-full h-3" />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>This usually takes 1-3 minutes</p>
          </div>

          {/* Animated dots for visual feedback */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}