"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GeneratedImage } from "@/lib/types";

interface ImageGalleryProps {
  images: GeneratedImage[];
  onDownload: (url: string, filename: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function ImageGallery({ images, onDownload, onDelete, onClear }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleDownload = (image: GeneratedImage) => {
    const filename = `generated-image-${image.id}.png`;
    onDownload(image.url, filename);
  };

  if (images.length === 0) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-4xl">🖼️</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No images generated yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter a prompt and click "Generate Image" to create your first AI-generated image.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Generated Images ({images.length})
        </h2>
        {images.length > 0 && (
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(image)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                
                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(image.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {image.prompt}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {image.settings.width}×{image.settings.height}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {image.settings.quality}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {image.settings.style}
                  </Badge>
                </div>

                <p className="text-xs text-gray-500">
                  {formatTimestamp(image.timestamp)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Generated Image Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              
              <div className="space-y-2">
                <div>
                  <strong className="text-sm">Prompt:</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedImage.prompt}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {selectedImage.settings.width}×{selectedImage.settings.height}
                  </Badge>
                  <Badge variant="outline">
                    {selectedImage.settings.quality}
                  </Badge>
                  <Badge variant="outline">
                    {selectedImage.settings.style}
                  </Badge>
                  {selectedImage.settings.steps && (
                    <Badge variant="outline">
                      {selectedImage.settings.steps} steps
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Generated: {formatTimestamp(selectedImage.timestamp)}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleDownload(selectedImage)} className="flex-1">
                  Download Image
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDelete(selectedImage.id);
                    setSelectedImage(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}