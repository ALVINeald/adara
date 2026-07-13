export interface Feeling {
  id: string;
  title: string;
  emoji: string;
}

export interface Community {
  id: string;
  title: string;
  description: string;
}

export interface OnboardingData {
  name: string;
  feeling: string;
  community: string;
}

export interface StepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}