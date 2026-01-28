import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
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
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          ...(imagePart ? [imagePart] : []),
          { text: userPrompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return NextResponse.json({ 
          image: `data:image/png;base64,${part.inlineData.data}` 
        });
      }
    }

    return NextResponse.json(
      { error: "Échec de la visualisation." },
      { status: 500 }
    );
  } catch (error) {
    console.error('[v0] Error in generate-vision API:', error);
    return NextResponse.json(
      { error: "Échec de la visualisation." },
      { status: 500 }
    );
  }
}
