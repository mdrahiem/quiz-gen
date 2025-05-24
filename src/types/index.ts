export interface QuizQuestion {
  id: string;
  question: string;
  answer?: string;
}

export interface FlashCard {
  id: string;
  front: string; // question
  back?: string; // answer (optional)
}
