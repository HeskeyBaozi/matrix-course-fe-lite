export interface IChoiceQuestion {
  choice_type: 'single' | 'multi';
  choices: Array<{
    description: string;
    id: number
  }>;
  description: string;
  grading: { max_grade: number, half_grade: number };
  id: number;
}

export interface IChoiceConfig {
  questions: IChoiceQuestion[];
  standard_score: number;
}

export interface IChoiceAnswerItem {
  choice_id: number[];
  question_id: number;
}

export interface IChoiceReport {
  report: Array<{
    grade: number;
    question_id: number;
    standard_answer: number[];
    student_answer: number[];
  }>;
}

export interface IChoiceFormResultItem {
  question_id: number;
  choice_id: number[];
}

export interface IChoiceSubmitDetail {
  answers: IChoiceFormResultItem[];
}
