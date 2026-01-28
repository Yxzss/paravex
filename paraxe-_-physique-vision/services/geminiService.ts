
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, ParetoResult } from "../types";

export const analyzeAndGeneratePlan = async (input: UserInput): Promise<Partial<ParetoResult>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Tu es une IA coach sportif et nutritionniste senior, spécialisée en programmes simples, efficaces et durables, basée sur le principe 80/20.

    Tu reçois :
    - les informations utilisateur (âge, genre, équipements, objectifs)
    - le diagnostic physique (photo)

    Ton rôle est de concevoir un programme COMPLET (Sport + Nutrition) clair et minimaliste.

    🟥 SPORT (80/20)
    - 3 jours de musculation intense.
    - 1 jour cardio léger.
    - Intensité : 1 à 2 répétitions avant l'échec (RPE 8-9) pour CHAQUE série de travail. C'est impératif.

    🟩 NUTRITION (80/20)
    - Focus sur les protéines et le total calorique.
    - 3 à 4 repas simples par jour.
    - Pas de diète restrictive complexe, juste les leviers qui fonctionnent.

    RÉPONDS EXCLUSIVEMENT EN JSON.
  `;

  const userPrompt = `Analyse ce profil : Genre ${input.gender}, Age ${input.age}, Equipement ${input.equipment}. Objectif : ${input.objective}`;

  const imagePart = input.photo ? {
    inlineData: {
      mimeType: 'image/jpeg',
      data: input.photo.split(',')[1],
    },
  } : null;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...(imagePart ? [imagePart] : []),
        { text: userPrompt }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          durationDays: { type: Type.NUMBER },
          morphology: {
            type: Type.OBJECT,
            properties: {
              boneStructure: { type: Type.STRING },
              estimatedFatPercent: { type: Type.NUMBER },
              muscleGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              clinicalNote: { type: Type.STRING }
            }
          },
          trainingPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                focus: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      sets: { type: Type.NUMBER },
                      reps: { type: Type.STRING },
                      rest: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          },
          nutritionPlan: {
            type: Type.OBJECT,
            properties: {
              dailyMacros: {
                type: Type.OBJECT,
                properties: {
                  protein: { type: Type.STRING },
                  carbs: { type: Type.STRING },
                  fats: { type: Type.STRING },
                  calories: { type: Type.STRING }
                }
              },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    timing: { type: Type.STRING },
                    description: { type: Type.STRING },
                    macros: { type: Type.STRING }
                  }
                }
              },
              paretoTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          paretoLever: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["durationDays", "morphology", "trainingPlan", "nutritionPlan", "paretoLever"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    throw new Error("Erreur d'analyse IA.");
  }
};

export const generateVisionImage = async (input: UserInput): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Tu es un moteur de rendu biométrique spécialisé dans la transformation physique RADICALE et RÉALISTE.
    Modifier le corps de la personne sur la photo pour qu'il corresponde à son objectif ultime.
    1. TRANSFORMATION VISIBLE : Change le corps, rends-le musclé et sec (10-15% gras).
    2. RÉALISME PHOTO : Garde le même visage et le même décor.
    FORMAT : 9:16 (Portrait).
  `;

  const userPrompt = `Transforme le corps de cette personne (${input.gender}) : ${input.objective}. Rendu 9:16 ultra-réaliste.`;

  const imagePart = input.photo ? {
    inlineData: {
      mimeType: 'image/jpeg',
      data: input.photo.split(',')[1],
    },
  } : null;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        ...(imagePart ? [imagePart] : []),
        { text: userPrompt }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
      imageConfig: {
        aspectRatio: "9:16"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Échec de la visualisation.");
};
