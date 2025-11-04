import { GoogleGenAI, Type } from "@google/genai";

// Fix: Adhere to guidelines by initializing with process.env.API_KEY directly.
// The SDK can handle if the key is undefined, and the runtime check below will prevent API calls.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Warn if API key is missing for developer awareness
if (!process.env.API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled. Please set process.env.API_KEY.");
}

interface AuctionDetails {
    title: string;
    description: string;
    startingPrice: number;
}

export const generateAuctionDetails = async (prompt: string): Promise<AuctionDetails | null> => {
    if (!process.env.API_KEY) {
        console.error("Gemini API key is missing.");
        return null;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following user prompt, generate details for an auction item. The user prompt is: "${prompt}". Provide a creative and appealing title, a detailed and enticing description (around 30-50 words), and a reasonable starting price as an integer.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "A creative and appealing title for the auction item.",
                        },
                        description: {
                            type: Type.STRING,
                            description: "A detailed and enticing description for the item, about 30-50 words long.",
                        },
                        startingPrice: {
                            type: Type.INTEGER,
                            description: "A reasonable starting price for the auction as a whole number.",
                        },
                    },
                    required: ["title", "description", "startingPrice"],
                },
            },
        });
        
        const jsonString = response.text.trim();
        const details = JSON.parse(jsonString) as AuctionDetails;
        return details;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
};
