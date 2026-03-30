import { GoogleGenAI, Type } from "@google/genai";
import { SlipStatus, ConfidenceTier, FailedLayer } from "../../src/types";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export async function extractSlipFromImage(imageBase64: string, mimeType: string) {
  const model = "gemini-3-flash-preview";
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract all sports matches from this bet slip. Return a JSON array of objects, each with 'match' (e.g. 'Team A vs Team B') and 'sport' ('football' or 'basketball').",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              match: { type: Type.STRING },
              sport: { type: Type.STRING, enum: ["football", "basketball"] },
              odds: { type: Type.NUMBER },
            },
            required: ["match", "sport"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("OCR Extraction Error:", error);
    throw error;
  }
}

export async function predictSlip(matches: any[], userId: string, slipId: string, io: any) {
  console.log(`Starting prediction for slip ${slipId} for user ${userId}`);
  
  // Simulate background processing
  setTimeout(async () => {
    try {
      const predictions = [];
      for (const match of matches) {
        // Simulate individual match prediction
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const prediction = {
          id: `pred_${Math.random().toString(36).substr(2, 5)}`,
          matchId: match.match,
          match: match.match,
          sport: match.sport,
          status: SlipStatus.PREDICTED,
          claudeConfidence: Math.floor(Math.random() * 20) + 75,
          gptConfidence: Math.floor(Math.random() * 20) + 75,
          finalConfidence: Math.floor(Math.random() * 20) + 75,
          confidenceTier: ConfidenceTier.TIER1,
          createdAt: new Date().toISOString(),
          reasoning: {
            summary: "Strong home form and tactical advantage.",
            layers: {
              [FailedLayer.L1_FORM]: 85,
              [FailedLayer.L2_SQUAD]: 70,
              [FailedLayer.L3_TACTICAL]: 90,
              [FailedLayer.L4_PSYCHOLOGY]: 80,
              [FailedLayer.L5_ENVIRONMENT]: 75,
              [FailedLayer.L6_SIMULATION]: 88
            }
          }
        };
        
        predictions.push(prediction);
        io.emit('prediction:complete', { matchId: match.match, prediction });
      }
      
      console.log(`Prediction complete for slip ${slipId}`);
    } catch (error) {
      console.error("Prediction Error:", error);
      io.emit('prediction:error', { slipId, error: 'Failed to process prediction' });
    }
  }, 1000);
}
