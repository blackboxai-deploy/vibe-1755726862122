"use client";

import { useState, useCallback } from "react";
import { GeneratedImage, GenerationRequest, GenerationSettings, DEFAULT_SETTINGS } from "@/lib/types";

export function useImageGeneration() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an AI image generator. Create high-quality, detailed images based on the user's prompt. Focus on visual clarity, artistic composition, and accurate representation of the described elements."
  );

  const generateImage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 1000);

      const request: GenerationRequest = {
        prompt,
        settings,
        systemPrompt,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();

      if (data.success && data.imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt,
          timestamp: Date.now(),
          settings: { ...settings },
        };

        setImages((prev) => [newImage, ...prev]);
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [settings, systemPrompt]);

  const deleteImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  const downloadImage = useCallback(async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download image");
    }
  }, []);

  return {
    images,
    isGenerating,
    progress,
    error,
    settings,
    systemPrompt,
    setSettings,
    setSystemPrompt,
    generateImage,
    deleteImage,
    clearImages,
    downloadImage,
    setError,
  };
}