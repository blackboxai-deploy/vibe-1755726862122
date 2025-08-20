"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  error: string | null;
}

const SUGGESTED_PROMPTS = [
  "A serene mountain landscape at sunset with golden light",
  "Futuristic city with flying cars and neon lights",
  "Beautiful garden with colorful flowers and butterflies",
  "Abstract geometric patterns in vibrant colors",
  "Cozy cabin in a snowy forest during winter",
  "Underwater scene with coral reefs and tropical fish",
  "Modern architecture with glass and steel elements",
  "Fantasy castle floating in the clouds",
];

export function PromptInput({ onGenerate, isGenerating, error }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your image
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a detailed description of the image you want to generate..."
            className="min-h-[120px] resize-none"
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!prompt.trim() || isGenerating}
          size="lg"
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </form>

      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Try these prompts:
        </h3>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((suggestedPrompt, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-xs"
              onClick={() => handleSuggestedPrompt(suggestedPrompt)}
            >
              {suggestedPrompt.length > 40 
                ? `${suggestedPrompt.substring(0, 40)}...` 
                : suggestedPrompt
              }
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}