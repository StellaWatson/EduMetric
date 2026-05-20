'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth-store';
import {
  useUsers,
  useChangeUserRole,
  useDeleteUser,
  type UserRow,
} from '@/lib/hooks/use-admin-mutations';

const ROLE_TONE: Record<UserRow['role'], 'default' | 'success' | 'warning' | 'danger' | 'muted'> = {
  STUDENT: 'default',
  MENTOR: 'success',
  TUTOR: 'success',
  ADMIN: 'warning',
  SUPER_ADMIN: 'danger',
};

const ROLES: UserRow['role'][] = ['STUDENT', 'MENTOR', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'];

export default function RoleManagementPage() {
  const [filter, setFilter] = useState<UserRow['role'] | ''>('');
  const { data: users } = useUsers(filter || undefined);
  const me = useAuthStore((s) => s.user);
  const changeRole = useChangeUserRole();
  const deleteUser = useDeleteUser();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function onChangeRole(user: UserRow, newRole: UserRow['role']) {
    if (newRole === user.role) return;
    setPendingId(user.id);
    try {
      await changeRole.mutateAsync({ id: user.id, role: newRole });
      toast.success(`${user.fullName} → ${newRole.replace('_', ' ').toLowerCase()}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? // @ts-expect-error axios
            (err.response?.data?.message ?? 'Failed to change role')
          : 'Network error';
      toast.error(typeof message === 'string' ? message : 'Failed');
    } finally {
      setPendingId(null);
    }
  }

  async function onDelete(user: UserRow) {
    if (!confirm(`Delete ${user.fullName}? This cannot be undone.`)) return;
    setPendingId(user.id);
    try {
      await deleteUser.mutateAsync(user.id);
      toast.success(`${user.fullName} deleted`);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? // @ts-expect-error axios
            (err.response?.data?.message ?? 'Failed to delete')
          : 'Network error';
      toast.error(typeof message === 'string' ? message : 'Failed');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Role management</h1>
        <p className="text-sm text-muted-foreground">
          Super-admin powers: change anyone's role, delete any account. Use with care.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">{users?.length ?? 0} users</CardTitle>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as UserRow['role'] | '')}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.replace('_', ' ')}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          {!users ? (
            <Skeleton className="h-64" />
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users match.</p>
          ) : (
            <ul className="divide-y">
              {users.map((u) => {
                const isSelf = u.id === me?.id;
                const pending = pendingId === u.id;
                return (
                  <li key={u.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar fallback={u.fullName} src={u.avatar ?? undefined} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {u.fullName} {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={ROLE_TONE[u.role]}>{u.role.replace('_', ' ')}</Badge>
                      <select
                        value={u.role}
                        disabled={pending || isSelf}
                        onChange={(e) => onChangeRole(u, e.target.value as UserRow['role'])}
                        className="h-8 rounded-md border bg-background px-2 text-xs disabled:opacity-50"
                        title={isSelf ? 'You cannot change your own role' : 'Change role'}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={pending || isSelf}
                        onClick={() => onDelete(u)}
                        title={isSelf ? 'You cannot delete yourself' : 'Delete user'}
                      >
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-danger" />}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
