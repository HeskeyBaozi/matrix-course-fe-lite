export interface IShortAnswerConfig {
  questions: IShortAnswerQuestion[];
  standard_score: number;
}

export interface IShortAnswerQuestion {
  $$hashKey: string;
  description: string;
  grade: string;
  id: number;
  key_words: string[];
  standard_answer?: string;
  explanation?: string;
}
