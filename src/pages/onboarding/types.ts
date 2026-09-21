import type { EducationLevel } from '@/types/db';

export interface OnboardingData {
  fullName: string;
  country: string;
  institutionId: string | null;
  institutionText: string;
  fieldOfStudy: string;
  educationLevel: EducationLevel | '';
  language: string;
  timezone: string;
  interests: string;
  goals: string;
}

export type OnboardingUpdate = <K extends keyof OnboardingData>(
  key: K,
  value: OnboardingData[K],
) => void;

export const LANGUAGE_OPTIONS = [
  'English',
  'German',
  'French',
  'Spanish',
  'Portuguese',
  'Italian',
  'Dutch',
  'Japanese',
  'Korean',
  'Chinese',
  'Arabic',
  'Hindi',
  'Russian',
  'Turkish',
  'Polish',
  'Swedish',
];

export const TIMEZONE_OPTIONS = [
  'Europe/London',
  'Europe/Berlin',
  'Europe/Zurich',
  'Europe/Paris',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Warsaw',
  'Europe/Istanbul',
  'Africa/Johannesburg',
  'Africa/Cairo',
  'Africa/Lagos',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'America/Mexico_City',
  'America/Bogota',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export const LEVEL_OPTIONS: { value: EducationLevel; key: string }[] = [
  { value: 'High School', key: 'highSchool' },
  { value: 'Undergraduate', key: 'undergraduate' },
  { value: 'Graduate', key: 'graduate' },
  { value: 'PhD', key: 'phd' },
  { value: 'Alumni', key: 'alumni' },
  { value: 'Mentor', key: 'mentor' },
  { value: 'Lifelong Learner', key: 'lifelong' },
];