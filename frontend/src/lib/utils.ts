import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl(): string {
  const configured = import.meta.env.VITE_HOST_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  if (typeof window !== 'undefined') return window.location.origin.replace(/\/+$/, '');
  return '';
}

export function getInterviewPath(interviewId: string): string {
  return `/interview/${interviewId}`;
}

export function getInterviewUrl(interviewId: string): string {
  return `${getBaseUrl()}${getInterviewPath(interviewId)}`;
}

export function extractJsonPayload(value: unknown, fallback: object = {}): any {
  if (!value) return fallback;
  if (typeof value === 'object') return value;

  const normalized = String(value)
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(normalized);
  } catch {
    return fallback;
  }
}

export function getAverageRating(rating: Record<string, number> = {}): number {
  const scores = [
    Number(rating.technicalSkills) || 0,
    Number(rating.communication) || 0,
    Number(rating.problemSolving) || 0,
    Number(rating.experience) || 0,
  ];
  return Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 10) / 10;
}

export function formatUtcDate(dateString?: string, _format?: string): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
