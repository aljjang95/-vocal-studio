'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingResult } from '@/types';

interface OnboardingState {
  step: number;
  isAnalyzing: boolean;
  isPlayingTts: boolean;
  error: string | null;
  result: OnboardingResult | null;

  setStep: (step: number) => void;
  setAnalyzing: (v: boolean) => void;
  setPlayingTts: (v: boolean) => void;
  setError: (err: string | null) => void;
  setResult: (result: OnboardingResult) => void;
  resetAll: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      isAnalyzing: false,
      isPlayingTts: false,
      error: null,
      result: null,

      setStep: (step) => set({ step }),
      setAnalyzing: (v) => set({ isAnalyzing: v }),
      setPlayingTts: (v) => set({ isPlayingTts: v }),
      setError: (err) => set({ error: err }),
      setResult: (result) => set({ result }),
      resetAll: () =>
        set({
          step: 0,
          isAnalyzing: false,
          isPlayingTts: false,
          error: null,
          result: null,
        }),
    }),
    {
      name: 'vocalmind-onboarding',
      partialize: (state) => ({ result: state.result }),
    }
  )
);
