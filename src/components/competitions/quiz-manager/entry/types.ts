import { QuestionType, QuestionDifficulty } from "@/lib/features/quizQuestion/types";

export interface NewQuestionState {
  question: string;
  type: QuestionType;
  options: string[];
  correctAnswerIndexes: number[];
  points: number;
  difficulty: QuestionDifficulty;
  wordLimit: number;
  isMarkdown: boolean;
}

export const initialNewQuestionState: NewQuestionState = {
  question: "",
  type: "single" as QuestionType,
  options: ["", "", "", ""],
  correctAnswerIndexes: [0] as number[],
  points: 10,
  difficulty: QuestionDifficulty.Medium,
  wordLimit: 100,
  isMarkdown: false,
};

/**
 * Encodes a string to a safe Base64 string for storage, handling UTF-8.
 */
export const encodeToBase64 = (str: string): string => {
  if (typeof window === "undefined") return str; // Skip on server rendering
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Convert byte array to binary string and then to Base64
  const binaryString = String.fromCharCode.apply(null, Array.from(data));
  return btoa(binaryString);
};

/**
 * Decodes a Base64 string back to the original UTF-8 string.
 */
export const decodeFromBase64 = (base64: string): string => {
  if (typeof window === "undefined") return base64; // Skip on server rendering
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  } catch (error) {
    // Return original string if decoding fails
    console.warn("Base64 decoding failed. Returning raw content.", error);
    return base64;
  }
};
