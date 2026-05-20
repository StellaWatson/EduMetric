'use client';

import { useMemo, useState } from 'react';
import { Download, RefreshCcw, Filter } from 'lucide-react';
import { useSheet, type SheetRow } from '@/lib/hooks/use-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function PublicDashboardPage() {
  const [faculty, setFaculty] = useState('');
  const [group, setGroup] = useState('');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof SheetRow>('finalScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const { data, isFetching, refetch, dataUpdatedAt } = useSheet({
    faculty: faculty || undefined,
    group: group || undefined,
  });

  const facultyOptions = useMemo(
    () => Array.from(new Set(data?.map((r) => r.faculty) ?? [])).sort(),
    [data],
  );
  const groupOptions = useMemo(
    () => Array.from(new Set(data?.map((r) => r.group) ?? [])).sort(),
    [data],
  );

  const rows = useMemo(() => {
    if (!data) return [];
    let r = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((row) => row.fullName.toLowerCase().includes(q) || row.group.toLowerCase().includes(q));
    }
    return [...r].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, search, sortKey, sortDir]);

  function toggleSort(key: keyof SheetRow) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'fullName' || key === 'group' || key === 'faculty' || key === 'status' ? 'asc' : 'desc');
    }
  }

  function exportCsv() {
    if (!data) return;
    const headers = [
      'Rank', 'Student', 'Group', 'Faculty', 'Status',
      'Academic %', 'Academic Ball', 'Attendance %', 'Attendance Ball',
      'Assignment Ball', 'Activity Ball', 'Tutor Ball', 'Discipline Ball',
      'Total Ball', 'Penalty Ball', 'Recovery Ball', 'Employment Ball',
      'Final Score',
    ];
    const lines = [headers.join(',')];
    for (const r of rows) {
      lines.push([
        r.rank, JSON.stringify(r.fullName), r.group, JSON.stringify(r.faculty), r.status,
        r.academicPercent, r.academicBall, r.attendancePercent, r.attendanceBall,
        r.assignmentBall, r.activityBall, r.tutorBall, r.disciplineBall,
        r.totalBall, r.penaltyBall, r.recoveryBall, r.employmentBall,
        r.finalScore,
      ].join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edumetric-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Scholarship dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Live ranking · auto-refresh every 10s
            {dataUpdatedAt > 0 && (
              <> · last updated {new Date(dataUpdatedAt).toLocaleTimeString()}</>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or group…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All faculties</option>
          {facultyOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All groups</option>
          {groupOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Tile label="Total students" value={rows.length} />
        <Tile label="Eligible" value={rows.filter((r) => r.status === 'ELIGIBLE').length} tone="text-success" />
        <Tile label="At risk" value={rows.filter((r) => r.status === 'AT_RISK').length} tone="text-warning" />
        <Tile label="Rejected" value={rows.filter((r) => r.status === 'REJECTED').length} tone="text-danger" />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead className="bg-muted/40">
            <tr className="text-left uppercase text-muted-foreground">
              {[
                ['rank', '#'],
                ['fullName', 'Student'],
                ['group', 'Group'],
                ['status', 'Status'],
                ['academicPercent', 'Acad %'],
                ['academicBall', 'Acad Ball'],
                ['attendancePercent', 'Att %'],
                ['attendanceBall', 'Att Ball'],
                ['assignmentBall', 'Assign'],
                ['activityBall', 'Activity'],
                ['tutorBall', 'Tutor'],
                ['disciplineBall', 'Disc'],
                ['totalBall', 'Total'],
                ['penaltyBall', 'Penalty'],
                ['recoveryBall', 'Recov'],
                ['employmentBall', 'Empl'],
                ['finalScore', 'Final'],
              ].map(([k, label]) => (
                <th
                  key={k}
                  onClick={() => toggleSort(k as keyof SheetRow)}
                  className="cursor-pointer whitespace-nowrap px-2.5 py-2 font-medium hover:text-foreground"
                >
                  {label}
                  {sortKey === k && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {!data ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={17} className="px-2.5 py-2">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={17} className="px-2.5 py-8 text-center text-muted-foreground">
                  No rows match.
                </td>
              </tr>
            ) : (
              rows.map((r) => <Row key={r.rank + r.fullName} row={r} />)
            )}
          </tbody>
        </table>
      </div>

      <footer className="text-xs text-muted-foreground">
        Color key:{' '}
        <span className="rounded bg-success/15 px-2 py-0.5 text-success">eligible</span>{' '}
        <span className="rounded bg-warning/15 px-2 py-0.5 text-warning">at risk</span>{' '}
        <span className="rounded bg-danger/15 px-2 py-0.5 text-danger">rejected</span>.
        Data syncs from the EduMetric backend every 10 seconds. Embed this page or export the CSV
        into Google Sheets / Excel for institutional reporting.
      </footer>
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold tabular-nums ${tone ?? ''}`}>{value}</div>
    </div>
  );
}

function Row({ row }: { row: SheetRow }) {
  const rowTone =
    row.status === 'ELIGIBLE' ? 'bg-success/5'
    : row.status === 'AT_RISK' ? 'bg-warning/5'
    : row.status === 'REJECTED' ? 'bg-danger/5'
    : '';
  return (
    <tr className={`${rowTone} hover:bg-muted/30`}>
      <td className="whitespace-nowrap px-2.5 py-2 font-semibold tabular-nums">{row.rank}</td>
      <td className="whitespace-nowrap px-2.5 py-2 font-medium">{row.fullName}</td>
      <td className="whitespace-nowrap px-2.5 py-2 text-muted-foreground">{row.group}</td>
      <td className="px-2.5 py-2">
        <Badge
          variant={
            row.status === 'ELIGIBLE' ? 'success'
            : row.status === 'AT_RISK' ? 'warning'
            : row.status === 'REJECTED' ? 'danger'
            : 'muted'
          }
        >
          {row.status.replace('_', ' ').toLowerCase()}
        </Badge>
      </td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.academicPercent}%</td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.academicBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.attendancePercent}%</td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.attendanceBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.assignmentBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.activityBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.tutorBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums">{row.disciplineBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums font-semibold">{row.totalBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums text-danger">{row.penaltyBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums text-success">+{row.recoveryBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums text-success">+{row.employmentBall}</td>
      <td className="px-2.5 py-2 text-right tabular-nums font-bold">{row.finalScore}</td>
    </tr>
  );
}
