"use client";

import { PromptInput } from "./PromptInput";
import { GenerationProgress } from "./GenerationProgress";
import { SettingsPanel } from "./SettingsPanel";
import { GenerationSettings } from "@/lib/types";

interface ImageGeneratorProps {
  generateImage: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  progress: number;
  error: string | null;
  settings: GenerationSettings;
  systemPrompt: string;
  setSettings: (settings: GenerationSettings) => void;
  setSystemPrompt: (prompt: string) => void;
  setError: (error: string | null) => void;
}

export function ImageGenerator({
  generateImage,
  isGenerating,
  progress,
  error,
  settings,
  systemPrompt,
  setSettings,
  setSystemPrompt,
  setError,
}: ImageGeneratorProps) {
  const handleGenerate = async (prompt: string) => {
    setError(null);
    await generateImage(prompt);
  };

  return (
    <div className="space-y-6">
      <PromptInput
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        error={error}
      />

      {isGenerating && (
        <GenerationProgress
          isGenerating={isGenerating}
          progress={progress}
        />
      )}

      <SettingsPanel
        settings={settings}
        systemPrompt={systemPrompt}
        onSettingsChange={setSettings}
        onSystemPromptChange={setSystemPrompt}
        isGenerating={isGenerating}
      />
    </div>
  );
}