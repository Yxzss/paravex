
export enum Gender {
  MALE = 'Homme',
  FEMALE = 'Femme'
}

export enum Equipment {
  BODYWEIGHT = 'Poids du corps',
  STREET_WORKOUT = 'Street Workout',
  FULL_GYM = 'Salle (Gym)'
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface TrainingDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  timing: string;
  description: string;
  macros: string;
}

export interface NutritionPlan {
  dailyMacros: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
  meals: Meal[];
  paretoTips: string[];
}

export interface MorphologyAnalysis {
  boneStructure: string;
  estimatedFatPercent: number;
  muscleGaps: string[];
  clinicalNote: string;
}

export interface ParetoResult {
  visionUrl: string;
  beforeUrl: string; // Ajout pour le comparatif
  durationDays: 90 | 180;
  morphology: MorphologyAnalysis;
  trainingPlan: TrainingDay[];
  nutritionPlan: NutritionPlan; // Ajout nutrition
  paretoLever: string[];
}

export interface UserInput {
  photo: string | null;
  gender: Gender;
  age: string;
  equipment: Equipment;
  objective: string;
  imageSize: '1K' | '2K' | '4K';
}
