
export interface Option {
  id: string;
  label: string;
  imageUrl: string;
  styleProfile: string;
  imagePosition?: string;
  visualPrompt?: string;
}

export interface Question {
  id: number;
  title: string;
  multiselect?: boolean;
  options: Option[];
}

export interface QuizResult {
  profileName: string;
  imageUrl: string;
  analysisText: string;
}