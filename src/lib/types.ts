export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  settings: GenerationSettings;
}

export interface GenerationSettings {
  width: number;
  height: number;
  quality: string;
  style: string;
  steps?: number;
}

export interface GenerationRequest {
  prompt: string;
  settings: GenerationSettings;
  systemPrompt?: string;
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  generationTime?: number;
}

export interface GenerationProgress {
  isGenerating: boolean;
  progress: number;
  status: string;
  estimatedTime?: number;
}

export const DEFAULT_SETTINGS: GenerationSettings = {
  width: 1024,
  height: 1024,
  quality: "standard",
  style: "realistic",
  steps: 50,
};

export const PRESET_DIMENSIONS = [
  { name: "Square", width: 1024, height: 1024 },
  { name: "Portrait", width: 768, height: 1024 },
  { name: "Landscape", width: 1024, height: 768 },
  { name: "Wide", width: 1344, height: 768 },
  { name: "Tall", width: 768, height: 1344 },
];

export const QUALITY_OPTIONS = [
  { value: "draft", label: "Draft", description: "Fast generation" },
  { value: "standard", label: "Standard", description: "Balanced quality" },
  { value: "high", label: "High", description: "Best quality" },
];

export const STYLE_PRESETS = [
  { value: "realistic", label: "Realistic", description: "Photorealistic images" },
  { value: "artistic", label: "Artistic", description: "Painterly style" },
  { value: "digital", label: "Digital Art", description: "Digital illustration" },
  { value: "anime", label: "Anime", description: "Anime/manga style" },
  { value: "abstract", label: "Abstract", description: "Abstract art" },
];