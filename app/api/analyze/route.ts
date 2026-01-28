import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SchemaType = {
  OBJECT: 'OBJECT' as const,
  STRING: 'STRING' as const,
  NUMBER: 'NUMBER' as const,
  ARRAY: 'ARRAY' as const,
};

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
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
      model: 'gemini-2.0-flash-exp',
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
          type: SchemaType.OBJECT,
          properties: {
            durationDays: { type: SchemaType.NUMBER },
            morphology: {
              type: SchemaType.OBJECT,
              properties: {
                boneStructure: { type: SchemaType.STRING },
                estimatedFatPercent: { type: SchemaType.NUMBER },
                muscleGaps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                clinicalNote: { type: SchemaType.STRING }
              }
            },
            trainingPlan: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  day: { type: SchemaType.STRING },
                  focus: { type: SchemaType.STRING },
                  exercises: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        name: { type: SchemaType.STRING },
                        sets: { type: SchemaType.NUMBER },
                        reps: { type: SchemaType.STRING },
                        rest: { type: SchemaType.STRING }
                      }
                    }
                  }
                }
              }
            },
            nutritionPlan: {
              type: SchemaType.OBJECT,
              properties: {
                dailyMacros: {
                  type: SchemaType.OBJECT,
                  properties: {
                    protein: { type: SchemaType.STRING },
                    carbs: { type: SchemaType.STRING },
                    fats: { type: SchemaType.STRING },
                    calories: { type: SchemaType.STRING }
                  }
                },
                meals: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: { type: SchemaType.STRING },
                      timing: { type: SchemaType.STRING },
                      description: { type: SchemaType.STRING },
                      macros: { type: SchemaType.STRING }
                    }
                  }
                },
                paretoTips: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
              }
            },
            paretoLever: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
          },
          required: ["durationDays", "morphology", "trainingPlan", "nutritionPlan", "paretoLever"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return NextResponse.json(result);
  } catch (error) {
    console.error('[v0] Error in analyze API:', error);
    return NextResponse.json(
      { error: "Erreur d'analyse IA." },
      { status: 500 }
    );
  }
}
