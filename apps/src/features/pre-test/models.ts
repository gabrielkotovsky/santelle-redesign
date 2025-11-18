export type UUID = string;

export type PretestChoice = {
  id: UUID;
  question_id: UUID;
  label: string;
  value: string;
  sort_order: number;
  active: boolean;
  weight: number | null;
};

export type QuestionType = 'single' | 'multi';

export type PretestQuestion = {
  id: UUID;
  slug: string;
  prompt: string;
  type: QuestionType;
  required: boolean;
  sort_order: number;
  version: number;
  active: boolean;
  created_at: string;
  q_id: string | null;
  symptom_or_context?: 'symptoms' | 'context';
  choices: PretestChoice[];
};

export type PretestAnswer =
  | { question_id: UUID; type: 'single'; choice_id: UUID }
  | { question_id: UUID; type: 'multi'; choice_ids: UUID[] };

// Additional types for pretest functionality
export type PretestResponse = {
  id: UUID;
  test_session_id: UUID;
  question_id: UUID | null;
  version: number | null;
  created_at: string;
  updated_at: string;
};

export type PretestResponseChoice = {
  response_id: UUID;
  choice_id: UUID;
};

export type PretestSession = {
  id: UUID;
  user_id: UUID;
  started_at: string;
  completed_at: string | null;
  answers: PretestAnswer[];
  status: 'in_progress' | 'completed' | 'abandoned';
};

export type PretestSubmission = {
  session_id: UUID;
  answers: PretestAnswer[];
  completed_at: string;
};

export type PretestResult = {
  session_id: UUID;
  score: number;
  recommendations: string[];
  generated_at: string;
};

// Form state types for UI components
export type PretestFormState = {
  currentQuestionIndex: number;
  answers: Map<UUID, PretestAnswer>;
  isSubmitting: boolean;
  errors: Map<UUID, string>;
};

export type PretestProgress = {
  current: number;
  total: number;
  percentage: number;
};
