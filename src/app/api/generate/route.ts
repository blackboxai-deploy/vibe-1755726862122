import { NextRequest, NextResponse } from "next/server";
import { GenerationRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { prompt, settings, systemPrompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Valid prompt is required" },
        { status: 400 }
      );
    }

    // Build the enhanced prompt with style and quality considerations
    const enhancedPrompt = `${systemPrompt ? systemPrompt + "\n\n" : ""}Create a ${settings.style} style image with ${settings.quality} quality. ${prompt}. Image should be ${settings.width}x${settings.height} pixels.`;

    const startTime = Date.now();

    // Make request to Replicate via custom endpoint
    const response = await fetch("https://oi-server.onrender.com/chat/completions", {
      method: "POST",
      headers: {
        "customerId": "cus_S16jfiBUH2cc7P",
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx",
      },
      body: JSON.stringify({
        model: "replicate/black-forest-labs/flux-1.1-pro",
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
      }),
      // 5 minute timeout for image generation
      signal: AbortSignal.timeout(300000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Replicate API error:", response.status, errorText);
      
      if (response.status === 429) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded. Please try again in a few moments." },
          { status: 429 }
        );
      }
      
      if (response.status === 503) {
        return NextResponse.json(
          { success: false, error: "Service temporarily unavailable. Please try again." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Failed to generate image. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Extract image URL from response
    let imageUrl: string | null = null;
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const messageContent = data.choices[0].message.content;
      
      // Look for image URL in the response
      if (typeof messageContent === "string") {
        // Extract URL from various possible formats
        const urlMatch = messageContent.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+\.(jpg|jpeg|png|webp)/i);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        }
      }
    }

    if (!imageUrl) {
      console.error("No image URL found in response:", data);
      return NextResponse.json(
        { success: false, error: "Failed to extract image from response" },
        { status: 500 }
      );
    }

    const generationTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      imageUrl,
      generationTime,
    });

  } catch (error) {
    console.error("Image generation error:", error);
    
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          { success: false, error: "Generation timed out. Please try again with a simpler prompt." },
          { status: 408 }
        );
      }
      
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { success: false, error: "Network error. Please check your connection and try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Image generation API. Use POST method with prompt and settings." },
    { status: 200 }
  );
}