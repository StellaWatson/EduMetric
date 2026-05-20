'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface SheetRow {
  rank: number;
  fullName: string;
  group: string;
  faculty: string;
  status: 'ELIGIBLE' | 'AT_RISK' | 'REJECTED' | 'UNDER_REVIEW';
  academicPercent: number;
  academicBall: number;
  attendancePercent: number;
  attendanceBall: number;
  assignmentBall: number;
  activityBall: number;
  tutorBall: number;
  disciplineBall: number;
  totalBall: number;
  penaltyBall: number;
  recoveryBall: number;
  employmentBall: number;
  finalScore: number;
}

export function useSheet(filter: { faculty?: string; group?: string } = {}) {
  return useQuery({
    queryKey: ['sheet', filter],
    queryFn: async () => {
      const { data } = await apiClient.get<SheetRow[]>('/leaderboard/sheet', { params: filter });
      return data;
    },
    // Poll every 10s — judges see "live" updates as data changes.
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });
}
