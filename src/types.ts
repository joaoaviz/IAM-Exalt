export interface Challenge {
  id: string;
  title: string;
  description: string;
  principle: string;
  completed?: boolean;
  content?: {
    intro: string;
    simulation: {
      type: string;
      [key: string]: any;
    };
    lessons: string[];
  };
  introduction?: string;
  lessons?: string[];
  component?: React.ComponentType<{ onSuccess: () => void }>;
}

export interface ChallengeState {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  progress: number;
}