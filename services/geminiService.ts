import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Submission, RankedResult } from "../types";

// Fix: Use process.env.API_KEY exclusively as per guidelines. 
// Removed import.meta.env check as process.env.API_KEY is assumed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      rank: { type: Type.INTEGER, description: "The final rank of the candidate (1 is best)." },
      candidateName: { type: Type.STRING, description: "Name of the candidate." },
      score: { type: Type.INTEGER, description: "Overall score out of 100." },
      roast: { type: Type.STRING, description: "A sarcastic, witty, technical roast about the poem." },
      creativity_score: { type: Type.INTEGER, description: "Score for creativity (1-10)." },
      humor_score: { type: Type.INTEGER, description: "Score for humor (1-10)." },
      zetech_reference_score: { type: Type.INTEGER, description: "Score for Zetech University references (1-10)." },
    },
    required: ["rank", "candidateName", "score", "roast", "creativity_score", "humor_score", "zetech_reference_score"],
  },
};

export const executeJudgment = async (submissions: Submission[]): Promise<RankedResult[]> => {
  const model = "gemini-2.5-flash";
  const systemInstruction = `
    You are a strict, technical, but secretly funny AI Judge presiding over the "Zetech AI Tribunal". 
    Rank these poems based on:
    1) Humor (Are they funny?)
    2) References to Zetech University (Did they mention the school?)
    3) Creativity (Is it unique or generic?)
    
    Be harsh but fair. Return the result as a raw JSON array. 
    Ensure the "roast" is in the style of a cynical system administrator or a buggy terminal.
  `;

  const prompt = `
    INPUT_DATA_STREAM:
    ${JSON.stringify(submissions.map(s => ({ name: s.candidateName, poem: s.poem })))}
    
    INSTRUCTION:
    Analyze the above array of poetry objects. Rank them.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8, // Slightly higher for humor
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from tribunal mainframe.");

    return JSON.parse(text) as RankedResult[];
  } catch (error) {
    console.error("Tribunal Logic Error:", error);
    throw error;
  }
};