"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GenerationSettings, PRESET_DIMENSIONS, QUALITY_OPTIONS, STYLE_PRESETS } from "@/lib/types";

interface SettingsPanelProps {
  settings: GenerationSettings;
  systemPrompt: string;
  onSettingsChange: (settings: GenerationSettings) => void;
  onSystemPromptChange: (prompt: string) => void;
  isGenerating: boolean;
}

export function SettingsPanel({ 
  settings, 
  systemPrompt, 
  onSettingsChange, 
  onSystemPromptChange, 
  isGenerating 
}: SettingsPanelProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateSetting = <K extends keyof GenerationSettings>(
    key: K, 
    value: GenerationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleDimensionChange = (dimensionString: string) => {
    const [width, height] = dimensionString.split("x").map(Number);
    onSettingsChange({ ...settings, width, height });
  };

  const currentDimension = `${settings.width}x${settings.height}`;
  const isCustomDimension = !PRESET_DIMENSIONS.some(
    preset => `${preset.width}x${preset.height}` === currentDimension
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Generation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Dimensions */}
        <div className="space-y-2">
          <Label>Image Size</Label>
          <Select 
            value={isCustomDimension ? "custom" : currentDimension}
            onValueChange={handleDimensionChange}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dimensions" />
            </SelectTrigger>
            <SelectContent>
              {PRESET_DIMENSIONS.map((preset) => (
                <SelectItem 
                  key={`${preset.width}x${preset.height}`} 
                  value={`${preset.width}x${preset.height}`}
                >
                  {preset.name} ({preset.width}×{preset.height})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isCustomDimension && (
            <p className="text-xs text-gray-500">
              Custom: {settings.width}×{settings.height}
            </p>
          )}
        </div>

        {/* Quality Setting */}
        <div className="space-y-2">
          <Label>Quality</Label>
          <Select 
            value={settings.quality} 
            onValueChange={(value) => updateSetting("quality", value)}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {QUALITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style Preset */}
        <div className="space-y-2">
          <Label>Style</Label>
          <Select 
            value={settings.style} 
            onValueChange={(value) => updateSetting("style", value)}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {STYLE_PRESETS.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div>
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs text-gray-500">{style.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Advanced Settings */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Advanced Settings</span>
              <span className="text-xs text-gray-500">
                {isAdvancedOpen ? "Hide" : "Show"}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* System Prompt */}
            <div className="space-y-2">
              <Label>System Prompt</Label>
              <Textarea
                value={systemPrompt}
                onChange={(e) => onSystemPromptChange(e.target.value)}
                placeholder="Customize how the AI interprets your prompts..."
                className="min-h-[100px] text-xs"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-500">
                Customize how the AI interprets and processes your image prompts
              </p>
            </div>

            {/* Generation Steps */}
            <div className="space-y-2">
              <Label>Generation Steps: {settings.steps || 50}</Label>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={settings.steps || 50}
                onChange={(e) => updateSetting("steps", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isGenerating}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Faster</span>
                <span>Higher Quality</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}