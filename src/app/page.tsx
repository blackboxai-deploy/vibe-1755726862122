"use client";

import { ImageGenerator } from "@/components/ImageGenerator";
import { ImageGallery } from "@/components/ImageGallery";
import { useImageGeneration } from "@/hooks/useImageGeneration";

export default function Home() {
  const imageGeneration = useImageGeneration();

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          AI Image Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create stunning, high-quality images using advanced AI technology. 
          Enter your prompt and watch your imagination come to life.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ImageGenerator {...imageGeneration} />
        </div>
        
        <div className="lg:col-span-2">
          <ImageGallery 
            images={imageGeneration.images}
            onDownload={imageGeneration.downloadImage}
            onDelete={imageGeneration.deleteImage}
            onClear={imageGeneration.clearImages}
          />
        </div>
      </div>
    </main>
  );
}