import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Running local food recognizer on:", imageUrl);

    // Run the Python script
    const py = spawn("python3", ["food_recognizer.py", imageUrl]);

    let data = "";
    let errorOutput = "";

    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (chunk) => (errorOutput += chunk.toString()));

    const exitCode = await new Promise((resolve) => {
      py.on("close", resolve);
    });

    if (exitCode !== 0) {
      console.error("Python error:", errorOutput);
      throw new Error("Python recognizer failed");
    }

    const result = JSON.parse(data.trim());

    // Simple nutrition lookup table
    const nutritionData = {
      pizza: { calories: 285, protein: 12, carbs: 36, fat: 10 },
      chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      paneer: { calories: 265, protein: 17, carbs: 4, fat: 21 },
      biryani: { calories: 290, protein: 12, carbs: 40, fat: 8 },
      burger: { calories: 540, protein: 30, carbs: 41, fat: 28 },
      rice: { calories: 130, protein: 3, carbs: 28, fat: 0.3 },
    };

    let detectedFood =
      Array.isArray(result) && result.length > 0
        ? result[0].label.toLowerCase()
        : "unknown";

    const nutrition = nutritionData[detectedFood] || {
      calories: 200,
      protein: 10,
      carbs: 25,
      fat: 8,
    };

    console.log(`✅ DETECTED: ${detectedFood}`);

    return NextResponse.json({
      result: {
        food: detectedFood,
        confidence: result[0]?.confidence || 0,
        nutrition,
      },
    });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
