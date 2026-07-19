export interface Feeling {
  id: string;
  title: string;
  emoji: string;
}

export interface OnboardingData {
  name: string;
  feeling: string;
  communityJoined: boolean;
}

export interface StepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}